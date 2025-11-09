# CBAAC Travels Module Documentation

## Overview

The Travels module provides comprehensive tour and trip management functionality for CBAAC, including museum tours and cultural trips with integrated payment processing.

## Modules

### 1. Payment Gateway (`src/features/Payment/`)
Centralized payment processing supporting multiple gateways.

### 2. Tours (`src/features/Travels/Tours/`)
Museum tours with fixed weekly schedules.

### 3. Trips (`src/features/Travels/Trips/`)
Cultural trips (local/international) with detailed itineraries.

---

## Installation

### Install New Dependencies

```bash
npm install axios qrcode stripe
```

### Environment Variables

Add these to your `.env` file:

```env
# Payment Gateways
PAYSTACK_SECRET_KEY=your_paystack_secret_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Payment Callbacks
PAYMENT_CALLBACK_URL=http://localhost:3000/payment/success
PAYMENT_CANCEL_URL=http://localhost:3000/payment/cancel

# Email (already configured)
SENDGRID_API_KEY=your_sendgrid_key
SENDER_EMAIL=noreply@cbaac.org
```

---

## Database Migration

Run these SQL commands to create the new tables:

```sql
-- Payment table
CREATE TABLE "Payments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "transactionReference" VARCHAR(255) UNIQUE NOT NULL,
  "paymentGateway" VARCHAR(50) NOT NULL CHECK ("paymentGateway" IN ('paystack', 'flutterwave', 'stripe')),
  "amount" DECIMAL(10,2) NOT NULL,
  "currency" VARCHAR(10) DEFAULT 'NGN',
  "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'success', 'failed', 'refunded')),
  "paymentMethod" VARCHAR(100),
  "bookingType" VARCHAR(50) NOT NULL CHECK ("bookingType" IN ('event', 'tour', 'trip')),
  "bookingId" UUID NOT NULL,
  "userId" UUID,
  "email" VARCHAR(255) NOT NULL,
  "metadata" JSONB DEFAULT '{}',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tours table
CREATE TABLE "Tours" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "shortDescription" TEXT,
  "fullDescription" TEXT NOT NULL,
  "pricePerTicket" DECIMAL(10,2) NOT NULL,
  "duration" VARCHAR(100),
  "startTime" TIME,
  "meetingPoint" VARCHAR(255) NOT NULL,
  "mapLink" TEXT,
  "availableDays" VARCHAR(50)[] NOT NULL,
  "images" TEXT[],
  "isActive" BOOLEAN DEFAULT true,
  "createdBy" UUID,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TourBookings table
CREATE TABLE "TourBookings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tourId" UUID NOT NULL REFERENCES "Tours"("id") ON DELETE CASCADE,
  "userId" UUID,
  "fullName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phoneNumber" VARCHAR(50) NOT NULL,
  "selectedDate" DATE NOT NULL,
  "numberOfTickets" INTEGER DEFAULT 1,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "paymentStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'success', 'failed')),
  "paymentId" UUID,
  "ticketId" VARCHAR(100) UNIQUE,
  "qrCode" TEXT,
  "bookingStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("bookingStatus" IN ('pending', 'confirmed', 'cancelled')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TourInquiries table
CREATE TABLE "TourInquiries" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tourId" UUID REFERENCES "Tours"("id") ON DELETE SET NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'resolved')),
  "adminResponse" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE "Trips" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "destination" VARCHAR(255) NOT NULL,
  "destinationType" VARCHAR(50) DEFAULT 'local' CHECK ("destinationType" IN ('local', 'international')),
  "shortDescription" TEXT,
  "fullDescription" TEXT NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "pricePerPerson" DECIMAL(10,2) NOT NULL,
  "itinerary" JSONB DEFAULT '[]',
  "mapLink" TEXT,
  "images" TEXT[],
  "maxParticipants" INTEGER,
  "currentBookings" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "createdBy" UUID,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TripBookings table
CREATE TABLE "TripBookings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tripId" UUID NOT NULL REFERENCES "Trips"("id") ON DELETE CASCADE,
  "userId" UUID,
  "fullName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phoneNumber" VARCHAR(50) NOT NULL,
  "numberOfTickets" INTEGER DEFAULT 1,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "paymentStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'success', 'failed')),
  "paymentId" UUID,
  "ticketId" VARCHAR(100) UNIQUE,
  "qrCode" TEXT,
  "bookingStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("bookingStatus" IN ('pending', 'confirmed', 'cancelled')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TripInquiries table
CREATE TABLE "TripInquiries" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tripId" UUID REFERENCES "Trips"("id") ON DELETE SET NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'resolved')),
  "adminResponse" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_payments_reference ON "Payments"("transactionReference");
CREATE INDEX idx_payments_booking ON "Payments"("bookingType", "bookingId");
CREATE INDEX idx_tour_bookings_tour ON "TourBookings"("tourId");
CREATE INDEX idx_tour_bookings_date ON "TourBookings"("selectedDate");
CREATE INDEX idx_trip_bookings_trip ON "TripBookings"("tripId");
CREATE INDEX idx_trips_dates ON "Trips"("startDate", "endDate");
```

