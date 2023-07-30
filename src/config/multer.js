const multer = require("multer");

const storageMulter = multer.memoryStorage();
const uploadMulter = multer({ storage: storageMulter });

module.exports = uploadMulter;