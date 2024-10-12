"use client";
import { TrainerData } from "@/app/interfaces";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import Meta from "antd/es/card/Meta";
import { useState, useEffect } from "react";

const randomColors: string[] = [
  "red",
  "green",
  "blue",
  "purple",
  "orange",
  "yellow",
];

const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * randomColors.length);
  return randomColors[randomIndex];
};

const TrainerCard = ({ data }: { data: TrainerData }) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [cardColor, setCardColor] = useState<string>(getRandomColor());

  useEffect(() => {
    setCardColor(getRandomColor());
  }, []);

  return (
    <Card
      style={{ width: "20%", margin: "1rem" }}
      cover={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: cardColor, // Use the fixed color from state
            height: "10rem",
          }}
        >
          <p style={{ fontSize: "4rem" }}>
            {data.first_name[0]} {data.last_name[0]}
          </p>
        </div>
      }
      actions={[
        <PlusCircleOutlined
          key="select"
          style={{
            fontSize: "2rem",
            color: selected ? "green" : "grey",
          }}
          onClick={() => setSelected(!selected)}
        />,
      ]}
    >
      <Meta
        avatar={
          <Avatar
            src={
              data.picture
                ? data.picture // Use the direct picture URL
                : "https://cdn-icons-png.flaticon.com/128/847/847969.png"
            }
          />
        }
        title={data.first_name}
        description={
          <div
            style={{
              height: "4rem", // Set a fixed height for the biography
            }}
          >
            {data.biography}
          </div>
        }
      />
    </Card>
  );
};

export default TrainerCard;
