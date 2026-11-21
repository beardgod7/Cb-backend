const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authorize } = require("../../middleware/rolemiddleware");
const controller = require("./controller");

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPG, PNG, and WebP are allowed."
        )
      );
    }
  },
});

const admin = authorize(["Admin", "SuperAdmin"]);

// Image upload endpoint
router.post("/uploads", admin, upload.single("file"), controller.uploadImage);

module.exports = router;
