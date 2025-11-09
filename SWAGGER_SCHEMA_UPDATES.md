# Swagger Schema Updates Summary

## Completed Updates

### Authentication (src/docs/auth.swagger.js)
✅ **Signup** - Fixed to match actual schema:
- Required: `email`, `password`
- Optional: `username`, `phoneNumber`, `role`
- Removed: `firstName`, `lastName` (not in actual schema)

✅ **Login** - Fixed field name:
- Changed `email` to `identifier` (can be email or username)
- Password minimum length: 8

✅ **Refresh Token** - Fixed field name:
- Changed `refreshToken` to `refresh_token`

✅ **Reset Password** - Fixed field name:
- Changed `newPassword` to `password`
- Minimum length: 6

### Event Bookings (src/docs/bookings.swagger.js)
✅ **EventBooking Schema** - Fixed requirements:
- Only `EventId` is required
- All other fields (`FirstName`, `LastName`, `Email`, `PhoneNumber`, `registrationType`) are optional
- Added maxLength constraints (255)
- Removed `metadata` from schema (handled with `.unknown(true)` in Joi)

### Events (src/docs/events.swagger.js)
✅ **Event Schema** - Fixed requirements:
- Required: `Description`, `Location`
- All other fields are optional
- Fixed Status enum: `[past, upcoming]` (removed `cancelled`)
- Added nullable support for `maxAttendees` and `registrationDeadline`

### Films (src/docs/films.swagger.js)
✅ **Completely rewritten** to match actual schema:
- Required fields: `title`, `fullDescription`, `category`, `ticketPrice`
- Added all actual fields from schema
- Fixed booking schema to include all required fields
- Fixed inquiry schema

## Schemas That Need Review/Update

### Library (src/docs/library.swagger.js)
**Book Schema** - Needs update:
- Actual required: `title`, `author`
- Has: `yearOfPublication`, `categoryIds`, `tableOfContents`, `isPreviewVisible`

**Reading Visit** - Needs update:
- Required: `fullName`, `email`, `phoneNumber`, `preferredDate`
- Optional: `bookId`, `message`

### Museum (src/docs/museum.swagger.js)
**Artifact Schema** - Needs update:
- Required: `identificationNumber`, `title`, `country`, `category`, `fullDescription`
- Has: `era`, `yearOrPeriod`, `shortDescription` (max 500)

**Rental Request** - Needs update:
- Required: `artifactId`, `fullName`, `email`, `phoneNumber`, `purposeOfRental`, `startDate`, `endDate`
- `endDate` must be >= `startDate`

### Tours (src/docs/travels.swagger.js)
**Tour Schema** - Needs update:
- Required: `title`, `fullDescription`, `pricePerTicket`, `meetingPoint`, `availableDays`
- `availableDays`: array of weekday names, min 1, max 2
- Has: `mapLink` (URI), `duration`, `startTime`

**Tour Booking** - Needs update:
- Required: `tourId`, `fullName`, `email`, `phoneNumber`, `selectedDate`, `numberOfTickets`

### Trips (src/docs/travels.swagger.js)
**Trip Schema** - Needs update:
- Required: `title`, `destination`, `destinationType`, `fullDescription`, `startDate`, `endDate`, `pricePerPerson`
- `destinationType`: enum `[local, international]`
- `endDate` must be >= `startDate`
- Has: `itinerary` array with day, title, description, activities

**Trip Booking** - Needs update:
- Required: `tripId`, `fullName`, `email`, `phoneNumber`, `numberOfTickets`

## Key Differences Found

1. **Authentication**: No `firstName`/`lastName` in signup
2. **Login**: Uses `identifier` not `email`
3. **Event Bookings**: Only `EventId` required, everything else optional
4. **Events**: Only `Description` and `Location` required
5. **Films**: Completely different schema than documented
6. **All Bookings**: Use `fullName` (single field) not `firstName`/`lastName`

## Testing Recommendations

After updates, test these endpoints:
1. POST /auth/signup - with minimal fields (email, password)
2. POST /auth/login - with identifier field
3. POST /eventbooking/book - with only EventId
4. POST /films/bookings - with all required fields
5. POST /travels/tours/book - with selectedDate and numberOfTickets

## Next Steps

1. Update remaining swagger files (library, museum, travels)
2. Test all endpoints in Swagger UI
3. Commit and push changes
4. Verify on production
