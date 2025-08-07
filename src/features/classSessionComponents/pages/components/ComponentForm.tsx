import React, { useState, useEffect } from 'react';
import { z } from 'zod'; // Import Zod
import { FormField, ActionButton } from '../../../../components/ui';
import { showNotification } from '../../../../lib/notificationsService';
import type { Course, CourseInsert, CourseUpdate } from '../../types/course';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../../types/classGroup';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../../types/classroom';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../../types/instructor';
import { componentSchemas } from '../../types/validation';

type BaseFormProps = {
  onCancel?: () => void;
  loading?: boolean;
};

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

interface FormData {
  name: string;
  code?: string;
  location?: string;
  email?: string;
}

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
    location: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Get form configuration based on type
  const getFormConfig = () => {
    switch (type) {
      case 'course':
        return {
          title: 'Course',
          fields: [
            { key: 'name' as keyof FormData, label: 'Course Name', required: true },
            { key: 'code' as keyof FormData, label: 'Course Code', required: true },
          ],
        };
      case 'classGroup':
        return {
          title: 'Class Group',
          fields: [{ key: 'name' as keyof FormData, label: 'Group Name', required: true }],
        };
      case 'classroom':
        return {
          title: 'Classroom',
          fields: [
            { key: 'name' as keyof FormData, label: 'Classroom Name', required: true },
            { key: 'location' as keyof FormData, label: 'Location', required: true },
          ],
        };
      case 'instructor':
        return {
          title: 'Instructor',
          fields: [
            { key: 'name' as keyof FormData, label: 'Instructor Name', required: true },
            {
              key: 'email' as keyof FormData,
              label: 'Email',
              required: true,
              type: 'email' as const,
            },
          ],
        };
      default:
        return { title: '', fields: [] };
    }
  };

  const config = getFormConfig();

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        code: 'code' in editingItem ? editingItem.code || '' : '',
        location: 'location' in editingItem ? editingItem.location || '' : '',
        email: 'email' in editingItem ? editingItem.email || '' : '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        location: '',
        email: '',
      });
    }
    setErrors({});
  }, [editingItem, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schema = componentSchemas[type];
    const dataToValidate = {
      name: formData.name,
      code: formData.code,
      location: formData.location,
      email: formData.email,
    };

    try {
      // Zod validates the data
      const validatedData = schema.parse(dataToValidate);
      setErrors({}); // Clear errors on success
      onSubmit(validatedData); // Submit the Zod-validated data
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod errors into a flat object for our state
        const formattedErrors: Partial<FormData> = {};
        error.issues.forEach((err: z.core.$ZodIssue) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(formattedErrors);
        showNotification('Please fix the errors in the form.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editingItem ? `Edit ${config.title}` : `Create ${config.title}`}
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        role="form"
        aria-label={`${editingItem ? 'Edit' : 'Create'} ${config.title}`}
      >
        <fieldset disabled={loading}>
          {config.fields.map((field) => (
            <FormField
              key={field.key}
              id={field.key} // Pass the key as the id
              label={field.label}
              type={field.type || 'text'}
              value={formData[field.key] || ''}
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
