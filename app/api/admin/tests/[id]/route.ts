import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Test from "@/models/Test";

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
        const test = await Test.findByIdAndUpdate(
            id,
            { testId, description, price },
            { new: true, runValidators: true }
        );

        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 });
        }

        return NextResponse.json({ test });
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
    const test = await Test.findByIdAndDelete(id);

    if (!test) {
        return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}

function isDuplicateKeyError(err: unknown): boolean {
    return typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000;
}