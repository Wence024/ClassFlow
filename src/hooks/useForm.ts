import { useState } from 'react';

type FormFieldValue = string | number | null;

export function useForm<T extends Record<string, FormFieldValue>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setIsEditing(false);
    setEditId(null);
  };

  const setEditValues = (item: T & { id?: string; _id?: string }) => {
    const id = item.id ?? item._id ?? '';
    setValues({
      ...item,
      id,
    });
    setIsEditing(true);
    setEditId(id || null);
  };

  const normalize = (item: any) => ({
    ...item,
    id: item.id ?? item._id,
  });

  return {
    values,
    isEditing,
    editId,
    handleChange,
    handleSelectChange,
    resetForm,
    setEditValues,
    setValues,
  };
}
