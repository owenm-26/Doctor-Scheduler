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
