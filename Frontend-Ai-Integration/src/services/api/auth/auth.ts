import axios from "../axios";
import { ResponseLogout } from "./model/auth.model";

export const register = async (data: any) => {
  return await axios.post("/api/v2/auth/register", data);
};

export const loginCredentials = async (username: string, password: string) => {
  return await axios.post("/api/v2/auth/login", { username, password });
};

export const fetchAccount = async (token: string) => {
  return await axios.get("/api/v1/auth/account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
};

export const getDataUser = async () => {
  const response = await axios.get("/api/v2/auth/account", {
    timeout: 5000, //5s
  });
  return response
};

export const logout = async (): Promise<ResponseLogout> => {
    const response = await axios.get(`/api/v2/auth/signout`);
    return response;
}

export const verifyEmail = async (token: string) => {
  return await axios.get(`/api/v2/mail/verify-registration-mail?token=${token}`);
};
