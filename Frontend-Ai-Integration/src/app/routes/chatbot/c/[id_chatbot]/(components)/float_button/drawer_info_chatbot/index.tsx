import React, { useEffect, useState } from "react";
import { Button, Drawer, Radio, Space, Image } from "antd";
import { getDetailChatbot } from "@/services/api/chatbot";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface IProps {
  open: boolean;
  onClose: () => void;
}

interface IDataChatBot {
  code: number;
  message: string;
  status: string;
  data: {
    title: string;
    description: string;
    thumbnail: string;
  };
}

function DrawerInfoChatBot(props: IProps) {
  const { open, onClose } = props;
  const handleCloseDrawer = () => {
    onClose();
  };

  const { id_chatbot } = useParams();

  const {
    data: data_chatbot,
    isLoading,
    isError,
  }: {
    data: IDataChatBot | undefined;
    isLoading: boolean;
    isError: boolean;
  } = useQuery({
    queryKey: ["GET_DETAIL_CHATBOT", id_chatbot],
    queryFn: () => getDetailChatbot(id_chatbot!),
    gcTime: 1000 * 60 * 1, // 1 minute
    //enabled: open,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    //refetchInterval: 3000 * 10 * 60,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  // console.log("data_chatbot", data_chatbot);

  return (
    <>
      <Drawer
        title="Information chatbot"
        placement={"bottom"}
        width={500}
        onClose={handleCloseDrawer}
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
        {data_chatbot && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{}}>
              <Image
                style={{
                  maxHeight: "70vh",
                }}
                src={data_chatbot.data.thumbnail}
              />
            </div>
            <div>
              <div>
                <strong>Tên chatbot: </strong> {data_chatbot.data.title}
              </div>
              <div>
                <strong>Mô tả: </strong>{" "}
                <p
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  {data_chatbot.data.description}
                </p>
              </div>
              <div
                style={{
                  gap: "10px",
                  display: "flex",
                }}
              >
                <Button type="primary" danger>
                  Phản hồi
                </Button>
                <Button type="primary">Chia sẻ</Button>
              </div>
            </div>
          </div>
        )}
        {isError && (
          <div>
            Fail to fetch data information chatbot with id:{" "}
            <strong>{id_chatbot}</strong>
          </div>
        )}
        {isLoading && <div>Loading...</div>}
      </Drawer>
    </>
  );
}

export default DrawerInfoChatBot;
