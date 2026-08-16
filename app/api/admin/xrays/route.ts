import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import XRay from "@/models/XRay";

export async function GET() {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    await connectToDatabase();
    const xrays = await XRay.find().sort({ category: 1, procedure: 1 });

    return NextResponse.json({ xrays });
}

export async function POST(request: NextRequest) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const procedure = typeof body.procedure === "string" ? body.procedure.trim() : "";

    if (!category || !procedure) {
        return NextResponse.json(
            { error: "Both category and procedure are required" },
            { status: 400 }
        );
    }

    await connectToDatabase();
    const xray = await XRay.create({ category, procedure });

    return NextResponse.json({ xray }, { status: 201 });
}