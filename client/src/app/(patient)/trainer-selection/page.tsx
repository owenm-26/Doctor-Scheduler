"use client";
import { TrainerData } from "@/app/interfaces";
import { useEffect, useState } from "react";
import { getAllTrainers } from "./action";
import TrainerCard from "../../../../components/TrainerCard";
import { Button, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const TrainerPage: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [selected, setSelected] = useState<number>(-1);
  const [leave, setLeave] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    console.log(selected);
    if (selected == -1) {
      return;
    }
    const fetchSave = async () => {
      const data = {
        userId: 1,
        trainerId: selected,
      };
      try {
        const response = await fetch("/api/saveTrainer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // Ensure data is being serialized correctly
        });
        if (response) {
          router.push("/home");
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchSave();
  }, [leave]);

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography.Title title="Trainer Page">Trainer Page</Typography.Title>
        {selected > 0 ? (
          <Button onClick={() => setLeave(true)}>
            Continue <ArrowRightOutlined />{" "}
          </Button>
        ) : (
          <></>
        )}
      </div>

      <div>
        {trainers.map((data, index) => {
          return (
            <TrainerCard
              key={index}
              data={data}
              selected={selected}
              setSelected={setSelected}
              index={data.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TrainerPage;
