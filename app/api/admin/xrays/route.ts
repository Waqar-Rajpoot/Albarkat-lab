import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import XRay from "@/models/XRay";

type XRayFilter = {
    $or?: Array<{ category?: { $regex: string; $options: string }; procedure?: { $regex: string; $options: string } }>;
    price?: { $gte?: number; $lte?: number };
};

export async function GET(request: NextRequest) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() ?? "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const filter: XRayFilter = {};

    if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { category: { $regex: escaped, $options: "i" } },
            { procedure: { $regex: escaped, $options: "i" } },
        ];
    }

    const priceFilter: { $gte?: number; $lte?: number } = {};
    if (minPrice !== null && minPrice !== "" && Number.isFinite(Number(minPrice))) {
        priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice !== null && maxPrice !== "" && Number.isFinite(Number(maxPrice))) {
        priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
    }

    await connectToDatabase();

    const [xrays, total] = await Promise.all([
        XRay.find(filter).sort({ category: 1, procedure: 1 }).skip(skip).limit(limit),
        XRay.countDocuments(filter),
    ]);

    return NextResponse.json({
        xrays,
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
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const procedure = typeof body.procedure === "string" ? body.procedure.trim() : "";
    const price = Number(body.price);

    if (!category || !procedure || !Number.isFinite(price) || price < 0) {
        return NextResponse.json(
            { error: "Category, procedure, and a non-negative price are required" },
            { status: 400 }
        );
    }

    await connectToDatabase();
    const xray = await XRay.create({ category, procedure, price });

    return NextResponse.json({ xray }, { status: 201 });
}
