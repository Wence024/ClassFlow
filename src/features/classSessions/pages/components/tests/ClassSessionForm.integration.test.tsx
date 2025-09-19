import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ClassSessionForm from '../classSession/ClassSessionForm';
import { classSessionSchema } from '../../../../classSessions/types/validation';
import type {
  Course,
  Instructor,
  Classroom,
  ClassGroup,
} from '../../../../classSessionComponents/types';

const MOCK_PROGRAM_ID = 'p1';

// --- Mock Data ---
const mockCourses: Course[] = [
  { id: 'c1', name: 'Test Course', code: 'T101', user_id: 'u1', created_at: '', color: '#fff', program_id: MOCK_PROGRAM_ID },
];
const mockInstructors: Instructor[] = [
  {
    id: 'i1',
    first_name: 'Test',
    last_name: 'Instructor',
    email: 't@t.com',
    user_id: 'u1',
    created_at: '',
    code: 'TI',
    color: '#fff',
    contract_type: null,
    phone: null,
    prefix: null,
    suffix: null,
    program_id: MOCK_PROGRAM_ID,
  },
];
const mockClassrooms: Classroom[] = [
  {
    id: 'r1',
    name: 'Small Room',
    capacity: 20,
    user_id: 'u1',
    created_at: '',
    code: 'R1',
    color: '#fff',
    location: 'A',
    program_id: MOCK_PROGRAM_ID,
  },
  {
    id: 'r2',
    name: 'Large Room',
    capacity: 40,
    user_id: 'u1',
    created_at: '',
    code: 'R2',
    color: '#fff',
    location: 'B',
    program_id: MOCK_PROGRAM_ID,
  },
];
const mockClassGroups: ClassGroup[] = [
  {
    id: 'g1',
    name: 'Small Group',
    student_count: 15,
    user_id: 'u1',
    created_at: '',
    code: 'G1',
    color: '#fff',
    program_id: MOCK_PROGRAM_ID,
  },
  {
    id: 'g2',
    name: 'Large Group',
    student_count: 30,
    user_id: 'u1',
    created_at: '',
    code: 'G2',
    color: '#fff',
    program_id: MOCK_PROGRAM_ID,
  },
];

type ClassSessionFormData = z.infer<typeof classSessionSchema>;

// A wrapper component to initialize react-hook-form
const FormWrapper: React.FC<Partial<React.ComponentProps<typeof ClassSessionForm>>> = (props) => {
  const formMethods = useForm<ClassSessionFormData>({
    resolver: zodResolver(classSessionSchema),
    defaultValues: {
      course_id: mockCourses[0].id,
      instructor_id: mockInstructors[0].id,
      class_group_id: '',
      classroom_id: '',
      period_count: 1,
    },
  });

  return (
    <FormProvider {...formMethods}>
      <ClassSessionForm
        courses={mockCourses}
        instructors={mockInstructors}
        classGroups={mockClassGroups}
        classrooms={mockClassrooms}
        formMethods={formMethods}
        onSubmit={vi.fn()}
        loading={false}
        isEditing={false}
        {...props}
      />
    </FormProvider>
  );
};

describe('ClassSessionForm', () => {
  it('should display a conflict warning when group size exceeds classroom capacity', async () => {
    render(<FormWrapper />);

    fireEvent.change(screen.getByLabelText(/Class Group/i), { target: { value: 'g2' } }); // Large Group (30)
    fireEvent.change(screen.getByLabelText(/Classroom/i), { target: { value: 'r1' } }); // Small Room (20)

    expect(await screen.findByText('Potential Conflicts')).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Capacity conflict: The group "Large Group" \(30 students\) exceeds the capacity of "Small Room" \(20 seats\)\./
      )
    ).toBeInTheDocument();
  });

  it('should remove the conflict warning when selections are changed to be valid', async () => {
    render(<FormWrapper />);

    fireEvent.change(screen.getByLabelText(/Class Group/i), { target: { value: 'g2' } });
    fireEvent.change(screen.getByLabelText(/Classroom/i), { target: { value: 'r1' } });
    expect(await screen.findByText('Potential Conflicts')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Classroom/i), { target: { value: 'r2' } });

    await waitFor(() => {
      expect(screen.queryByText('Potential Conflicts')).not.toBeInTheDocument();
    });
  });
});
