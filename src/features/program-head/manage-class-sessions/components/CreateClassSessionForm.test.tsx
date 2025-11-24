import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateClassSessionForm } from '../../src/features/program-head/manage-class-sessions/components/CreateClassSessionForm';
import { ClassSessionService } from '../../src/lib/services/classSessionService';

// Mock the service
vi.mock('../../src/lib/services/classSessionService', () => ({
  ClassSessionService: {
    createIncompleteClassSession: vi.fn(),
  }
}));

// Mock data
const mockPrograms = [
  { id: 'prog-1', name: 'Computer Science' },
  { id: 'prog-2', name: 'Mathematics' }
];

const mockCourses = [
  { id: 'course-1', name: 'Math 101', program_id: 'prog-1' },
  { id: 'course-2', name: 'CS 101', program_id: 'prog-1' }
];

const mockGroups = [
  { id: 'group-1', name: 'Group A', program_id: 'prog-1' },
  { id: 'group-2', name: 'Group B', program_id: 'prog-1' }
];

const mockInstructors = [
  { id: 'instructor-1', name: 'Dr. Smith', program_id: 'prog-1' },
  { id: 'instructor-2', name: 'Dr. Jones', program_id: 'prog-1' }
];

const mockClassrooms = [
  { id: 'classroom-1', name: 'Room 101', capacity: 30 },
  { id: 'classroom-2', name: 'Room 202', capacity: 25 }
];

describe('CreateClassSessionForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows creating incomplete session with optional resources', async () => {
    (ClassSessionService.createIncompleteClassSession as vi.Mock).mockResolvedValue({
      id: 'session-1',
      course: { id: 'course-1', name: 'Math 101' },
      group: { id: 'group-1', name: 'Group A' },
      instructor: null,
      classroom: null,
      period_count: 2,
      program_id: 'prog-1'
    });
    
    render(
      <CreateClassSessionForm
        onSuccess={mockOnSuccess}
        programs={mockPrograms}
        courses={mockCourses}
        groups={mockGroups}
        instructors={mockInstructors}
        classrooms={mockClassrooms}
      />
    );
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/course/i), { target: { value: 'course-1' } });
    fireEvent.change(screen.getByLabelText(/class group/i), { target: { value: 'group-1' } });
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: '2' } });
    
    // Don't fill instructor or classroom (optional fields)
    
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    await waitFor(() => {
      expect(ClassSessionService.createIncompleteClassSession).toHaveBeenCalledWith(
        expect.objectContaining({
          course_id: 'course-1',
          class_group_id: 'group-1',
          instructor_id: null,
          classroom_id: null,
          period_count: 2,
        })
      );
    });
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('shows info message about optional resource assignment', () => {
    render(
      <CreateClassSessionForm
        onSuccess={() => {}}
        programs={mockPrograms}
        courses={mockCourses}
        groups={mockGroups}
        instructors={mockInstructors}
        classrooms={mockClassrooms}
      />
    );
    
    expect(screen.getByText(/you can assign instructor and classroom later/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <CreateClassSessionForm
        onSuccess={mockOnSuccess}
        programs={mockPrograms}
        courses={mockCourses}
        groups={mockGroups}
        instructors={mockInstructors}
        classrooms={mockClassrooms}
      />
    );
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    // Check that validation errors appear
    await waitFor(() => {
      expect(screen.getByText(/course is required/i)).toBeInTheDocument();
      expect(screen.getByText(/class group is required/i)).toBeInTheDocument();
      expect(screen.getByText(/duration is required/i)).toBeInTheDocument();
    });
  });

  it('allows creating session with partial resources (only instructor)', async () => {
    (ClassSessionService.createIncompleteClassSession as vi.Mock).mockResolvedValue({
      id: 'session-1',
      course: { id: 'course-1', name: 'Math 101' },
      group: { id: 'group-1', name: 'Group A' },
      instructor: { id: 'instructor-1', name: 'Dr. Smith' },
      classroom: null,
      period_count: 2,
      program_id: 'prog-1'
    });
    
    render(
      <CreateClassSessionForm
        onSuccess={mockOnSuccess}
        programs={mockPrograms}
        courses={mockCourses}
        groups={mockGroups}
        instructors={mockInstructors}
        classrooms={mockClassrooms}
      />
    );
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/course/i), { target: { value: 'course-1' } });
    fireEvent.change(screen.getByLabelText(/class group/i), { target: { value: 'group-1' } });
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: '2' } });
    
    // Fill only instructor (optional field)
    fireEvent.change(screen.getByLabelText(/instructor/i), { target: { value: 'instructor-1' } });
    
    // Don't fill classroom (optional field)
    
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    await waitFor(() => {
      expect(ClassSessionService.createIncompleteClassSession).toHaveBeenCalledWith(
        expect.objectContaining({
          course_id: 'course-1',
          class_group_id: 'group-1',
          instructor_id: 'instructor-1',
          classroom_id: null,
          period_count: 2,
        })
      );
    });
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('allows creating session with partial resources (only classroom)', async () => {
    (ClassSessionService.createIncompleteClassSession as vi.Mock).mockResolvedValue({
      id: 'session-1',
      course: { id: 'course-1', name: 'Math 101' },
      group: { id: 'group-1', name: 'Group A' },
      instructor: null,
      classroom: { id: 'classroom-1', name: 'Room 101' },
      period_count: 2,
      program_id: 'prog-1'
    });
    
    render(
      <CreateClassSessionForm
        onSuccess={mockOnSuccess}
        programs={mockPrograms}
        courses={mockCourses}
        groups={mockGroups}
        instructors={mockInstructors}
        classrooms={mockClassrooms}
      />
    );
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/course/i), { target: { value: 'course-1' } });
    fireEvent.change(screen.getByLabelText(/class group/i), { target: { value: 'group-1' } });
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: '2' } });
    
    // Don't fill instructor (optional field)
    
    // Fill only classroom (optional field)
    fireEvent.change(screen.getByLabelText(/classroom/i), { target: { value: 'classroom-1' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    await waitFor(() => {
      expect(ClassSessionService.createIncompleteClassSession).toHaveBeenCalledWith(
        expect.objectContaining({
          course_id: 'course-1',
          class_group_id: 'group-1',
          instructor_id: null,
          classroom_id: 'classroom-1',
          period_count: 2,
        })
      );
    });
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});