/**
 * Integration tests for Class Groups component.
 * Placeholder test - full implementation requires component refactoring.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ClassGroupManagement from '../../../classSessionComponents/pages/ClassGroupTab';
import { AuthContext } from '@/features/shared/auth/contexts/AuthContext';
import type { AuthContextType } from '@/features/shared/auth/types/auth';

vi.mock('../hooks/useClassGroups');

const mockClassGroups = [
  {
    id: 'g1',
    name: 'CS 1A',
    code: '1A',
    program_id: 'p1',
    user_id: 'u1',
    student_count: 30,
    created_at: '',
    color: '#4f46e5',
  },
  {
    id: 'g2',
    name: 'CS 2B',
    code: '2B',
    program_id: 'p1',
    user_id: 'u1',
    student_count: 25,
    created_at: '',
    color: '#10b981',
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const authValue: AuthContextType = {
    user: {
      id: 'u1',
      email: 'test@example.com',
      role: 'program_head',
      program_id: 'p1',
      department_id: 'd1',
      full_name: 'Test User',
    },
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('ClassGroupManagement Component', () => {
  it('should render the component', () => {
    render(<ClassGroupManagement />, { wrapper: createWrapper() });

    expect(screen.getByText(/class groups/i)).toBeInTheDocument();
  });
});
