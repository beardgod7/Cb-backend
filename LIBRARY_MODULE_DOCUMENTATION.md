# CBAAC Online Library Module Documentation

## Overview

The CBAAC Online Library is a book discovery and scheduling platform that allows visitors to explore the library's collection, view book previews, and schedule reading visits. It's **not a full e-library** but a catalog system with preview functionality.

---

## Features

### For Visitors (Public)
- ✅ Browse book catalog
- ✅ Search books by title, author, or description
- ✅ Filter books by category
- ✅ View book details and previews
- ✅ Navigate through preview pages
- ✅ View table of contents
- ✅ Book a reading visit
- ✅ Contact librarian

### For Admins
- ✅ Manage categories (create, edit, delete)
- ✅ Manage books (add, edit, delete)
- ✅ Upload cover images and preview pages
- ✅ Toggle preview visibility
- ✅ Mark featured books
- ✅ Manage reading visit bookings
- ✅ View and respond to contact messages
- ✅ Export booking data

---

## Database Schema

### Tables

**1. Categories**
```sql
CREATE TABLE "Categories" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) UNIQUE NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. Books**
```sql
CREATE TABLE "Books" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "author" VARCHAR(255) NOT NULL,
  "yearOfPublication" INTEGER,
  "description" TEXT,
  "coverImage" VARCHAR(1000),
  "previewPages" TEXT[],
  "tableOfContents" TEXT,
  "isPreviewVisible" BOOLEAN DEFAULT true,
  "isFeatured" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  "createdBy" UUID,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**3. BookCategories** (Junction Table)
```sql
CREATE TABLE "BookCategories" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "bookId" UUID NOT NULL REFERENCES "Books"("id") ON DELETE CASCADE,
  "categoryId" UUID NOT NULL REFERENCES "Categories"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**4. ReadingVisits**
```sql
CREATE TABLE "ReadingVisits" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "bookId" UUID REFERENCES "Books"("id") ON DELETE SET NULL,
  "userId" UUID,
  "fullName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phoneNumber" VARCHAR(50) NOT NULL,
  "preferredDate" DATE NOT NULL,
  "message" TEXT,
  "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'confirmed', 'completed', 'cancelled')),
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**5. LibrarianContacts**
```sql
CREATE TABLE "LibrarianContacts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "subject" VARCHAR(255),
  "message" TEXT NOT NULL,
  "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'responded', 'resolved')),
  "adminResponse" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
CREATE INDEX idx_books_title ON "Books"("title");
CREATE INDEX idx_books_author ON "Books"("author");
CREATE INDEX idx_books_featured ON "Books"("isFeatured");
CREATE INDEX idx_bookcategories_book ON "BookCategories"("bookId");
CREATE INDEX idx_bookcategories_category ON "BookCategories"("categoryId");
CREATE INDEX idx_readingvisits_date ON "ReadingVisits"("preferredDate");
CREATE INDEX idx_readingvisits_status ON "ReadingVisits"("status");
```

---

## API Endpoints

### Public Routes

#### Categories
```
GET    /v1/api/library/categories           - Get all categories
GET    /v1/api/library/categories/:id       - Get category details
```

#### Books
```
GET    /v1/api/library/books                - Get all books
GET    /v1/api/library/books/featured       - Get featured books
GET    /v1/api/library/books/:id            - Get book details
GET    /v1/api/library/books/category/:categoryId - Get books by category
```

**Query Parameters for `/books`:**
- `search` - Search by title, author, or description
- `categoryId` - Filter by category
- `featured` - Show only featured books (true/false)

#### Reading Visits
```
POST   /v1/api/library/reading-visits/book  - Book a reading visit
```

#### Contact
```
POST   /v1/api/library/contact-librarian    - Contact librarian
```

### User Routes (Authenticated)

```
GET    /v1/api/library/reading-visits/user/:userId - Get user's reading visits
```

### Admin Routes

#### Categories Management
```
POST   /v1/api/library/admin/categories     - Create category
PUT    /v1/api/library/admin/categories/:id - Update category
DELETE /v1/api/library/admin/categories/:id - Delete category
```

#### Books Management
```
POST   /v1/api/library/admin/books          - Create book
PUT    /v1/api/library/admin/books/:id      - Update book
DELETE /v1/api/library/admin/books/:id      - Delete book
```

#### Reading Visits Management
```
GET    /v1/api/library/admin/reading-visits - Get all reading visits
PATCH  /v1/api/library/admin/reading-visits/:id - Update visit status
```

#### Contacts Management
```
GET    /v1/api/library/admin/contacts       - Get all contacts
PATCH  /v1/api/library/admin/contacts/:id   - Update contact status
```

---

## Usage Examples

### 1. Create a Category (Admin)

```javascript
POST /v1/api/library/admin/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "African History",
  "description": "Books about African history and culture"
}
```

### 2. Add a Book (Admin)

```javascript
POST /v1/api/library/admin/books
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "yearOfPublication": 1958,
  "description": "A classic novel about pre-colonial life in Nigeria",
  "tableOfContents": "Chapter 1: The Beginning\nChapter 2: The Village...",
  "isPreviewVisible": true,
  "isFeatured": true,
  "categoryIds": ["category-uuid-1", "category-uuid-2"],
  "coverImage": <file>,
  "previewPages": [<file1>, <file2>, <file3>]
}
```

