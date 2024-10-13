import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
interface DecodedJWT {
  userId: string; // Add other properties as needed
}

const prisma = new PrismaClient();

export const getUserIdFromCookie = (): number => {
  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((cookie) => cookie.startsWith("session"));
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

  if (!sessionCookie) {
    return -1;
  }

  if (!secret) {
    return -2;
  }
  const token = sessionCookie.split("=")[1];

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, secret) as DecodedJWT;

    // Check if decoded is an object and has userId
    if (decoded && decoded.userId) {
      return Number(decoded.userId);
    } else {
      return -2;
    }
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return -2;
  }
};

export const getUserRoleById = async (userId: number): Promise<User | null> => {
  const user = await prisma.user.findFirst({ where: { id: userId } });
  return user;
};
