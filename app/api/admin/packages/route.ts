import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Package from "@/models/Package";

export async function GET() {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    await connectToDatabase();
    const packages = await Package.find().sort({ createdAt: -1 });

    return NextResponse.json({ packages });
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