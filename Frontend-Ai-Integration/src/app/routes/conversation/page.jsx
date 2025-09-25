import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./conversation.scss";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  DownOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Switch,
  Button,
  Drawer,
  Radio,
  Space,
  Dropdown,
  Tooltip,
} from "antd";
const { Header, Content, Footer, Sider } = Layout;

function Conversation() {
  const [isSettings, setIsSettings] = useState(false);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const [theme, setTheme] = useState("dark");
  const [collapsed, setCollapsed] = useState(false);

  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };

  const optionDropDown = [
    {
      label: (
        <Link style={{ textDecoration: "none" }} to="/admin/account">
          <i className="bi bi-person-fill"></i> Account
        </Link>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Link style={{ textDecoration: "none" }} to="/admin/settings">
          <i className="bi bi-sliders"></i> Settings
        </Link>
      ),
      key: "1",
    },
  ];

  return (
    <>
      <div className="container_conversation">
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
          >
            <div className="demo-logo-vertical" />
            <div style={{ margin: 13 }}>
              <Link style={{textDecoration:"none"}} to="/">
              <h3
                style={{
                  color: theme === "dark" ? "white" : "black",
                  textAlign: "center",
                  color: "#008eff",
                }}
              >
                {collapsed ? <i className="bi bi-stars"></i> : "AskYourAI"}
              </h3>
              </Link>
            </div>
            <Menu
              theme="light"
              defaultSelectedKeys={[window.location.pathname]}
              // selectedKeys={[
              //   window.location.pathname 
              // ]}
              mode="inline"
              //   items={items}
            >
              <Menu.Item
                key="/conversation"
                icon={<i className="bi bi-chat-left"></i>}
              >
                Conversation<Link to="/conversation"></Link>
              </Menu.Item>
              <Menu.Item
                key="/conversation/summarise"
                icon={<i className="bi bi-file-text"></i>}
              >
                Summarise<Link to="/conversation/summarise"></Link>
              </Menu.Item>
              <Menu.Item
                key="/conversation/documents"
                icon={<i className="bi bi-folder2-open"></i>}
              >
                Documents<Link to="/conversation/documents"></Link>
              </Menu.Item>
              <Menu.Item
                key="/conversation/account"
                icon={<i className="bi bi-person-circle"></i>}
              >
                Account<Link to="/conversation/account"></Link>
              </Menu.Item>
              <Menu.Item
                key="/conversation/help-support"
                icon={<i className="bi bi-question-circle"></i>}
              >
                Help & Support<Link to="/conversation/help-support"></Link>
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout>
            <Header
              style={{
                padding: 0,
                //background: theme === "dark" ? "rgb(230 230 230)" : "#fff",
                background: "linear-gradient(145deg, #cacaca, #f0f0f0)",
                boxShadow: "rgb(149 140 140) 0px 2px 8px",
                display: "flex",
                justifyContent: "space-between",
                padding: "1% 3%",
              }}
            >
              <Space>
                <i
                  style={{
                    fontSize: 30,
                    padding: "9%",
                    cursor: "pointer",
                    color: "rgb(100 100 100)",
                  }}
                  onClick={showDrawer}
                  className="bi bi-list"
                ></i>
              </Space>

              <Dropdown
                menu={{
                  items: optionDropDown,
                }}
                trigger={["click"]}
              >
                <a
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={(e) => {
                    setIsSettings(!isSettings);
                    e.preventDefault();
                  }}
                >
                  {isSettings ? (
                    <i
                      style={{ fontSize: 27, color: "rgb(100 100 100)" }}
                      className="bi bi-gear"
                    ></i>
                  ) : (
                    <i
                      style={{ fontSize: 27, color: "rgb(100 100 100)" }}
                      className="bi bi-gear-fill"
                    ></i>
                  )}
                </a>
              </Dropdown>
            </Header>

            <Content
              style={{
                //margin: "0 16px",
                backgroundColor:"#f3f3f30a"
              }}
            >
              <div className="outlet_content" style={{ padding: "3%" }}>
                <Outlet />
              </div>
            </Content>

            {/* <Footer
              style={{
                textAlign: "center",
              }}
            >
              Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer> */}
          </Layout>
        </Layout>

        <Drawer
          title="AskYourAI"
          placement="bottom"
          width={500}
          onClose={onClose}
          open={open}
          // extra={
          //   <Space>
          //     <Button onClick={onClose}>Cancel</Button>
          //     <Button type="primary" onClick={onClose}>
          //       OK
          //     </Button>
          //   </Space>
          // }
        >
          <Menu
            theme="light"
            defaultSelectedKeys={[window.location.pathname]}
            mode="inline"
            //   items={items}
          >
            <Menu.Item
              key="/conversation"
              icon={<i className="bi bi-chat-left"></i>}
            >
              Conversation<Link to="/conversation"></Link>
            </Menu.Item>
            <Menu.Item
              key="/conversation/summarise"
              icon={<i className="bi bi-file-text"></i>}
            >
              Summarise<Link to="/conversation/summarise"></Link>
            </Menu.Item>
            <Menu.Item
              key="/conversation/documents"
              icon={<i className="bi bi-folder2-open"></i>}
            >
              Documents<Link to="/conversation/documents"></Link>
            </Menu.Item>
            <Menu.Item
              key="/conversation/account"
              icon={<i className="bi bi-person-circle"></i>}
            >
              Account<Link to="/conversation/account"></Link>
            </Menu.Item>
            <Menu.Item
              key="/conversation/help-support"
              icon={<i className="bi bi-question-circle"></i>}
            >
              Help & Support<Link to="/conversation/help-support"></Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    </>
  );
}

export default Conversation;
