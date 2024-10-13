"use client";
import { TrainerCardParams } from "@/app/interfaces";
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

const TrainerCard = ({
  data,
  selected,
  setSelected,
  index,
}: TrainerCardParams) => {
  const [cardColor, setCardColor] = useState<string>(getRandomColor());

  const handleSelect = () => {
    if (selected == index) {
      // If the key is already selected, remove it
      setSelected(-1);
    } else {
      // If the key is not selected, add it
      setSelected(index);
    }
  };

  useEffect(() => {
    setCardColor(getRandomColor());
  }, []);

  const fullName = data.first_name + " " + data.last_name;

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
            color: selected > 0 ? "green" : "grey",
          }}
          onClick={handleSelect}
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
        title={fullName}
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
