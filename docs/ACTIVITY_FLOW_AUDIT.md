# Recent Activity Flow - Audit Report

**Date:** 2024-12-19  
**Scope:** Complete audit of the Recent Activity feature flow in the Suivi mobile app

---

## 1. HomeScreen.tsx Analysis

### Activities Displayed
- **Number of activities shown:** 3 (hardcoded via `activities.slice(0, 3)`)
- **Source:** Data comes from `useActivityFeed(5)` hook, which loads 5 activities but only displays the first 3
- **Display format:** Compact `ActivityCard` components in vertical list
- **Location:** Section titled "Activités récentes" below "What's new" statistics

### Tap on Activity Card Behavior
- **Action:** Tapping an `ActivityCard` in the preview calls `onPress={(event) => setSelectedEvent(event)}`
- **Result:** Sets `selectedEvent` state, which conditionally renders `ActivityDetailModal`
- **Flow:** `ActivityCard` → `setSelectedEvent(event)` → `ActivityDetailModal` renders with `visible={true}` and `event={selectedEvent}`

### "Voir les activités" Button Behavior
- **Action:** Tapping the button calls `onPress={() => setActivityModalVisible(true)}`
- **Result:** Opens `RecentActivityModal` with full activity list
- **Flow:** Button → `setActivityModalVisible(true)` → `RecentActivityModal` renders with `visible={activityModalVisible}`

### State Management
The following states control the Recent Activity flow:

1. **`activityModalVisible`** (`useState<boolean>`)
   - Controls visibility of `RecentActivityModal`
   - Initial: `false`
   - Set to `true` when "Voir les activités" button is pressed
   - Set to `false` when modal is closed

2. **`selectedEvent`** (`useState<SuiviActivityEvent | null>`)
   - Stores the currently selected activity event
   - Initial: `null`
   - Set when an `ActivityCard` is tapped (from preview or modal)
   - Used to conditionally render `ActivityDetailModal`
   - Reset to `null` when `ActivityDetailModal` is closed

3. **`activities`** (from `useActivityFeed(5)` hook)
   - Contains the list of activity events
   - Loaded via React Query hook
   - Limited to 5 items by the hook parameter
   - Only first 3 are displayed in preview

---

## 2. RecentActivityModal.tsx Analysis

### Is It Still Referenced?
**Yes.** The modal is actively used in `HomeScreen.tsx`:
- Imported: `import RecentActivityModal from '../components/activity/RecentActivityModal';`
- Rendered conditionally based on `activityModalVisible` state
- Located at lines 212-219 in `HomeScreen.tsx`

### How Is It Triggered?
- **Trigger:** `activityModalVisible` state set to `true`
- **Trigger source:** "Voir les activités" button in `HomeScreen.tsx` (line 164)
- **Props passed:**
  - `visible={activityModalVisible}`
  - `onClose={() => setActivityModalVisible(false)}`
  - `onSelect={(event) => { setActivityModalVisible(false); setSelectedEvent(event); }}`

### What Content Does It Render?
The modal displays:

1. **Header:**
   - Title: "Activités récentes"
   - Subtitle: "Ce qui a bougé dans vos projets"
   - Close button (X icon)

2. **Filter Bar:**
   - Three filter chips: "Tous", "Boards", "Portails"
   - Filters by `event.source` ('BOARD' or 'PORTAL')
   - State managed by `activeFilter` (`'ALL' | 'BOARD' | 'PORTAL'`)

3. **Activity List:**
   - Scrollable list of `ActivityCard` components
   - Grouped by date: "Aujourd'hui", "Hier", "Cette semaine", "Plus ancien"
   - Each card wrapped in `SwipeableActivityCard` for swipe-to-delete
   - Loads up to 50 activities via `getRecentActivity(null, { limit: 50 })`
   - Sorted anti-chronologically (most recent first)

