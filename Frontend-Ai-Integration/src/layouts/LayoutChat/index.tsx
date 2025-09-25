import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import SidebarChat from "./sidebar";
import "./layoutchat.scss";
import RoleAccess from "@/app/auth/role.access";

import { useEffect, useState } from "react";

function LayoutChat() {
  const [refresh, setRefresh] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [infoConversation, setInfoConversation] = useState({
    totalTokens: 0,
    isTyping: false,
    length: -1,
    saved: null,
  });
  const [themeDarkMode, setThemeDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/chat") {
      navigate("/chat/gemini/newchat");
    }
  }, []);

  const getLenConversation = (path: string) => {
    //console.log("getLenConversation");
    navigate(path, {
      state: {
        path: path,
      },
    });
  };

  const triggerSavedConversation = (path: string) => {
    //console.log("triggerSavedConversation",path);
    navigate(path, {
      state: {
        pathChat: path,
      },
    });
  };

  return (
    <>
      <RoleAccess roles={["ADMIN", "USER"]}>
        <div className={
          themeDarkMode
            ? "dark_layoutchat_container"
            : "light_layoutchat_container"
        }>
          <SidebarChat
            getLenConversation={getLenConversation}
            setOpenSidebar={setOpenSidebar}
            openSidebar={openSidebar}
            refresh={refresh}
            infoConversation={infoConversation}
            triggerSavedConversation={triggerSavedConversation}
            setThemeDarkMode={setThemeDarkMode}
            themeDarkMode={themeDarkMode}
          />
          <Outlet
            context={{
              refresh,
              setRefresh,
              openSidebar,
              setOpenSidebar,
              setInfoConversation,
              infoConversation,
              themeDarkMode
            }}
          />
        </div>
      </RoleAccess>
    </>
  );
}

export default LayoutChat;
