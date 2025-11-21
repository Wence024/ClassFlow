import { useState, useEffect } from 'react';
import type { TimetableViewMode } from '../types';

const STORAGE_KEY = 'timetable_view_mode';
const DEFAULT_VIEW_MODE: TimetableViewMode = 'class-group';

/**
 * Custom hook to manage the timetable view mode state.
 * Persists the selected view mode to localStorage for continuity across sessions.
 *
 * @returns An object containing the current view mode and a setter function.
 */
export function useTimetableViewMode() {
  const [viewMode, setViewModeState] = useState<TimetableViewMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['class-group', 'classroom', 'instructor'].includes(stored)) {
      return stored as TimetableViewMode;
    }
    return DEFAULT_VIEW_MODE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, viewMode);
  }, [viewMode]);

  const setViewMode = (mode: TimetableViewMode) => {
    setViewModeState(mode);
  };

  return { viewMode, setViewMode };
}
