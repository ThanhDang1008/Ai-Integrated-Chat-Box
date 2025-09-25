import * as service from "../services/v1/role.service";
import { Request, Response } from "express";

const createRole = async (req:Request, res:Response) => {
  const { permission } = req.body;
  try {
    const res_service = await service.createRole({ permission });
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

export {
  createRole
}
