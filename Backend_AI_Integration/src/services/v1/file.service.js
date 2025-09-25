import db from "@/models/index";
import fs from "fs";
import { urlGetFile } from "../../constants/api";
const uploadSystem = async (data) => {
  const id_file = "upload-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
  try {
    const { dataValues, _previousDataValues } = await db.File.create({
      id: id_file,
      originalname: data.originalname,
      keyfile: data.filename,
      urlfile: data.pathFile,
      type: data.mimetype,
      iduser: data.iduser ? data.iduser : null,
      ocr: data.ocr ? data.ocr : null,
    });
    console.log("data_file", dataValues);
    if (!dataValues) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "upload file fail!",
          status: "FAIL_UPLOAD_FILE",
        },
      };
    }
    return {
      code: 2,
      data: {
        code: "201",
        message: "upload file success!",
        status: "UPLOAD_FILE_SUCCESS",
        id: dataValues.id,
        url: urlGetFile(dataValues.keyfile),
        keyfile: dataValues.keyfile,
        name: dataValues.originalname,
        ...(dataValues.ocr === "true" ? { ocr: true } : {}),
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

const getFile = async (data) => {
  try {
    const data_file = await db.File.findOne({
      where: {
        keyfile: data.keyfile,
      },
      atributes: ["urlfile"],
    });
    //console.log("data_file", data_file);
    if (!data_file) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `file ${data.keyfile} not found!`,
          status: "FILE_NOT_FOUND",
        },
      };
    }
    return {
      code: 2,
      path: data_file.urlfile,
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

const deleteFile = async (data) => {
  try {
    const find_file = await db.File.findOne({
      where: {
        id: data.id,
      },
      //atributes: ["id","urlfile","originalname"], ko tác dụng
    });
    //console.log("find_file", find_file);

    if (!find_file) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `file ${data.id} not found!`,
          status: "FILE_NOT_FOUND",
        },
      };
    }

    fs.unlink(find_file.urlfile, (err) => {
      if (err) {
        return console.log(`delete file ${find_file.urlfile} fail!`);
      }
      return console.log(`delete file ${find_file.urlfile} success!`);
    });

    const data_file = await db.File.destroy({
      where: {
        id: find_file.id,
      },
    });

    //console.log("data_file", data_file);
    if (data_file === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `delete file ${find_file.originalname} fail!`,
          status: "DELETE_FILE_FAIL",
        },
      };
    }
    return {
      code: 2,
      data: {
        code: "200",
        message: `delete file ${find_file.originalname} success!`,
        status: "DELETE_FILE_SUCCESS",
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
  uploadSystem,
  getFile,
  deleteFile,
};
