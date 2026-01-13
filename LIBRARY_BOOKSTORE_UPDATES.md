# Library and Bookstore Module Updates

## Overview
Both the Library and Bookstore modules have been enhanced with flexible content management capabilities and improved organization.

## Library Module Updates

### New Fields Added to Library Books

#### Content Fields with Flexible Types
All content fields now support three different formats:

1. **Text Format**: Array of objects or plain text
2. **Images Format**: Array of uploaded image files
3. **PDF Format**: Single PDF file upload

#### New Book Fields

1. **Preview Pages** (Enhanced)
   - `previewPages`: JSONB field storing content
   - `previewPagesType`: Enum (text, images, pdf)
   - Supports: `{page_title, text}` objects, image URLs, or PDF URL

2. **Table of Contents** (Enhanced)
   - `tableOfContents`: JSONB field storing content
   - `tableOfContentsType`: Enum (text, images, pdf)
   - Supports: Text array, image URLs, or PDF URL

3. **Abstract Preview** (New)
   - `abstractPreview`: JSONB field storing content
   - `abstractPreviewType`: Enum (text, images, pdf)
   - Supports: Plain text, image URLs, or PDF URL

4. **Other Preview Pages** (New)
   - `otherPreviewPages`: JSONB field storing content
   - `otherPreviewPagesType`: Enum (text, images, pdf)
   - Supports: Various content formats

5. **Scheduled Visit Date** (New)
   - `scheduledVisitDate`: Date field for library visit scheduling

6. **Most Popular Flag** (New)
   - `isMostPopular`: Boolean flag for popular books

### New API Endpoints

#### Public Endpoints
- `GET /api/library/books/popular` - Get most popular books

#### File Upload Support
Enhanced file upload support for all content types:
- `coverImage` - Cover image file
- `previewPages` - Multiple preview page images
- `previewPagesPdf` - Preview pages PDF
- `tableOfContents` - Table of contents images
- `tableOfContentsPdf` - Table of contents PDF
- `abstractPreview` - Abstract preview images
- `abstractPreviewPdf` - Abstract preview PDF
- `otherPreviewPages` - Other preview images
- `otherPreviewPagesPdf` - Other preview PDF

## Bookstore Module Features

### Complete Book Management System

#### Book Fields
- **Author**: Book author name
- **Title**: Book title
- **Price**: Decimal pricing with 2 decimal places
- **Short Description**: Brief summary (max 500 chars)
- **Long Description**: Detailed description
- **Number of Chapters**: Integer field
- **Number of Pages**: Integer field
- **Number of Parts**: Integer field
- **Editors**: Array of editor names
- **Cover Page**: Uploaded cover image
- **Preview Pages**: Flexible content (text/images/PDF)
- **Categories**: Multiple category assignment
- **Featured Status**: Boolean flag
- **Active Status**: Boolean flag

#### Preview Pages Support
Three types of preview content:
1. **Text**: Array of `{page_title, text}` objects
2. **Images**: Array of uploaded image files
3. **PDF**: Single PDF file

### API Endpoints

#### Public Endpoints
- `GET /api/bookstore/categories` - List categories
- `GET /api/bookstore/categories/:id` - Get category details
- `GET /api/bookstore/books` - List books with filters
- `GET /api/bookstore/books/featured` - Featured books
- `GET /api/bookstore/books/:id` - Book details
- `GET /api/bookstore/books/category/:categoryId` - Books by category

#### Admin Endpoints
- `POST /api/bookstore/admin/categories` - Create category
- `PUT /api/bookstore/admin/categories/:id` - Update category
- `DELETE /api/bookstore/admin/categories/:id` - Delete category
- `POST /api/bookstore/admin/books` - Create book
- `PUT /api/bookstore/admin/books/:id` - Update book
- `DELETE /api/bookstore/admin/books/:id` - Delete book

#### Query Parameters for Books
- `categoryId` - Filter by category
- `search` - Search in title, author, description
- `featured` - Filter featured books
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

