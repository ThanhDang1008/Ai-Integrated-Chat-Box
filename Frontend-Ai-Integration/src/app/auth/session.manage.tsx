import React, { useEffect, useState, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/Common";
import { socketService } from "@/services/socket/socket.service";
import SessionExpires from "@/app/auth/SessionExpires";
import { AuthContext } from "@/app/auth/auth.provider";

interface IProps {
  children: React.ReactNode;
}

function SessionManage(props: IProps) {
  const [isSessionDestroy, setIsSessionDestroy] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { user_session } = useContext(AuthContext);

  //   console.log("__ctx_session", user_session);
  //console.log("isSessionDestroy", isSessionDestroy);

  useEffect(() => {
    socketService.connect();
    socketService.getSocket().on("session_destroy", (data) => {
      //   console.log("session_destroy", data);
      //   console.log(
      //     "user_session?.session_id === data?.session_id",
      //     typeof user_session?.session_id,
      //     typeof data?.session_id
      //   );
      console.log("user_session", user_session);
      if (user_session?.session_id == data?.session_id) {
        setIsSessionDestroy(true);
        queryClient.removeQueries({
          queryKey: [queryKeys.ACCOUNT],
        });
        queryClient.removeQueries({
          queryKey: ["INFO_USER"],
        });
      }
    });
    return () => {
      socketService.disconnect();
    };
  }, [user_session]);

  return (
    <>
      {isSessionDestroy && (
        <SessionExpires
          handleOnOK={() => {
            if (isSessionDestroy) {
              setIsSessionDestroy(false);
            }
          }}
        />
      )}
      {props.children}
    </>
  );
}

export default SessionManage;
