Here is your **consolidated, de-duplicated, and streamlined ClassFlow Maintenance & Refactoring Index**, combining overlapping items and eliminating redundancy for clarity and sprint planning:

---

# ✅ ClassFlow Maintenance & Refactoring Index

## 🔥 Critical Priority (Fix First)

### 🧠 Code Quality & Architecture

- [x] **React Query** — ✅ Fully adopted
- [x] **Fix `useTimetable` real-time re-subscription** due to unstable dependencies
- [x] **Remove `localStorage` fallback** from `authService.getStoredUser()` — security risk
- [x] **Standardize loading state naming** — unify `isLoading` vs `loading`
- [x] **Implement error boundaries** at feature level (`auth`, `scheduling`)
- [ ] **Create validation schemas** (Zod/Yup) for all user inputs

### 🛡️ Type Safety & Data Consistency

- [ ] **Unify type sources** — align `/types/` with `supabase.types.ts`
- [ ] **Improve error typing** — enforce consistent `Error | null` or `string | null`
- [ ] **Remove manual `authUser` persistence** — rely on Supabase sessions only

---

## 🟡 High Priority (Next Sprint)

### 🐞 Bug Fixes & Refactors

- [ ] **Fix `useTimetable` queryKey** and `useEffect` dependencies
- [ ] **Standardize error shape in hooks** (some return `Error`, others return `string`)
- [ ] **Unify loading state management** across all hooks and components

### 🔐 Security & Backend Hygiene

- [ ] **Audit Supabase Row Level Security (RLS)** rules
- [ ] **Implement session refresh handling** — auto-refresh on token expiry
- [ ] **Add input validation on server** (backend mutation verification)
- [ ] **Sanitize inputs** on both client and server

### 🏛️ Architecture Upgrades

- [ ] **Replace global `Notification` singleton** with a `NotificationContext`
- [ ] **Centralize error handling** using a shared hook/service
- [ ] **Add centralized logging system** for client-side diagnostics

### 🧪 Testing & QA

- [x] **Unit test** `checkConflicts.ts` — ✅ done
- [ ] **Test `useTimetable` edge cases** — especially real-time sync
- [ ] **Write integration tests** for auth flow
- [ ] **Test drag-and-drop reliability**
- [ ] **Add form validation tests**

---

## 🟢 Medium Priority (Future Iterations)

### ✨ Feature Enhancements

- [ ] **Improve conflict detection** with visual cues and detailed messages
- [ ] **Add bulk operations** for managing multiple class sessions
- [ ] **Implement undo/redo** for drag-and-drop operations
- [ ] **Enable export/import** of timetable data

### 🧑‍🎨 UI/UX Improvements

- [ ] **Enhance accessibility** — ARIA, focus states, keyboard support
- [ ] **Refine responsive design** for mobile and tablet
- [ ] **Improve drag-and-drop visuals**
- [ ] **Add tooltips and contextual help**

### 🚀 Performance Optimizations

- [ ] **Add lazy loading** for routes/components
- [ ] **Implement query/resource caching**
- [ ] **Optimize `Timetable` re-renders**
- [ ] **Add list virtualization** where applicable

---

## 🔵 Long-Term (Strategic Goals)

### 🧠 Advanced Features

- [ ] **Admin setup** — dynamic term/period/session configs
- [ ] **Multi-user collaboration** with real-time presence
- [ ] **Dynamic views** (per instructor, room, course)
- [ ] **Scheduling algorithms** — auto-placement, conflict resolution

### 🛠️ DevOps & Infrastructure

- [ ] **Preview deployments** via CI
- [ ] **Add observability tools** (e.g., Sentry, logs)
- [ ] **Automated tests in CI/CD**
- [ ] **Rollback strategy** for deploys

### 🌍 Accessibility & Internationalization

- [ ] **Implement i18n** — extract all strings
- [ ] **Add RTL support**
- [ ] **Improve screen reader support**
- [ ] **Support high contrast & dark mode**

---

## 🔧 Immediate Fixes with Code Suggestions

### 🛠️ Fix 1: `useTimetable` Real-Time Subscription

```ts
// ✅ Use stable array and avoid passing mutable `queryClient`
const queryKey = ['hydratedTimetable', user?.id];

useEffect(() => {
  const channel = supabase.channel(`timetable-realtime-${channelId}`);
  // ... logic ...
}, [user?.id, channelId]); // ✅ Clean deps
```

### 🛠️ Fix 2: AuthService `getStoredUser()`

```ts
// ❌ REMOVE localStorage fallback
export async function getStoredUser(): Promise<User | null> {
  const currentUser = await getCurrentUser();
  return currentUser?.user ?? null;
}
```

### 🛠️ Fix 3: Notification System Refactor

```tsx
// CREATE a NotificationContext
export const NotificationContext = createContext({ showNotification: () => {} });
export const useNotification = () => useContext(NotificationContext);
```

---

## 📁 Files Needed for Next Analysis Batch

> To continue refactoring and recommend specific code improvements, please share:

### Core App & Routing

- [ ] `src/App.tsx`
- [ ] `src/main.tsx`

### Authentication

- [ ] `auth/contexts/AuthContext.tsx`
- [ ] `auth/services/authService.ts`
- [ ] `auth/components/PrivateRoute.tsx`

### Scheduling Logic

- [ ] `scheduleLessons/hooks/useTimetable.ts`
- [ ] `scheduleLessons/services/timetableService.ts`
- [ ] `scheduleLessons/utils/checkConflicts.ts`

### UI

- [ ] `components/timetabling/Timetable.tsx`
- [ ] `components/ui/` (sample subset)
- [ ] `pages/Scheduler.tsx`

### Configuration & Types

- [ ] `lib/supabase.ts`
- [ ] `lib/supabase.types.ts`
- [ ] `types/index.ts`
- [ ] `package.json`

---

## 🎯 Success Metrics (Objective Benchmarks)

| Goal                                | Target     |
|-------------------------------------|------------|
| ✅ TypeScript Errors                | **0**      |
| ✅ Test Coverage (core logic)       | **>80%**   |
| ⚡ Initial Load Time                | **<3s**    |
| ♿ Accessibility Violations         | **0**      |
| 🌟 Lighthouse Performance Score     | **100%**   |
| 🔐 localStorage Removed from Auth   | **Yes**    |

---

Let me know when you'd like help creating an **interactive migration checklist**, or if you want **progress tracking for individual tasks** across sprints.
