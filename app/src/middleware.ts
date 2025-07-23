import { NextRequest, NextResponse } from "next/server";
import { checkIsTeacherToken } from "@/helpers/isTeacher";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    console.log(path);

    const isPublicPath = path === '/student-login' || path === '/' || path === '/testing-socket';
    const token = request.cookies.get('authToken')?.value || ''
    const isTeacher = await checkIsTeacherToken(request);
    console.log("Admin: " + isTeacher);
    
    if (isPublicPath && isTeacher) {
        return NextResponse.redirect(new URL('/create-pool', request.nextUrl))
    }
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/answer-question', request.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    
}

export const config = {
    matcher: [
        '/', 
        '/student-login',
        '/create-pool',
        '/answer-question',
        '/ask-question',
    ]
}