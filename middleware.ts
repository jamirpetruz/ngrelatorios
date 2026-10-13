import { NextRequest, NextResponse } from "next/server";
import {jwtVerify} from 'jose'

const admRoutes = ["/adm/:path*"];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("session")?.value;

    if (!token) {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    try {
        const payload = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );

        const decodedPayload = payload.payload as { id: number; email: string; role: string };
        if(request.nextUrl.pathname.startsWith("/adm") && decodedPayload.role !== "admin") {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        return NextResponse.next();
    } catch (error) {
        console.log("JWT ERROR", error);

        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }
}

export const config = {
  matcher: [
    "/relatorios/:path*",
    "/adm/:path*",
],
}