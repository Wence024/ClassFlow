import React, { useState, useEffect } from 'react';
import { FormField, ActionButton } from '../../../../components/ui';
import { showNotification } from '../../../../lib/notificationsService';
import type { Course, CourseInsert, CourseUpdate } from '../../types/course';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../../types/classGroup';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../../types/classroom';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../../types/instructor';
import { componentSchemas } from '../../types/validation';

/** A generic type representing the data needed to create or update any component. */
type ComponentSubmitData =
  | CourseInsert
  | CourseUpdate
  | ClassGroupInsert
  | ClassGroupUpdate
  | ClassroomInsert
  | ClassroomUpdate
  | InstructorInsert
  | InstructorUpdate;

/** Base props common to all form variations. */
type BaseFormProps = {
  onCancel?: () => void;
  loading?: boolean;
};

/** Discriminated union of props for the ComponentForm. */
type ComponentFormProps = (
  | {
      type: 'course';
      editingItem?: Course | null;
      onSubmit: (itemData: CourseInsert | CourseUpdate) => void;
    }
  | {
      type: 'classGroup';
      editingItem?: ClassGroup | null;
      onSubmit: (itemData: ClassGroupInsert | ClassGroupUpdate) => void;
    }
  | {
      type: 'classroom';
      editingItem?: Classroom | null;
      onSubmit: (itemData: ClassroomInsert | ClassroomUpdate) => void;
    }
  | {
      type: 'instructor';
      editingItem?: Instructor | null;
      onSubmit: (itemData: InstructorInsert | InstructorUpdate) => void;
    }
) &
  BaseFormProps;

/** Represents the universal shape of the form's state. */
interface FormData {
  name: string;
  code?: string;
  number_of_periods?: number | string;
  location?: string;
  email?: string;
}

/** Defines the configuration structure for a single form field. */
interface FieldConfig {
  key: keyof FormData;
  label: string;
  required: boolean;
  type?: 'text' | 'number' | 'email'; // This property is now explicitly optional.
}

/**
 * A highly reusable and generic form component for creating and editing different types
 * of schedulable components (Courses, Instructors, etc.).
 *
 * It dynamically renders the correct form fields based on the `type` prop.
 * It handles its own state, validation (using Zod), and submission logic,
 * delegating the final data persistence to the `onSubmit` prop provided by the parent.
 *
 * @param {ComponentFormProps} props The props for the component.
 */
const ComponentForm: React.FC<ComponentFormProps> = ({
  type,
  editingItem,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    number_of_periods: 1,
    location: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  /** Dynamically generates the configuration for the form fields based on the component `type`. */
  const getFormConfig = (): { title: string; fields: FieldConfig[] } => {
    switch (type) {
      case 'course':
        return {
          title: 'Course',
          fields: [
            { key: 'name', label: 'Course Name', required: true },
            { key: 'code', label: 'Course Code', required: true },
            {
              key: 'number_of_periods',
              label: 'Number of Periods',
              required: true,
              type: 'number',
            },
          ],
        };
      case 'classGroup':
        return {
          title: 'Class Group',
          fields: [{ key: 'name', label: 'Group Name', required: true }],
        };
      case 'classroom':
        return {
          title: 'Classroom',
          fields: [
            { key: 'name', label: 'Classroom Name', required: true },
            { key: 'location', label: 'Location', required: true },
          ],
        };
      case 'instructor':
        return {
          title: 'Instructor',
          fields: [
            { key: 'name', label: 'Instructor Name', required: true },
            { key: 'email', label: 'Email', required: true, type: 'email' },
          ],
        };
      default:
        return { title: '', fields: [] };
    }
  };

  const config = getFormConfig();

  // Populate form when editing or reset when creating new.
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        code: 'code' in editingItem ? editingItem.code || '' : '',
        number_of_periods:
          'number_of_periods' in editingItem ? editingItem.number_of_periods || 1 : 1,
        location: 'location' in editingItem ? editingItem.location || '' : '',
        email: 'email' in editingItem ? editingItem.email || '' : '',
      });
    } else {
      setFormData({ name: '', code: '', number_of_periods: 1, location: '', email: '' });
    }
    setErrors({});
  }, [editingItem, type]);

  /** Handles form submission, validation, and calling the parent's onSubmit. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schema = componentSchemas[type];
    const validationResult = schema.safeParse(formData);

    if (validationResult.success) {
      setErrors({});
      onSubmit(validationResult.data as ComponentSubmitData);
    } else {
      const formattedErrors: Partial<Record<keyof FormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormData;
        if (key) formattedErrors[key] = issue.message;
      });
      setErrors(formattedErrors);
      showNotification('Please correct the errors in the form.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editingItem ? `Edit ${config.title}` : `Create ${config.title}`}
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={loading} className="space-y-4">
          {config.fields.map((field) => (
            <FormField
              key={field.key}
              id={field.key}
              label={field.label}
              type={field.type || 'text'}
              value={String(formData[field.key] ?? '')}
              onChange={(value) => setFormData((prev) => ({ ...prev, [field.key]: value }))}
              required={field.required}
              error={errors[field.key]}
              autoComplete={field.key === 'email' ? 'email' : 'off'}
            />
          ))}
          <div className="flex gap-2 mt-4">
            <ActionButton type="submit" variant="primary" loading={loading} className="flex-1">
              {editingItem ? 'Save Changes' : `Create ${config.title}`}
            </ActionButton>
            {onCancel && (
              <ActionButton type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </ActionButton>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ComponentForm;
