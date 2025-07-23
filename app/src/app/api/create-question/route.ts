import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/helpers/tokenHelper';
import Question from '@/models/questionModel'; // Assuming you have a Question model defined
import { connect } from '@/dbConfig/dbConfig';

connect(); // Ensure the database connection is established

export default async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { question, options, timeLimit } = body;
    
        // Validate input
        if (!question || !options || !timeLimit) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
        }
    
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
    
        // Here you would typically save the question to your database
        // For demonstration, we will just return a success message
        const optionsString = options.map((opt: { value: string }) => opt.value).join(', ');
        const rightOption = options.findIndex((opt: { answer: string }) => opt.answer === 'yes');
        const newQuestion = new Question({
            question,
            options: optionsString, 
            rightOption: rightOption,
            timeLimit
        });
        const savedQuestion = await newQuestion.save();
    
        return NextResponse.json({
        message: 'Question created successfully',
        done: true,
        status: 200, 
        savedQuestion
        });
    
    } catch (error) {
        console.error("Error creating question:", error);
        return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
        );
    }
    }