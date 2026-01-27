-- SQL to create Bookstore tables manually
-- Based on the Sequelize model definitions

-- 1. Create ENUM type for preview types
CREATE TYPE bookstore_preview_type AS ENUM ('text', 'images', 'pdf', 'video', 'audio');

-- 2. Create BookstoreCategories table
CREATE TABLE "BookstoreCategories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create BookstoreBooks table
CREATE TABLE "BookstoreBooks" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "author" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL CHECK ("price" >= 0),
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "numberOfChapters" INTEGER CHECK ("numberOfChapters" >= 0),
    "numberOfPages" INTEGER CHECK ("numberOfPages" >= 0),
    "numberOfParts" INTEGER CHECK ("numberOfParts" >= 0),
    "editors" TEXT[] DEFAULT '{}',
    "previewPages" JSONB,
    "previewType" bookstore_preview_type NOT NULL DEFAULT 'text',
    "coverPage" VARCHAR(1000),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" UUID,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create BookstoreBookCategories junction table
CREATE TABLE "BookstoreBookCategories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT "fk_bookstore_book_categories_book" 
        FOREIGN KEY ("bookId") REFERENCES "BookstoreBooks"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    CONSTRAINT "fk_bookstore_book_categories_category" 
        FOREIGN KEY ("categoryId") REFERENCES "BookstoreCategories"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Unique constraint to prevent duplicate book-category relationships
    CONSTRAINT "unique_book_category" UNIQUE ("bookId", "categoryId")
);

-- 5. Create indexes for better performance
CREATE INDEX "idx_bookstore_books_title" ON "BookstoreBooks"("title");
CREATE INDEX "idx_bookstore_books_author" ON "BookstoreBooks"("author");
CREATE INDEX "idx_bookstore_books_featured" ON "BookstoreBooks"("isFeatured");
CREATE INDEX "idx_bookstore_books_active" ON "BookstoreBooks"("isActive");
CREATE INDEX "idx_bookstore_categories_name" ON "BookstoreCategories"("name");
CREATE INDEX "idx_bookstore_categories_active" ON "BookstoreCategories"("isActive");
CREATE INDEX "idx_bookstore_book_categories_book" ON "BookstoreBookCategories"("bookId");
CREATE INDEX "idx_bookstore_book_categories_category" ON "BookstoreBookCategories"("categoryId");

-- 6. Create triggers to automatically update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookstore_categories_updated_at 
    BEFORE UPDATE ON "BookstoreCategories" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookstore_books_updated_at 
    BEFORE UPDATE ON "BookstoreBooks" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookstore_book_categories_updated_at 
    BEFORE UPDATE ON "BookstoreBookCategories" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert some sample categories (optional)
INSERT INTO "BookstoreCategories" ("name", "description") VALUES
('Fiction', 'Fictional books and novels'),
('Non-Fiction', 'Educational and factual books'),
('Biography', 'Life stories and memoirs'),
('History', 'Historical books and documentation'),
('Science', 'Scientific and technical books'),
('Art', 'Art, design, and creative books'),
('Children', 'Books for children and young adults'),
('Religion', 'Religious and spiritual books');

-- Verification queries (run these to check if tables were created successfully)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%Bookstore%';
-- SELECT * FROM "BookstoreCategories";
-- \d "BookstoreBooks"
-- \d "BookstoreCategories" 
-- \d "BookstoreBookCategories"