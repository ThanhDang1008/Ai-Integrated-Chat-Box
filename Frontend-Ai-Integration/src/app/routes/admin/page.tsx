import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./admin.scss";
import { Layout, Menu, Button, Drawer, Space, Dropdown, Tooltip } from "antd";
const { Header, Content, Footer, Sider } = Layout;

import { items_menu } from "./items.sidebar";

function Admin() {
  const [isSettings, setIsSettings] = useState(false);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [collapsed, setCollapsed] = useState(true);

  const optionDropDown = [
    {
      label: (
        <Link style={{ textDecoration: "none" }} to="/admin/account">
          <i className="bi bi-person-fill"></i> Account
        </Link>
      ),
      key: "0",
    },
  ];

  return (
    <>
      <div className="admin_container">
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          {/* {window.innerWidth >= 576 &&( */}
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="dark"
          >
            <div className="demo-logo-vertical" />
            <div style={{ margin: 13 }}>
              <h3
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                {collapsed ? <i className="bi bi-person-circle"></i> : "Admin"}
              </h3>
            </div>
            <Menu
              theme="dark"
              defaultSelectedKeys={[window.location.pathname]}
              mode="inline"
              items={items_menu}
            />
          </Sider>
          {/* )} */}

          <Layout>
            <Header
              style={{
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
                    color: "#008eff",
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
                    <i style={{ fontSize: 27 }} className="bi bi-gear"></i>
                  ) : (
                    <i style={{ fontSize: 27 }} className="bi bi-gear-fill"></i>
                  )}
                </a>
              </Dropdown>
            </Header>

            <Content>
              {/* <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
              {/* <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: theme === "dark" ? "rgb(230 230 230)" : "#fff",
                  borderRadius: 10,
                  marginTop: 20,
                }}
              >
              </div> */}
              <Outlet />
            </Content>

            {/* <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
          </Layout>
        </Layout>

        <Drawer
          title="Menu Admin"
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
            items={items_menu}
          />
        </Drawer>
      </div>
    </>
  );
}

export default Admin;
