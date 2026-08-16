import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";

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

    // better-auth also keeps session and OAuth account records keyed by
    // userId in separate collections. Deleting only the user document
    // would leave those behind — a stale session for this user could
    // otherwise keep authenticating after the "delete" appears to succeed.
    const userIdVariants = [id, objectId];
    await Promise.all([
        usersCollection.deleteOne({ _id: objectId }),
        db.collection("session").deleteMany({ userId: { $in: userIdVariants } }),
        db.collection("account").deleteMany({ userId: { $in: userIdVariants } }),
    ]);

    return NextResponse.json({ success: true });
}