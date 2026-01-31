# Podcast Module Documentation

## Overview
The Podcast module provides functionality for managing podcast content within the VTB backend system. It allows administrators to create, update, and manage podcasts with file uploads for audio and cover images, while providing public access to published podcasts for direct listening on the platform.

## Features
- **CRUD Operations**: Create, read, update, and delete podcasts
- **File Upload Support**: Upload audio files and cover images via Cloudinary
- **Publishing System**: Control podcast visibility with publish/unpublish functionality
- **Live Streaming**: Mark podcasts as currently live for real-time content
- **Search & Pagination**: Search podcasts by title or description with paginated results
- **Role-based Access**: Admin-only management with public read access for published content
- **Direct Audio Playback**: Users can listen to podcast audio directly on the platform

## Database Schema

### Podcasts Table
```sql
- id (UUID, Primary Key)
- userId (UUID, Foreign Key to Users)
- title (VARCHAR(255), Required)
- description (TEXT, Required)
- link (VARCHAR(255), Optional, URL format)
- audio (VARCHAR(255), Optional, Cloudinary URL)
- coverImage (VARCHAR(255), Optional, Cloudinary URL)
- isPublished (BOOLEAN, Default: false)
- isLive (BOOLEAN, Default: false)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## API Endpoints

### Admin Endpoints (Require Authentication + Admin Role)
- `POST /api/podcast` - Create new podcast with file uploads
- `GET /api/podcast/admin` - Get all podcasts with search and pagination
- `PUT /api/podcast/:id` - Update podcast with optional file uploads
- `DELETE /api/podcast/:id` - Delete podcast and associated files

### Public Endpoints
- `GET /api/podcast/published` - Get published podcasts with pagination
- `GET /api/podcast/live` - Get live podcasts with pagination
- `GET /api/podcast/:id` - Get specific podcast by ID

## File Upload Support

### Audio Files
- **Supported Formats**: MP3, WAV, M4A, OGG
- **Upload Field**: `audio` (multipart/form-data)
- **Storage**: Cloudinary with resource type "video"
- **Folder**: "Podcasts"

### Cover Images
- **Supported Formats**: JPG, PNG, GIF, WebP
- **Upload Field**: `coverImage` (multipart/form-data)
- **Storage**: Cloudinary with resource type "image"
- **Folder**: "Podcasts"

## Request/Response Examples

### Create Podcast with Files
```javascript
// Using FormData for file upload
const formData = new FormData();
formData.append('title', 'Tech Talk Weekly');
formData.append('description', 'A weekly podcast about the latest in technology');
formData.append('link', 'https://example.com/podcast/tech-talk-weekly');
formData.append('audio', audioFile); // File object
formData.append('coverImage', imageFile); // File object
formData.append('isPublished', 'false');
formData.append('isLive', 'false');

// POST /api/podcast
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
    "audio": "https://res.cloudinary.com/example/video/upload/v1234567890/Podcasts/audio-file.mp3",
    "coverImage": "https://res.cloudinary.com/example/image/upload/v1234567890/Podcasts/cover-image.jpg",
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
- **link**: Optional, must be valid URL format if provided
- **audio**: Optional file upload, audio formats only
- **coverImage**: Optional file upload, image formats only
- **isPublished**: Optional boolean, defaults to false
- **isLive**: Optional boolean, defaults to false

## File Management
- **Upload**: Files are uploaded to Cloudinary with organized folder structure
- **Update**: Old files are automatically deleted when new files are uploaded
- **Delete**: All associated files are deleted when a podcast is removed
- **Validation**: File types are validated by Cloudinary and upload middleware

## Security
- Admin authentication required for all management operations
- Public access only to published podcasts
- File upload validation and sanitization
- URL format validation for external links
- Automatic cleanup of orphaned files

## Usage Notes
1. Only users with Admin or SuperAdmin role can create, update, or delete podcasts
2. Unpublished podcasts are only visible to admins
3. Live podcasts must also be published to be visible publicly
4. Audio files are stored with Cloudinary's "video" resource type for better handling
5. Cover images are optimized automatically by Cloudinary
6. Search functionality works on both title and description fields
7. File uploads are optional - podcasts can be created with just metadata
8. All timestamps are in UTC format

## Integration
The Podcast module integrates with:
- Authentication system for user management
- Role-based middleware for access control
- Cloudinary service for file storage and optimization
- Swagger documentation for API reference
- Database connection through Sequelize ORM
- File upload middleware for multipart form handling