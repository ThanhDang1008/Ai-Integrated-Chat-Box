import "./header.scss";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { doGetAccountAction } from "@/redux/account/accountSlice";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getInfoUser } from "@/services/api/user";
import { queryKeys } from "@/constants/Common";

import { logout } from "@/services/api/auth/auth";
// import { googleLogout } from "@react-oauth/google";

const NavLinkStyle = {
  textDecoration: "none",
};

interface IHeaderProps {
  customStyles: {
    backgroundColor?: string;
    colorPageLogin?: boolean;
  };
}

function Header(props: IHeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { customStyles } = props;
  //console.log("customStyles", customStyles);

  // const logout = () => {
  //   googleLogout();
  //   console.log("logout");
  // };
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 835);
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 835;
      setIsMobile(isNowMobile);
      if (!isNowMobile) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      //console.log("response", response);
      if (response.status === 200) {
        dispatch(doGetAccountAction(null));
        queryClient.setQueryData([queryKeys.INFO_USER], null);
        queryClient.setQueryData([queryKeys.ACCOUNT], null);

        message.success("Logout success");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Logout failed");
    }
  };

  const {
    data: info_user,
    isLoading,
    isError,
    error: data_error,
  } = useQuery({
    queryKey: [queryKeys.INFO_USER],
    queryFn: () => getInfoUser(),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    //enabled:
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    retryDelay: 2000,
    retryOnMount: true,
  });

  // console.log("info_user", info_user);

  // console.log("data_error", data_error);

  return (
    <>
      <header
        style={{
          backgroundColor: customStyles.backgroundColor,
        }}
        className="header_mainlayout"
      >
        <div className="logo">
          <i className="bi bi-fire"></i>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink
                className={`${
                  customStyles.colorPageLogin ? `color_Page_Login` : ""
                }`}
                to="/"
              >
                Home
              </NavLink>
            </li>
            {window.location.pathname === "/" && (
              <li>
                {/* <NavLink
                className={`${
                  customStyles.colorPageLogin ? `color_Page_Login` : ""
                }`}
                to="/conversation"
              >
                Conversation
              </NavLink> */}

                <a
                  href="#home_title"
                  className={`${
                    customStyles.colorPageLogin ? `color_Page_Login` : ""
                  }`}
                >
                  <i className="bi bi-stars"></i> Conversation
                </a>
              </li>
            )}

            {window.location.pathname === "/" && (
              <li>
                {/* <NavLink
                    className={`${
                      customStyles.colorPageLogin ? `color_Page_Login` : ""
                    }`}
                    to="/chat"
                  >
                    Chat AI
                  </NavLink> */}
                <a
                  href="#home_cardtrial"
                  className={`${
                    customStyles.colorPageLogin ? `color_Page_Login` : ""
                  }`}
                >
                  <i className="bi bi-lightning-charge-fill"></i> Chat AI
                </a>
              </li>
            )}

            {/* <li>
              <NavLink
                className={`${
                  customStyles.colorPageLogin ? `color_Page_Login` : ""
                }`}
                to="/documents"
              >
                Documents
              </NavLink>
            </li> */}
            {window.location.pathname === "/" && (
              <li>
                <NavLink
                  className={`${
                    customStyles.colorPageLogin ? `color_Page_Login` : ""
                  }`}
                  to="/chatbot/list"
                >
                  Chatbot
                </NavLink>
                {/* <a
                  href="#home_cardlist"
                  className={
                    customStyles.colorPageLogin ? `color_Page_Login` : ""
                  }
                >
                  Contribute
                </a> */}
              </li>
            )}

            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    type: "group",
                    label: "Info",
                    children: [
                      {
                        key: "1-1",
                        label: (
                          <NavLink style={{ ...NavLinkStyle }} to="/account">
                            Account
                          </NavLink>
                        ),
                        icon: (
                          <i
                            style={{ marginRight: 5 }}
                            className="bi bi-person-circle"
                          ></i>
                        ),
                      },
                      {
                        key: "1-2",
                        label: (
                          <NavLink style={{ ...NavLinkStyle }} to="/contribute">
                            Contribute
                          </NavLink>
                        ),
                        icon: (
                          <i
                            style={{ marginRight: 5 }}
                            className="bi bi-envelope-paper-fill"
                          ></i>
                        ),
                      },
                      {
                        //help and support
                        key: "1-3",
                        label: (
                          <NavLink
                            style={{ ...NavLinkStyle }}
                            to="/help-support"
                          >
                            Help&Support
                          </NavLink>
                        ),
                        icon: (
                          <i
                            style={{ marginRight: 5 }}
                            className="bi bi-question-octagon"
                          ></i>
                        ),
                      },
                    ],
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "2",
                    label: (
                      <NavLink style={{ ...NavLinkStyle }} to="/settings">
                        Settings
                      </NavLink>
                    ),
                    icon: (
                      <i style={{ marginRight: 5 }} className="bi bi-gear"></i>
                    ),
                  },
                  {
                    key: "3",
                    label: <strong>{info_user ? "Logout" : "Login"}</strong>,
                    danger: info_user ? true : false,
                    onClick: () => {
                      info_user ? handleLogout() : navigate("/login");
                    },
                    icon: info_user ? (
                      <i
                        style={{ marginRight: 5 }}
                        className="bi bi-box-arrow-right"
                      ></i>
                    ) : (
                      <i
                        style={{ marginRight: 5 }}
                        className="bi bi-box-arrow-in-right"
                      ></i>
                    ),
                  },
                ],
              }}
            >
              {/* <li>
                <a
                  className={`${
                    customStyles.colorPageLogin ? `color_Page_Login` : ""
                  }`}
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    className="avatar"
                    //src="https://res.cloudinary.com/dg2awknkk/image/upload/v1704732879/bc1qqdokbeedqas6yfro.jpg"
                    src={
                      info_user
                        ? info_user?.urlavatar
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcvT6QqjdH2mTk0Zpf84FLHDMX77xUTonQ0g&s"
                    }
                  />
                  {info_user?.fullname ?? "Guest"}
                </a>
              </li> */}
              <li>
                <a
                  className={`${
                    customStyles.colorPageLogin ? `color_Page_Login` : ""
                  }`}
                  onClick={(e) => e.preventDefault()}
                >
                  {info_user && (
                    <img
                      className="avatar"
                      src={info_user.urlavatar}
                      alt="User Avatar"
                    />
                  )}
                  {info_user?.fullname || "Guest"}
                </a>
              </li>
            </Dropdown>
          </ul>
        </nav>
        <div>
          {/* {isMobile && (
            <Dropdown
              className="menu-dropdown"
              menu={{
                items: [
                  {
                    key: "1",
                    type: "group",
                    label: "Menu",
                    children: [
                      {
                        key: "1.1",
                        label: (
                          <NavLink style={{ ...NavLinkStyle }} to="/">
                            Home
                          </NavLink>
                        ),
                      },
                      window.location.pathname === "/" && {
                        key: "1.2",
                        label: (
                          // <NavLink
                          //   style={{ ...NavLinkStyle }}
                          //   to="/conversation"
                          // >
                          //   Conversation
                          // </NavLink>
                          <a href="#home_title" style={{ ...NavLinkStyle }}>
                            <i className="bi bi-stars"></i> Conversation
                          </a>
                        ),
                      },
                      window.location.pathname === "/" && {
                        key: "1.3",
                        label: (
                          // <NavLink style={{ ...NavLinkStyle }} to="/chat">
                          //   Chat AI
                          // </NavLink>
                          <a href="#home_cardtrial" style={{ ...NavLinkStyle }}>
                            <i className="bi bi-lightning-charge-fill"></i> Chat
                            AI
                          </a>
                        ),
                      },
                      {
                        key: "1.4",
                        label: (
                          <NavLink style={{ ...NavLinkStyle }} to="/documents">
                            Documents
                          </NavLink>
                        ),
                      },
                      window.location.pathname === "/" && {
                        key: "1.5",
                        label: (
                          // <NavLink style={{ ...NavLinkStyle }} to="/pricing">
                          //   Pricing
                          // </NavLink>
                          <a href="#home_cardlist" style={{ ...NavLinkStyle }}>
                            Contribute
                          </a>
                        ),
                      },
                    ],
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "3",
                    label: <>{`${info_user?.fullname ?? "Guest"}`}</>,
                    icon: (
                      <i
                        style={{ marginRight: 5 }}
                        className="bi bi-person-circle"
                      ></i>
                    ),
                    //danger: true,
                    children: [
                      {
                        key: "3.1",
                        type: "group",
                        label: "Info",
                        children: [
                          {
                            key: "3.1.1",
                            label: (
                              <NavLink
                                style={{ ...NavLinkStyle }}
                                to="/account"
                              >
                                Account
                              </NavLink>
                            ),
                            icon: (
                              <i
                                style={{ marginRight: 5 }}
                                className="bi bi-person-circle"
                              ></i>
                            ),
                          },
                          {
                            key: "3.1.2",
                            label: (
                              <NavLink
                                style={{ ...NavLinkStyle }}
                                to="/contribute"
                              >
                                Contribute
                              </NavLink>
                            ),
                            icon: (
                              <i
                                style={{ marginRight: 5 }}
                                className="bi bi-envelope-paper-fill"
                              ></i>
                            ),
                          },
                          {
                            key: "3.1.3",
                            label: (
                              <NavLink
                                style={{ ...NavLinkStyle }}
                                to="/help-support"
                              >
                                Help&Support
                              </NavLink>
                            ),
                            icon: (
                              <i
                                style={{ marginRight: 5 }}
                                className="bi bi-question-octagon"
                              ></i>
                            ),
                          },
                        ],
                      },
                      {
                        type: "divider",
                      },
                      {
                        key: "3.2",
                        label: (
                          <NavLink style={{ ...NavLinkStyle }} to="/settings">
                            Settings
                          </NavLink>
                        ),
                        icon: (
                          <i
                            style={{ marginRight: 5 }}
                            className="bi bi-gear"
                          ></i>
                        ),
                      },
                      {
                        key: "3.3",
                        label: (
                          <strong>{info_user ? "Logout" : "Login"}</strong>
                        ),
                        danger: info_user ? true : false,
                        onClick: () => {
                          info_user ? handleLogout() : navigate("/login");
                        },
                        icon: info_user ? (
                          <i
                            style={{ marginRight: 5 }}
                            className="bi bi-box-arrow-right"
                          ></i>
                        ) : (
                          <i
                            style={{ marginRight: 5 }}
                            className="bi bi-box-arrow-in-right"
                          ></i>
                        ),
                      },
                    ],
                  },
                ],
              }}
              trigger={["click"]}
              onClick={handleClick}
              onOpenChange={(open) => setIsOpen(open)}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {isOpen ? (
                    <CloseOutlined
                      style={{
                        color: "#d8d7d7",
                      }}
                    />
                  ) : (
                    <MenuOutlined
                      style={{
                        color: "#d8d7d7",
                      }}
                    />
                  )}
                </Space>
              </a>
            </Dropdown>
          )} */}
        </div>
      </header>
    </>
  );
}

export default Header;
