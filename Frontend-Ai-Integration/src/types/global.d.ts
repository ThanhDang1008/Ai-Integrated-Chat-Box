export {};

declare global {
  interface IPages {
    Documents: any;
    Chat: any;
    DocsChat: any;
    Register: any;
    Login: any;

    Admin: any;
    Admin_ManageChatbot: any;
    Admin_ManageChatbot_Update: any;

    Settings: any;
    NotFound: any;
    AccessDenied: any;
    ChatWithFile: any;
    VerifyEmail: any;

    Conversation: any;
    Conversation_Index: any;
    Conversation_Documents: any;

    Account: any;
    Account_Profile: any;

    Chatbot: any;
    ListChatbot: any;
  }

  interface IDataChatbot {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
  }

  interface ICache_GET_ALL_CHATBOT<T> {
    code: string;
    message: string;
    status: string;
    data: T;
  }

  interface IDataAccount {
    id: string;
    fullname: string;
    phone: string;
    gender: string;
    email: string;
    refreshtoken: string;
    urlavatar: string;
    status: string;
    type: string;
    idrole: string;
    createdAt: string;
    updatedAt: string;
    role: {
      id: string;
      permission: string;
      createdAt: string;
      updatedAt: string;
    };
  }

  type Permission = "ADMIN" | "USER" | "GUEST";

  interface ISessionUser {
    id: string;
    session_id: string;
    email: string;
    type: string;
    idrole: string;
    role: {
      id: string;
      permission: Permission
      createdAt: string;
      updatedAt: string;
    };
  }
}
