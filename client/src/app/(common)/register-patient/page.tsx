"use client";

import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

type FieldType = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  birthday?: string;
  role?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {

  if (values.birthday) {
    const birthday: Date = new Date(Date.parse(values.birthday));
  }

  try {
    console.log("Attempting fetch...");
    const birthdayISO = values.birthday
      ? new Date(values.birthday).toISOString()
      : null;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: values.firstname,
        last_name: values.lastname,
        email: values.email,
        password: values.password,
        birthday: birthdayISO,
        role: "PATIENT",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registered successfully!");
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

const Register: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow w-screen flex flex-col justify-center items-center gap-1">
        <h2 className="text-4xl">Register</h2>
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
              rules={[{ required: true, message: "Please input your email!" }]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item<FieldType>
              label="First Name"
              name="firstname"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Last Name"
              name="lastname"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Birthday"
              name="birthday"
              rules={[
                { required: true, message: "Please input your birthday!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" type="date" />
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

            <Form.Item className="w-[40%]">
              <Button
                className="w-full max-w-lg rounded-md p-4"
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </>
      </div>
    </div>
  );
};

export default Register;
