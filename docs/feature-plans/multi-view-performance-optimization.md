# I can see the performance test results show that while most metrics are close to the targets, there are a few areas that need optimization

## Performance Analysis

**Current vs Expected:**

- ✅ Initial load on Vercel: 2s (target: < 2s) - **MEETS TARGET**
- ⚠️ Initial load local/Lovable: 5-10s - **EXCEEDS TARGET**
- ⚠️ View switching: 600ms-1.5s (target: < 500ms) - **EXCEEDS TARGET**
- ✅ Drag-drop: Mostly instant to 700ms (target: < 300ms) - **ACCEPTABLE**
- ⚠️ Animation jankiness at 20fps - **NEEDS IMPROVEMENT**
- ❌ **Grid building uses nested loops instead of Map-based lookups** - **CRITICAL ISSUE**

Let me examine the timetable logic to understand the current implementation:

Good! I can see the code already uses Map-based data structures, but there are still nested loops that can be optimized. Let me check the hook that uses this logic:

Now let me check how the grid is rendered to understand the animation performance:

Perfect! Now I have a comprehensive understanding of the performance issues. Let me create a detailed optimization plan:

## Performance Analysis Summary

After reviewing the codebase, I've identified the key performance bottlenecks:

### 🔍 **Current Issues Identified:**

1. **Nested Loop in `timetableLogic.ts` (Lines 185-194, 222-263, 291-333)**
   - The main bottleneck: `for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++)` iterates through all periods
   - Inside each loop, there's another loop through assignments: `for (const assignment of assignmentsInPeriod)`
   - For 50 periods × 60 assignments = 3,000+ iterations
   - **Time Complexity: O(n × m)** where n = totalPeriods, m = assignments per period

2. **Array Filtering in `updateGroupRowWithMergedSessions` (Line 117)**
   - `allMergedSessions.filter(s => s.id !== sessionForThisGroup.id)` runs for every merged session
   - Creates new arrays repeatedly during grid building

3. **Repeated `grid.get()` Calls (Lines 76, 149, 233, 252, 302, 321)**
   - Map lookups happen inside tight loops
   - While Map lookups are O(1), they still add overhead when called thousands of times

4. **React Re-rendering Issues**
   - `TimetableRow` component renders all cells sequentially (Lines 174-210)
   - `SessionCell` creates inline style objects on every render (Lines 152-191, 387-392)
   - No memoization for expensive computations like `checkCellSoftConflicts`

5. **View Switching Performance**
   - Every view switch triggers a complete grid rebuild via `useMemo` (Lines 99-102 in useTimetable.ts)
   - No caching of previously built grids

## Optimization Plan: Timetable Performance Enhancement

### **Phase 1: Optimize Grid Building Algorithm** (Priority: HIGH)

#### 1.1 Eliminate Nested Loops in `timetableLogic.ts`

**Current Problem:** O(n × m) complexity with nested loops
**Solution:** Pre-index assignments by both period AND resource ID

**Changes to `buildTimetableGridForClassGroups`:**

- Create a compound index: `Map` with key `${resourceId}-${periodIndex}`
- Replace the double loop with direct Map lookups
- **Expected improvement:** Reduces from O(n × m) to O(m) - single pass through assignments

**Changes to `buildTimetableGridForClassrooms` and `buildTimetableGridForInstructors`:**

- Apply the same indexing strategy
- Pre-group by resource ID to avoid repeated filtering

#### 1.2 Optimize Session Array Creation

- Replace `allMergedSessions.filter()` with a Set-based approach for excluding sessions
- Pre-allocate arrays with known sizes instead of dynamic array spreading
- Use object pooling for frequently created temporary arrays

### **Phase 2: Implement Grid Caching** (Priority: MEDIUM)

#### 2.1 Add View-Specific Grid Cache in `useTimetable.ts`

- Create a cache Map: `gridCache: Map`
- Cache key: `${viewMode}-${assignmentsHash}`
- Only rebuild grid when assignments actually change
- **Expected improvement:** View switching from 600ms-1.5s → <100ms for cached views

#### 2.2 Implement Incremental Updates

- For single assignment changes (add/remove/move), update only affected cells
- Avoid full grid rebuild on optimistic updates
- Keep a dirty flag to know when full rebuild is needed

### **Phase 3: React Component Optimization** (Priority: MEDIUM)

#### 3.1 Memoize `SessionCell` Component

- Wrap with `React.memo()` with custom comparison function
- Prevent re-renders when session data hasn't changed
- **Expected improvement:** Reduces re-renders by 70-80%

#### 3.2 Optimize Style Calculations

- Move `createCellBackground()` computation outside render
- Use CSS variables for colors instead of inline styles
- Pre-calculate text colors once per instructor
- Cache gradient styles in a WeakMap

#### 3.3 Virtualize Timetable Rows (Optional - for very large datasets)

- Implement row virtualization if >30 rows
- Only render visible rows + buffer
- Use `react-window` or custom virtualization

#### 3.4 Optimize `TimetableRow` Rendering

- Memoize `getResourceLabel()` result
- Pre-calculate `renderedPeriods` set size
- Use `useMemo` for cells array

### **Phase 4: Data Fetching Optimization** (Priority: LOW)

#### 4.1 Optimize Query Dependencies in `useTimetable.ts`

- Fetch resources in parallel, not sequentially
- Add stale-time to React Query config to reduce refetches
- Implement query prefetching on route transition

#### 4.2 Reduce Real-time Subscription Overhead

- Debounce real-time invalidations (batch updates within 100ms)
- Only invalidate if changes affect current view

### **Phase 5: Animation Performance** (Priority: MEDIUM)

#### 5.1 Optimize Drag Animations

- Use `transform` and `opacity` for drag feedback (GPU-accelerated)
- Add `will-change` CSS hint for drag elements
- Reduce drop zone recalculations

#### 5.2 Improve Transition Smoothness

- Replace transition-all with specific properties
- Use `requestAnimationFrame` for smooth state updates
- Target 60fps by keeping frame budget under 16ms

### **Expected Performance After Optimization:**

| Metric | Current (Worst) | Target | Improvement |
|--------|----------------|--------|-------------|
| Initial Load | 10s | <2s | 5x faster |
| View Switch (first) | 1.5s | <200ms | 7.5x faster |
| View Switch (cached) | 1s | <50ms | 20x faster |
| Drag Response | 500ms | <100ms | 5x faster |
| Grid Building | O(n×m) | O(m) | ~50x for large datasets |

### **Implementation Order:**

1. **Week 1:** Phase 1 (Grid building optimization) - Highest impact
2. **Week 1:** Phase 3.1-3.2 (Component memoization & style optimization)
3. **Week 2:** Phase 2 (Grid caching)
4. **Week 2:** Phase 5 (Animation optimization)
5. **Week 3:** Phase 3.3-3.4 (Advanced React optimization)
6. **Week 3:** Phase 4 (Data fetching polish)

### **Testing Strategy:**

- Add performance benchmarks in test suite
- Measure time for grid building with 100 assignments
- Profile with React DevTools and Chrome Performance tab
- Test on low-end devices (throttled CPU)
- Verify no regression in functionality

Implement the plan
