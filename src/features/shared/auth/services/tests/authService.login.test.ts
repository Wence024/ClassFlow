/**
 * Unit tests for authService login functionality.
 * Tests authentication, profile fetching, and role assignment.
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { login } from '../authService';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => {
  const mockAuth = {
    signInWithPassword: vi.fn(),
  };

  const mockFrom = vi.fn();

  return {
    supabase: {
      auth: mockAuth,
      from: mockFrom,
    },
  };
});

const mockedSupabase = vi.mocked(supabase);

describe('authService.login', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should successfully login and return user with profile and role', async () => {
    const mockAuthData = {
      data: {
        user: {
          id: 'u1',
          email: 'test@example.com',
          user_metadata: { name: 'Test User' },
        },
        session: {
          access_token: 'test-token',
          refresh_token: 'refresh-token',
        },
      },
      error: null,
    };

    const mockProfile = { program_id: 'p1', department_id: 'd1' };
    const mockRole = [{ role: 'admin' }];

    mockedSupabase.auth.signInWithPassword.mockResolvedValue(mockAuthData);

    const fromProfilesMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };

    const fromRolesMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: mockRole, error: null }),
    };

    mockedSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return fromProfilesMock;
      if (table === 'user_roles') return fromRolesMock;
      return {};
    });

    const result = await login('test@example.com', 'password123');

    expect(result.user).toEqual({
      id: 'u1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      program_id: 'p1',
      department_id: 'd1',
    });
    expect(result.token).toBe('test-token');
  });

  it('should handle invalid credentials error', async () => {
    mockedSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Invalid login credentials'),
    });

    await expect(login('wrong@example.com', 'wrongpass')).rejects.toThrow(
      'Invalid email or password'
    );
  });

  it('should handle unverified email error', async () => {
    mockedSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Email not confirmed'),
    });

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'Please verify your email address'
    );
  });

  it('should handle profile fetch failure', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockAuthData = {
      data: {
        user: { id: 'u1', email: 'test@example.com' },
        session: { access_token: 'token' },
      },
      error: null,
    };

    mockedSupabase.auth.signInWithPassword.mockResolvedValue(mockAuthData);

    const fromMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Profile not found'),
      }),
    };

    mockedSupabase.from.mockReturnValue(fromMock);

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'could not find user profile'
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle role fetch failure', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockAuthData = {
      data: {
        user: { id: 'u1', email: 'test@example.com' },
        session: { access_token: 'token' },
      },
      error: null,
    };

    const mockProfile = { program_id: 'p1', department_id: 'd1' };

    mockedSupabase.auth.signInWithPassword.mockResolvedValue(mockAuthData);

    const fromProfilesMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };

    const fromRolesMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Role not found'),
      }),
    };

    mockedSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return fromProfilesMock;
      if (table === 'user_roles') return fromRolesMock;
      return {};
    });

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'could not fetch user role'
    );

    consoleErrorSpy.mockRestore();
  });

  it('should default to program_head role if no role found', async () => {
    const mockAuthData = {
      data: {
        user: { id: 'u1', email: 'test@example.com' },
        session: { access_token: 'token' },
      },
      error: null,
    };

    const mockProfile = { program_id: 'p1', department_id: null };

    mockedSupabase.auth.signInWithPassword.mockResolvedValue(mockAuthData);

    const fromProfilesMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };

    const fromRolesMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    mockedSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return fromProfilesMock;
      if (table === 'user_roles') return fromRolesMock;
      return {};
    });

    const result = await login('test@example.com', 'password');

    expect(result.user.role).toBe('program_head');
  });
});
