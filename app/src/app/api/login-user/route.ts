import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/helpers/tokenHelper"; 

export default async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, role } = body;

    // Validate input
    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    if ( role == "teacher" ){
      name = name || "Teacher";
      const tokenData = { name, isTeacher: true }; 
      const token = await createToken(tokenData); 
      const response = NextResponse.json({
          message: 'Teacher logged in successfully',
          done: true,
          status: 200
      })
      response.cookies.set("authToken", token, {
          httpOnly: true,
      })

      return response;
    }
    if ( role == "student" ){
      const tokenData = { name, isTeacher: false }; 
      const token = await createToken(tokenData); 

      const response = NextResponse.json({
          message: 'Student logged in successfully',
          done: true,
          status: 200
      })
      response.cookies.set("authToken", token, {
          httpOnly: true,
      })
      return response;
    }
    return NextResponse.json(
      { error: "Invalid role" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
    