import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ActionButton, FormField } from '../../../../components/ui';
import { classSessionSchema } from '../../../classSessionComponents/types/validation';
import type { Course, ClassGroup, Instructor, Classroom } from '../../../classSessionComponents/types';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../../types/classSession';

type ClassSessionFormData = z.infer<typeof classSessionSchema>;

interface ClassSessionFormProps {
  courses: Course[];
  classGroups: ClassGroup[];
  instructors: Instructor[];
  classrooms: Classroom[];
  editingClassSession?: ClassSession | null;
  onSubmit: (data: ClassSessionInsert | ClassSessionUpdate) => Promise<void>;
  onCancel?: () => void;
  loading: boolean;
}

const ClassSessionForm: React.FC<ClassSessionFormProps> = ({
  courses, classGroups, instructors, classrooms, editingClassSession, onSubmit, onCancel, loading
}) => {
  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ClassSessionFormData>({
    resolver: zodResolver(classSessionSchema),
    defaultValues: { course_id: '', instructor_id: '', class_group_id: '', classroom_id: '', period_count: 1 }
  });

  useEffect(() => {
    if (editingClassSession) {
      reset({
        course_id: editingClassSession.course.id,
        instructor_id: editingClassSession.instructor.id,
        class_group_id: editingClassSession.group.id,
        classroom_id: editingClassSession.classroom.id,
        period_count: editingClassSession.period_count ?? 1,
      });
    } else {
      reset();
    }
  }, [editingClassSession, reset]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-center">{editingClassSession ? 'Edit Class Session' : 'Create New Class Session'}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={loading}>
          <Controller name="course_id" control={control} render={({ field }) => (
            <FormField {...field} id="course_id" label="Course" type="select" error={errors.course_id?.message} options={courses.map(c => ({ id: c.id, name: `${c.name} (${c.code})` }))} required />
          )}/>
          <Controller name="instructor_id" control={control} render={({ field }) => (
            <FormField {...field} id="instructor_id" label="Instructor" type="select" error={errors.instructor_id?.message} options={instructors.map(i => ({ id: i.id, name: `${i.first_name} ${i.last_name}` }))} required />
          )}/>
          <Controller name="class_group_id" control={control} render={({ field }) => (
            <FormField {...field} id="class_group_id" label="Class Group" type="select" error={errors.class_group_id?.message} options={classGroups} required />
          )}/>
          <Controller name="classroom_id" control={control} render={({ field }) => (
            <FormField {...field} id="classroom_id" label="Classroom" type="select" error={errors.classroom_id?.message} options={classrooms} required />
          )}/>
          <Controller name="period_count" control={control} render={({ field }) => (
            <FormField {...field} value={String(field.value ?? '')} onChange={val => field.onChange(Number(val))} id="period_count" label="Duration (periods)" type="number" error={errors.period_count?.message} required />
          )}/>
          <div className="flex gap-3 pt-2">
            <ActionButton type="submit" loading={loading} disabled={!isDirty && !editingClassSession}>{editingClassSession ? 'Save Changes' : 'Add Class Session'}</ActionButton>
            {onCancel && <ActionButton type="button" variant="secondary" onClick={onCancel}>Cancel</ActionButton>}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ClassSessionForm;```

---

### Step 4: Refactor `ComponentForm.tsx` (The Composition Pattern)

**Goal:** Replace the complex, single-form component with small, dedicated field components. This is the biggest architectural improvement.

**File:** `src/features/classSessionComponents/pages/components/ComponentForm.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext, type Control, type FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../../../components/ui';
import { componentSchemas } from '../../types/validation';

// Define the precise form data types
type CourseFormData = z.infer<typeof componentSchemas.course>;
type ClassGroupFormData = z.infer<typeof componentSchemas.classGroup>;
type ClassroomFormData = z.infer<typeof componentSchemas.classroom>;
type InstructorFormData = z.infer<typeof componentSchemas.instructor>;

// --- Exported Field Components ---

export const CourseFields: React.FC<{ control: Control<CourseFormData>; errors: FieldErrors<CourseFormData> }> = ({ control, errors }) => (
  <>
    <Controller name="name" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="name" label="Course Name" error={errors.name?.message} required />} />
    <Controller name="code" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="code" label="Course Code" error={errors.code?.message} required />} />
    <Controller name="color" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="color" label="Color" type="color" error={errors.color?.message} />} />
  </>
);

