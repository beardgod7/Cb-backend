/**
 * Normalize API responses to consistent format with camelCase fields
 */

/**
 * Convert object keys from PascalCase to camelCase
 */
function toCamelCase(obj) {
  if (!obj || typeof obj !== "object") return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    // Convert PascalCase to camelCase (e.g., "Title" -> "title")
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    
    if (value && typeof value === "object") {
      result[camelKey] = toCamelCase(value);
    } else {
      result[camelKey] = value;
    }
  }
  return result;
}

/**
 * Normalize an event object (convert PascalCase to camelCase)
 */
function normalizeEvent(event) {
  if (!event) return event;
  
  const normalized = toCamelCase(event.toJSON ? event.toJSON() : event);
  return normalized;
}

/**
 * Standard successful response envelope
 */
function standardResponse(res, statusCode, message, data) {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data && typeof data === "object" && !Array.isArray(data) 
      ? toCamelCase(data) 
      : data,
  });
}

/**
 * Standard list response envelope with pagination
 */
function standardListResponse(res, statusCode, message, items, pagination) {
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      items: Array.isArray(items) ? items.map(toCamelCase) : items,
      ...(pagination && { pagination: toCamelCase(pagination) }),
    },
  });
}

module.exports = {
  toCamelCase,
  normalizeEvent,
  standardResponse,
  standardListResponse,
};
