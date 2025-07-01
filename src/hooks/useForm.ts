import { useState } from 'react';

type FormValues = Record<string, any>;

export function useForm<T extends FormValues>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value)
    }));
  };

  const handleSelectChange = (name: string, value: number | null) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setIsEditing(false);
    setEditId(null);
  };

  const setEditValues = (item: T & { id: number }) => {
    setValues(item);
    setIsEditing(true);
    setEditId(item.id);
  };

  return {
    values,
    isEditing,
    editId,
    handleChange,
    handleSelectChange,
    resetForm,
    setEditValues,
    setValues
  };
}