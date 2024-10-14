"use client";

import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

type FieldType = {
  email?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  console.log("Success:", values);

  try {
    console.log("Attempting fetch...");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        role: "PATIENT",
      }),
    });


    if (response.ok) {
      window.location.href = "/home";
    } else {
      alert("Registration failed.");
    }
  } catch (error) {
    console.error("An error occurred while registering:", error);
  }
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-grow w-screen flex flex-col justify-center items-center gap-6
        "
      >
        <h2 className="text-4xl">Login</h2>
        <>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 8 }}
            className="w-full max-w-sm flex flex-col items-center justify-center"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              className="w-full"
            >
              <Input.Password className="w-full" />
            </Form.Item>

            <Form.Item className="w-full flex justify-end">
              <a
                href="/register-onboard"
                className="text-blue-500 hover:underline"
              >
                Not a user? Register here
              </a>
            </Form.Item>

            <Form.Item className="w-[40%]">
              <Button
                className="w-full max-w-lg rounded-md p-4"
                type="primary"
                htmlType="submit"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </>
      </div>
    </div>
  );
};

export default Login;
