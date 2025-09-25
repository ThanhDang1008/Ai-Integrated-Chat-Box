import "./chatbots.scss";
import {
  Card,
  Avatar,
  Tooltip,
  Pagination,
  Empty,
  Layout,
  Menu,
  MenuProps,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { getAllChatbot } from "@/services/api/chatbot";
import { GET_ALL_CHATBOT } from "@/services/api/queryKey";
import SearchChatBot from "../search";
import { getFormattedDateTime } from "@/utils/formatTime";
const { Meta } = Card;
const { Header } = Layout;
const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  // label: `nav ${key}`,
}));

interface IDataChatbot {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

const url_default_thumbnail =
  "https://res.cloudinary.com/dg2awknkk/image/upload/v1724260359/gtbkhspr0l6zggwcbdsp.png";
const url_default_avatar =
  "https://res.cloudinary.com/dg2awknkk/image/upload/v1724874550/lutbfishupwepa4jyfnx.png";

function Chatbots() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataChatbot, setDataChatbot] = useState<IDataChatbot[]>([]);
  const [dataSearchChatbot, setDataSearchChatbot] = useState<IDataChatbot[]>(
    []
  );
  const [idChatbot, setIdChatbot] = useState<{ id: string }[] | []>([]);

  //console.log("idChatbot-list:  ", idChatbot);

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

  useEffect(() => {
    setDataChatbot(data_response_chatbot?.data?.data_chatbot);
    setDataSearchChatbot(data_response_chatbot?.data?.data_chatbot);
  }, [data_response_chatbot]);

  useEffect(() => {
    if (idChatbot.length === 0) {
      setDataSearchChatbot(dataChatbot);
      return;
    }
    setDataSearchChatbot(
      dataChatbot.filter((item) => {
        return idChatbot.some((id) => id.id === item.id);
      })
    );
  }, [idChatbot]);

  //console.log("dataSearchChatbot: ", dataSearchChatbot);

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#79aaea",
          marginBottom: "20px",
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items1}
          style={{ flex: 1, minWidth: 0, backgroundColor: "#79aaea" }}
        />
        <div
          className="pagecontainer_search"
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "10px 0",
          }}
        >
          <SearchChatBot setIdChatbot={setIdChatbot} />
        </div>
      </Header>

      <div className="ListChatbot_Chatbots_container">
        {dataSearchChatbot?.length !== 0 &&
          dataSearchChatbot?.map((item: IDataChatbot) => {
            return (
              <Card
                key={item.id}
                style={{ width: 280 }}
                cover={
                  <img
                    alt="thumbnail_chatbot"
                    style={{
                      maxHeight: "195px",
                      minHeight: "195px",
                      maxWidth: "300px",

                      borderRadius: "5px",
                    }}
                    onError={(e: any) => {
                      e.target.src = url_default_thumbnail;
                    }}
                    src={item.thumbnail}
                  />
                }
                actions={[
                  <FolderOpenOutlined
                    title="Open Convertion"
                    onClick={() => {
                      navigate(`/chatbot/c/${item.id}`);
                    }}
                  />,
                ]}
              >
                <>
                  <div
                    style={{
                      //canh sát trái
                      display: "flex",
                      justifyContent: "end",
                      opacity: 0.5,
                      //chữ nghiêng
                      fontStyle: "italic",
                    }}
                  >
                    <span>{getFormattedDateTime(item.updatedAt)}</span>
                  </div>
                  <Meta
                    style={{ height: 170 }}
                    avatar={<Avatar src={url_default_avatar} />}
                    title={
                      <>
                        {item.title.trim().length > 22 ? (
                          <Tooltip title={item.title}>
                            {item.title.trim().slice(0, 22) + "..."}
                          </Tooltip>
                        ) : (
                          item.title
                        )}
                      </>
                    }
                    description={
                      <>
                        {item.description.length > 97 ? (
                          <Tooltip title={item.description}>
                            {item.description.slice(0, 97) + "..."}
                          </Tooltip>
                        ) : (
                          item.description
                        )}
                      </>
                    }
                  />
                </>
              </Card>
            );
          })}
        {isLoading &&
          [...Array(Number(_limit))].map((_, index) => {
            return (
              <Card
                key={index}
                style={{ width: 260 }}
                actions={[<FolderOpenOutlined />]}
                loading={true}
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
                    src={url_default_thumbnail}
                  />
                }
              >
                <Meta
                  style={{ height: 130 }}
                  avatar={<Avatar src={url_default_avatar} />}
                />
              </Card>
            );
          })}
        {isError && (
          <div>
            <h2>Failed to load chatbot</h2>
          </div>
        )}
        {dataSearchChatbot?.length === 0 && (
          <Empty
            style={{
              marginTop: "40px",
              marginBottom: "40px",
            }}
            description="No chatbot found"
          />
        )}
      </div>
      <Pagination
        style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}
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
    </>
  );
}

export default Chatbots;
