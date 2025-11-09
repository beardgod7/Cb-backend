# Swagger Schema Corrections Summary

## Completed Corrections

### ✅ Authentication (src/docs/auth.swagger.js)
- Fixed signup schema (removed firstName/lastName)
- Fixed login (uses `identifier` not `email`)
- Fixed refresh token (uses `refresh_token`)
- Fixed reset password (uses `password` not `newPassword`)
- Removed Driver and TruckOwner roles

### ✅ Event Bookings (src/docs/bookings.swagger.js)
- Only EventId is required
- All other fields optional

### ✅ Events (src/docs/events.swagger.js)
- Only Description and Location required
- Fixed Status enum to [past, upcoming]
- Added file upload support for Images

### ✅ Films (src/docs/films.swagger.js)
- Completely rewritten to match schema
- Required: title, fullDescription, category, ticketPrice
- Proper file upload fields

### ✅ Library (src/docs/library.swagger.js)
- Fixed Book schema - removed isbn, publisher, language, pages, availableCopies
- Added actual fields: yearOfPublication, tableOfContents, isPreviewVisible, categoryIds
- Required: title, author
- categoryIds as JSON string for multipart/form-data

### ✅ Museum (src/docs/museum.swagger.js)
- Completely rewritten
- Required: identificationNumber, title, country, category, fullDescription
- Added all actual fields: era, yearOrPeriod, shortDescription, tags
- tags as JSON string for multipart/form-data
- Fixed rental request schema

## Remaining Issues

### Tours (src/docs/travels.swagger.js)
**Actual Schema Requirements:**
- Required: title, fullDescription, pricePerTicket, meetingPoint, availableDays
- availableDays: array of weekday names (min 1, max 2)
- Has: shortDescription, duration, startTime, mapLink (URI), images, isActive

**Current Swagger Issues:**
- Missing required fields in create endpoint
- availableDays needs to be JSON string in multipart
- Missing field descriptions

### Trips (src/docs/travels.swagger.js)
**Actual Schema Requirements:**
- Required: title, destination, destinationType, fullDescription, startDate, endDate, pricePerPerson
- destinationType: enum [local, international]
- Has: shortDescription, itinerary (complex array), mapLink, images, maxParticipants, isActive

**Current Swagger Issues:**
- Missing destinationType field
- Missing itinerary field (complex nested structure)
- itinerary needs special handling as JSON string

## Key Patterns for Arrays in Multipart/Form-Data

When a field is an array in the schema but needs to be sent via multipart/form-data:

```yaml
fieldName:
  type: string
  description: 'JSON array of items, e.g., ["item1", "item2"]'
  example: '["value1", "value2"]'
```

Examples:
- Location: `'["Convention Center", "Hall A"]'`
- Date: `'["2024-12-25"]'`
- categoryIds: `'["uuid1", "uuid2"]'`
- tags: `'["tag1", "tag2"]'`
- availableDays: `'["Monday", "Tuesday"]'`

## Testing Checklist

After all corrections:
1. ✅ POST /auth/signup - with email and password only
2. ✅ POST /auth/login - with identifier field
3. ✅ POST /eventbooking/book - with only EventId
4. ✅ POST /events/events - with Description and Location as JSON strings
5. ✅ POST /films/admin/films - with all required fields
6. ✅ POST /library/admin/books - with title and author
7. ✅ POST /museum/admin/artifacts - with all 5 required fields
8. ⏳ POST /travels/tours/admin/tours - needs fixing
9. ⏳ POST /travels/trips/admin/trips - needs fixing

## Next Steps

1. Fix Tours swagger documentation
2. Fix Trips swagger documentation
3. Test all endpoints in Swagger UI
4. Commit and push all changes
5. Verify on production
