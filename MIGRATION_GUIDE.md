# Database Migration Guide

This guide explains the database changes needed for the new event management features.

## New Fields Added to Events Table

Run these SQL commands to add new fields to the Events table:

```sql
-- Add new fields to Events table
ALTER TABLE "Events" 
ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS "registrationEnabled" BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS "volunteerEnabled" BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS "eventType" VARCHAR(255) DEFAULT 'offline' NOT NULL,
ADD COLUMN IF NOT EXISTS "maxAttendees" INTEGER,
ADD COLUMN IF NOT EXISTS "registrationDeadline" TIMESTAMP WITH TIME ZONE;

-- Add constraint for eventType enum
ALTER TABLE "Events" 
DROP CONSTRAINT IF EXISTS "Events_eventType_check";

ALTER TABLE "Events" 
ADD CONSTRAINT "Events_eventType_check" 
CHECK ("eventType" IN ('online', 'offline', 'hybrid'));
```

## Update EventBooking Table

Run these SQL commands to update the EventBooking table:

```sql
-- Rename Status column to registrationType
ALTER TABLE "EventBooking" 
RENAME COLUMN "Status" TO "registrationType";

-- Add new attendanceStatus column
ALTER TABLE "EventBooking" 
ADD COLUMN IF NOT EXISTS "attendanceStatus" VARCHAR(255) DEFAULT 'registered' NOT NULL;

-- Update registrationType constraint
ALTER TABLE "EventBooking" 
DROP CONSTRAINT IF EXISTS "EventBooking_Status_check";

ALTER TABLE "EventBooking" 
ADD CONSTRAINT "EventBooking_registrationType_check" 
CHECK ("registrationType" IN ('Register', 'Volunteer', 'Sponsor'));

-- Add attendanceStatus constraint
ALTER TABLE "EventBooking" 
ADD CONSTRAINT "EventBooking_attendanceStatus_check" 
CHECK ("attendanceStatus" IN ('registered', 'confirmed', 'attended', 'cancelled'));

-- Add default value for registrationType if NULL
UPDATE "EventBooking" 
SET "registrationType" = 'Register' 
WHERE "registrationType" IS NULL;

ALTER TABLE "EventBooking" 
ALTER COLUMN "registrationType" SET DEFAULT 'Register';
```

## Add Indexes for Performance

```sql
-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS "idx_events_isPublished" ON "Events" ("isPublished");
CREATE INDEX IF NOT EXISTS "idx_events_status" ON "Events" ("Status");
CREATE INDEX IF NOT EXISTS "idx_eventbooking_eventid" ON "EventBooking" ("EventId");
CREATE INDEX IF NOT EXISTS "idx_eventbooking_userid" ON "EventBooking" ("userId");
CREATE INDEX IF NOT EXISTS "idx_eventbooking_registrationType" ON "EventBooking" ("registrationType");
CREATE INDEX IF NOT EXISTS "idx_eventbooking_attendanceStatus" ON "EventBooking" ("attendanceStatus");
```

## Add Foreign Key Constraints (Optional but Recommended)

```sql
-- Add foreign key from EventBooking to Events
ALTER TABLE "EventBooking" 
ADD CONSTRAINT "fk_eventbooking_event" 
FOREIGN KEY ("EventId") 
REFERENCES "Events"("id") 
ON DELETE CASCADE;

-- Add foreign key from EventBooking to User
ALTER TABLE "EventBooking" 
ADD CONSTRAINT "fk_eventbooking_user" 
FOREIGN KEY ("userId") 
REFERENCES "User1"("id") 
ON DELETE CASCADE;
```

## Using Sequelize Sync (Alternative Method)

If you prefer to use Sequelize to sync the models automatically:

```javascript
// In your server.js or a migration script
const sequelize = require("./src/config/dbconfig");
const { Events } = require("./src/features/Events/model");
const { EventBooking } = require("./src/features/Booking/model");

async function syncDatabase() {
  try {
    // This will alter tables to match models
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

syncDatabase();
```

**Warning:** Using `sync({ alter: true })` in production can be risky. Always backup your database first and test in a development environment.

## Verification

After running migrations, verify the changes:

```sql
-- Check Events table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Events';

-- Check EventBooking table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'EventBooking';

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('Events', 'EventBooking');
```

## Rollback (If Needed)

If you need to rollback the changes:

```sql
-- Remove new columns from Events
ALTER TABLE "Events" 
DROP COLUMN IF EXISTS "isPublished",
DROP COLUMN IF EXISTS "registrationEnabled",
DROP COLUMN IF EXISTS "volunteerEnabled",
DROP COLUMN IF EXISTS "eventType",
DROP COLUMN IF EXISTS "maxAttendees",
DROP COLUMN IF EXISTS "registrationDeadline";

-- Revert EventBooking changes
ALTER TABLE "EventBooking" 
DROP COLUMN IF EXISTS "attendanceStatus";

ALTER TABLE "EventBooking" 
RENAME COLUMN "registrationType" TO "Status";
```
