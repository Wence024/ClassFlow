import React, { useState, useEffect } from 'react';
import FormField from '../ui/FormField';
import ActionButton from '../ui/ActionButton';
import type { Course, ClassGroup, Classroom, Instructor } from '../../types/scheduleLessons';

type ComponentItem = Course | ClassGroup | Classroom | Instructor;
type ComponentType = 'course' | 'classGroup' | 'classroom' | 'instructor';

interface ComponentFormProps {
  type: ComponentType;
  editingItem?: ComponentItem | null;
  onSubmit: (itemData: Omit<ComponentItem, 'id'>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

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

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    config.fields.forEach((field) => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create the appropriate object based on type
    const baseData = { name: formData.name };
    let submitData: Omit<ComponentItem, 'id'>;

    switch (type) {
      case 'course':
        submitData = { ...baseData, code: formData.code! } as Omit<Course, 'id'>;
        break;
      case 'classGroup':
        submitData = baseData as Omit<ClassGroup, 'id'>;
        break;
      case 'classroom':
        submitData = { ...baseData, location: formData.location! } as Omit<Classroom, 'id'>;
        break;
      case 'instructor':
        submitData = { ...baseData, email: formData.email! } as Omit<Instructor, 'id'>;
        break;
      default:
        return;
    }

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      code: '',
      location: '',
      email: '',
    });
    setErrors({});
    onCancel?.();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editingItem ? `Edit ${config.title}` : `Create ${config.title}`}
      </h2>

      <form onSubmit={handleSubmit}>
        {config.fields.map((field) => (
          <FormField
            key={field.key}
            label={field.label}
            type={field.type || 'text'}
            value={formData[field.key] || ''}
            onChange={(value) => setFormData((prev) => ({ ...prev, [field.key]: value }))}
            required={field.required}
            error={errors[field.key]}
          />
        ))}

        <div className="flex gap-2">
          <ActionButton type="submit" variant="primary" loading={loading} className="flex-1">
            {editingItem ? 'Save Changes' : `Create ${config.title}`}
          </ActionButton>

          {(editingItem || onCancel) && (
            <ActionButton type="button" variant="secondary" onClick={handleReset}>
              Cancel
            </ActionButton>
          )}
        </div>
      </form>
    </div>
  );
};

export default ComponentForm;
