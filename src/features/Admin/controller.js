const cloudinary = require("../../config/cloudinary");

/**
 * Upload a single image file to Cloudinary
 * POST /v1/api/admin/uploads
 */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided. Please upload an image.",
      });
    }

    const folder = req.body.folder || "uploads";
    const allowedFolders = [
      "merchandise",
      "programmes",
      "archives",
      "events",
      "books",
      "films",
    ];

    // Validate folder name
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: `Invalid folder. Allowed folders: ${allowedFolders.join(", ")}`,
      });
    }

    // Validate file type
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPG, PNG, and WebP are allowed.",
      });
    }

    // Check file size (8MB max)
    const maxSize = 8 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 8MB.",
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `CBAAC/${folder}`,
          resource_type: "auto",
          quality: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    return res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        width: result.width,
        height: result.height,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadImage,
};
