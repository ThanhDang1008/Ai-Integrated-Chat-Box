import "dotenv/config";
import * as service from "../services/v1/auth.service";
import { verifyToken, generateToken } from "../shared/utils/jwt";
import { Response, Request } from "express";

const register = async (req: Request, res: Response) => {
  const { fullname, gender, email, password, type } = req.body;
  try {
    const res_service = await service.register({
      fullname,
      gender,
      email,
      password,
      type,
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

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const res_service = await service.login({ username, password });
    if (res_service.data) {
      return res.status(200).json(res_service.data);
    }
  } catch (error: any) {
    return res.status(error.cause.code).json(error.cause);
  }
};

const account = async (req: Request, res: Response) => {
  //lấy token trong header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  //verify token
  if (!token) {
    return res.status(401).json({
      code: "401",
      message: "unauthorized please login!",
      status: "UNAUTHORIZED",
    });
  }
  const { status, ...user } = verifyToken(token);
  //console.log("user",user);
  if (status === "TOKEN_VALID") {
    const { iat, exp, ...rest }: any = user;
    const access_token = generateToken(rest, process.env.ACCESS_TOKEN_TIME);
    return res.status(200).json({
      code: "200",
      message: "get account success!",
      status: "SUCCESS",
      data: {
        access_token,
        user: rest,
      },
    });
  }

  return res.status(401).json({
    code: "401",
    message: "unauthorized please login!",
    status: "UNAUTHORIZED",
  });
};

export {
  register,
  login,
  account,
};
