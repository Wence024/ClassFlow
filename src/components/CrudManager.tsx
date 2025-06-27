import React, { useState } from 'react';

export type CrudField<T> = {
  key: keyof T;
  label: string;
  type?: 'text' | 'number';
};

interface CrudManagerProps<T> {
  items: T[];
  fields: CrudField<T>[];
  itemName: string;
  onAdd: (item: Omit<T, 'id'>) => void;
  onEdit: (id: number, item: Omit<T, 'id'>) => void;
  onDelete: (id: number) => void;
}

function CrudManager<T extends { id: number }>({ items, fields, itemName, onAdd, onEdit, onDelete }: CrudManagerProps<T>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Omit<T, 'id'>>>({});

  const handleChange = (key: keyof Omit<T, 'id'>, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fields.some(f => !form[f.key])) {
      alert('Please fill out all fields.');
      return;
    }
    if (editingId === null) {
      onAdd(form as Omit<T, 'id'>);
    } else {
      onEdit(editingId, form as Omit<T, 'id'>);
    }
    setForm({});
    setEditingId(null);
  };

  const handleEdit = (item: T) => {
    setEditingId(item.id);
    const { id, ...rest } = item;
    setForm(rest);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({});
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        {fields.map(field => (
          <div key={String(field.key)} style={{ marginBottom: 8 }}>
            <label>
              {field.label}: <br />
              <input
                type={field.type || 'text'}
                value={form[field.key] ?? ''}
                onChange={e => handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="submit">{editingId === null ? `Add ${itemName}` : `Save ${itemName}`}</button>
        {editingId !== null && <button type="button" onClick={handleCancel} style={{ marginLeft: 8 }}>Cancel</button>}
      </form>
      <ul>
        {items.length === 0 && <li>No {itemName.toLowerCase()}s found.</li>}
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: 8 }}>
            {fields.map(f => (
              <span key={String(f.key)} style={{ marginRight: 16 }}><b>{f.label}:</b> {String(item[f.key])}</span>
            ))}
            <button onClick={() => handleEdit(item)} style={{ marginRight: 8 }}>Edit</button>
            <button onClick={() => onDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrudManager; 