export const ClassGroupFields: React.FC<{ control: Control<ClassGroupFormData>; errors: FieldErrors<ClassGroupFormData> }> = ({ control, errors }) => (
  <>
    <Controller name="name" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="name" label="Group Name" error={errors.name?.message} required />} />
    <Controller name="code" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="code" label="Short Code" error={errors.code?.message} />} />
    <Controller name="student_count" control={control} render={({ field }) => <FormField {...field} value={String(field.value ?? '')} onChange={(val) => field.onChange(val === '' ? null : Number(val))} id="student_count" label="Number of Students" type="number" error={errors.student_count?.message} />} />
    <Controller name="color" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="color" label="Color" type="color" error={errors.color?.message} />} />
  </>
);

export const ClassroomFields: React.FC<{ control: Control<ClassroomFormData>; errors: FieldErrors<ClassroomFormData> }> = ({ control, errors }) => (
    <>
      <Controller name="name" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="name" label="Classroom Name" error={errors.name?.message} required />} />
      <Controller name="code" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="code" label="Short Code (e.g., A-101)" error={errors.code?.message} />} />
      <Controller name="capacity" control={control} render={({ field }) => <FormField {...field} value={String(field.value ?? '')} onChange={(val) => field.onChange(val === '' ? null : Number(val))} id="capacity" label="Capacity / Size" type="number" error={errors.capacity?.message} />} />
      <Controller name="color" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="color" label="Color" type="color" error={errors.color?.message} />} />
    </>
);

export const InstructorFields: React.FC<{ control: Control<InstructorFormData>; errors: FieldErrors<InstructorFormData> }> = ({ control, errors }) => {
  const { watch, setValue } = useFormContext<InstructorFormData>();
  const [firstName, lastName] = watch(['first_name', 'last_name']);
  const [isCodeManuallyEdited, setIsCodeManuallyEdited] = useState(false);

  useEffect(() => {
    const generateInstructorCode = (fName?: string | null, lName?: string | null): string => {
      const firstInitial = fName?.[0]?.toUpperCase() || '';
      const lastInitials = (lName || '').substring(0, 2).toUpperCase();
      return `${firstInitial}${lastInitials}`;
    };
    if (!isCodeManuallyEdited && (firstName || lastName)) {
      setValue('code', generateInstructorCode(firstName, lastName));
    }
  }, [firstName, lastName, isCodeManuallyEdited, setValue]);

  return (
    <>
      <Controller name="prefix" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="prefix" label="Prefix (e.g., Mr.)" error={errors.prefix?.message} />} />
      <Controller name="title" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="title" label="Title (e.g., Dr.)" error={errors.title?.message} />} />
      <Controller name="first_name" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="first_name" label="First Name" error={errors.first_name?.message} required />} />
      <Controller name="last_name" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="last_name" label="Last Name" error={errors.last_name?.message} required />} />
      <Controller name="suffix" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="suffix" label="Suffix (e.g., PhD)" error={errors.suffix?.message} />} />
      <Controller name="code" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} onChange={(val) => { setIsCodeManuallyEdited(true); field.onChange(val); }} id="code" label="Short Code" error={errors.code?.message} />} />
      <Controller name="contract_type" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="contract_type" label="Contract Type" error={errors.contract_type?.message} />} />
      <Controller name="email" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="email" label="Email" type="email" error={errors.email?.message} />} />
      <Controller name="phone" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="phone" label="Phone" error={errors.phone?.message} />} />
      <Controller name="color" control={control} render={({ field }) => <FormField {...field} value={field.value ?? ''} id="color" label="Color" type="color" error={errors.color?.message} />} />
    </>
  );
};