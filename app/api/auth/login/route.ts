
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { findUserByUsername } from "@/service/rh/usuarios";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username and password are required",
                },
                { status: 400 }
            );
        }

        const userFound = await findUserByUsername(username.trim());

        if (!userFound) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid username or password",
                },
                { status: 401 }
            );
        }

        const passwordMatch = await bcrypt.compare(
            password,
            userFound.password
        );

        if (!passwordMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid username or password",
                },
                { status: 401 }
            );
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET não está configurado");
        }

        const secret = new TextEncoder().encode(jwtSecret);

        if(!userFound.ativo){
            return NextResponse.json(
                {
                    success: false,
                    message: "Usuário inativo"
                },
                { status: 401 }
            );
        }

        const token = await new SignJWT({
            id: userFound.userId,
            username: userFound.username,
            role: userFound.role,
        })
            .setProtectedHeader({
                alg: "HS256",
                typ: "JWT",
            })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(secret);

        const cookieStore = await cookies();

        cookieStore.set("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                username: userFound.username
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Erro na API de login:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
