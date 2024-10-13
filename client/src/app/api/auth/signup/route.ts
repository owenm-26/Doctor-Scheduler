import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { first_name, last_name, email, password, birthday, role } =
    await request.json();

  if (!first_name || !last_name || !email || !password || !birthday || !role) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        birthday,
        role,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    // Set the JWT token as a cookie
    const response = NextResponse.json(
      { message: "Signup successful" },
      { status: 200 }
    );
    cookies().set("session", token, {
      httpOnly: true, // Not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only use Secure in production
      sameSite: "strict", // Protect against CSRF attacks
      maxAge: 60 * 60, // Cookie expires in 1 hour
      path: "/", // Cookie available across entire site
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Internal server error: ${error} ` },
      { status: 500 }
    );
  }
}
