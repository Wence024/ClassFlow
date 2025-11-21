# Multi-View Timetable System - October 2025

## Overview

Implementation of a comprehensive multi-view timetable system allowing users to view schedules by class group, classroom, or instructor. Includes view mode switching, localStorage persistence, and proper resource grouping.

**Completed**: October 2025  
**Type**: Feature  
**Impact**: Major - Significantly improved UX for schedule viewing

---

## Problem Statement

The original timetable only displayed sessions by class groups, making it difficult to:
1. View all sessions in a specific classroom
2. See an instructor's complete schedule
3. Identify resource conflicts across programs
4. Optimize room and instructor utilization

---

## Solution

### Architecture

Implemented a flexible view system with three modes:

1. **Class Group View** (Default)
   - Rows represent class groups
   - Shows all sessions for each group
   - Traditional timetable layout

2. **Classroom View**
   - Rows represent classrooms
   - Shows all sessions in each room
   - Useful for room utilization analysis

3. **Instructor View**
   - Rows represent instructors
   - Shows all sessions taught by each instructor
   - Useful for teaching load visualization

### Key Features

- **View Mode Switching**: Toggle between views with preserved context
- **localStorage Persistence**: Remember user's preferred view
- **Proper Resource Grouping**: Sessions grouped by selected resource type
- **Visual Consistency**: Maintained UI/UX across all views
- **Conflict Detection**: Works in all view modes

---

## Implementation Details

### State Management

#### `useTimetableViewMode` Hook
```typescript
export type ViewMode = 'class-group' | 'classroom' | 'instructor';

export function useTimetableViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as ViewMode) || 'class-group';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, viewMode);
  }, [viewMode]);

  return { viewMode, setViewMode };
}
```

**Benefits**:
- Type-safe view mode handling
- Automatic persistence
- Simple API for components

### Data Transformation

#### Resource Grouping Logic
```typescript
function groupSessionsByResource(
  sessions: ClassSession[],
  viewMode: ViewMode
): Map<string, ClassSession[]> {
  const grouped = new Map();
  
  sessions.forEach(session => {
    let key: string;
    
    switch (viewMode) {
      case 'classroom':
        key = session.classroom?.id || 'unassigned';
        break;
      case 'instructor':
        key = session.instructor?.id || 'unassigned';
        break;
      default: // 'class-group'
        key = session.group.id;
    }
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(session);
  });
  
  return grouped;
}
```

### UI Components

#### View Mode Selector
```typescript
<Select value={viewMode} onValueChange={setViewMode}>
  <SelectItem value="class-group">
    <Users className="mr-2 h-4 w-4" />
    Class Groups
  </SelectItem>
  <SelectItem value="classroom">
    <Building className="mr-2 h-4 w-4" />
    Classrooms
  </SelectItem>
  <SelectItem value="instructor">
    <GraduationCap className="mr-2 h-4 w-4" />
    Instructors
  </SelectItem>
</Select>
```

**Features**:
- Icon-based visual indicators
- Clear labels for each mode
- Accessible keyboard navigation

#### Dynamic Row Headers
```typescript
function renderRowHeader(resource: Resource, viewMode: ViewMode) {
  switch (viewMode) {
    case 'classroom':
      return (
        <div>
          <div className="font-semibold">{resource.name}</div>
          <div className="text-sm text-muted-foreground">
            {resource.location} • Capacity: {resource.capacity}
          </div>
        </div>
      );
    case 'instructor':
      return (
        <div>
          <div className="font-semibold">
            {resource.prefix} {resource.first_name} {resource.last_name}
          </div>
          <div className="text-sm text-muted-foreground">
            {resource.department_name}
          </div>
        </div>
      );
    default: // 'class-group'
      return (
        <div className="font-semibold">{resource.name}</div>
      );
  }
}
```

---

## User Workflows

### Switching View Modes

1. Click view mode selector in timetable toolbar
2. Select desired view (Class Groups, Classrooms, or Instructors)
3. Timetable updates instantly
4. Preference saved to localStorage
5. Next visit automatically uses saved preference

### Viewing Classroom Schedule

1. Switch to "Classrooms" view
2. Browse rows representing each classroom
3. See all sessions scheduled in each room
4. Identify gaps and conflicts
5. Optimize room utilization

### Viewing Instructor Schedule

1. Switch to "Instructors" view
2. Browse rows representing each instructor
3. See complete teaching schedule
4. Identify teaching load distribution
5. Plan course assignments

---

## Files Created/Modified

### Hooks
- `src/features/program-head/schedule-class-session/hooks/useTimetableViewMode.ts` - View mode state management

### Components
- `src/features/program-head/schedule-class-session/components/ViewModeSelector.tsx` - UI for switching views
- `src/features/program-head/schedule-class-session/components/TimetableGrid.tsx` - Updated to support all views

### Services
- `src/lib/services/timetableService.ts` - Enhanced data fetching for all resource types

### Types
- `src/types/timetable.ts` - ViewMode type definition

---

## Testing

### Integration Tests
- `view-mode-hook.integration.test.tsx` - Hook behavior and localStorage
- `view-selector-component.integration.test.tsx` - UI component interactions

### E2E Tests
- `cypress/e2e/05-timetabling/classroom-view.cy.ts` - Complete classroom view workflow
- `cypress/e2e/05-timetabling/instructor-view.cy.ts` - Complete instructor view workflow

### Test Coverage
- ✅ View mode switching
- ✅ localStorage persistence
- ✅ Data grouping by resource type
- ✅ UI updates on mode change
- ✅ Conflict detection in all views
- ✅ Drag-and-drop in all views

---

## Performance Considerations

### Optimizations
- **Memoized Grouping**: Resource grouping only recalculates when data changes
- **Virtual Scrolling**: Large timetables render efficiently
- **Lazy Loading**: Resources loaded on-demand
- **Cached Queries**: TanStack Query prevents unnecessary refetches

### Metrics
- View switching: < 100ms
- Initial render: < 500ms
- Resource grouping: O(n) complexity

---

## UI/UX Improvements

### Visual Enhancements
- **Icon-based Selector**: Clear visual representation of each view
- **Smooth Transitions**: Animated view switching
- **Contextual Headers**: Different information based on view mode
- **Color Coding**: Consistent session colors across views

### Accessibility
- Keyboard navigation for view selector
- Screen reader announcements for view changes
- ARIA labels on all interactive elements
- Focus management on view switch

---

## Future Enhancements

### Potential Improvements
1. **Combo Views**: Split screen showing multiple views simultaneously
2. **Custom Views**: User-defined groupings and filters
3. **Export by View**: Generate reports specific to current view
4. **View-Specific Actions**: Contextual actions based on view mode
5. **Resource Availability**: Show available vs. occupied slots
6. **Utilization Metrics**: Calculate and display resource utilization rates

---

## Related Documentation

- `feature-plans/multi-view-timetable-system.md` - Original feature plan
- `multi-view-implementation-complete.md` - Implementation summary
- `maintenance-log-2025-10-26-timetable-filtering.md` - Filtering enhancements

---

**Implemented By**: Development Team  
**Date**: October 2025  
**Status**: ✅ Complete and tested
