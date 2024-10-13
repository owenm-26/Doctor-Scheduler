"use server";
import { TrainerData } from "@/app/interfaces";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTrainers = async (): Promise<TrainerData[]> => {
  const trainers: TrainerData[] = await prisma.user.findMany({
    where: { role: "TRAINER" },
  });

  return trainers;
};

export const getMyTrainer = async (userId: number): Promise<number | null> => {
  const myTrainer = await prisma.user.findFirst({
    where: {
      id: userId, // The user whose trainer you are querying
    },
    select: {
      trainer: {
        select: {
          id: true,
        },
      },
    },
  });

  return myTrainer?.trainer?.id || null;
};

// export const saveTrainer = async (data: SaveTrainerParams) => {
//   const { userId, trainerId } = data;
//   const result = await prisma.user.update({
//     where: { id: userId }, // Find the user by userId
//     data: {
//       trainerId: trainerId, // Set the trainerId field
//     },
//     select: {
//       id: true, // Select the user's id
//       trainerId: true, // Return the trainerId after update
//     },
//   });

//   return NextResponse.json({ message: result });
// };
