import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getStoredUser } from '../authService';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

const mockedSupabase = vi.mocked(supabase, true);

describe('authService.getStoredUser - profile hydration', () => {
  const mockSession = {
    data: {
      session: {
        user: {
          id: 'u1',
          email: 'test@example.com',
          user_metadata: { name: 'Test User' },
          app_metadata: {},
          aud: '',
          created_at: '',
        },
        access_token: 'abc',
        refresh_token: 'def',
        expires_in: 3600,
        token_type: 'bearer',
      } as unknown as Session,
    },
    error: null,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Reset mocks on the deep mocked object
    mockedSupabase.auth.getSession.mockClear();
    mockedSupabase.from.mockClear();
  });

  it('should return user with role and program_id from profiles and user_roles tables', async () => {
    mockedSupabase.auth.getSession.mockResolvedValue(mockSession);

    const profileData = { program_id: 'p1', department_id: 'd1' };
    const roleData = [{ role: 'admin' }];

    // Mock the from('profiles') call with chained methods
    const profilesSelectMock = {
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profileData, error: null }),
    };

    const profilesFromMock = {
      select: vi.fn().mockReturnValue(profilesSelectMock),
    };

    // Mock the from('user_roles') call with chained methods
    const userRolesSelectMock = {
      eq: vi.fn().mockResolvedValue({ data: roleData, error: null }),
    };

    const userRolesFromMock = {
      select: vi.fn().mockReturnValue(userRolesSelectMock),
    };

    // Mock the supabase.from calls: first for 'profiles', then for 'user_roles'
    mockedSupabase.from
      .mockReturnValueOnce(profilesFromMock as any)
      .mockReturnValueOnce(userRolesFromMock as any);

    const user = await getStoredUser();

    expect(user).toEqual(
      expect.objectContaining({
        id: 'u1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        program_id: 'p1',
        department_id: 'd1',
      })
    );

    expect(mockedSupabase.from).toHaveBeenCalledWith('profiles');
    expect(profilesFromMock.select).toHaveBeenCalledWith('program_id, department_id');
    expect(profilesSelectMock.eq).toHaveBeenCalledWith('id', 'u1');
    expect(profilesSelectMock.single).toHaveBeenCalled();

    expect(mockedSupabase.from).toHaveBeenCalledWith('user_roles');
    expect(userRolesFromMock.select).toHaveBeenCalledWith('role');
    expect(userRolesSelectMock.eq).toHaveBeenCalledWith('user_id', 'u1');
  });

  it('should return null if profile not found', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedSupabase.auth.getSession.mockResolvedValue(mockSession);

    // Mock the from('profiles') call with chained methods that returns null data (record not found)
    // In Supabase, when .single() doesn't find a record, it returns data: null, error: null
    const profilesSelectMock = {
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    const profilesFromMock = {
      select: vi.fn().mockReturnValue(profilesSelectMock),
    };

    // Mock the from('user_roles') call with chained methods so the function can continue
    const userRolesSelectMock = {
      eq: vi.fn().mockResolvedValue({ data: [{ role: 'program_head' }], error: null }),
    };

    const userRolesFromMock = {
      select: vi.fn().mockReturnValue(userRolesSelectMock),
    };

    // Mock the supabase.from calls: first for 'profiles', then for 'user_roles'
    mockedSupabase.from
      .mockReturnValueOnce(profilesFromMock as any)
      .mockReturnValueOnce(userRolesFromMock as any);

    const user = await getStoredUser();

    expect(user).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should return null if no active session', async () => {
    mockedSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    const user = await getStoredUser();

    expect(user).toBeNull();
    expect(mockedSupabase.from).not.toHaveBeenCalled();
  });
});
