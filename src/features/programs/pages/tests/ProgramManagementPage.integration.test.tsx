/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../shared/auth/contexts/AuthContext';
import * as programsHooks from '../../hooks/usePrograms';
import * as departmentsHooks from '../../../departments/hooks/useDepartments';
import type { AuthContextType } from '../../../shared/auth/types/auth';
import type { ReactNode } from 'react';

// Mock the usePrograms hook
vi.mock('../../hooks/usePrograms');
vi.mock('../../../departments/hooks/useDepartments');
// Mock UI barrel to avoid alias resolution in test environment
vi.mock('@/components/ui', () => {
  const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
  const Card = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  );
  const ConfirmModal = ({
    isOpen,
    children,
    onConfirm,
    confirmText,
    title,
    onClose,
    isLoading,
  }: {
    isOpen: boolean;
    children?: React.ReactNode;
    onConfirm: () => void;
    confirmText: string;
    title: string;
    onClose: () => void;
    isLoading: boolean;
  }) => {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-modal="true" title={title}>
        <div>{children}</div>
        <button onClick={onConfirm} disabled={isLoading}>
          {confirmText || 'Confirm'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };
  const ErrorMessage = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const LoadingSpinner = () => <div>Loading...</div>;
  const Alert = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return { Button, Card, ConfirmModal, ErrorMessage, LoadingSpinner, Alert };
});
// Mock UI subpath modules used by Program fields

vi.mock('@/components/ui/input', () => {
  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />;
  return { Input };
});
vi.mock('@/components/ui/card', () => {
  const Card = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  );
  return { Card };
});
vi.mock('@/components/ui/button', () => {
  const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
  return { Button };
});
vi.mock('@/components/ui/custom/form-field', () => {
  const FormField = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return { default: FormField };
});

/**
 * Test suite for ProgramManagementPage integration tests.
 */
