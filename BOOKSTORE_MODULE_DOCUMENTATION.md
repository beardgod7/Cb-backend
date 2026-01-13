# Bookstore Module Documentation

## Overview
The Bookstore module allows administrators to upload and manage books for sale, while users can browse and view available books. This module is separate from the Library module and focuses on commercial book sales.

## Features

### Admin Features
- **Category Management**: Create, update, and delete book categories
- **Book Management**: Upload books with comprehensive details and media
- **Book Upload**: Support for multiple file types for preview pages (text, images, PDF)

### User Features
- **Browse Books**: View all available books with filtering options
- **Search**: Search books by title, author, or description
- **Category Filtering**: Filter books by category
- **Price Filtering**: Filter books by price range
- **Featured Books**: View specially highlighted books
- **Book Details**: View complete book information including previews

## Book Fields

### Required Fields
- **Author**: Book author name
- **Title**: Book title
- **Price**: Book price (decimal with 2 decimal places)

### Optional Fields
- **Short Description**: Brief book summary (max 500 characters)
- **Long Description**: Detailed book description
- **Number of Chapters**: Total chapters in the book
- **Number of Pages**: Total pages in the book
- **Number of Parts**: Total parts/sections in the book
- **Editors**: Array of editor names
- **Cover Page**: Book cover image (uploaded file)
- **Preview Pages**: Book preview content (supports 3 formats)
- **Categories**: Associated book categories
- **Featured Status**: Whether the book is featured
- **Active Status**: Whether the book is active/visible

## Preview Pages Support

The module supports three types of preview pages:

### 1. Text Preview (`previewType: "text"`)
Array of objects with page titles and text content:
```json
[
  {
    "page_title": "Chapter 1: Introduction",
    "text": "This is the content of the first chapter..."
  },
  {
    "page_title": "Chapter 2: Getting Started",
    "text": "This chapter covers the basics..."
  }
]
```

### 2. Image Preview (`previewType: "images"`)
Array of image URLs (uploaded as files):
- Upload multiple image files
- Maximum 20 preview images
- Images are stored in Cloudinary

### 3. PDF Preview (`previewType: "pdf"`)
Single PDF file containing preview pages:
- Upload one PDF file
- PDF is stored in Cloudinary
- Users can view/download the preview PDF

## API Endpoints

### Public Endpoints
- `GET /api/bookstore/categories` - Get all categories
- `GET /api/bookstore/categories/:id` - Get category by ID
- `GET /api/bookstore/books` - Get all books (with filters)
- `GET /api/bookstore/books/featured` - Get featured books
- `GET /api/bookstore/books/:id` - Get book by ID
- `GET /api/bookstore/books/category/:categoryId` - Get books by category

### Admin Endpoints (Requires Admin/SuperAdmin role)
- `POST /api/bookstore/admin/categories` - Create category
- `PUT /api/bookstore/admin/categories/:id` - Update category
- `DELETE /api/bookstore/admin/categories/:id` - Delete category
- `POST /api/bookstore/admin/books` - Create book
- `PUT /api/bookstore/admin/books/:id` - Update book
- `DELETE /api/bookstore/admin/books/:id` - Delete book

## Query Parameters for Book Listing

- `categoryId` - Filter by category UUID
- `search` - Search in title, author, or description
- `featured` - Filter featured books (true/false)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

## File Upload Requirements

### Cover Page
- Field name: `coverPage`
- Max files: 1
- Supported formats: Images (JPG, PNG, etc.)

### Preview Images
- Field name: `previewPages`
- Max files: 20
- Supported formats: Images (JPG, PNG, etc.)

### Preview PDF
- Field name: `previewPdf`
- Max files: 1
- Supported formats: PDF

## Database Tables

### BookstoreBooks
- Stores all book information
- Includes JSONB field for flexible preview page storage
- Supports price with decimal precision
- Tracks creation and modification timestamps

### BookstoreCategories
- Stores book categories
- Simple name and description structure
- Active status for soft deletion

### BookstoreBookCategories
- Junction table for many-to-many relationship
- Links books to multiple categories

## Usage Examples

### Creating a Book with Text Preview
```javascript
// Form data
const formData = new FormData();
formData.append('author', 'John Doe');
formData.append('title', 'Sample Book');
formData.append('price', '29.99');
formData.append('previewType', 'text');
formData.append('previewPages', JSON.stringify([
  {
    page_title: "Introduction",
    text: "Welcome to this amazing book..."
  }
]));
formData.append('coverPage', coverImageFile);
formData.append('categoryIds', JSON.stringify(['category-uuid-1', 'category-uuid-2']));
```

### Creating a Book with Image Preview
```javascript
const formData = new FormData();
formData.append('author', 'Jane Smith');
formData.append('title', 'Visual Guide');
formData.append('price', '39.99');
formData.append('previewType', 'images');
// Add multiple preview images
previewImageFiles.forEach(file => {
  formData.append('previewPages', file);
});
formData.append('coverPage', coverImageFile);
```

### Creating a Book with PDF Preview
```javascript
const formData = new FormData();
formData.append('author', 'Bob Johnson');
formData.append('title', 'Complete Manual');
formData.append('price', '49.99');
formData.append('previewType', 'pdf');
formData.append('previewPdf', pdfFile);
formData.append('coverPage', coverImageFile);
```

## Integration Notes

- The module is fully integrated with the existing authentication and authorization system
- Uses the same Cloudinary configuration for file uploads
- Follows the same error handling patterns as other modules
- Includes comprehensive Swagger documentation
- Database models are automatically synced with the existing database setup

## Security

- Admin endpoints require proper authentication and authorization
- File uploads are validated and processed through Cloudinary
- Input validation using Joi schemas
- SQL injection protection through Sequelize ORM
- CORS and security headers via existing middleware