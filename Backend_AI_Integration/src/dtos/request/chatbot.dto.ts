export interface ICreateChatbotReq {
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    iduser: string;
    arrayFiles: string[] | string;
}

export interface IUpdateChatbotReq {
    id: string;
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    iduser: string;
    arrayFiles: string[] | string;
}

