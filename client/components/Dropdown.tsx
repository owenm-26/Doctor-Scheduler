import { Dropdown, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CustomDropdownParams } from "@/app/interfaces";

const CustomDropdown: React.FC<CustomDropdownParams> = ({ setSelected }) => {
  const handleSelect = (name: string) => {
    setSelected(name);
    setSelectedLabel(name);
  };
  const [selectedLabel, setSelectedLabel] = useState<string>("Push-Ups");
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Push-Ups",
      onClick: () => handleSelect("Push-Ups"),
    },
    {
      key: "2",
      label: "Pull-Ups",
      onClick: () => handleSelect("Pull-Ups"),
    },
    {
      key: "3",
      label: "Squats",
      onClick: () => handleSelect("Squats"),
    },
    {
      key: "4",
      label: "Jumping Jacks",
      onClick: () => handleSelect("Jumping Jacks"),
    },
    // {
    //   key: "5",
    //   label: "Sit-Ups",
    //   onClick: () => handleSelect("Sit-Ups"),
    // },
  ];

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        defaultSelectedKeys: ["1"],
      }}
    >
      <Typography.Link>
        <Space>
          {selectedLabel}
          <DownOutlined />
        </Space>
      </Typography.Link>
    </Dropdown>
  );
};

export default CustomDropdown;
