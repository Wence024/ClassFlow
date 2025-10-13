/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import ClassSessionForm from '../classSession/ClassSessionForm';
import { classSessionSchema } from '../../../../classSessions/types/validation';
import type {
  Course,
  Instructor,
  Classroom,
  ClassGroup,
} from '../../../../classSessionComponents/types';
import { zodResolver } from '@hookform/resolvers/zod';

const MOCK_PROGRAM_ID = 'p1';

// --- Mock Data ---
const mockCourses: Course[] = [
  {
    id: 'c1',
    name: 'Test Course',
    code: 'T101',
    created_at: '',
    color: '#fff',
    program_id: MOCK_PROGRAM_ID,
    created_by: 'u1',
  },
];
const mockInstructors: Instructor[] = [
  {
    id: 'i1',
    first_name: 'Test',
    last_name: 'Instructor',
    email: 't@t.com',
    created_at: '',
    code: 'TI',
    color: '#fff',
    contract_type: null,
    phone: null,
    prefix: null,
    suffix: null,
    created_by: 'u1',
    department_id: null,
  },
];
const mockClassrooms: Classroom[] = [
  {
    id: 'r1',
    name: 'Small Room',
    capacity: 20,
    created_at: '',
    code: 'R1',
    color: '#fff',
    location: 'A',
    created_by: 'u1',
    preferred_department_id: null,
  },
  {
    id: 'r2',
    name: 'Large Room',
    capacity: 40,
    created_at: '',
    code: 'R2',
    color: '#fff',
    location: 'B',
    created_by: 'u1',
    preferred_department_id: null,
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
    const user = userEvent.setup();
    render(<FormWrapper />);

    await waitFor(() => expect(screen.getByLabelText(/Class Group/i)).not.toBeDisabled());
    await user.click(screen.getByLabelText(/Class Group/i));
    const groupListbox = await screen.findByRole('listbox');
    await user.click(within(groupListbox).getByText('Large Group'));

    // Select the "Small Room"
    await waitFor(() => expect(screen.getByLabelText(/Classroom/i)).not.toBeDisabled());
    await user.click(screen.getByLabelText(/Classroom/i));
    const classroomListbox = await screen.findByRole('listbox');
    await user.click(within(classroomListbox).getByText('Small Room'));

    expect(await screen.findByText('Potential Conflicts')).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Capacity conflict: The group "Large Group" \(30 students\) exceeds the capacity of classroom "Small Room" \(20 seats\)\./
      )
    ).toBeInTheDocument();
  });

  it('should remove the conflict warning when selections are changed to be valid', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await waitFor(() => expect(screen.getByLabelText(/Class Group/i)).not.toBeDisabled());
    await user.click(screen.getByLabelText(/Class Group/i));
    const groupListbox = await screen.findByRole('listbox');
    await user.click(within(groupListbox).getByText('Large Group'));
    await waitFor(() => expect(screen.getByLabelText(/Classroom/i)).not.toBeDisabled());
    await user.click(screen.getByLabelText(/Classroom/i));
    const classroomListbox = await screen.findByRole('listbox');
    await user.click(within(classroomListbox).getByText('Small Room'));
    expect(await screen.findByText('Potential Conflicts')).toBeInTheDocument();

    // Fix the conflict
    await waitFor(() => expect(screen.getByLabelText(/Classroom/i)).not.toBeDisabled());
    await user.click(screen.getByLabelText(/Classroom/i));
    const classroomListbox2 = await screen.findByRole('listbox');
    await user.click(within(classroomListbox2).getByText('Large Room'));

    await waitFor(() => {
      expect(screen.queryByText('Potential Conflicts')).not.toBeInTheDocument();
    });
  });
});
