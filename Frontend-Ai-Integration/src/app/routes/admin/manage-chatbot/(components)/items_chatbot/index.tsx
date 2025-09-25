import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  message,
  Tooltip,
  Dropdown,
  Button,
  Empty,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ModalDeleteItemChatbot from "./modal_delete";
import { useQuery } from "@tanstack/react-query";
import { getAllChatbot } from "@/services/api/chatbot";
import { GET_ALL_CHATBOT } from "@/services/api/queryKey";

interface IDataChatbot {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

function ItemsChatbot() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteChatbot, setDeleteChatbot] = useState<{
    open: boolean;
    id: string;
    title: string;
  }>({
    open: false,
    id: "",
    title: "",
  });

  const _page = searchParams.get("_page") || "1";
  const _limit = searchParams.get("_limit") || "4";

  const {
    data: data_response_chatbot,
    isLoading,
    isError,
    error: error_chatbot,
  } = useQuery({
    queryKey: [GET_ALL_CHATBOT, _page, _limit],
    queryFn: () => getAllChatbot(_page, _limit),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    //enabled:
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 1000 * 60 * 30, // Refetch the data every 30 minutes
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  //console.log("data_response_chatbot", data_response_chatbot);

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {data_response_chatbot?.data.data_chatbot.map(
            (item: IDataChatbot, index: number) => {
              return (
                <Card
                  key={item.id}
                  style={{
                    width: 300,
                    marginTop: 16,
                    filter: "drop-shadow(4px 10px 12px #bfc9e8)",
                  }}
                  cover={
                    <img
                      alt="thumbnail_chatbot"
                      style={{
                        maxHeight: "187px",
                        minHeight: "187px",
                        maxWidth: "300px",
                        padding: "10px",
                        borderRadius: "15px",
                      }}
                      onError={(e: any) => {
                        e.target.src =
                          "https://res.cloudinary.com/dg2awknkk/image/upload/v1724260359/gtbkhspr0l6zggwcbdsp.png";
                      }}
                      src={item.thumbnail}
                    />
                  }
                  actions={[
                    <ExportOutlined
                      title="Chat now"
                      key="export"
                      onClick={() => {
                        navigate(`/chatbot/c/${item.id}`);
                      }}
                    />,
                    <EditOutlined
                      title="Edit chatbot"
                      key="edit"
                      onClick={() => {
                        navigate(`/admin/manage-chatbot/update/${item.id}`);
                      }}
                    />,
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: (
                              <div>
                                <i className="bi bi-trash"></i> Delete
                              </div>
                            ),
                            title: "Delete chatbot",
                            onClick: () => {
                              setDeleteChatbot({
                                open: true,
                                id: item.id,
                                title: item.title,
                              });
                            },
                          },
                        ],
                      }}
                      placement="bottom"
                    >
                      <SettingOutlined key="setting" />
                    </Dropdown>,
                  ]}
                >
                  <Card.Meta
                    style={{
                      height: "136px",
                    }}
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: "#64a0de",
                          border: "1px solid rgb(126 224 255)",
                        }}
                        src="https://res.cloudinary.com/dg2awknkk/image/upload/v1724874550/lutbfishupwepa4jyfnx.png"
                      />
                    }
                    title={
                      <>
                        {item.title.trim().length > 22 ? (
                          <Tooltip title={item.title}>
                            {item.title.trim().slice(0, 22) + "..."}
                          </Tooltip>
                        ) : (
                          item.title.trim()
                        )}
                      </>
                    }
                    description={
                      <>
                        {item.description.trim().length > 90 ? (
                          <Tooltip title={item.description}>
                            {item.description.trim().slice(0, 90) + "..."}
                          </Tooltip>
                        ) : (
                          item.description.trim()
                        )}
                      </>
                    }
                  />
                </Card>
              );
            }
          )}
          {data_response_chatbot?.data.data_chatbot.length === 0 && (
            <Empty description={<span>No chatbot found</span>} />
          )}
          {isLoading &&
            [...Array(Number(_limit))].map((_,index) => {
              return (
                <Card
                  key={`loading-${index}`}
                  style={{
                    width: 300,
                    marginTop: 16,
                    filter: "drop-shadow(4px 10px 12px #bfc9e8)",
                  }}
                  cover={
                    <img
                      alt="thumbnail_chatbot"
                      style={{
                        maxHeight: "187px",
                        maxWidth: "300px",
                        padding: "10px",
                        borderRadius: "15px",
                      }}
                      src={
                        "https://res.cloudinary.com/dg2awknkk/image/upload/v1724260359/gtbkhspr0l6zggwcbdsp.png"
                      }
                    />
                  }
                  loading={true}
                  actions={[
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                    <SettingOutlined key="setting" />,
                  ]}
                >
                  <Card.Meta
                    style={{
                      height: "136px",
                    }}
                  />
                </Card>
              );
            })}
        </div>
        <Pagination
          style={{ textAlign: "center", marginTop: "40px" }}
          onChange={(page, pageSize) => {
            setSearchParams({
              _page: page.toString(),
              _limit: pageSize.toString(),
            });
          }}
          defaultPageSize={Number(_limit)}
          defaultCurrent={Number(_page)}
          total={data_response_chatbot?.data.totalRows}
        />
      </div>

      <ModalDeleteItemChatbot
        open={deleteChatbot?.open}
        id={deleteChatbot?.id}
        title={deleteChatbot?.title}
        onClose={() => {
          setDeleteChatbot({
            open: false,
            id: "",
            title: "",
          });
        }}
      />
    </>
  );
}

export default ItemsChatbot;
