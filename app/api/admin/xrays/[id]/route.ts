import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import XRay from "@/models/XRay";

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
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const procedure = typeof body.procedure === "string" ? body.procedure.trim() : "";

    if (!category || !procedure) {
        return NextResponse.json(
            { error: "Both category and procedure are required" },
            { status: 400 }
        );
    }

    await connectToDatabase();
    const xray = await XRay.findByIdAndUpdate(
        id,
        { category, procedure },
        { new: true, runValidators: true }
    );

    if (!xray) {
        return NextResponse.json({ error: "X-Ray not found" }, { status: 404 });
    }

    return NextResponse.json({ xray });
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
    const xray = await XRay.findByIdAndDelete(id);

    if (!xray) {
        return NextResponse.json({ error: "X-Ray not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}