## Database Changes

### Library Module
- Enhanced `Books` table with new JSONB fields
- Added type enum fields for content format specification
- Added `isMostPopular` and `scheduledVisitDate` fields

### Bookstore Module
- New `BookstoreBooks` table with comprehensive book information
- New `BookstoreCategories` table for organization
- New `BookstoreBookCategories` junction table for many-to-many relationships

## File Upload Configuration

### Library Module
Updated to support multiple file types per content field:
```javascript
upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "previewPages", maxCount: 20 },
  { name: "previewPagesPdf", maxCount: 1 },
  { name: "tableOfContents", maxCount: 20 },
  { name: "tableOfContentsPdf", maxCount: 1 },
  { name: "abstractPreview", maxCount: 20 },
  { name: "abstractPreviewPdf", maxCount: 1 },
  { name: "otherPreviewPages", maxCount: 20 },
  { name: "otherPreviewPagesPdf", maxCount: 1 },
])
```

### Bookstore Module
Supports cover page and preview content uploads:
```javascript
upload.fields([
  { name: "coverPage", maxCount: 1 },
  { name: "previewPages", maxCount: 20 },
  { name: "previewPdf", maxCount: 1 },
])
```

## Swagger Documentation Updates

### Library Module
- Updated to use `Library - Public` and `Library - Admin` tags
- Comprehensive schema definitions for all new fields
- Detailed file upload documentation
- Examples for different content types

### Bookstore Module
- Complete API documentation with examples
- Schema definitions for all models
- File upload specifications
- Query parameter documentation

## Usage Examples

### Library Book with Multiple Content Types

```javascript
const formData = new FormData();
formData.append('title', 'Advanced Programming');
formData.append('author', 'John Doe');

// Text preview pages
formData.append('previewPagesType', 'text');
formData.append('previewPages', JSON.stringify([
  { page_title: "Chapter 1", text: "Introduction to programming..." }
]));

// Image table of contents
formData.append('tableOfContentsType', 'images');
tableOfContentsImages.forEach(file => {
  formData.append('tableOfContents', file);
});

// PDF abstract
formData.append('abstractPreviewType', 'pdf');
formData.append('abstractPreviewPdf', abstractPdfFile);

// Cover image
formData.append('coverImage', coverImageFile);

// Flags
formData.append('isFeatured', 'true');
formData.append('isMostPopular', 'true');
formData.append('scheduledVisitDate', '2024-12-25');
```

### Bookstore Book with Price and Categories

```javascript
const formData = new FormData();
formData.append('author', 'Jane Smith');
formData.append('title', 'Business Strategy');
formData.append('price', '49.99');
formData.append('shortDescription', 'Essential business strategies');
formData.append('numberOfChapters', '12');
formData.append('numberOfPages', '350');
formData.append('editors', JSON.stringify(['Editor 1', 'Editor 2']));

// Image preview pages
formData.append('previewType', 'images');
previewImages.forEach(file => {
  formData.append('previewPages', file);
});

formData.append('coverPage', coverImageFile);
formData.append('categoryIds', JSON.stringify(['category-uuid-1']));
formData.append('isFeatured', 'true');
```

## Integration Notes

1. **Database Migration**: Models will auto-sync when server starts
2. **File Storage**: All files uploaded to Cloudinary with organized folder structure
3. **Validation**: Comprehensive Joi validation for all fields
4. **Error Handling**: Consistent error responses across both modules
5. **Authentication**: Admin endpoints require proper role-based access
6. **Search**: Full-text search capabilities in both modules

## Testing

Both modules are fully integrated and ready for testing:

1. Start the server: `npm run dev`
2. Visit Swagger UI: `http://localhost:6000/api-docs`
3. Test endpoints using the interactive documentation
4. Upload files using multipart/form-data requests

The enhanced modules provide comprehensive content management capabilities while maintaining backward compatibility and following established patterns in your application.