import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Test from "@/models/Test";

export async function GET() {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    await connectToDatabase();
    const tests = await Test.find().sort({ testId: 1 });

    return NextResponse.json({ tests });
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