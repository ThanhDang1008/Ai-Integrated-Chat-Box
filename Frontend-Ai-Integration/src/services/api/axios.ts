import axios from "axios";

export const baseURL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  // timeout: 1000,
  // headers: {
  //     "Content-Type": "application/json",
  // },
});


// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    //return response;
    return {
      status: response.status,
      data: response.data,
    } as any
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject({
      response: {
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
);

export default instance;
