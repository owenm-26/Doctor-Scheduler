"use client";
import React from "react";
import Camera from "../../../../components/Camera";
import MainHeader from "../../../../components/MainNavbar"
import { Layout, Menu } from "antd";

const Home: React.FC = () => {
  const { Header, Content, Footer } = Layout;
  const items = [
    {
      key: "1",
      label: "Home",
    },
    {
      key: "2",
      label: "Analytics",
    },
  ];

  return (
    <Layout className="h-screen">
      <MainHeader/>
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
      <Footer style={{ textAlign: "center" }}>EZPT</Footer>
    </Layout>
  );
};

export default Home;
