import { useState } from "react";
import ItemsChatbot from "./(components)/items_chatbot";
import ModalNewChatbot from "./(components)/modal_new_chatbot";
import { Button } from "antd";
import { UsbOutlined } from "@ant-design/icons";

function ManageChatbot() {
  const [modalNewChatbot, setModalNewChatbot] = useState({
    open: false,
  });
  return (
    <>
      <div
        style={{
          padding: "2% 3%",
        }}
      >
        <Button
          type="dashed"
          onClick={() => {
            setModalNewChatbot({ open: true });
          }}
        >
          Add Chatbot
          <UsbOutlined />
        </Button>
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <ItemsChatbot />
        </div>
      </div>
      <ModalNewChatbot
        open={modalNewChatbot.open}
        onClose={() => {
          setModalNewChatbot({ open: false });
        }}
      />
    </>
  );
}

export default ManageChatbot;
