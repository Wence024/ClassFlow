import React from 'react';
import './ClassSessions.css';
import { useComponents } from '../context/ComponentsContext';
import { useForm } from '../hooks/useForm';

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

const ComponentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>(TABS[0]);
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

  const handleEdit = (item: Entity) => {
    setEditValues({
      ...item,
      name: item.name,
      ...(item.code && { code: item.code }),
      ...(item.location && { location: item.location }),
      ...(item.email && { email: item.email }),
      ...(item.capacity && { capacity: item.capacity }),
    });
  };

  const handleDelete = (id: string) => {
    const setter = getCurrentSetter();
    setter((prev) => prev.filter((i) => i.id !== id));
    if (editId === id) resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name) {
      alert('Please fill out all required fields.');
      return;
    }

    const setter = getCurrentSetter();

    if (isEditing && editId) {
      setter((prev) => prev.map((i) => (i.id === editId ? { ...i, ...values } : i)));
    } else {
      const newItem: Entity = {
        ...values,
        id: crypto.randomUUID(),
      };
      setter((prev) => [...prev, newItem]);
    }

    resetForm();
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
          {getCurrentList().length === 0 ? (
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
                  <button onClick={() => handleDelete(item.id)}>Remove</button>
                  <button onClick={() => handleEdit(item)}>Edit</button>
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
              />
            </div>
          ))}
          <button className="create-button" type="submit">
            {isEditing ? 'Save Changes' : `Create ${activeTab.slice(0, -1)}`}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
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
