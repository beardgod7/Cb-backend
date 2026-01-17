# Library Swagger Examples Fix

## Corrected cURL Request with Proper Examples:

```bash
curl -X 'POST' \
  'https://cb-backend-qwxd.onrender.com/v1/api/library/admin/books' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: multipart/form-data' \
  -F 'title=Things Fall Apart' \
  -F 'author=Chinua Achebe' \
  -F 'yearOfPublication=1958' \
  -F 'description=A classic novel about pre-colonial life in Nigeria and the impact of colonialism' \
  -F 'previewPagesType=text' \
  -F 'previewPagesText=[{"page_title":"Chapter 1","text":"Okonkwo was well known throughout the nine villages and even beyond..."}]' \
  -F 'tableOfContentsType=text' \
  -F 'tableOfContentsText=["Chapter 1: The Beginning","Chapter 2: The Village","Chapter 3: The Conflict","Chapter 4: The Resolution"]' \
  -F 'abstractPreviewType=text' \
  -F 'abstractPreviewText=This novel explores the impact of colonialism on traditional African society through the story of Okonkwo, a respected warrior.' \
  -F 'otherPreviewPagesType=text' \
  -F 'otherPreviewPagesText=[{"page_title":"About the Author","text":"Chinua Achebe was a Nigerian novelist, poet, and critic who is regarded as a central figure of modern African literature."}]' \
  -F 'scheduledVisitDate=2024-12-25' \
  -F 'categoryIds=["550e8400-e29b-41d4-a716-446655440000","550e8400-e29b-41d4-a716-446655440001"]' \
  -F 'isPreviewVisible=true' \
  -F 'isFeatured=true' \
  -F 'isMostPopular=false' \
  -F 'isActive=true' \
  -F 'coverImage=@book_cover.jpg;type=image/jpeg'
```

## Key Points:

### 1. Text Content Examples:
- **previewPagesText**: `[{"page_title":"Chapter 1","text":"Content here..."}]`
- **tableOfContentsText**: `["Chapter 1","Chapter 2","Chapter 3"]`
- **abstractPreviewText**: `"Plain text description"`
- **otherPreviewPagesText**: `[{"page_title":"About","text":"Info here..."}]`

### 2. Required Fields:
- `title` and `author` are required
- Use actual meaningful values, not "string"

### 3. Category IDs:
- Must be valid UUIDs in JSON array format
- Example: `["550e8400-e29b-41d4-a716-446655440000"]`

### 4. Boolean Fields:
- Use `true` or `false`, not strings

### 5. File Uploads:
- Use actual file paths with proper MIME types
- Example: `@book_cover.jpg;type=image/jpeg`

## Alternative: Using Images Instead of Text

```bash
# For image-based preview pages:
-F 'previewPagesType=images' \
-F 'previewPagesImages=@page1.jpg' \
-F 'previewPagesImages=@page2.jpg' \

# For PDF-based content:
-F 'tableOfContentsType=pdf' \
-F 'tableOfContentsPdf=@table_of_contents.pdf' \
```

## Common Mistakes to Avoid:

❌ Don't use: `"string"` as literal values
❌ Don't use: `categoryIds=string`
❌ Don't use: Invalid JSON like `"documentary"` without brackets
❌ Don't send: Empty file fields when not needed

✅ Do use: Actual content values
✅ Do use: Valid JSON arrays for categoryIds
✅ Do use: Proper file uploads with correct MIME types