import axios from "./axios";

export const getListTitleConversation = async (iduser: string) => {
  const response = await axios.get(`/api/v1/user/conversations/${iduser}`);
  return response;
};

export const getFilesUser = async (iduser: string) => {
  return await axios.get(`/api/v1/user/files/${iduser}`);
};

export const getInfoUser = async (iduser?: string) => {
  const response =  await axios.get(`/api/v2/user/info${iduser ? `?id=${iduser}` : ""}`);
  return response?.data.data
};
