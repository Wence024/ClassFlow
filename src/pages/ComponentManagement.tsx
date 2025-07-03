import React, { useState } from 'react';
import './ClassSessions.css';
import { useComponents } from '../context/ComponentsContext';
import { useForm } from '../hooks/useForm';
import { apiCourses } from '../api/courses';
import { apiClassGroups } from '../api/classGroups';
import { apiClassrooms } from '../api/classrooms';
import { apiInstructors } from '../api/instructors';

const TABS = ['Courses', 'Class Groups', 'Classrooms', 'Instructors'] as const;

type Tab = (typeof TABS)[number];

type FormValues = {
  name: string;
  code?: string;
  location?: string;
  email?: string;
  capacity?: number;
};

type Entity = FormValues & { id: string };
type Setter = React.Dispatch<React.SetStateAction<Entity[]>>;

type ApiModule = {
  list: () => Promise<Entity[]>;
  get: (id: string) => Promise<Entity>;
  create: (data: Omit<Entity, 'id'>) => Promise<Entity>;
  update: (id: string, data: Partial<Entity>) => Promise<Entity>;
  delete: (id: string) => Promise<void>;
};

const normalize = <T extends { id?: string; _id?: string }>(item: T): T & { id: string } => ({
  ...item,
  id: item.id ?? item._id ?? '',
});

const ComponentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const {
    courses,
    setCourses,
    classGroups,
    setClassGroups,
    classrooms,
    setClassrooms,
    instructors,
    setInstructors,
  } = useComponents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, isEditing, editId, handleChange, resetForm, setEditValues } = useForm<FormValues>(
    {
      name: '',
      code: '',
      location: '',
      email: '',
      capacity: 0,
    }
  );

  const getCurrentList = (): Entity[] => {
    switch (activeTab) {
      case 'Courses':
        return courses as Entity[];
      case 'Class Groups':
        return classGroups as Entity[];
      case 'Classrooms':
        return classrooms as Entity[];
      case 'Instructors':
        return instructors as Entity[];
      default:
        return [];
    }
  };

  const getCurrentSetter = (): Setter => {
    switch (activeTab) {
      case 'Courses':
        return setCourses as Setter;
      case 'Class Groups':
        return setClassGroups as Setter;
      case 'Classrooms':
        return setClassrooms as Setter;
      case 'Instructors':
        return setInstructors as Setter;
      default:
        return () => {};
    }
  };

  const getApiModule = (): ApiModule => {
    switch (activeTab) {
      case 'Courses':
        return apiCourses as ApiModule;
      case 'Class Groups':
        return apiClassGroups as ApiModule;
      case 'Classrooms':
        return apiClassrooms as ApiModule;
      case 'Instructors':
        return apiInstructors as ApiModule;
      default:
        throw new Error('Invalid tab');
    }
  };

  const handleEdit = (item: Entity) => {
    // console.log('Editing item:', item);
    setEditValues({
      ...item,
      name: item.name,
      ...(item.code && { code: item.code }),
      ...(item.location && { location: item.location }),
      ...(item.email && { email: item.email }),
      ...(item.capacity && { capacity: item.capacity }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Invalid ID for deletion');
      return;
    }
    setLoading(true);
    setError(null);
    const setter = getCurrentSetter();
    const api = getApiModule();
    try {
      await api.delete(id);
      setter((prev) => prev.filter((i) => i.id !== id));
      if (editId === id) resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('handleSubmit', { isEditing, editId, values });
    if (!values.name) {
      alert('Please fill out all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    const setter = getCurrentSetter();
    const api = getApiModule();
    try {
      if (isEditing && editId) {
        const updated = await api.update(editId, values);
        setter((prev) => prev.map((i) => (i.id === editId ? normalize(updated) : i)));
      } else {
        const created = await api.create(values as Omit<Entity, 'id'>);
        setter((prev) => [...prev, normalize(created)]);
      }
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const getFields = () => {
    switch (activeTab) {
      case 'Courses':
        return [
          { label: 'Name', name: 'name' },
          { label: 'Code', name: 'code' },
        ];
      case 'Class Groups':
        return [{ label: 'Name', name: 'name' }];
      case 'Classrooms':
        return [
          { label: 'Name', name: 'name' },
          { label: 'Location', name: 'location' },
          { label: 'Capacity', name: 'capacity', type: 'number' },
        ];
      case 'Instructors':
        return [
          { label: 'Name', name: 'name' },
          { label: 'Email', name: 'email' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container main-flex">
      <div className="sessions-list-container">
        <h1>Component Management</h1>
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'tab active' : 'tab'}
              onClick={() => {
                setActiveTab(tab);
                resetForm();
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="class-sessions">
          <h2>{activeTab} List</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : getCurrentList().length === 0 ? (
            <p>No {activeTab.toLowerCase()} created yet.</p>
          ) : (
            getCurrentList().map((item) => (
              <div key={`${activeTab}-${item.id}`} className="class-session">
                <h3>
                  {item.name}
                  {item.code ? ` (${item.code})` : ''}
                </h3>
                {item.location && <p>Location: {item.location}</p>}
                {item.capacity !== undefined && <p>Capacity: {item.capacity}</p>}
                {item.email && <p>Email: {item.email}</p>}
                <div className="buttons">
                  <button onClick={() => handleDelete(item.id)} disabled={loading}>
                    Remove
                  </button>
                  <button onClick={() => handleEdit(item)} disabled={loading}>
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="form-container">
        <h2>{isEditing ? `Edit ${activeTab.slice(0, -1)}` : `Create ${activeTab.slice(0, -1)}`}</h2>
        <form className="create-session-form" onSubmit={handleSubmit}>
          {getFields().map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}: </label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={values[field.name as keyof FormValues] || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          ))}
          <button className="create-button" type="submit" disabled={loading}>
            {isEditing ? 'Save Changes' : `Create ${activeTab.slice(0, -1)}`}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} style={{ marginLeft: 8 }} disabled={loading}>
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ComponentManagement;
// TODO: check validation issue for classrooms: Is Capacity not required?
