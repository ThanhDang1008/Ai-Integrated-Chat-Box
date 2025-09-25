import "./sidebar_chat.scss";
import {
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  message,
  Popconfirm,
  Modal,
  Tooltip,
  Drawer,
  Switch,
} from "antd";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { getListTitleConversation } from "@/services/api/user";
import { isDateWithinDays } from "@/utils/date";
import { queryKeys } from "@/constants/Common";

function SidebarChat(props) {
  const { user } = useSelector((state) => state.account);
  const {
    refresh,
    openSidebar,
    setOpenSidebar,
    getLenConversation,
    infoConversation,
    triggerSavedConversation,
    setThemeDarkMode,
    themeDarkMode,
  } = props;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputEditTitle = useRef(null);

  queryClient.setDefaultOptions({
    queries: {
      gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: 3,
      retryDelay: 2000,
      retryOnMount: true,
    },
  });

  //---------------------------------------------------------
  const [titleConversation, setTitleConversation] = useState([]);
  const [editTitleConversation, setEditTitleConversation] = useState({});
  const dataTitleConversation = queryClient.getQueryData([
    queryKeys.GET_LIST_TITLE_CONVERSATION_NO_FILE,
    user?.id,
  ]);
  //console.log("dataTitleConversation", dataTitleConversation);
  const [titleEditNew, setTitleEditNew] = useState("");
  const [periodOfTime, setPeriodOfTime] = useState([
    { start: 0, end: 1, label: "Today" },
    { start: 1, end: 2, label: "Yesterday" },
    { start: 2, end: 3, label: "Previous 3 days" },
    { start: 3, end: 7, label: "Previous 7 days" },
    { start: 7, end: 9999, label: "All days from 7 days ago" },
  ]);

  //const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    const getListConversation = async () => {
      try {
        const response = await getListTitleConversation(user?.id);
        if (response.status === 200) {
          const data_chatbot_no_file = response.data.data.conversations.filter(
            (item) => item.urlfile === null
          );
          setTitleConversation(data_chatbot_no_file);
          queryClient.setQueryData(
            [queryKeys.GET_LIST_TITLE_CONVERSATION_NO_FILE, user?.id],
            data_chatbot_no_file
          );
        }
      } catch (error) {
        if (error.response?.status === 400) {
          message.error("Get list conversation fail!");
        }
      }
    };
    if (!dataTitleConversation) {
      getListConversation();
    }
    //nếu đã có trong cache thì ko call API
    setTitleConversation(dataTitleConversation);
  }, [refresh]);

  const handleEditTitle = (id) => {
    setEditTitleConversation({
      //...editTitleConversation,//chỉ edit 1 item nên command
      [id]: true,
    });
  };

  const handleSaveTitle = async (index, id, titleOld) => {
    setEditTitleConversation({
      // ...editTitleConversation,//chỉ edit 1 item nên command
      [id]: false,
    });
    const titleEditNew = inputEditTitle.current.value;
    //console.log("titleEditNew", titleEditNew);
    if (titleEditNew === titleOld) {
      return message.warning("No change title!");
    } else if (titleEditNew === "") {
      return message.warning("Title is required!");
    }

    const clone_titleConversation = [...titleConversation];
    clone_titleConversation[index].title = titleEditNew;
    setTitleConversation(clone_titleConversation);
    queryClient.setQueryData(
      [queryKeys.GET_LIST_TITLE_CONVERSATION_NO_FILE, user?.id],
      clone_titleConversation
    );

    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/conversation/update-title/${id}`,
        {
          title: titleEditNew,
        }
      );
      if (response.status === 200) {
        //message.success("Update title success!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.error("Update title fail!");
      }
    }
  };

  //console.log("titleConversation", titleConversation);

  const confirmDeleteConversation = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/conversation/delete/${id}`
      );
      if (response.status === 200) {
        const data_delete_conversation = titleConversation.filter(
          (item) => item.id !== id
        );
        setTitleConversation(data_delete_conversation);
        queryClient.setQueryData(
          [queryKeys.GET_LIST_TITLE_CONVERSATION_NO_FILE, user?.id],
          data_delete_conversation
        );
        navigate("/chat/gemini/newchat");
        message.success("Delete conversation success!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.error("Delete conversation fail!");
      }
    }
  };
  const cancel = (e) => {
    //console.log(e);
    //message.error("Click on No");
  };

  const warning_save_conversation = () => {
    Modal.confirm({
      title: "Warning",
      content:
        "You have not saved the conversation yet! Do you want to save it?",
      onOk() {
        triggerSavedConversation(window.location.pathname);
        //console.log("OK");
      },
      onCancel() {
        navigate("/");
      },
      okText: "Save",
      cancelText: "Don't save",
    });
  };

  useEffect(() => {
    if (
      window.location.pathname === "/chat/gemini/newchat" &&
      infoConversation.length > 0
    ) {
      warning_save_conversation();
    } else if (
      window.location.pathname === "/chat/gemini/newchat" &&
      infoConversation.length === 0
    ) {
      navigate("/");
    }
  }, [infoConversation.length]);

  useEffect(() => {
    if (infoConversation.saved === false) {
      warning_save_conversation();
    } else if (infoConversation.saved === true) {
      navigate("/");
    }
  }, [infoConversation.saved]);

  //------------------------------------------
  const onChangeTheme = (checked) => {
    //console.log(`switch to ${checked}`);
    setThemeDarkMode(checked);
  };

  return (
    <>
      <Drawer
        title="Menu"
        placement={"left"}
        closable={true}
        onClose={() => {
          setOpenSidebar(!openSidebar);
        }}
        open={openSidebar}
        key={"left"}
        className={
          themeDarkMode
            ? "dark_sidebar_chat_gemini_container"
            : "light_sidebar_chat_gemini_container"
        }
      >
        {/* <div
          className={`sidebar_chat`}
          style={{
            color: "white",
          }}
        > */}
        <div className="sidebar_chat__header">
          <i
            onClick={() => {
              setOpenSidebar(!openSidebar);
            }}
            className="bi bi-layout-sidebar"
            title="Close sidebar"
          ></i>
          <i
            onClick={() => {
              const path = window.location.pathname;
              if (path === "/chat/gemini/newchat") {
                getLenConversation(path);
              } else if (path.includes("/chat/gemini/conversation-")) {
                getLenConversation(path);
              }
            }}
            className="bi bi-houses"
          ></i>
        </div>
        <div
          style={{
            textAlign: "center",
            borderBottom: "1px solid #2a2a44",
          }}
        >
          <NavLink to="/chat/gemini/newchat" className="item__chat">
            <i className="bi bi-flower1"></i> New Chat Gemini
          </NavLink>
          <Switch defaultChecked onChange={onChangeTheme} />
          {/* <NavLink to="/chat/gemini/docs" className="item__chat">
              <i className="bi bi-journal-text"></i> Docs Gemini
            </NavLink> */}
        </div>
        <div
          style={{
            textAlign: "left",
            marginTop: "20px",
            fontSize: "0.9rem",
          }}
        >
          {periodOfTime.map((item_periodOfTime, index) => {
            return (
              <React.Fragment key={index}>
                <span
                  style={{
                    color: "#727281",
                    borderBottom: "1px solid #282332",
                    display: "block",
                    marginBottom: "10px",
                    padding: "5px 0px",
                  }}
                >
                  {item_periodOfTime.label}
                </span>
                {titleConversation?.map((item, index_titleConversation) => {
                  //console.log("item", item);
                  return (
                    <React.Fragment key={item.id}>
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        {editTitleConversation[item.id] &&
                          isDateWithinDays(
                            item.updatedAt,
                            item_periodOfTime.start,
                            item_periodOfTime.end
                          ) && (
                            <input
                              type="text"
                              defaultValue={item.title}
                              className="item__chat_edit"
                              spellCheck="false"
                              ref={inputEditTitle}
                              maxLength={255}
                            />
                          )}
                        {!editTitleConversation[item.id] &&
                          isDateWithinDays(
                            item.updatedAt,
                            item_periodOfTime.start,
                            item_periodOfTime.end
                          ) && (
                            <Tooltip title={item.title} placement="rightTop">
                              <NavLink
                                //key={item.id}
                                to={`/chat/gemini/${item.id}`}
                                className={({ isActive }) =>
                                  `item__chat ${
                                    isActive ? "item__chat_active" : ""
                                  }`
                                }
                              >
                                {item.title.length > 30
                                  ? item.title.substring(0, 30) + "..."
                                  : item.title}
                              </NavLink>
                            </Tooltip>
                          )}
                        {isDateWithinDays(
                          item.updatedAt,
                          item_periodOfTime.start,
                          item_periodOfTime.end
                        ) && (
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: "1",
                                  label: editTitleConversation[item.id]
                                    ? "Save"
                                    : "Edit",
                                  icon: editTitleConversation[item.id] ? (
                                    <CheckOutlined />
                                  ) : (
                                    <i className="bi bi-pencil"></i>
                                  ),
                                  onClick: () => {
                                    editTitleConversation[item.id]
                                      ? handleSaveTitle(
                                          index_titleConversation,
                                          item.id,
                                          item.title
                                        )
                                      : handleEditTitle(item.id);
                                  },
                                },
                                editTitleConversation[item.id] && {
                                  key: "2",
                                  //close save conversation
                                  label: "Close",
                                  icon: <CloseOutlined />,
                                  onClick: () => {
                                    setEditTitleConversation({
                                      [item.id]: false,
                                    });
                                  },
                                },
                                {
                                  key: "3",
                                  label: (
                                    <Popconfirm
                                      title=" Delete conversation?"
                                      description={
                                        <>
                                          <p>
                                            You want to delete conversation{" "}
                                            <b style={{ color: "red" }}>
                                              {item.title}
                                            </b>
                                          </p>
                                        </>
                                      }
                                      //placement="rightTop"
                                      onConfirm={() => {
                                        confirmDeleteConversation(item.id);
                                      }}
                                      onCancel={cancel}
                                      okText="Delete"
                                      cancelText="Cancel"
                                      icon={
                                        <QuestionCircleOutlined
                                          style={{
                                            color: "red",
                                          }}
                                        />
                                      }
                                    >
                                      <div
                                        style={{
                                          padding: "5px 12px",
                                        }}
                                      >
                                        <i className="bi bi-trash"></i> Delete
                                      </div>
                                    </Popconfirm>
                                  ),
                                  style: {
                                    padding: "0px",
                                  },
                                },
                              ],
                            }}
                            trigger={["click"]}
                            className="item_menu_dropdown"
                          >
                            <i
                              style={{
                                position: "absolute",
                                right: "0%",
                                top: "0%",
                              }}
                              className="bi bi-three-dots-vertical"
                            ></i>
                          </Dropdown>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
        {/* </div> */}
      </Drawer>
    </>
  );
}

export default SidebarChat;
