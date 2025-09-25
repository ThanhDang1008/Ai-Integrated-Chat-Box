import * as service from "../services/v1/conversation.service";

import { Request, Response } from "express";

const createConversation = async (req: Request, res: Response) => {
  const { iduser, content, urlfile } = req.body;
  const content_parse = JSON.parse(content);
  const index = content_parse.length - 2;
  const title = content_parse[index].parts[0].text;

  //console.log("index", index);
  //console.log("check title", title);
  //console.log("check data", data);
  try {
    const res_service = await service.createConversation({
      iduser,
      content,
      title,
      urlfile,
    });
    if (res_service.code === 2) {
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

const getDetailConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { iduser } = req.query;
  if (!id) {
    return res.status(400).json({
      message: "Get detail conversation failed",
      status: "ID_NOT_FOUND",
    });
  }

  if (!iduser) {
    return res.status(400).json({
      message: "Get detail conversation failed",
      status: "IDUSER_NOT_FOUND",
    });
  }
  try {
    const res_service = await service.getDetailConversation({ id, iduser });
    if (res_service.code === 2) {
      return res.status(200).json(res_service.data);
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

const updateConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, urlfile } = req.body;
  const content_parse = JSON.parse(content);
  const index = content_parse.length - 2;
  const title = content_parse[index].parts[0].text;
  try {
    const res_service = await service.updateConversation({
      id,
      title,
      content,
      urlfile,
    });
    if (res_service.code === 2) {
      return res.status(200).json(res_service.data);
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

const updateTitleConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const res_service = await service.updateTitleConversation({ id, title });
    if (res_service.code === 2) {
      return res.status(200).json(res_service.data);
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

const deleteConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const res_service = await service.deleteConversation({ id });
    if (res_service.code === 2) {
      return res.status(200).json(res_service.data);
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

const checkExistConversation = async (req: Request, res: Response) => {
  const { urlfile } = req.body;
  try {
    const res_service = await service.checkExistConversation({ urlfile });
    if (res_service.code === 2) {
      return res.status(200).json(res_service.data);
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

export {
  createConversation,
  getDetailConversation,
  updateConversation,
  updateTitleConversation,
  deleteConversation,
  checkExistConversation,
};
