import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimetableViewMode } from '../useTimetableViewMode';

const STORAGE_KEY = 'timetable_view_mode';

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

  it('should persist view mode to localStorage', () => {
    const { result } = renderHook(() => useTimetableViewMode());

    act(() => {
      result.current.setViewMode('classroom');
    });

    expect(result.current.viewMode).toBe('classroom');
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

  it('should update localStorage when view mode changes', () => {
    const { result } = renderHook(() => useTimetableViewMode());

    act(() => {
      result.current.setViewMode('classroom');
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('classroom');

    act(() => {
      result.current.setViewMode('instructor');
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('instructor');
  });
});
