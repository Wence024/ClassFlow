/**
 * Integration tests for useAuth hook.
 * Tests authentication context access and error handling.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthContext } from '../../contexts/AuthContext';
import type { AuthContextType, User } from '../../types/auth';

const mockUser: User = {
  id: 'u1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  program_id: null,
  department_id: null,
};

const mockAuthContext: AuthContextType = {
  user: mockUser,
  loading: false,
  error: null,
  role: 'admin',
  departmentId: null,
  login: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn(),
  updateMyProfile: vi.fn(),
  isAdmin: () => true,
  isDepartmentHead: () => false,
  isProgramHead: () => false,
  canManageInstructors: () => true,
  canManageClassrooms: () => true,
  canReviewRequestsForDepartment: () => true,
  canManageInstructorRow: () => true,
  canManageAssignmentsForProgram: () => true,
};

describe('useAuth Hook', () => {
  it('should return auth context when used within AuthProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockAuthContext}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockAuthContext);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.role).toBe('admin');
  });

  it('should throw error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleErrorSpy.mockRestore();
  });

  it('should provide access to login function', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockAuthContext}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe('function');
  });

  it('should provide access to logout function', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockAuthContext}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
  });

  it('should provide access to permission check functions', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockAuthContext}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAdmin()).toBe(true);
    expect(result.current.isDepartmentHead()).toBe(false);
    expect(result.current.isProgramHead()).toBe(false);
    expect(result.current.canManageInstructors()).toBe(true);
    expect(result.current.canManageClassrooms()).toBe(true);
  });

  it('should handle null user state', () => {
    const nullUserContext: AuthContextType = {
      ...mockAuthContext,
      user: null,
      role: null,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={nullUserContext}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.role).toBeNull();
  });

  it('should handle loading state', () => {
    const loadingContext: AuthContextType = {
      ...mockAuthContext,
      loading: true,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={loadingContext}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
  });

  it('should handle error state', () => {
    const errorContext: AuthContextType = {
      ...mockAuthContext,
      error: 'Authentication failed',
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={errorContext}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.error).toBe('Authentication failed');
  });
});
