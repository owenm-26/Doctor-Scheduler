"use client";
import { TrainerData } from "@/app/interfaces";
import { useEffect, useState } from "react";
import { getAllTrainers } from "./action";
import TrainerCard from "../../../../components/TrainerCard";

const TrainerPage: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerData[]>([]);

  useEffect(() => {
    const getTrainers = async () => {
      const result: TrainerData[] = await getAllTrainers();
      if (result) {
        setTrainers(result);
      }

      return;
    };
    getTrainers();
  }, []);

  return (
    <div>
      Trainer Page
      <div>
        {trainers.map((data, index) => {
          return <TrainerCard key={index} data={data} />;
        })}
      </div>
    </div>
  );
};

export default TrainerPage;
