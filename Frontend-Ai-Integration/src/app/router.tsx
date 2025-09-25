import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";

import Pages from "@/pages";
import AuthProvider from "@/app/auth/auth.provider";
import Loading from "@/components/Loading";

const Home = React.lazy(() => import("@/components/Home"));
const MainLayout = React.lazy(() => import("@/layouts/MainLayout"));
const LayoutChat = React.lazy(() => import("@/layouts/LayoutChat"));
const LayoutChatWithFile = React.lazy(
  () => import("@/layouts/LayoutChatWithFile")
);

export const router = createBrowserRouter([
  {
    path: "",
    element: <AuthProvider />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "documents",
            lazy: async () => {
              const Documents = React.lazy(
                () => import("./routes/documents/index")
              );
              return { Component: Documents };
            },
          },
        ],
      },
      //chatbot
      {
        path: "/chatbot",
        children: [
          {
            path: "c/:id_chatbot",
            lazy: async () => {
              const Chatbot = React.lazy(
                () => import("./routes/chatbot/c/[id_chatbot]/layout")
              );
              return { Component: Chatbot };
            },
          },
          {
            path: "list",
            lazy: async () => {
              const ListChatbot = React.lazy(
                () => import("./routes/chatbot/list/page")
              );
              return { Component: ListChatbot };
            },
          },
        ],
      },
      //chatgemini
      {
        path: "chat/gemini/",
        element: <LayoutChat />,
        children: [
          {
            path: "newchat",
            element: <Pages.Chat />,
          },
          {
            path: ":id_chat",
            element: <Pages.Chat />,
          },
          {
            path: "docs",
            element: <Pages.DocsChat />,
          },
        ],
      },
      //conversation layout
      {
        path: "conversation",
        lazy: async () => {
          const LayoutConversation = React.lazy(
            () => import("./routes/conversation/layout")
          );
          return { Component: LayoutConversation };
        },
        children: [
          {
            index: true,
            lazy: async () => {
              const Index = React.lazy(
                () => import("./routes/conversation/(components)/index")
              );
              return { Component: Index };
            },
          },
          {
            path: "summarise",
            element: <div>summarise</div>,
          },
          {
            path: "documents",
            Component: () => {
              const Documents = React.lazy(
                () => import("./routes/conversation/documents/page")
              );
              return (
                <React.Suspense fallback={<Loading />}>
                  <Documents />
                </React.Suspense>
              );
            },
          },
          {
            path: "account",
            Component: () => {
              const Profile = React.lazy(
                () => import("./routes/account/(components)/profile")
              );
              return (
                <React.Suspense fallback={<Loading />}>
                  <Profile />
                </React.Suspense>
              );
            },
          },
          {
            path: "help-support",
            element: <div>help-support</div>,
          },
        ],
      },
      //admin
      {
        path: "/admin", //bọc thêm layout admin
        lazy: async () => {
          const LayoutAdmin = React.lazy(() => import("./routes/admin/layout"));
          return { Component: LayoutAdmin };
        },
        children: [
          {
            index: true,
            //path: "dashboard",
            element: <div>Dashboard</div>,
          },
          {
            path: "manage-users",
            element: <div>Users</div>,
          },
          {
            path: "manage-chatbot",
            Component: () => {
              const ManageChatbot = React.lazy(
                () => import("./routes/admin/manage-chatbot/page")
              );
              return (
                <React.Suspense fallback={<></>}>
                  <ManageChatbot />
                </React.Suspense>
              );
            },
          },
          {
            path: "manage-chatbot/update/:id_chatbot",
            Component: () => {
              const UpdateChatbot = React.lazy(
                () =>
                  import(
                    "./routes/admin/manage-chatbot/update/[id_chatbot]/page"
                  )
              );
              return (
                <React.Suspense fallback={<></>}>
                  <UpdateChatbot />
                </React.Suspense>
              );
            },
          },
        ],
      },
      // conversation chat with file
      {
        path: "conversation/c",
        element: <LayoutChatWithFile />,
        children: [
          {
            path: "newchat",
            element: <Pages.ChatWithFile />,
          },
          {
            path: ":id_conversation",
            element: <Pages.ChatWithFile />,
          },
        ],
      },
      //account global
      {
        path: "account",
        lazy: async () => {
          const AccountLayout = React.lazy(
            () => import("./routes/account/layout")
          );
          return { Component: AccountLayout };
        },
      },
      //login
      {
        path: "/login",
        lazy: async () => {
          const LayoutLogin = React.lazy(() => import("./routes/login/layout"));
          return { Component: LayoutLogin };
        },
      },
      //register
      {
        path: "/register",
        lazy: async () => {
          const RegisterLayout = React.lazy(
            () => import("./routes/register/layout")
          );
          return { Component: RegisterLayout };
        },
      },
      //verify email
      {
        path: "/verify-email",
        lazy: async () => {
          const VerifyEmail = React.lazy(
            () => import("./routes/verify-email/page")
          );
          return { Component: VerifyEmail };
        },
      },
    ],
  },
  //No header & footer

  {
    path: "*",
    lazy: async () => {
      const NotFound = React.lazy(() => import("./routes/not-found"));
      return { Component: NotFound };
    },
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
