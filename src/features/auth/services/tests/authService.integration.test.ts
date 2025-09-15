import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getStoredUser } from '../authService';
import { supabase } from '../../../../lib/supabase';

vi.mock('../../../../lib/supabase');

describe('authService.getStoredUser - profile hydration', () => {
  const mockSession = {
    user: { id: 'u1', email: 'test@example.com', user_metadata: { name: 'Test User' } },
    access_token: 'abc',
    refresh_token: 'def',
  };
  const mockProfile = { role: 'admin', program_id: 'p1' };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return user with role and program_id from profiles table', async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const fromMock = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: singleMock,
    }));
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    supabase.from = fromMock;

    const user = await getStoredUser();

    expect(user).toEqual(
      expect.objectContaining({
        id: 'u1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        program_id: 'p1',
      })
    );
    expect(fromMock).toHaveBeenCalledWith('profiles');
    const mockCall = fromMock.mock.results[0].value;
    expect(mockCall.select).toHaveBeenCalledWith('role, program_id');
    expect(mockCall.eq).toHaveBeenCalledWith('id', 'u1');
    expect(mockCall.single).toHaveBeenCalled();
  });

  it('should return null if profile not found', async () => {
    const singleMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: new Error('Profile not found') });
    const fromMock = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: singleMock,
    }));
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    supabase.from = fromMock;

    const user = await getStoredUser();

    expect(user).toBeNull();
  });

  it('should return null if no active session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    const fromMock = vi.fn();
    supabase.from = fromMock;

    const user = await getStoredUser();

    expect(user).toBeNull();
    expect(fromMock).not.toHaveBeenCalled();
  });
});
