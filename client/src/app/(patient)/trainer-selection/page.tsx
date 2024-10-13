"use client";
import { TrainerData } from "@/app/interfaces";
import { useEffect, useState } from "react";
import { getAllTrainers, getMyTrainer } from "./action";
import TrainerCard from "../../../../components/TrainerCard";
import { Button, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getUserIdFromCookie } from "@/app/(common)/getUserId";

const TrainerPage: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [selected, setSelected] = useState<number>(-1);
  const [leave, setLeave] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const router = useRouter();

  useEffect(() => {
    console.log(selected);
    if (selected == -1) {
      return;
    }
    const fetchUserId = async () => {
      const userIdResult: number | null = await getUserIdFromCookie();
      if (!userIdResult) {
        console.error("Not able to find user");
        return -1;
      }
      setUserId(userIdResult);
    };
    fetchUserId();

    const fetchSave = async () => {
      const data = {
        userId: userId,
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

      if (userId && userId > 0) {
        const myTrainer: number | null = await getMyTrainer(userId);
        if (myTrainer) {
          setSelected(myTrainer);
        }
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
          padding: "1rem 3rem",
        }}
      >
        <Typography.Title title="Trainer Page">Trainer Page</Typography.Title>
        {selected > 0 ? (
          <Button onClick={() => setLeave(true)}>
            Save <ArrowRightOutlined />{" "}
          </Button>
        ) : (
          <></>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
