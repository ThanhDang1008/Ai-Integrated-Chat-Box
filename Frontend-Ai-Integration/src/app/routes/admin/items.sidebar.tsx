import type { MenuProps } from "antd";
import { Link } from "react-router-dom";
import {
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  UsbOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

export const items_menu: MenuItem[] = [
  {
    key: "/admin",
    icon: <PieChartOutlined />,
    label: (
      <>
        Trang chủ
        <Link to="/admin"></Link>
      </>
    ),
  },
  {
    key: "/admin/manage-users",
    icon: <i className="bi bi-people"></i>,
    label: (
      <>
        Quản lý người dùng
        <Link to="/admin/manage-users"></Link>
      </>
    ),
  },
  //chatbot
  {
    key: "/admin/manage-chatbot",
    icon: <UsbOutlined />,
    label: (
      <>
        Chatbot
        <Link to="/admin/manage-chatbot"></Link>
      </>
    ),
  },
  // {
  //   key: "sub1",
  //   icon: <UserOutlined />,
  //   label: (
  //     <Tooltip title="Quản lý người dùng" placement="rightTop">
  //       Quản lý người dùng
  //     </Tooltip>
  //   ),
  //   children: [
  //     { key: "3", label: "Tom" },
  //     { key: "4", label: "Bill" },
  //     { key: "5", label: "Alex" },
  //   ],
  // },
  // {
  //   key: "sub2",
  //   icon: <SnippetsOutlined />,
  //   label: (
  //     <Tooltip title="Quản lý loại công việc" placement="rightTop">
  //       Quản lý loại công việc
  //     </Tooltip>
  //   ),
  //   children: [
  //     { key: "5.5", label: "Tom" },
  //     { key: "6", label: "Bill" },
  //     { key: "7", label: "Alex" },
  //   ],
  // },
  {
    key: "g2",
    label: "Settings",
    type: "group",
    children: [
      {
        key: "sub3",
        icon: <i className="bi bi-archive-fill"></i>,
        label: "Archive",
        children: [
          { key: "8", label: "Tom" },
          { key: "9", label: "Bill" },
          { key: "10", label: "Alex" },
        ],
      },
      {
        key: "sub4",
        icon: <i className="bi bi-bookmark-check-fill"></i>,
        label: "Bookmark",
      },
      {
        key: "13",
        icon: <i className="bi bi-box-fill"></i>,
        label: "Box",
      },
      {
        key: "14",
        icon: <i className="bi bi-calculator-fill"></i>,
        label: "Calculator",
      },
      {
        key: "15",
        icon: <i className="bi bi-cloud-arrow-up-fill"></i>,
        label: "Cloud",
      },
      {
        key: "1x",
        icon: <SettingOutlined />,
        label: "Files",
        children: [
          { key: "14", label: "File 1" },
          { key: "15", label: "File 2" },
        ],
      },
    ],
  },
];
