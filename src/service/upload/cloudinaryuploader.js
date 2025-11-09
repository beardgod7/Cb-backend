// services/cloudinaryUploader.js
const cloudinary = require("../../config/cloudinary");

/**
 * Upload a file buffer to a dynamic Cloudinary folder.
 * @param {Buffer} buffer - File buffer to upload.
 * @param {string} folder - Cloudinary folder to store the file.
 * @param {string} filename - Public ID for the uploaded file.
 * @returns {Promise<string>} - Secure URL of the uploaded file.
 */
async function uploadToCloudinary(buffer, folder, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error("Failed to delete image: " + error.message);
  }
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };
