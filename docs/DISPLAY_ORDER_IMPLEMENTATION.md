# Display Order Implementation

## Overview
Added a custom display order feature that allows administrators to control the default order of products on the homepage through the data-beheer (admin) interface.

## Changes Made

### 1. Database Schema Update
- Added `displayOrder` field to the Product model in `prisma/schema.prisma`
  - Type: `Int`
  - Default value: `999`
  - Lower numbers appear first

### 2. Frontend Updates

#### Product Card Layout (components/OptimizedProductCard.tsx)
- Restructured the product card header layout:
  - Product name (h3) now spans full width
  - Review score positioned on the left below the product name
  - Award badges positioned on the right below the product name

#### Admin Dashboard (app/data-beheer/page.tsx)
- Added "Volgorde" column to the products table
- Displays current display order for each product
- Updated Product interface to include `displayOrder` field

#### Edit Product Modal (components/EditProductModal.tsx)
- Added "Weergave volgorde" input field
- Allows admins to set display order (0-999)
- Includes helper text explaining that lower numbers appear first

### 3. Backend Updates

#### API Endpoint (app/api/admin/products/[id]/route.ts)
- Updated PUT endpoint to handle `displayOrder` field
- Saves display order when updating products

#### Database Query (lib/db-safe.ts)
- Modified `getProductsSafe()` to order products by:
  1. `displayOrder` (ascending)
  2. `currentPrice` (ascending) as fallback

### 4. Database Migration
- Created migration `20250619112630_add_display_order`
- Added `displayOrder` column to products table
- Updated seed data with default display orders:
  - Wasstrip.nl: 10
  - Mother's Earth: 20
  - Bubblyfy: 30
  - Cosmeau: 40
  - Bio-Suds: 50
  - Natuwash: 60

## Usage

1. **Setting Display Order**:
   - Navigate to `/data-beheer`
   - Click "Bewerken" on any product
   - Enter a number in "Weergave volgorde" field (0-999)
   - Lower numbers appear first on the homepage
   - Click "Opslaan"

2. **Default Behavior**:
   - Products without a set display order default to 999
   - When display orders are equal, products are sorted by price
   - User-applied filters override the default display order

## Technical Notes

- The display order only affects the initial/default product ordering
- When users apply filters (reviews, sustainability, price, try-out), the display order is overridden
- Display order is preserved in the database and persists across scraping operations
- The field is optional and backwards compatible

## Future Enhancements

Consider adding:
- Drag-and-drop reordering in the admin interface
- Bulk display order updates
- Display order presets (e.g., "Featured", "New", "Sale")