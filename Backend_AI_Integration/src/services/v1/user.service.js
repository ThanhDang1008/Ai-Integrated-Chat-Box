import db from "@/models/index";
import { TIMEZONE_GMT } from "../../shared/utils/timezone";
import { generateToken } from "../../shared/utils/jwt";
import { avatar_default } from "../../constants/url-default";
import { or } from "sequelize";
require("dotenv").config();

const getConversations = async (iduser) => {
  try {
    const data_conversations = await db.User.findAll({
      attributes: ["id", "fullname", "email"],
      where: {
        id: iduser,
      },
      include: {
        model: db.Conversation,
        as: "conversations",
        attributes: ["id", "title", "urlfile", "createdAt", "updatedAt"],
      },
      raw: true,
      nest: true,
      order: [["conversations", "createdAt", "DESC"]],
    });
    //console.log("check data_conversations ", data_conversations);

    if (data_conversations.length === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "get conversation fail!",
          status: "FAIL_CONVERSATION",
        },
      };
    }
    //console.log("data_conversations", data_conversations);
    return {
      code: 2,
      data: {
        code: "200",
        message: "get conversation success!",
        data: {
          ...data_conversations[0],
          conversations:
            data_conversations[0].conversations.id === null
              ? []
              : data_conversations.map((item) => {
                  return item.conversations;
                }),
        },
      },
    };
  } catch (error) {
    return {
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

const getFiles = async (iduser) => {
  try {
    const data_user = await db.User.findOne({
      attributes: ["id", "fullname", "email"],
      where: { id: iduser },
    });
    //console.log("check find_user ", data_user);

    if (!data_user) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "user not found!",
          status: "USER_NOT_FOUND",
        },
      };
    }

    const data_files = await db.File.findAll({
      attributes: [
        "id",
        "keyfile",
        "urlCloudinary",
        "originalname",
        "type",
        "ocr",
        "createdAt",
        "updatedAt",
      ],
      where: {
        iduser: iduser,
        type: [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        //ocr: or({ [db.Sequelize.Op.eq]: null }, { [db.Sequelize.Op.eq]: "" }),
      },
      order: [["createdAt", "DESC"]],
    });
    //console.log("check data_files ", data_files);

    return {
      code: 2,
      data: {
        code: "200",
        message: "get files success!",
        status: "GET_FILES_SUCCESS",
        data: {
          ...data_user,
          files: data_files.length === 0 ? [] : data_files, //GMT 0
        },
      },
    };
  } catch (error) {
    return {
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

const updateAvatar = async (data) => {
  //console.log("data", data);
  try {
    if (data.keyFile_old) {
      const data_update_avatar = await db.File.update(
        {
          originalname: data.originalname,
          keyfile: data.filename,
          urlfile: data.pathFile,
          type: data.mimetype,
          iduser: data.iduser ? data.iduser : null,
        },
        {
          where: {
            keyfile: data.keyFile_old,
          },
        }
      );
      //console.log("data_update_avatar", data_update_avatar);
      if (data_update_avatar[0] === 0) {
        return {
          code: 4,
          error: {
            code: "400",
            message: "update avatar fail!",
            status: "UPDATE_AVATAR_FAIL",
          },
        };
      }
    }

    if (!data.keyFile_old) {
      const { dataValues, _previousDataValues } = await db.File.create({
        id: "Upload-" + Date.now() + "-" + Math.round(Math.random() * 1e9),
        originalname: data.originalname,
        keyfile: data.filename,
        urlfile: data.pathFile,
        type: data.mimetype,
        iduser: data.iduser ? data.iduser : null,
      });
      //console.log("dataValues", dataValues);
      if (!dataValues) {
        return {
          code: 4,
          error: {
            code: "400",
            message: "create avatar fail!",
            status: "CREATE_AVATAR_FAIL",
          },
        };
      }
    }

    const data_user = await db.User.update(
      {
        urlavatar: `http://localhost:${process.env.PORT}/api/v1/file/${data.filename}`,
      },
      {
        where: {
          id: data.iduser,
        },
      }
    );
    //console.log("data_user", data_user);
    if (data_user[0] === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "update avatar fail!",
          status: "UPDATE_AVATAR_FAIL",
        },
      };
    }

    const payload = {
      ...data.payloadToken,
      avatar: `http://localhost:${process.env.PORT}/api/v1/file/${data.filename}`,
    };

    const access_token = generateToken(payload);

    return {
      code: 2,
      data: {
        code: "200",
        message: "update avatar success!",
        status: "UPDATE_AVATAR_SUCCESS",
        data: {
          access_token,
          urlavatar: `http://localhost:${process.env.PORT}/api/v1/file/${data.filename}`,
        },
      },
    };
  } catch (error) {
    return {
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

const deleteAvatar = async (data) => {
  try {
    const data_user = await db.User.update(
      {
        urlavatar: avatar_default,
      },
      {
        where: {
          id: data.iduser,
        },
      }
    );
    //console.log("data_user", data_user);
    if (data_user[0] === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "delete avatar fail!",
          status: "DELETE_AVATAR_FAIL",
        },
      };
    }

    const payload = {
      ...data.payloadToken,
      avatar: avatar_default,
    };

    //console.log("payload", payload);

    const access_token = generateToken(payload);

    return {
      code: 2,
      data: {
        code: "200",
        message: "delete avatar success!",
        status: "DELETE_AVATAR_SUCCESS",
        data: {
          access_token,
          urlavatar: avatar_default,
        },
      },
    };
  } catch (error) {
    return {
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

const updateProfile = async (data) => {
  try {
    const data_user = await db.User.update(
      {
        fullname: data.fullname,
        phone: data.phone,
        gender: data.gender.toUpperCase(),
      },
      {
        where: {
          id: data.iduser,
        },
      }
    );
    //console.log("data_user", data_user);
    if (data_user[0] === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "update profile fail!",
          status: "UPDATE_PROFILE_FAIL",
        },
      };
    }

    //console.log("data.payloadToken", data.payloadToken);

    const payload = {
      ...data.payloadToken,
      fullname: data.fullname,
      phone: data.phone,
      gender: data.gender.toUpperCase(),
    };
    delete payload.iat;
    delete payload.exp;

    //console.log("payload", payload);

    //exp trong jwt là giây
    //Date.now() trả về mili giây
    const remainingTime = Math.round(data.payloadToken.exp - Date.now() / 1000); // đơn vị giây
    //console.log("remainingTime", remainingTime);

    const access_token = generateToken(payload, remainingTime);
    //console.log("access_token", access_token);

    return {
      code: 2,
      data: {
        code: "200",
        message: "update profile success!",
        status: "UPDATE_PROFILE_SUCCESS",
        data: {
          access_token,
          user: payload,
        },
      },
    };
  } catch (error) {
    return {
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

export {
  getConversations,
  getFiles,
  updateAvatar,
  updateProfile,
  deleteAvatar,
};
