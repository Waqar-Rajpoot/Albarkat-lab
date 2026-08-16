import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const skip = (page - 1) * limit;

    const mongooseInstance = await connectToDatabase();
    const db = mongooseInstance.connection.db;
    if (!db) {
        return NextResponse.json(
            { error: "Database connection unavailable" },
            { status: 500 }
        );
    }

    const usersCollection = db.collection("user");

    const [users, total] = await Promise.all([
        usersCollection
            .find(
                {},
                {
                    projection: {
                        name: 1,
                        email: 1,
                        emailVerified: 1,
                        image: 1,
                        role: 1,
                        createdAt: 1,
                    },
                }
            )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
        usersCollection.countDocuments(),
    ]);

    return NextResponse.json({
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        },
    });
}