# Collapsible Sidebar Feature

**Branch:** `feat/collapsible-sidebar`  
**Status:** ✅ Completed

## Overview

The collapsible sidebar feature provides users with the ability to maximize horizontal screen space for content-dense pages like the Timetable. The sidebar transitions smoothly between an expanded state (with text labels) and a collapsed state (icon-only with tooltips).

## Implementation Details

### Architecture

The feature uses a React Context pattern to manage global sidebar state:

```
LayoutContext (Global State)
    ↓
AppLayout (Provider)
    ↓
├── Header (Consumer - Toggle Button)
└── Sidebar (Consumer - Display State)
```

### Key Components

#### 1. LayoutContext (`src/contexts/LayoutContext.tsx`)

Provides global state management for sidebar collapse state:

- `isSidebarCollapsed`: Boolean state tracking sidebar expansion
- `toggleSidebar`: Function to toggle the sidebar state

#### 2. Header (`src/components/Header.tsx`)

Integrated toggle button:

- Positioned at the start of the header (left side)
- Shows `PanelLeftClose` icon when expanded
- Shows `Menu` icon when collapsed
- Includes accessible label and title attributes

#### 3. Sidebar (`src/components/Sidebar.tsx`)

Docked sidebar with responsive behavior:

- **Expanded (default):** `w-64` width, shows icons + text labels
- **Collapsed:** `w-20` width, shows icons only
- **Tooltips:** Hover over icons in collapsed mode to see labels
- **Transitions:** Smooth 300ms animation between states
- **Accessibility:** Proper ARIA labels and roles

#### 4. AppLayout (`src/components/layout/AppLayout.tsx`)

Main layout coordinator:

- Wraps application in `LayoutProvider`
- Uses flexbox layout for sidebar and main content
- Ensures smooth transitions with `transition-all duration-300`

## User Experience

### Default State (Expanded)

- Sidebar width: 64 (Tailwind's `w-64`)
- Navigation links show both icon and text label
- Toggle button shows collapse icon (⬅️)

### Collapsed State

- Sidebar width: 20 (Tailwind's `w-20`)
- Navigation links show icon only
- Text labels hidden with opacity and width transitions
- Toggle button shows expand icon (☰)
- Hover over icons displays tooltip with full label

### State Persistence

The sidebar state persists across navigation within the application session. Users can collapse the sidebar on one page and navigate to another page while maintaining the collapsed state.

## Testing Coverage

### Unit Tests

- **`src/contexts/tests/LayoutContext.test.tsx`**
  - Verifies initial state
  - Tests toggle functionality
  - Validates error handling when used outside provider

### Integration Tests

- **`src/components/tests/Header.integration.test.tsx`**
  - Toggle button rendering
  - Icon changes on click
  - Accessibility attributes

- **`src/components/layout/tests/Sidebar.integration.test.tsx`**
  - Updated to include `LayoutProvider` in test setup
  - Verifies role-based navigation still works

- **`src/components/layout/tests/AppLayout.integration.test.tsx`**
  - Sidebar collapse/expand behavior
  - State persistence across navigation
  - Layout transitions

## Verification Steps

### Manual Testing Checklist

1. ✅ **Initial Load**
   - Sidebar is expanded by default
   - Toggle button visible in header

2. ✅ **Collapse Behavior**
   - Click toggle button
   - Sidebar smoothly animates to narrow width
   - Text labels disappear
   - Icon changes to expand icon

3. ✅ **Tooltip Display**
   - Hover over navigation icons when collapsed
   - Tooltips appear with full label text
   - Tooltips disappear on mouse leave

4. ✅ **Expand Behavior**
   - Click toggle button again
   - Sidebar smoothly expands
   - Text labels reappear
   - Icon changes to collapse icon

5. ✅ **State Persistence**
   - Collapse sidebar
   - Navigate to different page
   - Sidebar remains collapsed

6. ✅ **Accessibility**
   - Keyboard navigation works (Tab to toggle button, Enter/Space to activate)
   - Screen reader announces toggle button state
   - ARIA labels present on sidebar and navigation

## Design Decisions

### Why Context API?

- Global state needed across Header and Sidebar
- Avoids prop drilling through AppLayout
- Provides clean separation of concerns
- Easy to test and maintain

### Why Header Toggle?

- Standard UX pattern (familiar to users)
- Always accessible regardless of scroll position
- Consistent with modern web applications
- Clear visual hierarchy

### Why Icon-Only Collapsed State?

- Maximizes horizontal space for content
- Tooltips maintain discoverability
- Common pattern in data-dense applications
- Balances space efficiency with usability

### Transition Duration (300ms)

- Fast enough to feel responsive
- Slow enough to be visually comprehensible
- Matches Tailwind's standard transition duration
- Consistent with other UI animations in the app

## Future Enhancements

Potential improvements for future iterations:

1. **Persistent Preference**: Store sidebar state in localStorage or user preferences
2. **Responsive Behavior**: Auto-collapse on mobile/tablet viewports
3. **Keyboard Shortcut**: Add `Ctrl+B` or similar shortcut to toggle sidebar
4. **Animation Variants**: Different animation curves for different user preferences
5. **Mini Mode**: Alternative collapsed state showing icon badges or notifications

## Related Documentation

- [User Guide - Navigation](../user-guide.md#navigation)
- [Architecture - Layout System](../architecture.md#layout-system)
- [Testing Guidelines](../testing.md)
- [AI Coding Guidelines](../ai-coding-guidelines.md)
