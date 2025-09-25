import axios from "./axios";

interface IDataUpdateChatbot {
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  iduser: number;
  files: string[];
}

interface IDataCreateChatbot {
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  iduser: number;
  files: string[];
}

const updateChatbot = async (data: IDataUpdateChatbot, id: string) => {
  const content = [
    {
      role: "user",
      timestamp: Date.now(),
      parts: [{ text: `${data.content}` }],
    },
    {
      role: "model",
      timestamp: Date.now(),
      parts: [
        {
          text: `Tôi là **chatbot** chuyên tư vấn về **${data.title.trim()}** bạn muốn tôi giúp gì không?`,
        },
      ],
    },
  ];
  try {
    const response = await axios.patch(`/api/v1/chatbot/update/${id}`, {
      title: data.title,
      description: data.description,
      content: JSON.stringify(content),
      thumbnail: data.thumbnail,
      iduser: data.iduser,
      files: JSON.stringify(data.files),
    });
    return {
      ...response.data,
      data: {
        id: id,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        content: JSON.stringify(content),
        iduser: data.iduser,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteChatbot = async (id: string) => {
  try {
    const response = await Promise.allSettled([
      axios.delete(`/api/v1/chatbot/delete-files/${id}`),
      axios.delete(`/api/v1/chatbot/delete/${id}`),
    ]);
    //console.log("res delete", response);
    return id;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getDetailChatbot = async (id: string) => {
  const respose = await axios.get(`/api/v1/chatbot/detail/${id}`);
  return respose.data;
};

const getAllChatbot = async (page: string, limit: string) => {
  const response = await axios.get(
    `/api/v1/chatbot?_page=${page}&_limit=${limit}`
  );
  return response.data;
};

const createChatbot = async (data: IDataCreateChatbot) => {
  //console.log(data);
  const content = [
    {
      role: "user",
      timestamp: Date.now(),
      parts: [{ text: `${data.content}` }],
    },
    {
      role: "model",
      timestamp: Date.now(),
      parts: [
        {
          text: `Tôi là **chatbot** chuyên tư vấn về **${data.title.trim()}** bạn muốn tôi giúp gì không?`,
        },
      ],
    },
  ];
  try {
    const response = await axios.post(`/api/v1/chatbot/create`, {
      title: data.title,
      description: data.description,
      content: JSON.stringify(content),
      thumbnail: data.thumbnail,
      iduser: data.iduser,
      files: JSON.stringify(data.files),
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const searchChatbot = async (search: string) => {
  type ESEntity = {
    _id: string;
    _index: string;
    _score: number;
    _source: {
      id: string;
      title: string;
      description: string;
    };
  };

  type Response = {
    status: number;
    data: {
      message: string;
      data: ESEntity[] | []
    };
  };
  const response: Response = await axios.post(`/api/v2/es/search-chatbot`, {
    value: search,
  });
  return response?.data;
};

export {
  updateChatbot,
  deleteChatbot,
  getDetailChatbot,
  getAllChatbot,
  createChatbot,
  searchChatbot,
};
