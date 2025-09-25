import { useState } from "react";
import { FloatButton, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import DrawerInfoChatBot from "./drawer_info_chatbot";

function FloatButtonChatBot() {
  const navigate = useNavigate();
  const [drawerInfoChatbot, setDrawerInfoChatBot] = useState({
    open: false,
  });
  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="default"
        style={{
          //insetInlineEnd: 300,
          //insetBlockStart: 300,
          //insetBlockEnd: 2,
          //insetInlineStart: 2,
          bottom: "50%",
          left: 12,
        }}
        icon={<i className="bi bi-caret-right-fill"></i>}
      >
        <FloatButton
          tooltip="Info"
          onClick={() => {
            setDrawerInfoChatBot({ open: true });
          }}
          icon={<i className="bi bi-info-circle"></i>}
        />
        <FloatButton
          icon={<i className="bi bi-card-text"></i>}
          tooltip="Chat"
        />
        <FloatButton
          icon={<i className="bi bi-box-arrow-left"></i>}
          tooltip="Back"
          onClick={() => {
            navigate(-1);
          }}
        />
      </FloatButton.Group>

      {/* {drawerInfoChatbot.open && ( */}
        <DrawerInfoChatBot
          open={drawerInfoChatbot.open}
          onClose={() => {
            setDrawerInfoChatBot({ open: false });
          }}
        />
      {/* )} */}
    </>
  );
}

export default FloatButtonChatBot;
