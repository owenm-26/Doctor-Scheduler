"use client";
import React from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";

interface MainHeaderProps {
  isLoggedIn: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ isLoggedIn }) => {
  const { Header } = Layout;
  const router = useRouter();

  const loggedInItems = [
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
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"; // Clear the session cookie
        router.push("/login");
      },
    },
  ];

  const loggedOutItems = [
    {
      key: "1",
      label: "Login",
      onClick: () => router.push("/login"),
    },
    {
      key: "2",
      label: "Register",
      onClick: () => router.push("/register"),
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
        items={isLoggedIn ? loggedInItems : loggedOutItems} // Ternary to switch between menus
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
