"use client";

import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import type { NextApiRequest, NextApiResponse } from 'next'

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
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
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
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