describe('ProgramManagementPage Integration Tests', () => {
  let queryClient: QueryClient;
  const mockCreateMutation = vi.fn();
  const mockUpdateMutation = vi.fn();
  const mockDeleteMutation = vi.fn();
  let d1: string, d2: string;

  const createWrapper =
    (authContext: Partial<AuthContextType>) =>
    ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={authContext as AuthContextType}>
            {children}
          </AuthContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>
    );

  beforeEach(() => {
    d1 = crypto.randomUUID();
    d2 = crypto.randomUUID();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();

    // Reset mock mutations
    mockCreateMutation.mockReset();
    mockUpdateMutation.mockReset();
    mockDeleteMutation.mockReset();

    // Mock departments hook
    vi.mocked(departmentsHooks.useDepartments).mockReturnValue({
      listQuery: {
        data: [
          { id: d1, name: 'Computer Science', code: 'CS', created_at: '' },
          { id: d2, name: 'Engineering', code: 'ENG', created_at: '' },
        ],
        isLoading: false,
        error: null,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateMutation: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteMutation: {} as any,
    });
  });

  it('should deny access to non-admin users', async () => {
    const nonAdminContext: Partial<AuthContextType> = {
      isAdmin: () => false,
    };

    vi.mocked(programsHooks.usePrograms).mockReturnValue({
      listQuery: { data: [], isLoading: false, error: null },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation: { mutateAsync: mockCreateMutation } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateMutation: { mutateAsync: mockUpdateMutation } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteMutation: { mutateAsync: mockDeleteMutation } as any,
    });

    const { default: ProgramManagementPage } = await import('../ProgramManagementPage');
    render(<ProgramManagementPage />, { wrapper: createWrapper(nonAdminContext) });
    expect(screen.getByText(/you do not have access to this page/i)).toBeInTheDocument();
  });

  it('should display a list of programs for admin users', async () => {
    const adminContext: Partial<AuthContextType> = {
      isAdmin: () => true,
    };
    const mockPrograms = [
      { id: 'p1', name: 'Program A', short_code: 'PA', department_id: d1, created_at: '' },
      { id: 'p2', name: 'Program B', short_code: 'PB', department_id: d1, created_at: '' },
    ];

    vi.mocked(programsHooks.usePrograms).mockReturnValue({
      listQuery: { data: mockPrograms, isLoading: false, error: null },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation: { mutateAsync: mockCreateMutation } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateMutation: { mutateAsync: mockUpdateMutation } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteMutation: { mutateAsync: mockDeleteMutation } as any,
    });

    const { default: ProgramManagementPage } = await import('../ProgramManagementPage');
    render(<ProgramManagementPage />, { wrapper: createWrapper(adminContext) });

    expect(screen.getByText('Program A')).toBeInTheDocument();
    expect(screen.getByText('Program B')).toBeInTheDocument();
  });

  it('should call the create mutation when the create form is submitted', async () => {
    const adminContext: Partial<AuthContextType> = {
      isAdmin: () => true,
    };

    vi.mocked(programsHooks.usePrograms).mockReturnValue({
      listQuery: { data: [], isLoading: false, error: null },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation: { mutateAsync: mockCreateMutation, isPending: false } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateMutation: { mutateAsync: mockUpdateMutation, isPending: false } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteMutation: { mutateAsync: mockDeleteMutation, isPending: false } as any,
    });

    const { default: ProgramManagementPage } = await import('../ProgramManagementPage');
    render(<ProgramManagementPage />, { wrapper: createWrapper(adminContext) });

    await userEvent.type(screen.getByLabelText(/name/i), 'New Program');
    await userEvent.type(screen.getByLabelText(/code/i), 'NP');
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: d1 } });
    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Program',
          short_code: 'NP',
          department_id: expect.any(String),
        })
      );
    });
  });

  it('should populate the form for editing and call the update mutation on save', async () => {
    const adminContext: Partial<AuthContextType> = {
      isAdmin: () => true,
    };
    const mockPrograms = [
      { id: 'p1', name: 'Program A', short_code: 'PA', department_id: d1, created_at: '' },
    ];

    vi.mocked(programsHooks.usePrograms).mockReturnValue({
      listQuery: { data: mockPrograms, isLoading: false, error: null },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation: { mutateAsync: mockCreateMutation, isPending: false } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateMutation: { mutateAsync: mockUpdateMutation, isPending: false } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteMutation: { mutateAsync: mockDeleteMutation, isPending: false } as any,
    });

    const { default: ProgramManagementPage } = await import('../ProgramManagementPage');
    render(<ProgramManagementPage />, { wrapper: createWrapper(adminContext) });

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Check if form is populated
    expect(screen.getByLabelText(/name/i)).toHaveValue('Program A');
    expect(screen.getByLabelText(/code/i)).toHaveValue('PA');

    // Change value and save
    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.type(screen.getByLabelText(/name/i), 'Updated Program A');
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: d1 } });
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: 'p1',
        update: expect.objectContaining({
          name: 'Updated Program A',
          short_code: 'PA',
          department_id: d1,
        }),
      });
    });
  });

  it('should call the delete mutation when deletion is confirmed', async () => {
    const adminContext: Partial<AuthContextType> = {
      isAdmin: () => true,
    };
    const mockPrograms = [
      { id: 'p1', name: 'Program A', short_code: 'PA', department_id: d1, created_at: '' },
    ];

    vi.mocked(programsHooks.usePrograms).mockReturnValue({
      listQuery: { data: mockPrograms, isLoading: false, error: null },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation: { mutateAsync: mockCreateMutation, isPending: false } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateMutation: { mutateAsync: mockUpdateMutation, isPending: false } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteMutation: { mutateAsync: mockDeleteMutation, isPending: false } as any,
    });

    const { default: ProgramManagementPage } = await import('../ProgramManagementPage');
    render(<ProgramManagementPage />, { wrapper: createWrapper(adminContext) });

    // Click delete button on the program card
    const programCard = screen.getByText('Program A').closest('.p-4');
    await userEvent.click(within(programCard).getByRole('button', { name: /delete/i }));

    // Confirm deletion in the modal
    const modal = screen.getByRole('dialog');
    await userEvent.click(within(modal).getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockDeleteMutation).toHaveBeenCalledWith('p1');
    });
  });
});
