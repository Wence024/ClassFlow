# E2E Test Fixes - November 12, 2025

## Summary

Comprehensive fixes for E2E test failures and proper test data isolation implementation.

## Core Functionality Fixes

### 1. Logout Behavior ✅
- **Issue**: Redirected to `/` instead of `/login`
- **Fix**: Updated `AuthProvider.tsx` to redirect to `/login` and clear all storage
- **File**: `src/features/auth/contexts/AuthProvider.tsx`

### 2. Notification Dismissal ✅
- **Issue**: Dismissed notifications reappeared after refresh
- **Fix**: Enhanced optimistic updates with comprehensive query invalidation
- **Files**: `PendingRequestsNotification.tsx`, `RequestNotifications.tsx`

### 3. Request Cancellation ✅
- **Issue**: UI didn't update completely after canceling requests
- **Fix**: Added missing `hydratedTimetable`, `my_reviewed_requests`, `enriched_requests` invalidations
- **File**: `useResourceRequests.ts`

### 4. Toast Clarity ✅
- **Issue**: Multiple confusing toasts for cross-dept moves
- **Fix**: Removed duplicate toast, kept single clear message
- **File**: `useTimetable.ts`

### 5. Department Head Notification ✅
- **Issue**: No notification when sessions removed
- **Fix**: Call `cancelActiveRequestsForClassSession` before removal
- **File**: `useTimetableDnd.ts`

## Test Selectors Added

All components now have `data-cy` attributes for reliable E2E testing:
- Notification bells and popovers
- Approve/reject/dismiss buttons
- Timetable grid, drawer, and view selector
- All interactive elements

## Test Infrastructure Created

- `cypress/fixtures/testData.ts` - Test data generators with TEST_* prefixes
- `cypress/support/dbHelpers.ts` - Database utilities for test management
- `cypress/README.md` - Comprehensive testing documentation

## Expected Test Results

All 7 Cypress test suites should now pass with proper test data isolation.
