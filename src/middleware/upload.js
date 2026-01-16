const multer = require("multer");

// In-memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Image formats
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
    
    // Document formats
    "application/pdf",
    
    // Video formats
    "video/mp4", // .mp4
    "video/mpeg", // .mpeg, .mpg
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
    "video/x-ms-wmv", // .wmv
    "video/webm", // .webm
    "video/x-flv", // .flv
    "video/3gpp", // .3gp
    "video/3gpp2", // .3g2
    "video/x-matroska", // .mkv
    "video/ogg", // .ogv
    
    // Audio formats
    "audio/mpeg", // .mp3
    "audio/mp4", // .m4a
    "audio/wav", // .wav
    "audio/wave", // .wav (alternative)
    "audio/x-wav", // .wav (alternative)
    "audio/webm", // .weba
    "audio/ogg", // .ogg, .oga
    "audio/flac", // .flac
    "audio/aac", // .aac
    "audio/x-aac", // .aac (alternative)
    "audio/x-m4a", // .m4a (alternative)
    "audio/3gpp", // .3gp
    "audio/3gpp2", // .3g2
    "audio/amr", // .amr
    "audio/x-ms-wma", // .wma
    "audio/midi", // .mid, .midi
    "audio/x-midi", // .mid, .midi (alternative)
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Unsupported file type: ${file.mimetype}. Allowed types: images, PDFs, audio, and video files.`)
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max for video/audio files
});

module.exports = { upload };