### 3. Search Books (Public)

```javascript
GET /v1/api/library/books?search=achebe&categoryId=category-uuid

// Response:
{
  "message": "Books retrieved successfully",
  "data": [
    {
      "id": "book-uuid",
      "title": "Things Fall Apart",
      "author": "Chinua Achebe",
      "yearOfPublication": 1958,
      "description": "...",
      "coverImage": "https://...",
      "previewPages": ["https://...", "https://..."],
      "isPreviewVisible": true,
      "isFeatured": true,
      "Categories": [
        {
          "id": "category-uuid",
          "name": "African Literature"
        }
      ]
    }
  ]
}
```

### 4. Book a Reading Visit (Public)

```javascript
POST /v1/api/library/reading-visits/book
Content-Type: application/json

{
  "bookId": "book-uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+234800000000",
  "preferredDate": "2024-12-25",
  "message": "I would like to read this book"
}

// Response:
{
  "message": "Reading visit booked successfully. Confirmation email sent.",
  "visit": {
    "id": "visit-uuid",
    "bookId": "book-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "preferredDate": "2024-12-25",
    "status": "pending"
  }
}
```

### 5. Contact Librarian (Public)

```javascript
POST /v1/api/library/contact-librarian
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Book Recommendation",
  "message": "Can you recommend books about African art?"
}
```

### 6. Get Featured Books (Public)

```javascript
GET /v1/api/library/books/featured

// Response:
{
  "message": "Featured books retrieved successfully",
  "data": [
    {
      "id": "book-uuid",
      "title": "Things Fall Apart",
      "author": "Chinua Achebe",
      "coverImage": "https://...",
      "description": "...",
      "isFeatured": true
    }
  ]
}
```

---

## User Flow

### Visitor Journey

1. **Landing Page**
   - View featured books
   - See search bar and category filters

2. **Browse Books**
   - Search by keyword
   - Filter by category
   - View book cards (cover, title, author)

3. **Book Details Page**
   - View cover image
   - Read description
   - See preview pages (if visible)
   - Navigate through preview pages (Next/Previous)

4. **Preview Navigation**
   - Click through preview pages
   - View table of contents
   - Reach end of preview

5. **Book a Reading Visit**
   - Fill out booking form
   - Select preferred date
   - Submit booking
   - Receive confirmation email

6. **Contact Librarian** (Optional)
   - Fill contact form
   - Submit inquiry
   - Librarian receives notification

---

## Admin Dashboard Features

### Book Management
- Add new books with metadata
- Upload cover images (1 per book)
- Upload preview pages (up to 20 per book)
- Toggle preview visibility (to manage storage costs)
- Mark books as featured
- Assign multiple categories
- Edit or delete books

### Category Management
- Create new categories
- Edit category names and descriptions
- Delete categories
- View books per category

### Reading Visits Management
- View all booking requests
- Filter by status (pending, confirmed, completed, cancelled)
- Update visit status
- Add admin notes
- Export booking data

### Contact Management
- View all contact messages
- Mark as responded/resolved
- Add admin responses
- Export contact data

---

## Storage Optimization

To minimize costs:

1. **Limited Preview Pages**: Max 20 pages per book
2. **Toggle Visibility**: Admins can hide previews for less popular books
3. **Cloud Storage**: Use efficient cloud storage (Cloudinary)
4. **Image Optimization**: Compress images before upload
5. **Lazy Loading**: Load preview pages on demand

---

## Environment Variables

Add to `.env`:

```env
# Librarian Email
LIBRARIAN_EMAIL=librarian@cbaac.org

# Already configured
SENDGRID_API_KEY=your_sendgrid_key
SENDER_EMAIL=noreply@cbaac.org
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Frontend Integration

### Book Preview Component

```jsx
// Example React component
function BookPreview({ bookId }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`/v1/api/library/books/${bookId}`)
      .then(res => res.json())
      .then(data => setBook(data.data));
  }, [bookId]);

  if (!book) return <div>Loading...</div>;

  const totalPages = book.previewPages.length;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <div>
      <img src={book.previewPages[currentPage]} alt={`Page ${currentPage + 1}`} />
      
      <div>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        
        <span>Page {currentPage + 1} of {totalPages}</span>
        
        {isLastPage ? (
          <button onClick={() => navigate('/book-reading-visit')}>
            Book a Date to Read
          </button>
        ) : (
          <button onClick={() => setCurrentPage(prev => prev + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Future Enhancements

- Multi-language support
- Downloadable reading schedule confirmation
- Newsletter integration for new books
- Analytics for popular books
- Book recommendations based on reading history
- QR code for quick book lookup
- Mobile app integration

---

## Notes

- Books are **not downloadable** - only preview pages are shown
- Full books can only be read during physical visits
- Preview visibility can be toggled to manage storage costs
- All admin routes require Admin or SuperAdmin role
- Reading visit bookings send automatic confirmation emails
- Librarian receives notifications for contact messages

---

## Support

For issues or questions, contact the development team.
