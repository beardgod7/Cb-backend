# API Response Standards

## Overview
All API responses should follow a consistent format with camelCase field names and a standard envelope structure.

## Standard Response Envelope

### Successful Response
```json
{
  "success": true,
  "message": "Brief description of operation",
  "data": {}
}
```

### List Response with Pagination
```json
{
  "success": true,
  "message": "Brief description",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## Field Name Convention

All response field names must use **camelCase** (not PascalCase or snake_case):

✅ CORRECT:
- `title` (not `Title`)
- `firstName` (not `FirstName`)
- `eventHighlights` (not `EventHighlights`)
- `registrationEnabled` (not `RegistrationEnabled`)

❌ INCORRECT:
- `Title`
- `FirstName`
- `EventHighlights`
- `RegistrationEnabled`

## HTTP Status Codes

- **201**: Created (POST successful)
- **200**: OK (GET, successful PUT/PATCH/DELETE)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid/expired token)
- **403**: Forbidden (valid token but insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (e.g., duplicate resource)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

## Response Format Examples

### Events Endpoint
```json
GET /v1/api/events

{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Annual Conference",
        "description": "...",
        "organizer": "CBAAC",
        "location": ["Lagos, Nigeria"],
        "startAt": "2026-12-01T10:00:00Z",
        "eventType": "offline",
        "status": "upcoming",
        "isPublished": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42
    }
  }
}
```

### Podcasts Endpoint
```json
GET /v1/api/podcasts/admin

{
  "success": true,
  "message": "Podcasts retrieved",
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Weekly Insights",
        "description": "...",
        "audioUrl": "https://...",
        "coverImage": "https://...",
        "published": true
      }
    ]
  }
}
```

### Merchandise Endpoint
```json
GET /v1/api/admin/merchandise/products/1

{
  "success": true,
  "message": "Product retrieved",
  "data": {
    "id": "uuid",
    "name": "Ceramic Vase",
    "category": "artworks",
    "price": 50000,
    "stock": 10,
    "isFeatured": true,
    "isActive": true
  }
}
```

## Response Normalization

Use the `responseNormalizer` utility to ensure consistent responses:

```javascript
const { toCamelCase, standardResponse, standardListResponse } = require("../../utils/responseNormalizer");

// Single item response
standardResponse(res, 200, "Item retrieved", item);

// List response
standardListResponse(res, 200, "Items retrieved", items, { page: 1, limit: 20 });
```

## Migration Notes

### Events (Priority)
- Field names in requests/responses should use camelCase
- Example: `Title` → `title`, `Organizer` → `organizer`, `EventHighlights` → `eventHighlights`
- Use `toCamelCase()` helper to normalize database responses

### Podcasts (Priority)
- Ensure consistent envelope structure
- Use `data.items` for lists, not just bare array

### Merchandise (Priority)
- Already mostly compliant, but verify all list endpoints use `data.items` pattern

### Library & Bookstore
- Continue using existing response patterns but migrate to camelCase field names over time

## Implementation Checklist

- [ ] Events: Convert all responses to use camelCase + standard envelope
- [ ] Podcasts: Standardize envelope structure (use data.items for lists)
- [ ] Merchandise: Audit and standardize all list responses
- [ ] Ensure all error responses include `success: false` and descriptive `message`
- [ ] Document all endpoints with expected response structure
- [ ] Test endpoints to verify response format compliance
