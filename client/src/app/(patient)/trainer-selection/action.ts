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
