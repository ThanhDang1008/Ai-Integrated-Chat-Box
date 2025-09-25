require("dotenv").config();

const urlGetFile = (keyfile:string) => {
  return `http://${process.env.HOST}:${process.env.PORT}/api/v1/file/${keyfile}`;
};

export {
  urlGetFile,
};
