import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Named export for POST requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, trainerId } = body;

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        trainerId: trainerId,
      },
      select: {
        id: true,
        trainerId: true,
      },
    });

    return NextResponse.json({ message: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save trainer" },
      { status: 500 }
    );
  }
}

// Named export for GET requests (optional, if you want to handle GET requests)
export async function GET(req: NextRequest) {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: "TRAINER" },
    });
    console.log(req);

    return NextResponse.json({ trainers }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 }
    );
  }
}

// Named export for PUT requests (if needed)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, trainerId } = body;

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        trainerId: trainerId,
      },
    });
    console.log(result);

    return NextResponse.json(
      { message: "Trainer updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update trainer" },
      { status: 500 }
    );
  }
}

// Named export for DELETE requests (if needed)
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        trainerId: null, // Assuming you're removing the trainer for the user
      },
    });
    console.log(result);

    return NextResponse.json(
      { message: "Trainer removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove trainer" },
      { status: 500 }
    );
  }
}
