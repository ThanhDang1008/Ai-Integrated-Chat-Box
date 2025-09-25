const key_GetDetailChatbot = (id:string) => `/api/v1/chatbot/detail/${id}`;
const key_GetAllChatbot = (page:string, limit:string) => `/api/v1/chatbot/?_page=${page}&_limit=${limit}`;

export {
    key_GetDetailChatbot,
    key_GetAllChatbot,
};
