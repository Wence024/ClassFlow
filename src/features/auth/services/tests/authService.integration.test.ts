import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getStoredUser } from '../authService';
import { supabase } from '../../../../lib/supabase';

vi.mock('../../../../lib/supabase', () => {
  const mockFrom = vi.fn(() => ({
    select: vi.fn(() => mockFrom),
    eq: vi.fn(() => mockFrom),
    single: vi.fn(),
  }));

  return {
    auth: {
      getSession: vi.fn(),
    },
    from: mockFrom,
  };
});

const { auth, from } = supabase as any;

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
    (auth.getSession as any).mockResolvedValue({ data: { session: mockSession }, error: null });
    (from as any).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
    }));

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
    expect(from).toHaveBeenCalledWith('profiles');
    const mockFromReturn = (from as any).mock.results[0].value;
    expect(mockFromReturn.select).toHaveBeenCalledWith('role, program_id');
    expect(mockFromReturn.eq).toHaveBeenCalledWith('id', 'u1');
    expect(mockFromReturn.single).toHaveBeenCalled();
  });

  it('should return null if profile not found', async () => {
    (auth.getSession as any).mockResolvedValue({ data: { session: mockSession }, error: null });
    (from as any).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('Profile not found') }),
    }));

    const user = await getStoredUser();

    expect(user).toBeNull();
  });

  it('should return null if no active session', async () => {
    (auth.getSession as any).mockResolvedValue({ data: { session: null }, error: null });

    const user = await getStoredUser();

    expect(user).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });
});
