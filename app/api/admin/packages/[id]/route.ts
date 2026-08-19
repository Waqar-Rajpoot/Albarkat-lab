import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Package from "@/models/Package";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

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
    const pkg = await Package.findByIdAndUpdate(
        id,
        { title, description, discountedPrice, originalPrice, includedTests },
        { returnDocument: "after", runValidators: true }
    );

    if (!pkg) {
        return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ package: pkg });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    if (typeof body.isFeatured !== "boolean") {
        return NextResponse.json(
            { error: "isFeatured must be a boolean" },
            { status: 400 }
        );
    }

    await connectToDatabase();
    const pkg = await Package.findByIdAndUpdate(
        id,
        { isFeatured: body.isFeatured },
        { returnDocument: "after", runValidators: true }
    );

    if (!pkg) {
        return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ package: pkg });
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const pkg = await Package.findByIdAndDelete(id);

    if (!pkg) {
        return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}