import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import AccessDenied from "@/components/AccessDenied";
import { AuthContext } from "@/app/auth/auth.provider";
import ServerError from "@/app/auth/ServerError";

interface RoleAccessProps {
  children: React.ReactNode;
  roles: Permission[];
  routeAuth?: boolean | false;
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

function RoleAccess(props: RoleAccessProps) {
  const { children, roles } = props;
  const authContext = useContext(AuthContext);
  //console.log("authContext", authContext);

  const pathLogin = "/login";
  const pathLoginSuccess = "/";

  const navigate = useNavigate();

  const [isAccess, setIsAccess] = useState<{
    isLogin: boolean | null;
    isPermission: boolean | null;
  }>({
    isLogin: null,
    isPermission: null,
  });
  const [isServerError, setIsServerError] = useState<boolean>(false);

  // console.log("isAccess", isAccess);
  // console.log("isServerError", isServerError);

  useEffect(() => {
    const getDataIsAccess = async () => {
      const isAccess = await authContext?.getIsAccess(roles);
      //console.log("getIsAccess_", isAccess);
      if (isAccess.isServerError) {
        setIsAccess({
          isLogin: null,
          isPermission: null,
        });
        return setIsServerError(true);
      }
      return setIsAccess(isAccess);
    };

    getDataIsAccess();
  }, [roles]);

  useEffect(() => {
    if (
      props?.routeAuth !== true &&
      isAccess.isLogin === false &&
      isAccess.isPermission === false
    ) {
      navigate(pathLogin);
    }
  }, [isAccess]);

  useEffect(() => {
    if (props?.routeAuth === true && isAccess.isLogin === true) {
      navigate(pathLoginSuccess);
    }
  }, [isAccess]);

  const isAccessNull =
    isAccess.isLogin === null && isAccess.isPermission === null;

  const routeAccessDeniedConditions =
    isAccess.isLogin === true && isAccess.isPermission === false;

  const privateAccessConditions =
    isAccess.isPermission === true && isAccess.isLogin === true;

  const routeAuthConditions =
    isAccess.isLogin === false && isAccess.isPermission === false;

  //---------------------------------------------
  const roleAccessConditions = props.routeAuth
    ? routeAuthConditions
    : privateAccessConditions;

  //console.log("roleAccessConditions", roleAccessConditions);

  return (
    <>
      {roleAccessConditions && (children ? children : <Outlet />)}

      {!isServerError && isAccessNull && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {isServerError && <ServerError />}

      {routeAccessDeniedConditions && <AccessDenied />}
    </>
  );
}

export default RoleAccess;
