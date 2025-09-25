import db from "@/models/index";
const { Chatbot, Chatbot_File, File } = db as any;
import { urlGetFile } from "@/constants/api";
import { thumbnail_chatbot_default } from "@/constants/url-default";
import fs from "fs";
import {
  ICreateChatbotReq,
  IUpdateChatbotReq,
} from "../../dtos/request/chatbot.dto";
import ApiResponse from "@/dtos/response/ApiResponse";

import { chatbotElastic } from "@service/elastic/chatbot.es";

const createChatbot = async (data: ICreateChatbotReq) => {
  type dataValuesCreate = {
    id: string;
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    iduser: string;
    createdAt: Date;
    updatedAt: Date;
  };

  const id_chatbot =
    "chatbot-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
  try {
    const {
      dataValues,
    }: {
      dataValues: dataValuesCreate;
    } = await Chatbot.create({
      id: id_chatbot,
      title: data.title,
      description: data.description,
      content: data.content,
      thumbnail: data.thumbnail ? data.thumbnail : thumbnail_chatbot_default,
      iduser: data.iduser ? data.iduser : null,
    });
    //console.log("data_chatbot", dataValues);
    // console.log("data_chatbot", _previousDataValues);
    if (!dataValues) {
      return {
        code: 4,
        error: ApiResponse(400, "create chatbot fail!", "FAIL_CREATE_CHATBOT"),
      };
    }

    //["upload-...","upload-..."]
    //console.log("data.arrayFiles", typeof data.arrayFiles);

    //cập nhật files cho chatbot
    let bulkChatbotFile: { idchatbot: string; idfile: string }[] = [];
    if (Array.isArray(data.arrayFiles) && data.arrayFiles.length > 0) {
      data.arrayFiles.forEach((element) => {
        if (id_chatbot && element) {
          bulkChatbotFile.push({
            idchatbot: id_chatbot,
            idfile: element,
          });
        }
      });
    }

    if (bulkChatbotFile.length > 0) {
      const data_chatbot_file = await Chatbot_File.bulkCreate(bulkChatbotFile);
      //console.log("data_chatbot_file", data_chatbot_file);
      if (!data_chatbot_file) {
        return {
          code: 4,
          error: ApiResponse(
            400,
            "create chatbot fail!",
            "FAIL_CREATE_CHATBOT_FILE"
          ),
        };
      }
    }

    chatbotElastic.createChatbot({
      id: dataValues.id,
      title: dataValues.title,
      description: dataValues.description,
    });

    return {
      code: 201,
      data: ApiResponse(
        201,
        "create chatbot success!",
        "CREATE_CHATBOT_SUCCESS",
        dataValues
      ),
    };
  } catch (error) {
    return {
      code: 5,
      error: ApiResponse(500, `server error: ${error}`, "SERVER_ERROR"),
    };
  }
};

const getAllChatbot = async (data: { _page: number; _limit: number }) => {
  try {
    const totalRows = await Chatbot.count();
    const totalPage = Math.ceil(totalRows / data._limit);
    const offset = (data._page - 1) * data._limit;
    // console.log("totalRows", totalRows);

    const data_chatbot = await Chatbot.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "thumbnail",
        "createdAt",
        "updatedAt",
      ],
      //   include: [
      //     {
      //       model: db.File,
      //       as: "files",
      //       attributes: ["keyfile"],
      //       through: {
      //         attributes: [],
      //       },
      //     },
      //   ],
      //   nest: true,
      //   raw: true,
      limit: data._limit,
      offset: offset,
      order: [["updatedAt", "DESC"]],
    });
    //console.log("data_chatbot", data_chatbot);
    if (!data_chatbot) {
      return {
        code: 4,
        error: ApiResponse(400, "get chatbot fail!", "FAIL_GET_CHATBOT"),
      };
    }
    return {
      code: 2,
      data: ApiResponse(200, "get chatbot success!", "GET_CHATBOT_SUCCESS", {
        totalRows: totalRows,
        totalPage: totalPage,
        currentPage: data._page,
        data_chatbot,
      }),
    };
  } catch (error) {
    return {
      code: 5,
      error: ApiResponse(500, `server error: ${error}`, "SERVER_ERROR"),
    };
  }
};

const getDetailChatbot = async (data: { id: string }) => {
  try {
    const data_chatbot = await Chatbot.findOne({
      //attributes: ["title", "content"],
      where: {
        id: data.id,
      },
    });
    //console.log("data_chatbot", data_chatbot);
    if (!data_chatbot) {
      return {
        code: 4,
        error: ApiResponse(
          400,
          `chatbot ${data.id} not found!`,
          "CHATBOT_NOT_FOUND"
        ),
      };
    }

    return {
      code: 2,
      data: ApiResponse(
        200,
        "get detail chatbot success!",
        "CHATBOT_FOUND",
        data_chatbot
      ),
    };
  } catch (error) {
    return {
      code: 5,
      error: ApiResponse(500, `server error: ${error}`, "SERVER_ERROR"),
    };
  }
};

