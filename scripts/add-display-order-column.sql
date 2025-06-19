-- Add displayOrder column to existing Product table
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 999;

-- Update existing products with appropriate display order
UPDATE "Product" SET "displayOrder" = 1 WHERE "supplier" = 'Natuwash';
UPDATE "Product" SET "displayOrder" = 2 WHERE "supplier" = 'Wasstrip.nl';
UPDATE "Product" SET "displayOrder" = 3 WHERE "supplier" = 'Bio-Suds';
UPDATE "Product" SET "displayOrder" = 4 WHERE "supplier" = 'Bubblyfy';
UPDATE "Product" SET "displayOrder" = 5 WHERE "supplier" = 'Cosmeau';
UPDATE "Product" SET "displayOrder" = 6 WHERE "supplier" = 'Mother''s Earth';