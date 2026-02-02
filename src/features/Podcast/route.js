const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");
const multer = require("multer");

// Custom upload middleware for podcasts
const storage = multer.memoryStorage();

const podcastFileFilter = (req, file, cb) => {
  console.log(`Podcast file upload attempt: ${file.originalname}, MIME type: ${file.mimetype}, Field: ${file.fieldname}`);
  
  // Allow all audio formats for audio field
  if (file.fieldname === 'audio') {
    const audioTypes = [
      "audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", 
      "audio/wav", "audio/wave", "audio/x-wav", "audio/webm", 
      "audio/ogg", "audio/oga", "audio/flac", "audio/aac", 
      "audio/x-aac", "audio/x-m4a", "audio/3gpp", "audio/3gpp2", 
      "audio/amr", "audio/x-ms-wma", "audio/wma", "audio/midi", 
      "audio/x-midi", "audio/vnd.wav", "audio/x-pn-wav"
    ];
    
    if (audioTypes.includes(file.mimetype)) {
      console.log(`Audio file accepted: ${file.originalname}`);
      cb(null, true);
    } else {
      console.log(`Audio file rejected: ${file.originalname}, MIME type: ${file.mimetype}`);
      cb(new Error(`Unsupported audio format: ${file.mimetype}. Supported formats: MP3, WAV, M4A, AAC, OGG, FLAC, WMA`));
    }
  }
  // Allow all image formats for coverImage field
  else if (file.fieldname === 'coverImage') {
    const imageTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/webp", 
      "image/gif", "image/bmp", "image/tiff", "image/svg+xml", 
      "image/x-icon", "image/vnd.microsoft.icon", "image/heic", 
      "image/heif"
    ];
    
    if (imageTypes.includes(file.mimetype)) {
      console.log(`Image file accepted: ${file.originalname}`);
      cb(null, true);
    } else {
      console.log(`Image file rejected: ${file.originalname}, MIME type: ${file.mimetype}`);
      cb(new Error(`Unsupported image format: ${file.mimetype}. Supported formats: JPG, PNG, WebP, GIF, BMP, TIFF`));
    }
  }
  else {
    cb(new Error(`Unexpected field: ${file.fieldname}`));
  }
};

const podcastUpload = multer({
  storage,
  fileFilter: podcastFileFilter,
  limits: { 
    fileSize: 500 * 1024 * 1024, // 500MB max for audio files
    files: 2 // Max 2 files (audio + coverImage)
  },
});

// Admin routes (require authentication and admin role)
router.post(
  "/",
  authorize(["Admin", "SuperAdmin"]),
  podcastUpload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  controller.createPodcast
);

router.get(
  "/admin",
  authorize(["Admin", "SuperAdmin"]),
  controller.getAllPodcasts
);

router.put(
  "/:id",
  authorize(["Admin", "SuperAdmin"]),
  podcastUpload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  controller.updatePodcast
);

router.delete(
  "/:id",
  authorize(["Admin", "SuperAdmin"]),
  controller.deletePodcast
);

// Public routes
router.get("/published", controller.getPublishedPodcasts);
router.get("/live", controller.getLivePodcasts);
router.get("/:id", controller.getPodcastById);

module.exports = router;