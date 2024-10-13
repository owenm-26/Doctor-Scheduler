import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Missing email or password" },
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.NEXT_PUBLIC_JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    
    const response = NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
    console.log(response);

    // Set the cookie with the JWT
    cookies().set("session", token, {
      httpOnly: false, // Not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only use Secure in production
      sameSite: "strict", // Protect against CSRF attacks
      maxAge: 60 * 60, // Cookie expires in 1 hour
      path: "/", // Cookie available across entire site
    });

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
