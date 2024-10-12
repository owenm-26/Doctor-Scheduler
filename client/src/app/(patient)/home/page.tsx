"use client";
import React from "react";
import Camera from "../../../../components/Camera";
import { Layout } from "antd";

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
          <Camera />
          <div className="border border-solid w-[20%] h-[65%]"></div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
