"use client";
import React from "react";
import { Layout } from "antd";
import VideoStreamPT from "../../../../components/VideoStreamPT";

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
          <VideoStreamPT />
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
