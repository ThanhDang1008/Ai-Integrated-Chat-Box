import { Outlet } from "react-router-dom";
import SideBarChatWithFile from "./sidebar_chat_with_file";
import { useState } from "react";
import RoleAccess from "@/app/auth/role.access";

function LayoutChatWithFile() {
  const [infoConversation, setInfoConversation] = useState({
    totalTokens: 0,
    isTyping: true,
  });
  const [settings, setSettings] = useState({
    backgroundLayout: "radial-gradient(circle, rgb(50 50 50) 11%, rgb(1, 9, 23) 89%)",
  });
  return (
    <>
    <RoleAccess roles={["ADMIN", "USER"]}>
      <div
        className="d-flex flex-row"
        style={{
          //background: "rgb(22, 7, 60)",
          background: settings.backgroundLayout,
        }}
      >
        <Outlet
        context={{
          infoConversation,
          setInfoConversation,
        }}
        />
        <SideBarChatWithFile
          infoConversation={infoConversation}
          setInfoConversation={setInfoConversation}
          setSettings={setSettings}
         />
      </div>
    </RoleAccess>
    </>
  );
}

export default LayoutChatWithFile;

