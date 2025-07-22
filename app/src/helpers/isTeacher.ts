import { NextRequest } from "next/server";
import { verifyToken } from "@/helpers/tokenHelper";

export async function checkIsTeacherToken(request: NextRequest): Promise<boolean> {
    try {
        const token = request.cookies.get("authToken")?.value || '';
        if (!token) {
            return false; // No token found
        }
        
        const decodedToken: any = await verifyToken(token);
        return decodedToken.isTeacher;
    } catch (error: any) {
        console.error("Error verifying teacher token:", error.message);
        return false; // Return false if there's an error
    }
}