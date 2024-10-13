"use client";
import React from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";

const MainHeader: React.FC = () => {
  const { Header } = Layout;
  const router = useRouter()

  const items = [
    {
      key: "1",
      label: "Home",
      onClick: () => router.push("/home"),
    },
    {
      key: "2",
      label: "Analytics",
      onClick: () => router.push("/dashboard"),
    },
    {
      key: "3",
      label: "Logout",
      onClick: () => {
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"; 
        router.push("/login"); 
      }
    }
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
