# Bookstore Module Setup Guide

## Quick Setup

The bookstore module has been successfully added to your application. Here's what was created and how to get started:

## Files Created

### Core Module Files
- `src/features/Bookstore/model.js` - Database models
- `src/features/Bookstore/schema.js` - Validation schemas
- `src/features/Bookstore/repository.js` - Database operations
- `src/features/Bookstore/controller.js` - Request handlers
- `src/features/Bookstore/route.js` - API routes

### Documentation Files
- `src/docs/bookstore.swagger.js` - API documentation
- `BOOKSTORE_MODULE_DOCUMENTATION.md` - Complete module documentation
- `BOOKSTORE_SETUP_GUIDE.md` - This setup guide

## Files Modified

### Integration Files
- `src/routes/index.js` - Added bookstore routes
- `src/config/swagger.js` - Added bookstore API documentation tags
- `src/app.js` - Added model import for database sync

## Database Setup

The bookstore module will automatically create the following tables when you start the server:

1. **BookstoreBooks** - Stores book information
2. **BookstoreCategories** - Stores book categories  
3. **BookstoreBookCategories** - Links books to categories

No manual database migration is required as the models use Sequelize's auto-sync feature.

## Testing the Module

### 1. Start the Server
```bash
npm run dev
```

### 2. Check API Documentation
Visit: `http://localhost:6000/api-docs`
Look for the "Bookstore" sections in the API documentation.

### 3. Test Basic Endpoints

#### Create a Category (Admin required)
```bash
POST /v1/api/bookstore/admin/categories
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Fiction",
  "description": "Fictional books and novels"
}
```

#### Get All Categories (Public)
```bash
GET /v1/api/bookstore/categories
```

#### Create a Book (Admin required)
```bash
POST /v1/api/bookstore/admin/books
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data

# Form fields:
author: "John Doe"
title: "Sample Book"
price: 29.99
shortDescription: "A great book"
previewType: "text"
previewPages: [{"page_title": "Chapter 1", "text": "Sample content"}]
categoryIds: ["category-uuid"]
# Files:
coverPage: [image file]
```

#### Get All Books (Public)
```bash
GET /v1/api/bookstore/books
```

## API Endpoints Summary

### Public Endpoints
- `GET /v1/api/bookstore/categories` - List categories
- `GET /v1/api/bookstore/categories/:id` - Get category details
- `GET /v1/api/bookstore/books` - List books (with filters)
- `GET /v1/api/bookstore/books/featured` - Get featured books
- `GET /v1/api/bookstore/books/:id` - Get book details
- `GET /v1/api/bookstore/books/category/:categoryId` - Books by category

### Admin Endpoints (Require Admin/SuperAdmin role)
- `POST /v1/api/bookstore/admin/categories` - Create category
- `PUT /v1/api/bookstore/admin/categories/:id` - Update category
- `DELETE /v1/api/bookstore/admin/categories/:id` - Delete category
- `POST /v1/api/bookstore/admin/books` - Create book
- `PUT /v1/api/bookstore/admin/books/:id` - Update book
- `DELETE /v1/api/bookstore/admin/books/:id` - Delete book

## Frontend Integration Tips

### Book Upload Form
```javascript
const uploadBook = async (bookData, files) => {
  const formData = new FormData();
  
  // Add text fields
  Object.keys(bookData).forEach(key => {
    if (key === 'categoryIds' || key === 'editors') {
      formData.append(key, JSON.stringify(bookData[key]));
    } else {
      formData.append(key, bookData[key]);
    }
  });
  
  // Add files
  if (files.coverPage) {
    formData.append('coverPage', files.coverPage);
  }
  
  if (files.previewPages) {
    files.previewPages.forEach(file => {
      formData.append('previewPages', file);
    });
  }
  
  const response = await fetch('/v1/api/bookstore/admin/books', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return response.json();
};
```

### Book Listing with Filters
```javascript
const getBooks = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.featured) params.append('featured', 'true');
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  
  const response = await fetch(`/v1/api/bookstore/books?${params}`);
  return response.json();
};
```

## Environment Variables

No additional environment variables are required. The module uses the existing:
- `DATABASE_URL` - For database connection
- Cloudinary configuration - For file uploads

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure your `DATABASE_URL` is correctly set
   - Check database server is running

2. **File Upload Issues**
   - Verify Cloudinary configuration
   - Check file size limits in your server configuration

3. **Authentication Errors**
   - Ensure you're using a valid JWT token
   - Check user has Admin or SuperAdmin role for admin endpoints

4. **Model Sync Issues**
   - The models should auto-sync when the server starts
   - Check server logs for any Sequelize errors

### Logs to Check
- Server startup logs for model synchronization
- Cloudinary upload logs for file processing
- Authentication middleware logs for permission issues

## Next Steps

1. **Test the API endpoints** using the Swagger documentation
2. **Create some sample categories** to organize books
3. **Upload test books** with different preview types
4. **Integrate with your frontend** application
5. **Set up proper error handling** in your frontend
6. **Consider adding pagination** for large book collections

The bookstore module is now ready to use! Check the complete documentation in `BOOKSTORE_MODULE_DOCUMENTATION.md` for detailed information about all features and capabilities.