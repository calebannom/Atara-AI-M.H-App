# Firebase Firestore Indexes Guide

## Required Indexes

### 1. For Moods Collection
- **Collection ID**: `moods`
- **Fields**:
  - `userId` → Ascending
  - `date` → Descending
- **Index Scope**: Collection

### 2. For Journals Collection
- **Collection ID**: `journals`
- **Fields**:
  - `userId` → Ascending
  - `date` → Descending
- **Index Scope**: Collection

## How to Create Indexes

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Indexes** tab
4. Click **Add Index**
5. Fill in the details from above
6. Click **Create Index**
7. Wait ~1-2 minutes for the index to build (it will say "Enabled" when ready)

## Why We Need Indexes

Firestore requires composite indexes for any query that uses:
- A `where` clause with **equality** filter on one field **AND**
- An `orderBy` clause on **another** field

This helps Firestore quickly find and sort your data!
