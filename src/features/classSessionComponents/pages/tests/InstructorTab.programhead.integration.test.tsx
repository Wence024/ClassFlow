/**
 * Integration tests for InstructorTab component with Program Head user.
 * 
 * Tests the read-only browsing behavior for program heads viewing instructors.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import InstructorTab from '../InstructorTab';
import { AuthProvider } from '../../../auth/contexts/AuthProvider';
import { supabase } from '../../../../lib/supabase';

describe('InstructorTab - Program Head Integration', () => {
  let queryClient: QueryClient;
  let testUserId: string;
  let testProgramId: string;
  let testDepartmentId: string;

  beforeEach(async () => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    // Create test department
    const { data: dept } = await supabase
      .from('departments')
      .insert({ name: 'Test Department for Instructor Browse', code: 'TDIB' })
      .select()
      .single();
    testDepartmentId = dept!.id;

    // Create test program under the department
    const { data: program } = await supabase
      .from('programs')
      .insert({
        name: 'Test Program for Instructor Browse',
        code: 'TPIB',
        department_id: testDepartmentId,
      })
      .select()
      .single();
    testProgramId = program!.id;

    // Create program head user (department_id should be NULL)
    const userId = await (
      window as { create_test_user?: (email: string, password: string, name: string, role: string, programId: string | null, deptId: string | null) => Promise<string> }
    ).create_test_user?.(
      'proghead.instructor.test@example.com',
      'password123',
      'Program Head Test User',
      'program_head',
      testProgramId,
      null // NULL department_id for program heads
    );

    if (!userId) {
      throw new Error('Failed to create test user - create_test_user helper not available');
    }
    testUserId = userId;

    // Sign in as the program head
    await supabase.auth.signInWithPassword({
      email: 'proghead.instructor.test@example.com',
      password: 'password123',
    });

    // Create test instructors in the department
    await supabase.from('instructors').insert([
      {
        first_name: 'John',
        last_name: 'Doe',
        code: 'JD001',
        department_id: testDepartmentId,
        created_by: testUserId,
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        code: 'JS002',
        department_id: testDepartmentId,
        created_by: testUserId,
      },
    ]);
  });

  afterEach(async () => {
    await supabase.auth.signOut();
    
    // Cleanup test data
    if (testUserId) {
      await (
        window as { delete_test_user?: (email: string) => Promise<void> }
      ).delete_test_user?.('proghead.instructor.test@example.com');
    }
    
    if (testProgramId) {
      await supabase.from('programs').delete().eq('id', testProgramId);
    }
    
    if (testDepartmentId) {
      await supabase.from('instructors').delete().eq('department_id', testDepartmentId);
      await supabase.from('departments').delete().eq('id', testDepartmentId);
    }

    queryClient.clear();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <InstructorTab />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('should display instructors in read-only mode for program heads', async () => {
    renderComponent();

    // Wait for instructors to load
    await waitFor(() => {
      expect(screen.getByText('Browse Instructors')).toBeInTheDocument();
    });

    // Should show the info alert about browsing
    expect(
      screen.getByText(/You can browse instructors from all departments/i)
    ).toBeInTheDocument();

    // Should display instructors
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should NOT show the create/edit form for program heads', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Browse Instructors')).toBeInTheDocument();
    });

    // Form should not be visible
    expect(screen.queryByText('Create Instructor')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit Instructor')).not.toBeInTheDocument();
  });

  it('should NOT show edit/delete buttons on instructor cards for program heads', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Edit/Delete buttons should not be present (isOwner = false)
    const editButtons = screen.queryAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });

    expect(editButtons).toHaveLength(0);
    expect(deleteButtons).toHaveLength(0);
  });

  it('should allow program heads to search instructors', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Find and use the search input
    const searchInput = screen.getByPlaceholderText(/search by name or code/i);
    
    // Type in search query
    await waitFor(() => {
      searchInput.focus();
      (searchInput as HTMLInputElement).value = 'John';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Should only show matching instructor
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('should fetch instructors using getAllInstructors for program heads', async () => {
    // Create an instructor in a different department
    const { data: otherDept } = await supabase
      .from('departments')
      .insert({ name: 'Other Department', code: 'OTHD' })
      .select()
      .single();

    await supabase.from('instructors').insert({
      first_name: 'Cross',
      last_name: 'Department',
      code: 'CD003',
      department_id: otherDept!.id,
      created_by: testUserId,
    });

    renderComponent();

    // Program head should see instructors from ALL departments
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Cross Department')).toBeInTheDocument();
    });

    // Cleanup
    await supabase.from('instructors').delete().eq('department_id', otherDept!.id);
    await supabase.from('departments').delete().eq('id', otherDept!.id);
  });
});
