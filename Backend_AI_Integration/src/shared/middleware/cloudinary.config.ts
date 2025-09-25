const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  //allowedFormats: ['jpg', 'png', 'jpeg', 'mp4','mp3','txt'],
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
  params: {
    folder: "react",
    format: async (req: any, file: any) => {
      //console.log("check file format", file);
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      const fileFormats: {
        [key: string]: string;
      } = {
        "image/jpeg": "jpeg",
        "image/png": "png",
        "image/jpg": "jpg",
        "video/mp4": "mp4",
        "audio/mp3": "mp3",
        "text/plain": "txt",
        "application/pdf": "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
        "application/msword": "doc",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "xlsx",
      };
      const format = fileFormats[file.mimetype];
      return format ? format : null;
    },
    // public_id: (req, file) => {
    //   const name = file.originalname.split('.');
    //   return name[0];
    // },
    resource_type: "raw",
  },
});

const uploadCloud = multer({ storage });

export default uploadCloud;
