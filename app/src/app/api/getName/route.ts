import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helpers/tokenHelper";
import { connect } from "@/dbConfig/dbConfig";

connect(); // Ensure the database connection is established

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('authToken')?.value || '';
        if (!token) {
            return NextResponse.json(
                { error: "Authentication token is required" },
                { status: 401 }
            );
        }

        const decodedToken = await verifyToken(token);
        if (!decodedToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            name: decodedToken.name || "Teacher",
            done: true,
            status: 200
        });

    } catch (error) {
        console.error("Error getting name:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}