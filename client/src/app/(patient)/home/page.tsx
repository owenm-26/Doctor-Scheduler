"use client";
import React from "react";
import { Layout } from "antd";
import VideoStream from "../../../../components/VideoStream";
import Camera from "../../../../components/Camera";

const Home: React.FC = () => {
  const { Content } = Layout;

  return (
    <Layout className="h-full">
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="w-full h-full flex justify-center items-center">
          <VideoStream />
          {/* <Camera /> */}
          <div className="border border-solid w-[20%] h-[65%]"></div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
