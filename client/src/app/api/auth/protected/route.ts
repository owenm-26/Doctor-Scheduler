import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);

    return NextResponse.json(
      { message: "This is a protected route", decoded },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Invalid or expired token ${error}` },
      { status: 401 }
    );
  }
}
