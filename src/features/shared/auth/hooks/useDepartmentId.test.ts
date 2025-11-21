import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDepartmentId } from './useDepartmentId';
import * as useAuthModule from './useAuth';
import * as useProgramsModule from '@/features/admin/manage-programs/hooks/usePrograms';
import { User } from '../types/auth';
import { Program } from '../../programs/types/program';
import { AuthContextType } from '../types/auth';
import { usePrograms } from '@/features/admin/manage-programs/hooks/usePrograms';

vi.mock('./useAuth');
vi.mock('@/features/admin/manage-programs/hooks/usePrograms');

const mockDeptHeadUser: User = {
  id: 'dept-head-id',
  name: 'Dept Head',
  email: 'dept@test.com',
  role: 'department_head',
  program_id: null,
  department_id: 'dept-123',
};

const mockProgHeadUser: User = {
  id: 'prog-head-id',
  name: 'Prog Head',
  email: 'prog@test.com',
  role: 'program_head',
  program_id: 'prog-456',
  department_id: null,
};

const mockAdminUser: User = {
  id: 'admin-id',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'admin',
  program_id: null,
  department_id: null,
};

const mockUserWithBoth: User = {
  id: 'user-id',
  name: 'User',
  email: 'user@test.com',
  role: 'department_head',
  program_id: 'prog-222',
  department_id: 'dept-111',
};

const mockProgram: Program = {
  id: 'prog-456',
  name: 'CS',
  short_code: 'CS',
  department_id: 'dept-789',
  created_at: '',
};

const mockProgram2: Program = {
  id: 'prog-222',
  name: 'IT',
  short_code: 'IT',
  department_id: 'dept-999',
  created_at: '',
};

describe('useDepartmentId', () => {
  it('should return explicit department_id for department heads', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: mockDeptHeadUser,
    } as AuthContextType);

    vi.spyOn(useProgramsModule, 'usePrograms').mockReturnValue({
      listQuery: { data: [] },
    } as unknown as ReturnType<typeof usePrograms>);

    const { result } = renderHook(() => useDepartmentId());
    expect(result.current).toBe('dept-123');
  });

  it('should derive department from program for program heads', async () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: mockProgHeadUser,
    } as AuthContextType);

    vi.spyOn(useProgramsModule, 'usePrograms').mockReturnValue({
      listQuery: {
        data: [mockProgram],
      },
    } as unknown as ReturnType<typeof usePrograms>);

    const { result } = renderHook(() => useDepartmentId());

    await waitFor(() => {
      expect(result.current).toBe('dept-789');
    });
  });

  it('should return null for admins with no assignments', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: mockAdminUser,
    } as AuthContextType);

    vi.spyOn(useProgramsModule, 'usePrograms').mockReturnValue({
      listQuery: { data: [] },
    } as unknown as ReturnType<typeof usePrograms>);

    const { result } = renderHook(() => useDepartmentId());
    expect(result.current).toBeNull();
  });

  it('should prioritize explicit department_id over program', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: mockUserWithBoth,
    } as AuthContextType);

    vi.spyOn(useProgramsModule, 'usePrograms').mockReturnValue({
      listQuery: {
        data: [mockProgram2],
      },
    } as unknown as ReturnType<typeof usePrograms>);

    const { result } = renderHook(() => useDepartmentId());
    expect(result.current).toBe('dept-111');
  });

  it('should return null when user is null', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
    } as AuthContextType);

    vi.spyOn(useProgramsModule, 'usePrograms').mockReturnValue({
      listQuery: { data: [] },
    } as unknown as ReturnType<typeof usePrograms>);

    const { result } = renderHook(() => useDepartmentId());
    expect(result.current).toBeNull();
  });
});
