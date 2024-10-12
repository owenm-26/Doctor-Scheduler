"use client";
import React from "react";
import { Layout, Menu } from "antd";

const MainHeader: React.FC = () => {
  const { Header } = Layout;
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
        }}
      />
    </Header>
  );
};

export default MainHeader;
