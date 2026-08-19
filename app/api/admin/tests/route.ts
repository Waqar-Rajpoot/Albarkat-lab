import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Test from "@/models/Test";

type TestFilter = {
    $or?: Array<{ description?: { $regex: string; $options: string }; testId?: number }>;
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

    const filter: TestFilter = {};

    if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const orConditions: NonNullable<TestFilter["$or"]> = [
            { description: { $regex: escaped, $options: "i" } },
        ];
        const searchAsNumber = Number(search);
        if (Number.isFinite(searchAsNumber)) {
            orConditions.push({ testId: searchAsNumber });
        }
        filter.$or = orConditions;
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

    const [tests, total] = await Promise.all([
        Test.find(filter).sort({ testId: 1 }).skip(skip).limit(limit),
        Test.countDocuments(filter),
    ]);

    return NextResponse.json({
        tests,
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
    const testId = Number(body.testId);
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const price = Number(body.price);

    if (!Number.isFinite(testId) || !description || !Number.isFinite(price) || price < 0) {
        return NextResponse.json(
            { error: "A numeric Test ID, a description, and a non-negative price are required" },
            { status: 400 }
        );
    }

    await connectToDatabase();

    try {
        const test = await Test.create({ testId, description, price });
        return NextResponse.json({ test }, { status: 201 });
    } catch (err: unknown) {
        if (isDuplicateKeyError(err)) {
            return NextResponse.json(
                { error: `Test ID ${testId} is already in use` },
                { status: 409 }
            );
        }
        throw err;
    }
}

function isDuplicateKeyError(err: unknown): boolean {
    return typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000;
}
