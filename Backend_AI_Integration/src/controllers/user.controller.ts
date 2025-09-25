import * as service from "../services/v1/user.service";
import { verifyToken } from "../shared/utils/jwt";
import { Request, Response } from "express";

const getConversations = async (req:Request , res:Response) => {
  const { iduser } = req.params;
  try {
    const res_service = await service.getConversations(iduser);
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
    console.log("check error ", error);
  }
};

const getFiles = async (req:Request, res:Response) => {
  const { iduser } = req.params;
  if (!iduser) {
    return res.status(400).json({
      code: "400",
      message: "iduser not found!",
      status: "IDUSER_NOT_FOUND",
    });
  }
  try {
    const res_service = await service.getFiles(iduser);
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
    console.log("check error ", error);
  }
};

const updateAvatar = async (req:Request, res:Response) => {
  const { iduser } = req.params;
  const { filename, destination, mimetype, originalname } = req.file as any;
  const { keyFile_old } = req.body;
  if (req.file === undefined) {
    return res.status(400).json({
      code: "400",
      message: "file not found!",
      status: "FAIL_UPLOAD_FILE",
    });
  }
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(400).json({
      code: "400",
      message: "Token not found!",
      status: "TOKEN_NOT_FOUND",
    });
  }
  const { status, ...user } = verifyToken(token);
  if (status !== "TOKEN_VALID") {
    return res.status(400).json({
      code: "400",
      message: `${status}!`,
      status: status,
    });
  }
  const pathFile = destination + filename;
  try {
    const res_service = await service.updateAvatar({
      filename,
      pathFile,
      mimetype,
      originalname,
      iduser,
      keyFile_old,
      payloadToken: user,
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
    console.log("check error ", error);
  }
};

const deleteAvatar = async (req:Request, res:Response) => {
  const { iduser } = req.params;
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(400).json({
      code: "400",
      message: "Token not found!",
      status: "TOKEN_NOT_FOUND",
    });
  }
  const { status, ...user } = verifyToken(token);
  if (status !== "TOKEN_VALID") {
    return res.status(400).json({
      code: "400",
      message: `${status}!`,
      status: status,
    });
  }
  try {
    const res_service = await service.deleteAvatar({
      iduser,
      payloadToken: user,
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
    console.log("check error ", error);
  }
};

const updateProfile = async (req:Request, res:Response) => {
  const { iduser } = req.params;
  const { fullname, phone, gender } = req.body;
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(400).json({
      code: "400",
      message: "Token not found!",
      status: "TOKEN_NOT_FOUND",
    });
  }
  const { status, ...user } = verifyToken(token);
  if (status !== "TOKEN_VALID") {
    return res.status(400).json({
      code: "400",
      message: `${status}!`,
      status: status,
    });
  }
  try {
    const res_service = await service.updateProfile({
      fullname,
      phone,
      gender,
      iduser,
      payloadToken: user,
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
    console.log("check error ", error);
  }
};

export {
  getConversations,
  getFiles,
  updateAvatar,
  updateProfile,
  deleteAvatar,
};
