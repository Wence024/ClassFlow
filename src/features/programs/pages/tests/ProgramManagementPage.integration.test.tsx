/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as programsHooks from '../../hooks/usePrograms';
import * as departmentsHooks from '../../../departments/hooks/useDepartments';
import type { AuthContextType } from '../../../auth/types/auth';
import type { ReactNode } from 'react';

// Mock the usePrograms hook
vi.mock('../../hooks/usePrograms');
vi.mock('../../../departments/hooks/useDepartments');
// Mock UI barrel to avoid alias resolution in test environment
vi.mock('@/components/ui', () => {
  const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
  const Card = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const ConfirmModal = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const ErrorMessage = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const LoadingSpinner = () => <div>Loading...</div>;
  const Alert = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return { Button, Card, ConfirmModal, ErrorMessage, LoadingSpinner, Alert };
});
// Mock UI subpath modules used by Program fields
vi.mock('@/components/ui/form', () => {
  const Form = ({ children, ...rest }: { children?: React.ReactNode }) => <form {...rest}>{children}</form>;
  const FormItem = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const FormLabel = ({ children, htmlFor }: { children?: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  );
  const FormControl = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
  const FormMessage = ({ children }: { children?: React.ReactNode }) => <p>{children}</p>;
  const FormDescription = ({ children }: { children?: React.ReactNode }) => <p>{children}</p>;
  // Minimal RHF field wrapper that just renders children
  const FormField = ({
    render,
  }: {
    render: (ctx: {
      field: { onChange: () => void; value: string; name: string };
    }) => React.ReactNode;
  }) => <>{render({ field: { onChange: () => {}, value: '', name: '' } })}</>;
  return { Form, FormItem, FormLabel, FormControl, FormMessage, FormDescription, FormField };
});
vi.mock('@/components/ui/input', () => {
  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />;
  return { Input };
});
vi.mock('@/components/ui/card', () => {
  const Card = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
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

  const createWrapper = (authContext: Partial<AuthContextType>) => ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authContext as AuthContextType}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );

  beforeEach(() => {
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
          { id: 'd1', name: 'Computer Science', code: 'CS', created_at: '' },
          { id: 'd2', name: 'Engineering', code: 'ENG', created_at: '' },
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
      { id: 'p1', name: 'Program A', short_code: 'PA', department_id: 'd1', created_at: '' },
      { id: 'p2', name: 'Program B', short_code: 'PB', department_id: 'd1', created_at: '' },
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

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Program' } });
    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'NP' } });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'd1' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Program', short_code: 'NP', department_id: expect.any(String) })
      );
    });
  });

  it('should populate the form for editing and call the update mutation on save', async () => {
    const adminContext: Partial<AuthContextType> = {
      isAdmin: () => true,
    };
    const mockPrograms = [{ id: 'p1', name: 'Program A', short_code: 'PA', department_id: 'd1', created_at: '' }];

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

    // Click edit button on the program card
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Check if form is populated
    expect(screen.getByLabelText(/name/i)).toHaveValue('Program A');
    expect(screen.getByLabelText(/code/i)).toHaveValue('PA');

    // Change value and save
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Program A' } });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'd1' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: 'p1',
        update: expect.objectContaining({ name: 'Updated Program A', short_code: 'PA', department_id: 'd1' }),
      });
    });
  });

  it('should call the delete mutation when deletion is confirmed', async () => {
    const adminContext: Partial<AuthContextType> = {
        isAdmin: () => true,
    };
    const mockPrograms = [{ id: 'p1', name: 'Program A', short_code: 'PA', department_id: 'd1', created_at: '' }];

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
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    // Confirm deletion in the modal
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
        expect(mockDeleteMutation).toHaveBeenCalledWith('p1');
    });
  });
});