---

## API Endpoints

### Payment Gateway

```
POST   /v1/api/payment/initialize              - Initialize payment
GET    /v1/api/payment/verify/:reference       - Verify payment
GET    /v1/api/payment/history/:userId         - User payment history
GET    /v1/api/payment/admin/transactions      - All transactions (Admin)
GET    /v1/api/payment/admin/statistics        - Payment stats (Admin)
POST   /v1/api/payment/webhook/paystack        - Paystack webhook
POST   /v1/api/payment/webhook/flutterwave     - Flutterwave webhook
POST   /v1/api/payment/webhook/stripe          - Stripe webhook
```

### Tours

**Public:**
```
GET    /v1/api/travels/tours                   - Get all tours
GET    /v1/api/travels/tours/:id               - Get tour details
GET    /v1/api/travels/tours/calendar/:tourId  - Get available dates
POST   /v1/api/travels/tours/book              - Book tour
POST   /v1/api/travels/tours/inquire           - Submit inquiry
POST   /v1/api/travels/tours/confirm-payment/:bookingId - Confirm payment
```

**Admin:**
```
POST   /v1/api/travels/tours/admin/tours       - Create tour
PUT    /v1/api/travels/tours/admin/tours/:id   - Update tour
DELETE /v1/api/travels/tours/admin/tours/:id   - Delete tour
GET    /v1/api/travels/tours/admin/bookings    - Get all bookings
GET    /v1/api/travels/tours/admin/bookings/tour/:tourId - Get tour bookings
GET    /v1/api/travels/tours/admin/export/:tourId - Export bookings CSV
POST   /v1/api/travels/tours/admin/resend/:bookingId - Resend ticket
GET    /v1/api/travels/tours/admin/inquiries   - Get all inquiries
PATCH  /v1/api/travels/tours/admin/inquiries/:id - Update inquiry
```

### Trips

**Public:**
```
GET    /v1/api/travels/trips                   - Get all trips
GET    /v1/api/travels/trips/:id               - Get trip details
POST   /v1/api/travels/trips/book              - Book trip
POST   /v1/api/travels/trips/inquire           - Submit inquiry
POST   /v1/api/travels/trips/confirm-payment/:bookingId - Confirm payment
```

**Admin:**
```
POST   /v1/api/travels/trips/admin/trips       - Create trip
PUT    /v1/api/travels/trips/admin/trips/:id   - Update trip
DELETE /v1/api/travels/trips/admin/trips/:id   - Delete trip
GET    /v1/api/travels/trips/admin/bookings    - Get all bookings
GET    /v1/api/travels/trips/admin/bookings/trip/:tripId - Get trip bookings
GET    /v1/api/travels/trips/admin/export/:tripId - Export bookings CSV
POST   /v1/api/travels/trips/admin/resend/:bookingId - Resend ticket
GET    /v1/api/travels/trips/admin/inquiries   - Get all inquiries
PATCH  /v1/api/travels/trips/admin/inquiries/:id - Update inquiry
```

