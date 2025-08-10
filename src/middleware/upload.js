const multer = require("multer");

// In-memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", // .jpg, .jpeg
    "image/png", // .png
    "image/webp", // .webp
    "image/gif", // .gif
    "image/bmp", // .bmp
    "image/tiff", // .tif, .tiff
    "image/svg+xml", // .svg
    "image/x-icon", // .ico
    "image/vnd.microsoft.icon", // .ico (alternative)
    "image/heic", // .heic (used by iPhones)
    "image/heif", // .heif
    "image/x-canon-cr2", // Canon raw image
    "image/x-nikon-nef", // Nikon raw image
    "image/x-sony-arw", // Sony raw image
    "image/x-olympus-orf",
    "image/x-panasonic-rw2",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Unsupported file type. Only PDF, JPEG, and PNG are allowed.")
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

module.exports = { upload };
