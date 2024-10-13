"use client";
import React, { useState } from "react";
import { Layout } from "antd";
import VideoStream from "../../../../components/VideoStream";
import CustomDropdown from "../../../../components/Dropdown";
import PTButton from "../../../../components/TrainerButton";

const Home: React.FC = () => {
  const { Content } = Layout;
  const [selected, setSelected] = useState<string>("Push-Ups");

  return (
    <Layout className="h-full">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          margin: "2rem 4rem ",
          gap: "3rem",
        }}
      >
        <PTButton />
        <CustomDropdown setSelected={setSelected} />
      </div>

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="w-full h-full flex justify-center items-center">
          <VideoStream selectedStretch={selected} />
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
