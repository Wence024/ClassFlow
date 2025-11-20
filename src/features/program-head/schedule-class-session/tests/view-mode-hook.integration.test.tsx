import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimetableViewMode } from '@/features/timetabling/hooks/useTimetableViewMode';

const STORAGE_KEY = 'timetable_view_mode';

/**
 * Test suite for useTimetableViewMode hook.
 *
 * Verifies view mode switching and localStorage persistence.
 */

// Mock localStorage properly
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTimetableViewMode', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with default view mode (class-group)', () => {
    const { result } = renderHook(() => useTimetableViewMode());
    expect(result.current.viewMode).toBe('class-group');
  });

  it('should persist view mode to localStorage', async () => {
    const { result } = renderHook(() => useTimetableViewMode());

    act(() => {
      result.current.setViewMode('classroom');
    });

    expect(result.current.viewMode).toBe('classroom');

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe('classroom');
  });

  it('should load view mode from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'instructor');

    const { result } = renderHook(() => useTimetableViewMode());
    expect(result.current.viewMode).toBe('instructor');
  });

  it('should switch between all view modes', () => {
    const { result } = renderHook(() => useTimetableViewMode());

    act(() => {
      result.current.setViewMode('classroom');
    });
    expect(result.current.viewMode).toBe('classroom');

    act(() => {
      result.current.setViewMode('instructor');
    });
    expect(result.current.viewMode).toBe('instructor');

    act(() => {
      result.current.setViewMode('class-group');
    });
    expect(result.current.viewMode).toBe('class-group');
  });

  it('should ignore invalid view mode from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-mode');

    const { result } = renderHook(() => useTimetableViewMode());
    expect(result.current.viewMode).toBe('class-group');
  });

  it('should update localStorage when view mode changes', async () => {
    const { result } = renderHook(() => useTimetableViewMode());

    act(() => {
      result.current.setViewMode('classroom');
    });

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('classroom');

    act(() => {
      result.current.setViewMode('instructor');
    });

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('instructor');
  });
});