const updateChatbot = async (data: IUpdateChatbotReq) => {
  //console.log("data", data);
  try {
    const data_chatbot = await Chatbot.update(
      {
        title: data.title,
        description: data.description,
        content: data.content,
        thumbnail: data.thumbnail,
        iduser: data.iduser,
      },
      {
        where: {
          id: data.id,
        },
      }
    );
    //console.log("data_chatbot", data_chatbot);
    if (data_chatbot[0] === 0) {
      return {
        code: 4,
        error: ApiResponse(
          400,
          `chatbot ${data.id} not found!`,
          "CHATBOT_NOT_FOUND"
        ),
      };
    }

    //["upload-...","upload-..."]
    //console.log("data.arrayFiles", typeof data.arrayFiles);

    //cập nhật files cho chatbot
    let bulkChatbotFile: { idchatbot: string; idfile: string }[] = [];
    if (Array.isArray(data.arrayFiles) && data.arrayFiles.length > 0) {
      data.arrayFiles.forEach((element: string) => {
        if (data.id && element) {
          bulkChatbotFile.push({
            idchatbot: data.id,
            idfile: element,
          });
        }
      });
    }

    if (bulkChatbotFile.length > 0) {
      const data_chatbot_file = await Chatbot_File.bulkCreate(bulkChatbotFile);
      //console.log("data_chatbot_file", data_chatbot_file);
      if (!data_chatbot_file) {
        return {
          code: 4,
          error: ApiResponse(
            400,
            "update chatbot fail!",
            "FAIL_UPDATE_CHATBOT_FILE"
          ),
        };
      }
    }

    chatbotElastic.updateChatbot({
      id: data.id,
      title: data.title,
      description: data.description,
    });

    return {
      code: 2,
      data: ApiResponse(
        200,
        "update chatbot success!",
        "UPDATE_CHATBOT_SUCCESS"
      ),
    };
  } catch (error) {
    return {
      code: 5,
      error: ApiResponse(500, `server error: ${error}`, "SERVER_ERROR"),
    };
  }
};

const deleteFilesChatbot = async (data: { id: string }) => {
  try {
    const data_chatbot = await Chatbot.findAll({
      where: {
        id: data.id,
      },
      attributes: ["id"],
      include: [
        {
          model: File,
          as: "files",
          attributes: ["id", "urlfile"],
          through: {
            attributes: [],
          },
        },
      ],
      nest: true,
      raw: true,
    });
    //console.log("data_chatbot", data_chatbot);

    const listId_Model_File = data_chatbot.map((element: any) => {
      if (element.files.id) {
        return element.files.id;
      }
    });
    const listPath_Model_File = data_chatbot.map((element: any) => {
      if (element.files.urlfile) {
        return element.files.urlfile;
      }
    });

    //console.log("listId_Model_File", listId_Model_File);
    //console.log("listPath_Model_File", listPath_Model_File);

    if (listId_Model_File.length > 0 && listId_Model_File[0]) {
      //console.log("run listId_Model_File", listId_Model_File);
      const data_model_file = await File.destroy({
        where: {
          id: listId_Model_File,
        },
      });

      // if (data_model_file === 0) {
      //   return {
      //     code: 4,
      //     error: {
      //       code: "400",
      //       message: `delete files chatbot ${data.id} fail!`,
      //       status: "DELETE_FILES_FAIL",
      //     },
      //   };
      // }
    }

    const data_chatbot_file = await Chatbot_File.destroy({
      where: {
        idchatbot: data.id,
      },
    });

    // if (data_chatbot_file === 0) {
    //   return {
    //     code: 4,
    //     error: {
    //       code: "400",
    //       message: `delete files chatbot ${data.id} fail!`,
    //       status: "DELETE_CHATBOT_FILES_FAIL",
    //     },
    //   };
    // }

    if (listPath_Model_File.length > 0 && listPath_Model_File[0]) {
      //console.log("run listPath_Model_File", listPath_Model_File);
      listPath_Model_File.forEach((element: string) => {
        fs.unlink(element, (err) => {
          if (err) {
            return console.log(`delete file ${element} fail!`);
          }
          return console.log(`delete file ${element} success!`);
        });
      });
    }

    return {
      code: 2,
      data: ApiResponse(
        200,
        "delete files chatbot success!",
        "DELETE_CHATBOT_FILES_SUCCESS"
      ),
    };
  } catch (error) {
    return {
      code: 5,
      error: ApiResponse(500, `server error: ${error}`, "SERVER_ERROR"),
    };
  }
};

const deleteChatbot = async (data: { id: string }) => {
  try {
    const find_chatbot = await Chatbot.findOne({
      where: {
        id: data.id,
      },
    });

    if (!find_chatbot) {
      return {
        code: 4,
        error: ApiResponse(
          400,
          `chatbot ${data.id} not found!`,
          "CHATBOT_NOT_FOUND"
        ),
      };
    }

    const data_chatbot = await Chatbot.destroy({
      where: {
        id: data.id,
      },
    });

    if (data_chatbot === 0) {
      return {
        code: 4,
        error: ApiResponse(
          400,
          `delete chatbot ${data.id} fail!`,
          "DELETE_CHATBOT_FAIL"
        ),
      };
    }

    chatbotElastic.deleteChatbot(data.id);

    return {
      code: 2,
      data: ApiResponse(
        200,
        "delete chatbot success!",
        "DELETE_CHATBOT_SUCCESS"
      ),
    };
  } catch (error) {
    return {
      code: 5,
      error: ApiResponse(500, `server error: ${error}`, "SERVER_ERROR"),
    };
  }
};

export {
  createChatbot,
  getAllChatbot,
  getDetailChatbot,
  updateChatbot,
  deleteFilesChatbot,
  deleteChatbot,
};
