"use client";
import React from "react";
import Camera from "../../../../components/Camera";
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
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
          style={{
            display: "flex",
            alignItems: "center",
            width: "500px",
            gap: "1.5rem",
          }}
        />
      </Header>
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
      <Footer style={{ textAlign: "center" }}>Streching-Pal</Footer>
    </Layout>
  );
};

export default Home;
