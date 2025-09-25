import db from "@/models/index";

const uploadCloudinary = async (data) => {
  try {
    const data_file = await db.File.create({
      id: "Upload-" + Date.now() + "-" + Math.round(Math.random() * 1e9),
      originalname: data.originalname,
      urlCloudinary: data.path,
      type: data.mimetype,
      iduser: data.iduser ? data.iduser : null,
    });
    //console.log("data_file",data_file);
    if (!data_file) {
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
        path: data_file.urlCloudinary,
        name: data_file.originalname,
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
  uploadCloudinary,
};
