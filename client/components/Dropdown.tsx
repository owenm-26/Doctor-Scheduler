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
      onClick: () => handleSelect("Push-ups"),
    },
    {
      key: "2",
      label: "Pull-ups",
      onClick: () => handleSelect("Pull-ups"),
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
