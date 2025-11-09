const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

/**
 * Generate unique ticket ID
 * @param {string} prefix - Prefix for ticket (EVENT, TOUR, TRIP)
 * @returns {string} Unique ticket ID
 */
function generateTicketId(prefix = "TICKET") {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate QR code for ticket
 * @param {string} ticketId - Ticket ID to encode
 * @returns {Promise<string>} Base64 encoded QR code image
 */
async function generateQRCode(ticketId) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(ticketId, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Generate QR code as buffer
 * @param {string} ticketId - Ticket ID to encode
 * @returns {Promise<Buffer>} QR code as buffer
 */
async function generateQRCodeBuffer(ticketId) {
  try {
    const buffer = await QRCode.toBuffer(ticketId, {
      errorCorrectionLevel: "H",
      type: "png",
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    return buffer;
  } catch (error) {
    console.error("Error generating QR code buffer:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Verify ticket ID format
 * @param {string} ticketId - Ticket ID to verify
 * @returns {boolean} True if valid format
 */
function verifyTicketIdFormat(ticketId) {
  const pattern = /^(EVENT|TOUR|TRIP)-[A-Z0-9]+-[A-Z0-9]+$/;
  return pattern.test(ticketId);
}

module.exports = {
  generateTicketId,
  generateQRCode,
  generateQRCodeBuffer,
  verifyTicketIdFormat,
};
