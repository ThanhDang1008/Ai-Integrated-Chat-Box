import * as service from "../services/v1/chatbot.service";
import {
  checkCacheRedis,
  setCacheRedis,
  deleteCacheRedis,
} from "../config/redis.config";
import {
  key_GetDetailChatbot,
  key_GetAllChatbot,
} from "../constants/key-redis";
import { Request, Response } from "express";

import { chatbotCache } from "@service/redis/chatbot.cache";
import type { IDetailChatbot } from "@/modules/chatbot/interfaces/chatbot.interface";

const createChatbot = async (req: Request, res: Response) => {
  const { title, description, content, thumbnail, iduser, files } = req.body;
  let arrayFiles;
  if (!Array.isArray(files) && typeof files === "string") {
    arrayFiles = JSON.parse(files);
  } else {
    arrayFiles = files;
  }
  try {
    const res_service = await service.createChatbot({
      title,
      description,
      content,
      thumbnail,
      iduser,
      arrayFiles,
    });
    if (res_service.code === 201) {
      //deleteCacheRedis(key_GetAllChatbot);
      return res.status(201).json(res_service.data);
    }
    if (res_service.code === 4) {
      return res.status(400).json(res_service.error);
    }
    if (res_service.code === 5) {
      return res.status(500).json(res_service.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const getAllChatbot = async (req: Request, res: Response) => {
  const { _page, _limit } = req.query;
  //console.log("query", req.query);
  let pageDefault = 1;
  let limitDefault = 16;
  //isNaN(123) => false
  if (_page && !isNaN(Number(_page))) {
    pageDefault = Number(_page);
  }
  if (_limit && !isNaN(Number(_limit))) {
    limitDefault = Number(_limit);
  }

  // const dataCache = await checkCacheRedis(
  //   key_GetAllChatbot(pageDefault.toString(), limitDefault.toString())
  // );
  // //console.log("check Cache", dataCache);
  // if (dataCache) {
  //   return res.status(200).json(JSON.parse(dataCache));
  // }
  try {
    const data = await service.getAllChatbot({
      _page: pageDefault,
      _limit: limitDefault,
    });
    if (data.code === 2) {
      //setCacheRedis(key_GetAllChatbot(pageDefault.toString(), limitDefault.toString()), JSON.stringify(data.data));
      return res.status(200).json(data.data);
    }
    if (data.code === 4) {
      return res.status(400).json(data.error);
    }
    if (data.code === 5) {
      return res.status(500).json(data.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const getDetailChatbot = async (req: Request, res: Response) => {
  const { id } = req.params;
  const dataCache = await chatbotCache.getDetailChatbotFromCache(
    key_GetDetailChatbot(id)
  );
  //console.log("check Cache", dataCache);
  if (dataCache) {
    return res.status(200).json(dataCache);
  }
  try {
    const data = await service.getDetailChatbot({ id });
    //console.log("data", data);
    if (data.code === 2) {
      // setCacheRedis(key_GetDetailChatbot(id), JSON.stringify(data.data),{
      //   EX: 600,//10 phút
      // });
      const saveCache = data?.data as any;
      await chatbotCache.saveDetailChatbotToCache(
        key_GetDetailChatbot(id),
        saveCache
      );
      return res.status(200).json(data.data);
    }
    if (data.code === 4) {
      return res.status(400).json(data.error);
    }
    if (data.code === 5) {
      return res.status(500).json(data.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const updateChatbot = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, content, thumbnail, iduser, files } = req.body;
  let arrayFiles;
  if (!Array.isArray(files) && typeof files === "string") {
    arrayFiles = JSON.parse(files);
  } else {
    arrayFiles = files;
  }
  try {
    const data = await service.updateChatbot({
      id,
      title,
      description,
      content,
      thumbnail,
      iduser,
      arrayFiles,
    });
    if (data.code === 2) {
      chatbotCache.deleteDetailChatbotFromCache(key_GetDetailChatbot(id));
      //deleteCacheRedis(key_GetAllChatbot);
      return res.status(200).json(data.data);
    }
    if (data.code === 4) {
      return res.status(400).json(data.error);
    }
    if (data.code === 5) {
      return res.status(500).json(data.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const deleteFilesChatbot = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await service.deleteFilesChatbot({ id });
    if (data.code === 2) {
      return res.status(200).json(data.data);
    }
    if (data.code === 4) {
      return res.status(400).json(data.error);
    }
    if (data.code === 5) {
      return res.status(500).json(data.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const deleteChatbot = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await service.deleteChatbot({ id });
    if (data.code === 2) {
      chatbotCache.deleteDetailChatbotFromCache(key_GetDetailChatbot(id));
      return res.status(200).json(data.data);
    }
    if (data.code === 4) {
      return res.status(400).json(data.error);
    }
    if (data.code === 5) {
      return res.status(500).json(data.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

export = {
  createChatbot,
  getAllChatbot,
  getDetailChatbot,
  updateChatbot,
  deleteFilesChatbot,
  deleteChatbot,
};
