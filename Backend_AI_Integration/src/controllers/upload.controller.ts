import * as service from "../services/v1/upload.service";
import { Request, Response } from "express";

const uploadCloudinary = async (req: Request, res: Response) => {
  const { originalname, mimetype, path } = req.file as any;
  const { iduser } = req.body;
  console.log("check file", req.file);
  try {
    const res_service = await service.uploadCloudinary({
      originalname,
      mimetype,
      path,
      iduser,
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
    console.log("check error ", error);
  }
  // try {
  //   if (!file) {
  //     return res
  //       .status(400)
  //       .json({ message: "upload image fail", path: "", name: "" });
  //   }
  //   return res.status(200).json({
  //     message: "upload image success",
  //     path: file.path,
  //     name: file.filename,
  //   });
  // } catch (error) {
  //   console.log("check error ", error);
  // }
};

export { uploadCloudinary };
