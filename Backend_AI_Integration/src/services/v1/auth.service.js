import db from "@/models/index";
import bcrypt from "bcryptjs";
import { generateToken } from "../../shared/utils/jwt";
import { avatar_default } from "../../constants/url-default";
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const checkPassword = async (password, hashPassword) => {
  return await bcrypt.compareSync(password, hashPassword);
};

const MessInternalServerError = "Internal Server Error";

//------------------------------------------------

const register = async (data) => {
  try {
    const checkUser = await db.User.findOne({
      where: {
        email: data.email,
      },
    });

    if (checkUser) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "Email existed!",
          status: "EMAIL_EXISTED",
        },
      };
    }

    const id_user =
      "User-" + Date.now() + "-" + Math.round(Math.random() * 1e9);

    const hash_pass = hashPassword(data.password);

    const new_user = await db.User.create({
      id: id_user,
      fullname: data.fullname,
      gender: data.gender,
      email: data.email,
      urlavatar: avatar_default,
      status: "unverified",
      type: data.type,
      password: hash_pass,
      idrole: "Role-1720080433589-212485831",
    });

    if (!new_user) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "Create user fail!",
          status: "CREATE_USER_FAIL",
        },
      };
    }

    return {
      code: 2,
      data: {
        code: "201",
        message: "Create user success!",
      },
    };
  } catch (error) {
    return {
      code: 5,
      error: {
        code: "500",
        message: `Server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

const login = async (data) => {
  const checkUser = await db.User.findAll({
    where: {
      email: data.username,
    },
    include: {
      model: db.Role,
      as: "role",
    },
    raw: true,
    nest: true,
  });
  //console.log("checkUser", checkUser);

  //sai username
  if (checkUser.length === 0) {
    throw new Error("Username or password incorrect!", {
      cause: {
        code: 400,
        message: "Username or password incorrect!",
        status: "USERNAME_INCORRECT",
      },
    });
  }

  if (checkUser.length === 1) {
    const checkPass = await checkPassword(data.password, checkUser[0].password);
    //console.log("checkPass",checkPass);
    //sai password
    if (!checkPass) {
      throw new Error("Username or password incorrect!", {
        cause: {
          code: 400,
          message: "Username or password incorrect!",
          status: "PASSWORD_INCORRECT",
        },
      });
    }

    //chua verify
    if (checkPass) {
      if (checkUser[0].status === "unverified") {
        throw new Error("Account is not verified!", {
          cause: {
            code: 401,
            message: "Account is not verified!",
            status: "ACCOUNT_NOT_VERIFIED",
            data: {
              fullname: checkUser[0].fullname,
              email: checkUser[0].email,
            },
          },
        });
      }

      const payload = {
        id: checkUser[0].id,
        fullname: checkUser[0].fullname,
        email: checkUser[0].email,
        phone: checkUser[0]?.phone,
        gender: checkUser[0].gender,
        type: checkUser[0].type,
        role: checkUser[0].role.permission,
        avatar: checkUser[0].urlavatar,
      };

      const access_token = generateToken(
        payload,
        process.env.ACCESS_TOKEN_TIME
      );

      return {
        data: {
          code: 200,
          message: "login success!",
          data: {
            access_token,
            user: payload,
          },
        },
      };
    }
  }

  throw new Error(MessInternalServerError, {
    cause: {
      code: 500,
      message: MessInternalServerError,
      status: "SERVER_ERROR",
    },
  });
};

export { register, login };
