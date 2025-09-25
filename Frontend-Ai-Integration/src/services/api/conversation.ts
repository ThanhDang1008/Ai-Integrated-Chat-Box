import axios from "./axios";

export const createConversation = async (
  iduser: string,
  content: [],
  url?: string
) => {
  return await axios.post(`/api/v1/conversation/create`, {
    iduser,
    content: JSON.stringify(content),
    urlfile: url ? url : null,
  });
};

export const saveConversation = async (
  idconversation: string,
  content: [],
  url?: string
) => {
  return await axios.patch(`/api/v1/conversation/update/${idconversation}`, {
    content: JSON.stringify(content),
    urlfile: url ? url : null,
  });
};

export const getDetailConversation = async (
  idconversation: string,
  idUser: string
) => {
  return await axios.get(`/api/v1/conversation/detail/${idconversation}?iduser=${idUser}`);
};
