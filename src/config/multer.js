const multer = require("multer");

// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "src/uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const storageMulter = multer.memoryStorage();
const uploadMulter = multer({ storage: storageMulter });

module.exports = uploadMulter;