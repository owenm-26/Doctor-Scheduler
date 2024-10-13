import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;

  let userId: string | null = null;

  if (token && process.env.NEXT_PUBLIC_JWT_SECRET) {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.NEXT_PUBLIC_JWT_SECRET
      ) as jwt.JwtPayload;
      userId = decodedToken?.issuer || null;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  } else {
    console.error(`cant get ${process.env.NEXT_PUBLIC_JWT_SECRET} or ${token}`);
  }

  const { pathname } = req.nextUrl;

  if (pathname.includes("/api/login") || userId) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
