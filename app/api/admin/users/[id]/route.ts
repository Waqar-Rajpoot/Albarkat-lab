import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";

const VALID_ROLES = ["user", "admin"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;
    const session = guard;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const role = (body as { role?: unknown })?.role;
    if (typeof role !== "string" || !VALID_ROLES.includes(role as Role)) {
        return NextResponse.json(
            { error: `Role must be one of: ${VALID_ROLES.join(", ")}` },
            { status: 400 }
        );
    }

    if (id === session.user.id) {
        return NextResponse.json(
            { error: "You can't change your own role" },
            { status: 400 }
        );
    }

    const mongooseInstance = await connectToDatabase();
    const db = mongooseInstance.connection.db;
    if (!db) {
        return NextResponse.json(
            { error: "Database connection unavailable" },
            { status: 500 }
        );
    }

    const usersCollection = db.collection("user");
    const objectId = new mongoose.Types.ObjectId(id);

    const target = await usersCollection.findOne({ _id: objectId });
    if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === role) {
        return NextResponse.json({ success: true, role });
    }

    if (target.role === "admin" && role === "user") {
        const adminCount = await usersCollection.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
            return NextResponse.json(
                { error: "Can't demote the last remaining admin" },
                { status: 400 }
            );
        }
    }

    await usersCollection.updateOne({ _id: objectId }, { $set: { role } });

    return NextResponse.json({ success: true, role });
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;
    const session = guard;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    if (id === session.user.id) {
        return NextResponse.json(
            { error: "You can't delete your own account" },
            { status: 400 }
        );
    }

    const mongooseInstance = await connectToDatabase();
    const db = mongooseInstance.connection.db;
    if (!db) {
        return NextResponse.json(
            { error: "Database connection unavailable" },
            { status: 500 }
        );
    }

    const usersCollection = db.collection("user");
    const objectId = new mongoose.Types.ObjectId(id);

    const target = await usersCollection.findOne({ _id: objectId });
    if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "admin") {
        const adminCount = await usersCollection.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
            return NextResponse.json(
                { error: "Can't delete the last remaining admin" },
                { status: 400 }
            );
        }
    }

    const userIdVariants = [id, objectId];
    await Promise.all([
        usersCollection.deleteOne({ _id: objectId }),
        db.collection("session").deleteMany({ userId: { $in: userIdVariants } }),
        db.collection("account").deleteMany({ userId: { $in: userIdVariants } }),
    ]);

    return NextResponse.json({ success: true });
}