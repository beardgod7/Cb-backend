# Event Management API Documentation

## Overview

This API provides comprehensive event management capabilities including event creation, registration, volunteer management, and admin controls.

## Base URL

```
http://localhost:8000/v1/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Events Endpoints

### Admin Routes (Require Admin/SuperAdmin Role)

#### Create Event
```http
POST /events/events
Authorization: Required (Admin/SuperAdmin)
Content-Type: multipart/form-data
```

**Body:**
```json
{
  "Title": "Community Gathering",
  "Organizer": "Community Center",
  "Description": "Annual community event",
  "Location": ["123 Main St", "City Hall"],
  "Date": ["2024-12-25"],
  "EventHighlights": ["Food", "Music", "Games"],
  "Status": "upcoming",
  "isPublished": false,
  "registrationEnabled": true,
  "volunteerEnabled": true,
  "eventType": "offline",
  "maxAttendees": 100,
  "registrationDeadline": "2024-12-20T23:59:59Z",
  "Images": [<file>, <file>]
}
```

#### Update Event
```http
PUT /events/events/:EventId
Authorization: Required (Admin/SuperAdmin)
Content-Type: multipart/form-data
```

#### Delete Event
```http
DELETE /events/events/:id
Authorization: Required (Admin/SuperAdmin)
```

#### Publish Event
```http
POST /events/events/publish/:id
Authorization: Required (Admin/SuperAdmin)
```

**Response:**
```json
{
  "message": "Event published successfully",
  "event": { ... }
}
```

#### Unpublish Event
```http
POST /events/events/unpublish/:id
Authorization: Required (Admin/SuperAdmin)
```

#### Duplicate Event
```http
POST /events/events/duplicate/:id
Authorization: Required (Admin/SuperAdmin)
```

**Response:**
```json
{
  "message": "Event duplicated successfully",
  "event": { ... }
}
```

#### Get Event Statistics
```http
GET /events/events/stats/:id
Authorization: Required (Admin/SuperAdmin)
```

**Response:**
```json
{
  "message": "Event statistics retrieved successfully",
  "data": {
    "eventId": "uuid",
    "title": "Event Title",
    "status": "upcoming",
    "isPublished": true,
    "registrationEnabled": true,
    "volunteerEnabled": true,
    "maxAttendees": 100,
    "currentRegistrations": 45,
    "availableSpots": 55,
    "registrationDeadline": "2024-12-20T23:59:59Z"
  }
}
```

#### Get Draft Events
```http
GET /events/events/drafts
Authorization: Required (Admin/SuperAdmin)
```

### Public Routes

#### Get All Events
```http
GET /event/events
```

**Query Parameters:**
- `status`: Filter by "past" or "upcoming"
- `published`: Filter by "true" or "false"

#### Get Published Events
```http
GET /event/events/published
```

#### Get Past Events
```http
GET /event/events/past
```

#### Get Upcoming Events
```http
GET /event/events/upcoming
```

#### Get Event by ID
```http
GET /event/events/:id
```

---

## Event Registration (Booking) Endpoints

### User Routes

#### Register for Event
```http
POST /eventbooking/book
Authorization: Required (User)
Content-Type: application/json
```

**Body:**
```json
{
  "EventId": "event-uuid",
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john@example.com",
  "PhoneNumber": "+1234567890",
  "registrationType": "Register",
  "customField1": "value1",
  "customField2": "value2"
}
```

**registrationType options:**
- `Register` - Regular attendee
- `Volunteer` - Volunteer registration
- `Sponsor` - Sponsor registration

**Response:**
```json
{
  "message": "Registration successful! Confirmation email sent.",
  "booking": { ... }
}
```

**Validation:**
- Checks if event is published
- Checks if registration is enabled
- Checks if volunteer registration is allowed (for volunteers)
- Checks registration deadline
- Checks for duplicate registrations
- Checks event capacity

#### Get User's Bookings
```http
GET /eventbooking/bookings/user/:userId
Authorization: Required
```

#### Get Booking by ID
```http
GET /eventbooking/bookings/:id
Authorization: Required
```

#### Delete Booking
```http
DELETE /eventbooking/bookings/:id
Authorization: Required
```

### Admin Routes

#### Get All Bookings
```http
GET /eventbooking/bookings
Authorization: Required (Admin/SuperAdmin)
```

#### Get Bookings by Event
```http
GET /eventbooking/bookings/event/:eventId
Authorization: Required (Admin/SuperAdmin)
```

#### Export Attendees to CSV
```http
GET /eventbooking/export/:eventId
Authorization: Required (Admin/SuperAdmin)
```

**Response:** CSV file download

#### Send Broadcast Email
```http
POST /eventbooking/broadcast/:eventId
Authorization: Required (Admin/SuperAdmin)
Content-Type: application/json
```

**Body:**
```json
{
  "subject": "Important Update",
  "message": "This is a broadcast message to all attendees..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Broadcast sent to 45 attendees"
}
```

#### Send Event Update Email
```http
POST /eventbooking/update-email/:eventId
Authorization: Required (Admin/SuperAdmin)
Content-Type: application/json
```

**Body:**
```json
{
  "updateMessage": "The event time has been changed to 3 PM..."
}
```

#### Update Booking Status
```http
PATCH /eventbooking/bookings/:id/status
Authorization: Required (Admin/SuperAdmin)
Content-Type: application/json
```

**Body:**
```json
{
  "attendanceStatus": "confirmed"
}
```

**attendanceStatus options:**
- `registered` - Initial registration
- `confirmed` - Confirmed attendance
- `attended` - Actually attended
- `cancelled` - Cancelled registration

#### Get Registration Statistics
```http
GET /eventbooking/stats/:eventId
Authorization: Required (Admin/SuperAdmin)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "registered": 30,
    "volunteers": 10,
    "sponsors": 5
  }
}
```

---

## Form Field Templates

### Create/Update Form Template
```http
POST /eventbooking/admin/form-fields
Authorization: Required (Admin/SuperAdmin)
Content-Type: application/json
```

**Body:**
```json
{
  "EventId": "event-uuid",
  "isGlobal": false,
  "fields": [
    {
      "name": "dietaryRestrictions",
      "label": "Dietary Restrictions",
      "type": "text",
      "required": false
    },
    {
      "name": "tshirtSize",
      "label": "T-Shirt Size",
      "type": "select",
      "options": ["S", "M", "L", "XL"],
      "required": true
    }
  ]
}
```

### Get Form Template
```http
GET /eventbooking/admin/:EventId
Authorization: Required (Admin/SuperAdmin)
```

---

## Albums Endpoints

### Admin Routes

#### Create Album
```http
POST /events/albums
Authorization: Required (Admin/SuperAdmin)
Content-Type: multipart/form-data
```

#### Update Album
```http
PUT /events/albums/:AlbumId
Authorization: Required (Admin/SuperAdmin)
Content-Type: multipart/form-data
```

#### Delete Album
```http
DELETE /events/albums/:id
Authorization: Required (Admin/SuperAdmin)
```

### Public Routes

#### Get All Albums
```http
GET /event/albums
```

#### Get Album by ID
```http
GET /event/albums/:id
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Event is not available for registration"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden: You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "message": "Event not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error",
  "error": "Error details..."
}
```

---

## Email Notifications

The system automatically sends emails for:

1. **Registration Confirmation** - Sent when user registers for an event
2. **Volunteer Confirmation** - Special email for volunteer registrations
3. **Broadcast Messages** - Admin can send to all attendees
4. **Event Updates** - Admin can send event updates

All emails are sent using SendGrid and include both text and HTML versions.

---

## Notes

- All dates should be in ISO 8601 format
- File uploads support up to 5 images per event/album
- CSV exports include all booking data including custom metadata fields
- Dynamic form fields are stored in the `metadata` JSONB column
- Registration validation happens before booking creation
