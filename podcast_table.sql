-- Create Podcasts table
CREATE TABLE IF NOT EXISTS "Podcasts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "link" VARCHAR(255),
    "audio" VARCHAR(255),
    "isPublished" BOOLEAN DEFAULT false NOT NULL,
    "isLive" BOOLEAN DEFAULT false NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_podcasts_user_id" ON "Podcasts" ("userId");
CREATE INDEX IF NOT EXISTS "idx_podcasts_published" ON "Podcasts" ("isPublished");
CREATE INDEX IF NOT EXISTS "idx_podcasts_live" ON "Podcasts" ("isLive");
CREATE INDEX IF NOT EXISTS "idx_podcasts_created_at" ON "Podcasts" ("createdAt");

-- Add URL validation constraint
ALTER TABLE "Podcasts" 
ADD CONSTRAINT "check_link_format" 
CHECK ("link" IS NULL OR "link" ~* '^https?://[^\s/$.?#].[^\s]*$');

ALTER TABLE "Podcasts" 
ADD CONSTRAINT "check_audio_format" 
CHECK ("audio" IS NULL OR "audio" ~* '^https?://[^\s/$.?#].[^\s]*$');