import multer from "multer";
import multerType from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //console.log('file', file);
    // file {
    //     fieldname: 'image1',
    //     originalname: 'Screenshot 2024-03-05 165924.png',
    //     encoding: '7bit',
    //     mimetype: 'image/png'
    //   }
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    let uploadPath = "";
    if (file.mimetype.startsWith("image/")) {
      uploadPath = "./src/public/uploads/images/";
    } else if (file.mimetype.startsWith("audio/")) {
      uploadPath = "./src/public/uploads/audios/";
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath = "./src/public/uploads/videos/";
    } else if (file.mimetype.startsWith("application/pdf")) {
      uploadPath = "./src/public/uploads/pdfs/";
    }
    // else if (file.mimetype.startsWith('image/')&&file.fieldname==='image_user') {
    //     uploadPath = './src/public/uploads/user/images/';
    // }
    else {
      uploadPath = "./src/public/uploads/others/";
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // {
    //   fieldname: 'file',
    //   originalname: 'blob',
    //   encoding: '7bit',
    //   mimetype: 'application/pdf'
    // }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    if (fileExtension === "blob") {
      const fileExtensionBlob = file.mimetype.split("/").pop();
      cb(
        null,
        file.fieldname +
          "-" +
          "blob" +
          "-" +
          uniqueSuffix +
          "." +
          fileExtensionBlob
      );
    } else {
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
    }
  },
});

const uploadSystem: multerType.Multer = multer({ storage: storage });

export default uploadSystem;
