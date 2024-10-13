"use client";
import React from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";

interface MainHeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ isLoggedIn, onLogout }) => {
  const { Header } = Layout;
  const router = useRouter();

  const menuItems = isLoggedIn 
  ? [ 
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
        onClick: onLogout,
      },
    ] : [
      {
        key: "1",
        label: "Login",
        onClick: () => router.push("/login"),
      },
      {
        key: "2",
        label: "Register",
        onClick: () => router.push("/register-onboard"),
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
        items={menuItems} // Ternary to switch between menus
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
