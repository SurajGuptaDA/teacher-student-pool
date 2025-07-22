import { SignJWT, jwtVerify } from "jose";

export async function createToken(tokenData: any) {
    const encodedKey = new TextEncoder().encode(process.env.TOKEN_SECRET_INF!);
    const token = await new SignJWT(
        tokenData // payload (i.e., the data you want to include in the token, e.g., user ID, roles, etc.)
    ) // details to encode in the token
    .setProtectedHeader({
        alg: 'HS256'
    }) // algorithm
    .setExpirationTime("1 day") // token expiration time, e.g., "1 day"
    .sign(encodedKey);
    return token;
}

export async function verifyToken(token: string) {
    const encodedKey = new TextEncoder().encode(process.env.TOKEN_SECRET_INF!);
    try {
        const { payload } = await jwtVerify(token, encodedKey);
        return payload; // returns the decoded payload if verification is successful
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Invalid token");
    }
}