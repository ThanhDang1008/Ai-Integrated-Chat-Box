import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";

import { getDataUser } from "@/services/api/auth/auth";
import { doGetAccountAction } from "@/redux/account/accountSlice";
import HttpStatusCode from "@/constants/httpStatusCode.enum";
import { queryKeys } from "@/constants/Common";
import SessionManage from "@/app/auth/session.manage";

type CreateContext = {
  getIsAccess: (roles: Permission[]) => Promise<{
    isLogin: boolean;
    isPermission: boolean;
    isServerError?: boolean;
  }>;
  user_session: ISessionUser | null;
};

export const AuthContext = createContext<CreateContext>({
  getIsAccess: async (roles: Permission[]) => {
    return {
      isLogin: false,
      isPermission: false,
    };
  },
  user_session: null,
});

function AuthProvider(props: any) {
  //const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  queryClient.setDefaultOptions({
    queries: {
      gcTime: 86400000, // 24h
    },
  });

  const [user_session, setUserSession] = useState<ISessionUser | null>(null);

  // console.log("user__", user);

  const checkSession = async () => {
    try {
      const response: {
        status: number;
        data: ISessionUser;
      } = await getDataUser();
      //console.log("response", response);
      if (response.status === HttpStatusCode.Ok) {
        //console.log("checkSession success!", response.data);
        queryClient.setQueryData([queryKeys.ACCOUNT], response.data);
        setUserSession(response.data);
        dispatch(doGetAccountAction(response.data));
        return response;
      }
    } catch (error: any) {
      //console.log("getAccount error", error);
      if (error.response.status === HttpStatusCode.Unauthorized) {
        setUserSession(null);
        dispatch(doGetAccountAction(null));
        return error.response;
      } else {
        setUserSession(null);
        dispatch(doGetAccountAction(null));
        return error.response;
      }
    }
    //console.log(response);
  };

  const getIsAccess = async (roles: Permission[]) => {
    const account = queryClient.getQueryData([
      queryKeys.ACCOUNT,
    ]) as ISessionUser;
    //console.log("account", account);
    //nếu không có cache account
    if (!account) {
      const { status, data } = (await checkSession()) as any;
      if (status === HttpStatusCode.Ok) {
        const role = data.role.permission.toUpperCase() as Permission;
        if (roles.includes(role)) {
          //đã đăng nhập và có quyền
          return {
            isLogin: true,
            isPermission: true,
          };
        } else {
          //đã đăng nhập nhưng không có quyền
          return {
            isLogin: true,
            isPermission: false,
          };
        }
      } else if (status === HttpStatusCode.Unauthorized) {
        //chưa đăng nhập hoặc đã hết phiên đăng nhập
        return {
          isLogin: false,
          isPermission: false,
        };
      } else {
        //lỗi khác
        //console.log("lỗi khác");
        return {
          isLogin: false,
          isPermission: false,
          isServerError: true,
        };
      }
    }

    //nếu có cache account
    const role = account.role.permission.toUpperCase() as Permission;
    if (roles.includes(role)) {
      //đã đăng nhập và có quyền
      setUserSession(account);
      return {
        isLogin: true,
        isPermission: true,
      };
    } else {
      setUserSession(account);
      //đã đăng nhập nhưng không có quyền
      return {
        isLogin: true,
        isPermission: false,
      };
    }
  };

  //const path = location.pathname;
  //console.log("_path_", path);

  // const session = useMemo(async () => {
  //   const account = queryClient.getQueryData([
  //     queryKeys.ACCOUNT,
  //   ]) as ISessionUser; //CHECK ACCOUNT
  //   //console.log("account", account);
  //   if (!account) {
  //     const response = await checkSession(); //CALL API
  //     if (response.status === HttpStatusCode.Ok) {
  //       setUserSession(response.data);
  //       return response.data as ISessionUser;
  //     }
  //     return null;
  //   }
  //   setUserSession(account);
  //   return account;
  // }, [path]);

  return (
    <AuthContext.Provider
      value={{
        getIsAccess,
        user_session,
      }}
    >
      <SessionManage>
        <Outlet />
      </SessionManage>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
