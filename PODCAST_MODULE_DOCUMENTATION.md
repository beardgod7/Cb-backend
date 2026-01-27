# Podcast Module Documentation

## Overview
The Podcast module provides functionality for managing podcast content within the VTB backend system. It allows administrators to create, update, and manage podcasts, while providing public access to published podcasts.

## Features
- **CRUD Operations**: Create, read, update, and delete podcasts
- **Publishing System**: Control podcast visibility with publish/unpublish functionality
- **Search & Pagination**: Search podcasts by title or description with paginated results
- **Role-based Access**: Admin-only management with public read access for published content
- **URL Validation**: Ensures podcast links are valid URLs

## Database Schema

### Podcasts Table
```sql
- id (UUID, Primary Key)
- userId (UUID, Foreign Key to Users)
- title (VARCHAR(255), Required)
- description (TEXT, Required)
- link (VARCHAR(255), Required, URL format)
- isPublished (BOOLEAN, Default: false)
- isLive (BOOLEAN, Default: false)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## API Endpoints

### Admin Endpoints (Require Authentication + Admin Role)
- `POST /api/podcast` - Create new podcast
- `GET /api/podcast/admin` - Get all podcasts with search and pagination
- `PUT /api/podcast/:id` - Update podcast
- `DELETE /api/podcast/:id` - Delete podcast

### Public Endpoints
- `GET /api/podcast/published` - Get published podcasts with pagination
- `GET /api/podcast/live` - Get live podcasts with pagination
- `GET /api/podcast/:id` - Get specific podcast by ID

## Request/Response Examples

### Create Podcast
```json
POST /api/podcast
{
  "title": "Tech Talk Weekly",
  "description": "A weekly podcast about the latest in technology",
  "link": "https://example.com/podcast/tech-talk-weekly",
  "isPublished": false,
  "isLive": false
}
```

### Response
```json
{
  "message": "Podcast created successfully",
  "podcast": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "123e4567-e89b-12d3-a456-426614174001",
    "title": "Tech Talk Weekly",
    "description": "A weekly podcast about the latest in technology",
    "link": "https://example.com/podcast/tech-talk-weekly",
    "isPublished": false,
    "isLive": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Validation Rules
- **title**: Required, 1-255 characters
- **description**: Required, minimum 1 character
- **link**: Required, must be valid URL format
- **isPublished**: Optional boolean, defaults to false
- **isLive**: Optional boolean, defaults to false

## Security
- Admin authentication required for all management operations
- Public access only to published podcasts
- Input validation and sanitization
- URL format validation for podcast links

## Usage Notes
1. Only users with admin role can create, update, or delete podcasts
2. Unpublished podcasts are only visible to admins
3. Live podcasts are only shown if they are also published
4. Search functionality works on both title and description fields
5. Pagination is available for all list endpoints
6. All timestamps are in UTC format

## Integration
The Podcast module integrates with:
- Authentication system for user management
- Role-based middleware for access control
- Swagger documentation for API reference
- Database connection through Sequelize ORM