---

## Usage Examples

### 1. Create a Tour (Admin)

```javascript
POST /v1/api/travels/tours/admin/tours
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

{
  "title": "CBAAC Museum Tour",
  "shortDescription": "Guided tour of CBAAC museum",
  "fullDescription": "Experience the rich history...",
  "pricePerTicket": 5000,
  "duration": "2 hours",
  "startTime": "10:00:00",
  "meetingPoint": "Museum Main Entrance",
  "mapLink": "https://maps.google.com/...",
  "availableDays": ["Wednesday", "Friday"],
  "images": [<file>, <file>]
}
```

### 2. Book a Tour (User)

```javascript
POST /v1/api/travels/tours/book

{
  "tourId": "tour-uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+234800000000",
  "selectedDate": "2024-12-25",
  "numberOfTickets": 2
}

// Response:
{
  "message": "Tour booking created successfully. Please proceed to payment.",
  "booking": {
    "id": "booking-uuid",
    "tourId": "tour-uuid",
    "totalAmount": 10000,
    "paymentStatus": "pending"
  }
}
```

### 3. Initialize Payment

```javascript
POST /v1/api/payment/initialize

{
  "email": "john@example.com",
  "amount": 10000,
  "bookingType": "tour",
  "bookingId": "booking-uuid",
  "gateway": "paystack"
}

// Response:
{
  "message": "Payment initialized successfully",
  "data": {
    "reference": "TOUR-abc123",
    "authorizationUrl": "https://checkout.paystack.com/...",
    "accessCode": "xyz789"
  }
}
```

### 4. Confirm Payment

```javascript
POST /v1/api/travels/tours/confirm-payment/booking-uuid

{
  "paymentId": "payment-uuid",
  "paymentStatus": "success"
}

// Response:
{
  "message": "Payment confirmed. Ticket sent to your email.",
  "ticketId": "TOUR-1234567890-ABCDEF"
}
```

---

## Features

### Tours
- ✅ Fixed weekly schedule (2 days per week)
- ✅ Calendar view of available dates
- ✅ Booking management
- ✅ QR code ticket generation
- ✅ Email confirmations
- ✅ CSV export
- ✅ Inquiry system

### Trips
- ✅ Local and international trips
- ✅ Day-by-day itinerary
- ✅ Capacity management
- ✅ QR code ticket generation
- ✅ Email confirmations
- ✅ CSV export
- ✅ Inquiry system

### Payment Gateway
- ✅ Paystack integration
- ✅ Flutterwave integration
- ✅ Stripe integration
- ✅ Webhook handling
- ✅ Transaction history
- ✅ Payment verification

---

## Testing

### Test Payment Gateway

```bash
# Initialize payment
curl -X POST http://localhost:8000/v1/api/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 5000,
    "bookingType": "tour",
    "bookingId": "test-booking-id",
    "gateway": "paystack"
  }'

# Verify payment
curl http://localhost:8000/v1/api/payment/verify/TOUR-reference-123
```

### Test Tour Booking

```bash
# Get all tours
curl http://localhost:8000/v1/api/travels/tours

# Get available dates
curl "http://localhost:8000/v1/api/travels/tours/calendar/tour-id?month=12&year=2024"

# Book tour
curl -X POST http://localhost:8000/v1/api/travels/tours/book \
  -H "Content-Type: application/json" \
  -d '{
    "tourId": "tour-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+234800000000",
    "selectedDate": "2024-12-25",
    "numberOfTickets": 2
  }'
```

---

## Notes

- All admin routes require `Admin` or `SuperAdmin` role
- Payment webhooks don't require authentication
- QR codes are generated automatically upon successful payment
- Email confirmations are sent automatically
- CSV exports include all booking details
- Tickets contain unique IDs and QR codes for verification

---

## Support

For issues or questions, contact the development team.
