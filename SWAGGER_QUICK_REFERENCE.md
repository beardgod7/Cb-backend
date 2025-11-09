# Swagger API Quick Reference

## Access Swagger UI

```
http://localhost:8000/api-docs
```

## Quick Testing Guide

### 1. Test Public Endpoints (No Auth Required)

Try these endpoints without authentication:

- `GET /event/events` - Get all events
- `GET /event/events/published` - Get published events
- `GET /films/films` - Get all films
- `GET /library/books` - Get all books
- `GET /museum/artifacts` - Get all artifacts

### 2. Test Authentication

**Step 1: Register a user**
```
POST /auth/signup
Body:
{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Step 2: Login**
```
POST /auth/login
Body:
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**Step 3: Copy the token from response**

**Step 4: Authorize in Swagger**
- Click the "Authorize" button (🔒) at the top
- Enter: `Bearer YOUR_TOKEN_HERE`
- Click "Authorize"

### 3. Test Protected Endpoints

Now you can test authenticated endpoints:

- `POST /eventbooking/book` - Register for an event
- `GET /eventbooking/bookings/user/{userId}` - Get your bookings
- `POST /films/bookings` - Book a film screening
- `GET /payment/history/{userId}` - Get payment history

### 4. Test Admin Endpoints

Admin endpoints require Admin or SuperAdmin role:

- `POST /events/events` - Create an event
- `PUT /events/events/{id}` - Update an event
- `DELETE /events/events/{id}` - Delete an event
- `GET /eventbooking/bookings` - Get all bookings
- `POST /films/admin/films` - Create a film

## Common Request Examples

### Create an Event (Admin)
```json
POST /events/events
Content-Type: multipart/form-data

{
  "Title": "Tech Conference 2024",
  "Organizer": "Tech Community",
  "Description": "Annual technology conference",
  "Location": ["Convention Center", "Hall A"],
  "Date": ["2024-12-15"],
  "Status": "upcoming",
  "isPublished": true,
  "registrationEnabled": true,
  "eventType": "offline",
  "maxAttendees": 500
}
```

### Register for Event
```json
POST /eventbooking/book

{
  "EventId": "event-uuid-here",
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john@example.com",
  "PhoneNumber": "+1234567890",
  "registrationType": "Register"
}
```

### Book a Film Screening
```json
POST /films/bookings

{
  "screeningSlotId": "slot-uuid-here",
  "numberOfSeats": 2
}
```

### Initialize Payment
```json
POST /payment/initialize

{
  "amount": 5000,
  "email": "user@example.com",
  "currency": "NGN",
  "bookingType": "event",
  "bookingId": "booking-uuid-here"
}
```

## Response Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Internal server error

## Tips

1. **Use the "Try it out" button** - Test endpoints directly in Swagger UI
2. **Check the Models section** - See all available schemas
3. **Expand responses** - View example responses for each endpoint
4. **Use filters** - Filter endpoints by tag (Events, Films, etc.)
5. **Download OpenAPI spec** - Available at the top of Swagger UI

## Troubleshooting

### "Unauthorized" Error
- Make sure you've clicked "Authorize" and entered your token
- Verify token format: `Bearer YOUR_TOKEN`
- Check if token is expired (login again)

### "Forbidden" Error
- Your user role doesn't have permission
- Admin endpoints require Admin or SuperAdmin role

### "Validation Error"
- Check required fields in the schema
- Verify data types match the schema
- Ensure dates are in correct format (ISO 8601)

## Module Overview

### Events Module
- Admin routes: `/events/*`
- Public routes: `/event/*`
- Bookings: `/eventbooking/*`

### Films Module
- Public: `/films/films`, `/films/screening-slots`
- User: `/films/bookings`
- Admin: `/films/admin/*`

### Library Module
- Public: `/library/books`, `/library/categories`
- User: `/library/reading-visits`
- Admin: `/library/admin/*`

### Museum Module
- Public: `/museum/artifacts`
- Requests: `/museum/rental-requests`, `/museum/collaboration-requests`
- Admin: `/museum/admin/*`

### Travel Module
- Tours: `/travels/tours/*`
- Trips: `/travels/trips/*`
- Both have public, user, and admin routes

### Payment Module
- Initialize: `/payment/initialize`
- Verify: `/payment/verify/{reference}`
- History: `/payment/history/{userId}`
- Admin: `/payment/admin/*`
- Webhooks: `/payment/webhook/*`

## Next Steps

1. Explore the Swagger UI at `http://localhost:8000/api-docs`
2. Test public endpoints first
3. Create a test account and authenticate
4. Try booking/registration flows
5. Check the detailed documentation in each endpoint

For more details, see [SWAGGER_SETUP.md](./SWAGGER_SETUP.md)
