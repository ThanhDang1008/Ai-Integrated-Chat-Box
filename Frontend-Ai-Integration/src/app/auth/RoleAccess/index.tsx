// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Outlet } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";

// import { getDataUser } from "@/services/api/auth/auth";
// import { doGetAccountAction } from "@/redux/account/accountSlice";
// import HttpStatusCode from "@/constants/httpStatusCode.enum";
// import AccessDenied from "@/components/AccessDenied";
// import ServerError from "@/app/auth/ServerError";

// interface IRoles {
//   roles: "ADMIN" | "USER" | "GUEST";
// }

// interface RoleAccessProps {
//   children?: React.ReactNode;
//   redirectPath: {
//     pathLogin: string;
//     pathLoginSuccess?: string;
//   };
//   publicRoutes: string[];
//   roles: IRoles["roles"][];
//   routeAuth?: boolean | false;
// }

// function RoleAccess(props: RoleAccessProps) {
//   const { children, roles, redirectPath, publicRoutes } = props;
//   const { user } = useSelector((state: any) => state.account);
//   //console.log("user__", user);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [isAccess, setIsAccess] = useState<{
//     isLogin: boolean | null;
//     isPermission: boolean | null;
//   }>({
//     isLogin: null,
//     isPermission: null,
//   });
//   const [serverError, setServerError] = useState<boolean>(false);

//   const checkAccount = async () => {
//     try {
//       const response: {
//         status: number;
//         data: IDataAccount;
//       } = await getDataUser();
//       //console.log("response", response);
//       if (response.status === HttpStatusCode.Ok) {
//         //console.log("getAccount success!", response);
//         dispatch(doGetAccountAction(response.data));
//         const role =
//           response.data.role.permission.toUpperCase() as IRoles["roles"];
//         if (roles.includes(role)) {
//           setIsAccess({
//             isLogin: true,
//             isPermission: true,
//           });
//         } else {
//           setIsAccess({
//             isLogin: true,
//             isPermission: false,
//           });
//         }
//       }
//     } catch (error: any) {
//       //console.log("getAccount error", error);
//       if (error.response.status === HttpStatusCode.Unauthorized) {
//         setIsAccess({
//           isLogin: false,
//           isPermission: false,
//         });
//       } else {
//         //console.log("server error");
//         setIsAccess({
//           isLogin: null,
//           isPermission: null,
//         });
//         setServerError(true);
//       }
//     }
//     //console.log(response);
//   };

//   const getDataAccount = async () => {
//     try {
//       const response: {
//         status: number;
//         data: IDataAccount;
//       } = await getDataUser();
//       if (response.status === HttpStatusCode.Ok) {
//         //console.log("getDataAccount success!", response);
//         dispatch(doGetAccountAction(response.data));
//       }
//     } catch (error: any) {
//       //some thing...
//     }
//   };

//   const checkCache = async (data: IDataAccount) => {
//     if (data) {
//       const role = data.role.permission.toUpperCase() as IRoles["roles"];
//       if (roles.includes(role)) {
//         setIsAccess({
//           isLogin: true,
//           isPermission: true,
//         });
//       } else {
//         setIsAccess({
//           isLogin: true,
//           isPermission: false,
//         });
//       }
//     }
//   };

//   const path = window.location.pathname;

//   useEffect(() => {
//     //console.log("window.location.pathname", window.location.pathname);
//     //console.log("publicRoutes.includes(path)", publicRoutes.includes(path));

//     //---khi vào public route
//     if (publicRoutes.includes(path) === true) {
//       setIsAccess({
//         ...isAccess,
//         isPermission: true,
//       });
//       const dataAccount: IDataAccount | null = user;
//       if (!dataAccount) {
//         getDataAccount(); //public không đc set IsAccess
//       }
//     }

//     //---khi vào private route
//     if (publicRoutes.includes(path) === false) {
//       //console.log("private route");
//       const dataAccount: IDataAccount | null = user;
//       if (dataAccount) {
//         //console.log("checkCache");
//         checkCache(dataAccount);
//       } else {
//         //console.log("checkAccount");
//         checkAccount();
//       }
//     }
//   }, [path]);

//   useEffect(() => {
//     if (
//       props?.routeAuth !== true &&
//       isAccess.isLogin === false &&
//       isAccess.isPermission === false &&
//       publicRoutes.includes(path) === false
//     ) {
//       navigate(redirectPath.pathLogin);
//     }
//   }, [isAccess]);

//   useEffect(() => {
//     if (props?.routeAuth === true && isAccess.isLogin === true) {
//       navigate(redirectPath.pathLoginSuccess || "/");
//     }
//   }, [isAccess]);

//   const publicAccessConditions =
//     publicRoutes.includes(path) === true && isAccess.isPermission === true;

//   const privateAccessConditions =
//     publicRoutes.includes(path) === false &&
//     isAccess.isPermission === true &&
//     isAccess.isLogin === true;

//   const isAccessNull =
//     isAccess.isLogin === null && isAccess.isPermission === null;

//   const routeAccessDeniedConditions =
//     isAccess.isLogin === true && isAccess.isPermission === false;
//   // console.log("isAccess", isAccess);

//   const routeAuthConditions =
//     isAccess.isLogin === false && isAccess.isPermission === false;

//   return (
//     <>
//       {publicAccessConditions ||
//       privateAccessConditions ||
//       (props?.routeAuth && routeAuthConditions) ? (
//         children ? (
//           children
//         ) : (
//           <Outlet />
//         )
//       ) : (
//         <></>
//       )}

//       {isAccessNull && serverError === false && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//             flexDirection: "column",
//           }}
//         >
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       )}

//       {!props?.routeAuth && routeAccessDeniedConditions && <AccessDenied />}

//       {isAccessNull && serverError === true && <ServerError />}
//     </>
//   );
// }

// export default RoleAccess;
