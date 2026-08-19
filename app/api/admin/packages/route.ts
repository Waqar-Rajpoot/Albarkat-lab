import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Package from "@/models/Package";

type PackageFilter = {
    $or?: Array<
        | { title: { $regex: string; $options: string } }
        | { description: { $regex: string; $options: string } }
        | { includedTests: { $elemMatch: { $regex: string; $options: string } } }
    >;
    discountedPrice?: { $gte?: number; $lte?: number };
};

export async function GET(request: NextRequest) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 9));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() ?? "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const filter: PackageFilter = {};

    if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { title: { $regex: escaped, $options: "i" } },
            { description: { $regex: escaped, $options: "i" } },
            { includedTests: { $elemMatch: { $regex: escaped, $options: "i" } } },
        ];
    }

    // Price filters apply to the discounted (customer-facing) price.
    const priceFilter: { $gte?: number; $lte?: number } = {};
    if (minPrice !== null && minPrice !== "" && Number.isFinite(Number(minPrice))) {
        priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice !== null && maxPrice !== "" && Number.isFinite(Number(maxPrice))) {
        priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
        filter.discountedPrice = priceFilter;
    }

    await connectToDatabase();

    const [packages, total] = await Promise.all([
        Package.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Package.countDocuments(filter),
    ]);

    return NextResponse.json({
        packages,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        },
    });
}

export async function POST(request: NextRequest) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const discountedPrice = Number(body.discountedPrice);
    const originalPrice = Number(body.originalPrice);
    const includedTests = Array.isArray(body.includedTests)
        ? body.includedTests
              .map((t: unknown) => (typeof t === "string" ? t.trim() : ""))
              .filter((t: string) => t.length > 0)
        : [];

    if (
        !title ||
        !description ||
        !Number.isFinite(discountedPrice) ||
        discountedPrice < 0 ||
        !Number.isFinite(originalPrice) ||
        originalPrice < 0 ||
        includedTests.length === 0
    ) {
        return NextResponse.json(
            {
                error:
                    "Title, description, both prices, and at least one included test are required",
            },
            { status: 400 }
        );
    }

    if (originalPrice < discountedPrice) {
        return NextResponse.json(
            { error: "Original price can't be lower than the discounted price" },
            { status: 400 }
        );
    }

    await connectToDatabase();
    const pkg = await Package.create({
        title,
        description,
        discountedPrice,
        originalPrice,
        includedTests,
    });

    return NextResponse.json({ package: pkg }, { status: 201 });
}
