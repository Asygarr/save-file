import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./public/images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const uniqueNameImg = `${
      Date.now() + "-" + Math.round(Math.random() * 1e9)
    }${extname}`;

    cb(null, uniqueNameImg);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 1000000 } });

export default upload;