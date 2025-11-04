# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for a used truck sales company (ノアコーポレーション / NOA Corporation) based in Chiba, Japan. The site is in Japanese and handles vehicle inventory management, customer inquiries, and admin functionality.

**Tech Stack:**
- Next.js 15.2.4 (App Router)
- React 19.1.0
- TypeScript 5
- Firebase (Firestore, Auth, Storage)
- Tailwind CSS + shadcn/ui components
- Radix UI primitives

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture

### Application Structure

**Public-Facing Pages:**
- `/` - Homepage
- `/inventory` - Vehicle inventory listing with search/filter/sort
- `/vehicle/[id]` - Individual vehicle details
- `/about` - Company information
- `/news` - News/announcements
- `/contact` - Contact form
- `/rental` - Rental information
- `/purchase` - Purchase information
- `/assessment` - Vehicle assessment

**Admin Panel** (`/admin/*`):
- `/admin` - Dashboard
- `/admin/vehicles` - Vehicle management (CRUD)
- `/admin/stores` - Store management
- `/admin/inquiries` - Customer inquiry management
- `/admin/alert-logs` - Alert logs

**Authentication:**
- Simple hardcoded auth in `app/admin/auth-context.tsx`
- Credentials: `admin@gmail.com` / `password`
- Auth state managed via React Context
- `/admin/layout.tsx` handles auth gate - shows login form if not authenticated

### Key Features & Implementation Details

**Vehicle Management:**
- Vehicles stored in Firestore `vehicles` collection
- Type definition in `types/index.ts` with extensive fields
- Status flags: `isPrivate`, `isTemporarySave`, `isSoldOut`, `isNegotiating`
- Images stored in Firebase Storage
- CSV import functionality for bulk vehicle upload (`/admin/vehicles/import`)
- Vehicle filtering by: body type, maker, size, keyword, sold/negotiating status
- Sorting by: price, year, mileage
- Pagination: 20/50/100 vehicles per page

**Inventory Page (`/inventory`):**
- Displays 12 vehicle types with icon selection (クレーン, ダンプ, ミキサー車, etc.)
- Complex filtering logic with `normalizeType()` function to handle type variations
- URL-based state management for filters using `useSearchParams`
- Default sort: SOLD OUT vehicles at end, others by `createdAt` (oldest first)
- Generates 110 dummy vehicles for testing (with placeholder images)

**Vehicle Detail Page (`/vehicle/[id]`):**
- Image carousel with thumbnails
- Comprehensive specifications display
- Contact form integration
- SOLD OUT / 商談中 overlay badges

**Store Management:**
- Stores in Firestore `stores` collection
- CRUD via API routes at `/api/stores/*`
- Migration functionality to add `storeId` to existing vehicles

**Inquiry System:**
- Contact forms submit to Firestore `inquiries` collection
- Types: "購入" (purchase), "買取" (buy/trade-in), "その他" (other)
- Status tracking: "未対応", "対応中", "完了"
- Admin can view and respond to inquiries

### File Organization

```
app/
├── (pages)/          # Public pages
├── admin/            # Admin panel with auth
├── api/              # API routes
├── components/       # Shared components (Header, Footer, etc.)
components/ui/        # shadcn/ui components
lib/
├── firebase.ts       # Firebase initialization
├── firebase-utils.ts # Firestore helper functions
├── utils.ts          # Utility functions
types/index.ts        # TypeScript type definitions
```

### Firebase Configuration

Firebase config is in `lib/firebase.ts` with:
- Firestore for data storage
- Auth for authentication
- Storage for images (vehicle photos, inspection certificates)

**Important Collections:**
- `vehicles` - Vehicle inventory
- `stores` - Store locations
- `inquiries` - Customer inquiries
- `announcements` - News/announcements

**Storage Structure:**
- Vehicle images organized by vehicle ID
- Inspection certificates and condition reports stored separately

### Styling Approach

- Uses inline styles extensively with rem units
- Tailwind for utility classes
- Custom design system with specific colors:
  - Primary blue: `#2B5EC5`, `#1154AF`
  - Dark text: `#1A1A1A`
  - Gray backgrounds: `#F5F5F5`, `#E6E6E6`, `#CCCCCC`
  - Red for SOLD: `#EA1313`
- Responsive design with mobile/desktop breakpoints
- Font: Noto Sans JP

### Important Patterns

**Type Normalization:**
The `normalizeType()` function handles vehicle type variations:
- "ダンプ" → "ダンプ・ローダーダンプ"
- "車輌運搬車" or "キャリアカー" → "キャリアカー・車両運搬車"
- etc.

**Image Handling:**
- Unoptimized images (see `next.config.mjs`)
- Firebase Storage remote patterns whitelisted
- Placeholder shown when no images available

**Japanese Formatting:**
- Prices in 万円 (10,000 yen units)
- Years in R6年 (Reiwa era) format
- Distances in km, weights in kg

### Build Configuration

**next.config.mjs:**
- ESLint and TypeScript errors ignored during builds
- Image optimization disabled
- Firebase Storage remote patterns allowed

**tsconfig.json:**
- Path alias: `@/*` maps to root
- Strict mode enabled
- ES6 target

## Common Development Tasks

**Adding a new vehicle field:**
1. Update `Vehicle` interface in `types/index.ts`
2. Update vehicle form in `app/admin/vehicles/VehicleForm.tsx`
3. Update display in inventory and detail pages
4. Update Firestore queries if filtering/sorting needed

**Adding a new page:**
1. Create page in `app/` directory
2. Add navigation link in `app/components/Header.tsx` or `app/admin/layout.tsx`
3. Follow existing pattern for layout and styling

**Working with Firebase:**
- Helper functions in `lib/firebase-utils.ts`
- Direct Firestore calls using `db` from `lib/firebase.ts`
- Use `collection()`, `getDocs()`, `addDoc()`, `updateDoc()`, `deleteDoc()`

**CSV Import:**
- Uses PapaParse library
- Preview endpoint: `/api/upload-csv/preview`
- Actual upload: `/api/upload-csv`
- Handles Japanese text encoding properly
