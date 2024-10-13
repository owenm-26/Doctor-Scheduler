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
  const [userId, setUserId] = useState<number | null>(null); // Initialize with null
  const router = useRouter();

  // Fetch userId from cookie when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const userIdResult: number | null = await getUserIdFromCookie();
      if (!userIdResult) {
        console.error("Not able to find user");
        return;
      }
      setUserId(userIdResult); // Update userId state
    };
    fetchUserId();
  }, []); // Only run once when the component mounts

  // Fetch trainers whenever userId changes
  useEffect(() => {
    const getTrainers = async () => {
      const result: TrainerData[] = await getAllTrainers();
      if (result) {
        setTrainers(result);
      }
      if (userId && userId > 0) {
        const myTrainer: number | null = await getMyTrainer(userId);
        console.log("MY TRAINER", myTrainer);
        if (myTrainer) {
          setSelected(myTrainer);
        }
      }
    };
    getTrainers();
  }, [userId]); // Run whenever userId changes

  // Save trainer whenever selected changes and userId is set
  useEffect(() => {
    const fetchSave = async () => {
      if (selected === -1 || userId === null) {
        return; // Do not proceed if selected is -1 or userId is not available
      }
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
          body: JSON.stringify(data),
        });
        if (response.ok) {
          router.push("/home");
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (leave) {
      fetchSave(); // Call save function if leave is true
    }
  }, [leave, selected, userId]); // Run when leave, selected, or userId changes

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
            Save <ArrowRightOutlined />
          </Button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {trainers.map((data, index) => (
          <TrainerCard
            key={index}
            data={data}
            selected={selected}
            setSelected={setSelected}
            index={data.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainerPage;
