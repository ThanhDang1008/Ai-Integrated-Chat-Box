import { Modal, message } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChatbot } from "@/services/api/chatbot";
import { GET_ALL_CHATBOT } from "@/services/api/queryKey";

interface IProps {
  open: boolean;
  id: string;
  title: string;
  onClose: () => void;
}

function ModalDeleteItemChatbot(props: IProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteChatbotMutation, isPending } = useMutation({
    mutationFn: (id: string) => deleteChatbot(id),
    onSuccess: (id) => {
      // queryClient.setQueryData([GET_ALL_CHATBOT], (oldData: ICache_GET_ALL_CHATBOT<IDataChatbot[]>) => {
      //   return {
      //     ...oldData,
      //     data: oldData.data.filter((item: IDataChatbot) => item.id !== id),
      //   };
      // });
      queryClient.removeQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          //console.log("queryKey", queryKey);
          return queryKey[0] === GET_ALL_CHATBOT;
        }
      });
      props.onClose();
      message.success("Chatbot has been deleted");
    },
    onError: (error: any) => {
      message.open({
        type: "error",
        content: error.response.data.message,
        duration: 3,
      });
    },
  });

  const handleDeleteChatbot = () => {
    deleteChatbotMutation(props.id);
  };

  const handleCancel = () => {
    props.onClose();
  };

  return (
    <>
      <Modal
        title="Delete Chatbot"
        open={props.open}
        onOk={handleDeleteChatbot}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{
          danger: true,
          loading: isPending,
        }}
      >
        Are you sure you want to delete{" "}
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            display: "inline",
          }}
        >
          {props.title}
        </p>
      </Modal>
    </>
  );
}

export default ModalDeleteItemChatbot;
