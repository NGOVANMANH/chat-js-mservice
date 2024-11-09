const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(
      null,
      `${file.originalname.split(".")[0]}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const acceptFileExtensions = /jpeg|jpg|png|pdf|txt|docx|xlsx|csv|mp4/;
    const extname = acceptFileExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = acceptFileExtensions.test(file.mimetype);
    if (extname && mimetype) {
      return callback(null, true);
    }
    callback(new Error("Unsupported file type."));
  },
});

module.exports = { upload };