4. **Features:**
   - Swipe-to-delete (removes from local state only, doesn't affect backend)
   - Loading state while fetching activities
   - Empty state when no activities found
   - Dark/light mode support

---

## 3. ActivityDetailModal.tsx Analysis

### Is It Used?
**Yes.** The modal is actively used in `HomeScreen.tsx`:
- Imported: `import { ActivityDetailModal } from '../components/activity/ActivityDetailModal';`
- Rendered conditionally when `selectedEvent` is not null
- Located at lines 221-227 in `HomeScreen.tsx`

### By Who?
- **Primary user:** `HomeScreen.tsx`
- **Triggered from:**
  1. Tap on `ActivityCard` in the preview (line 158)
  2. Tap on `ActivityCard` in `RecentActivityModal` (via `onSelect` callback)

### What Props Does It Expect?
```typescript
interface ActivityDetailModalProps {
  /** Contrôle la visibilité du modal */
  visible: boolean;
  /** Événement d'activité à afficher (null si modal fermé) */
  event: SuiviActivityEvent | null;
  /** Callback appelé lors de la fermeture du modal */
  onClose: () => void;
}
```

**Current usage in HomeScreen:**
- `visible={true}` (hardcoded, modal only renders when `selectedEvent` is not null)
- `event={selectedEvent}`
- `onClose={() => setSelectedEvent(null)}`

**Note:** The `visible` prop is always `true` because the modal is conditionally rendered. This could be improved to use the `visible` prop properly.

### What Does It Display?
- Event icon with colored background
- Event title
- Relative and absolute timestamps
- Actor information (avatar + name)
- Workspace / Board / Portal context
- Event type details
- Status changes (for TASK_COMPLETED, TASK_REPLANNED, OBJECTIVE_STATUS_CHANGED)
- Date changes (for TASK_REPLANNED)
- "Ouvrir dans Suivi (web)" button (placeholder URL)

---

## 4. Navigation Setup Analysis

### Is There an ActivityDetailScreen?
**No.** There is no `ActivityDetailScreen` in the navigation structure.

**Evidence:**
- `src/navigation/types.ts` defines:
  - `RootStackParamList` (AppLoading, Auth, App)
  - `AuthStackParamList` (Login)
  - `AppStackParamList` (Main, TaskDetail)
  - `MainTabParamList` (Home, MyTasks, Notifications, More)
- No route for `ActivityDetail` or `ActivityDetailScreen`
- Search for `ActivityDetailScreen` returns 0 files

### How Is Navigation to Details Handled?
**Navigation is handled via modals, not screen navigation:**
- `ActivityDetailModal` is a React Native `Modal` component
- Rendered conditionally in `HomeScreen.tsx` based on `selectedEvent` state
- No navigation stack involved
- Modal overlays the current screen

**Flow:**
1. User taps activity → `setSelectedEvent(event)`
2. `HomeScreen` re-renders with `selectedEvent !== null`
3. `ActivityDetailModal` renders with `visible={true}`
4. User closes modal → `setSelectedEvent(null)`
5. Modal unmounts

### Is There Any Unused Screen or Modal?
**Yes, one unused example file:**
- `src/screens/HomeScreen.example.tsx` - Example integration file showing how to use the modals
  - Not imported or used anywhere
  - Contains example code that was already implemented in `HomeScreen.tsx`
  - Safe to delete

---

## 5. Summary of Findings

### Current Architecture
- **Preview:** 3 activities shown in `HomeScreen` using compact `ActivityCard`
- **Full List:** `RecentActivityModal` shows up to 50 activities with filters and grouping
- **Detail View:** `ActivityDetailModal` shows detailed information about a single activity
- **Navigation:** All handled via modals, no screen-based navigation

### Data Flow
```
useActivityFeed(5) 
  → activities (5 items)
    → HomeScreen preview (first 3)
    → RecentActivityModal (all 50, loaded separately)
      → ActivityDetailModal (selected event)
```

### State Flow
```
HomeScreen:
  - activityModalVisible → controls RecentActivityModal
  - selectedEvent → controls ActivityDetailModal
  - activities → from useActivityFeed hook
```

---

## 6. Recommendations

### Files That Can Be Safely Deleted

1. **`src/screens/HomeScreen.example.tsx`**
   - **Reason:** Example file not used in production
   - **Status:** Safe to delete
   - **Impact:** None (not imported anywhere)

### Components That Should Be Replaced by a Real Screen Version

1. **`ActivityDetailModal` → `ActivityDetailScreen`**
   - **Current:** Modal overlay that appears on top of current screen
   - **Recommended:** Full screen navigation for better UX
   - **Benefits:**
     - Native navigation stack (back button support)
     - Better deep linking support
     - More consistent with app navigation patterns
     - Better accessibility
   - **Implementation:**
     - Add `ActivityDetail: { eventId: string }` to `AppStackParamList`
     - Create `src/screens/ActivityDetailScreen.tsx`
     - Use `navigation.navigate('ActivityDetail', { eventId: event.id })`
     - Keep modal as fallback or for quick preview

2. **`RecentActivityModal` → `RecentActivityScreen` (optional)**
   - **Current:** Modal slide-up from bottom
   - **Recommendation:** Could remain as modal (common pattern for activity feeds)
   - **Alternative:** If full-screen navigation is preferred, convert to screen
   - **Note:** Modal pattern is acceptable for this use case

### Additional Improvements

1. **Fix `ActivityDetailModal` visible prop:**
   - Currently hardcoded to `true` because of conditional rendering
   - Should use `visible={selectedEvent !== null}` for consistency

2. **Add ActivityDetail route to navigation types:**
   - Even if keeping modal, add route for future deep linking
   - Prepare for potential screen migration

3. **Consider pagination:**
   - `RecentActivityModal` loads 50 activities at once
   - Could implement infinite scroll or pagination for better performance

---

## 7. File Inventory

### Active Files (In Use)
- ✅ `src/screens/HomeScreen.tsx` - Main screen using activity components
- ✅ `src/components/activity/ActivityCard.tsx` - Card component for displaying activities
- ✅ `src/components/activity/RecentActivityModal.tsx` - Modal for full activity list
- ✅ `src/components/activity/ActivityDetailModal.tsx` - Modal for activity details
- ✅ `src/hooks/useActivity.ts` - Hook for fetching activities
- ✅ `src/api/activity.ts` - API adapter for activities
- ✅ `src/types/activity.ts` - TypeScript types for activities
- ✅ `src/mocks/data/activity.ts` - Mock data for activities

### Unused Files (Can Be Deleted)
- ❌ `src/screens/HomeScreen.example.tsx` - Example file, not used in production

### Navigation Files (No Activity Routes)
- `src/navigation/types.ts` - No `ActivityDetail` route defined
- `src/navigation/MainTabNavigator.tsx` - No activity-related screens
- `src/navigation/RootNavigator.tsx` - No activity-related screens

---

**End of Audit Report**

