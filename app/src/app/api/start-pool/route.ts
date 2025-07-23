import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helpers/tokenHelper";
import { connect } from "@/dbConfig/dbConfig";
import Question from "@/models/questionModel"; // Assuming you have a Question model defined

connect(); // Ensure the database connection is established

export async function POST(request: NextRequest) {
    const question = await Question.findOne({ isAnswered: false });
    if (!question) {
        return NextResponse.json(
            { error: "No unanswered questions available" },
            { status: 404 }
        );
    }
    try {
        const token = request.cookies.get('authToken')?.value || '';
        if (!token) {
            return NextResponse.json(
                { error: "Authentication token is required" },
                { status: 401 }
            );
        }

        const decodedToken = await verifyToken(token);
        if (!decodedToken || !decodedToken.isTeacher) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        question.askedOn = Date.now(); 
        question.isStarted = true; // Set the question as started
        await question.save();

        return NextResponse.json({
            message: 'Poll started successfully',
            done: true,
            status: 200,
            question
        });

    } catch (error) {
        console.error("Error starting poll:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}