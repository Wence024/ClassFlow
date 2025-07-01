import React from "react";
import "./ClassSessions.css";
import { useComponents } from '../context/ComponentsContext';
import { useForm } from '../hooks/useForm';
import type { Course, ClassGroup, Classroom, Instructor } from '../types/classSessions';

const TABS = ["Courses", "Class Groups", "Classrooms", "Instructors"] as const;

type Tab = typeof TABS[number];

type FormValues = {
  name: string;
  code?: string;
  location?: string;
  email?: string;
};

const ComponentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>(TABS[0]);
  const {
    courses, setCourses,
    classGroups, setClassGroups,
    classrooms, setClassrooms,
    instructors, setInstructors
  } = useComponents();

  const { 
    values, 
    isEditing, 
    editId, 
    handleChange, 
    resetForm, 
    setEditValues 
  } = useForm<FormValues>({ 
    name: '',
    code: '',
    location: '',
    email: ''
  });

  const getCurrentList = () => {
    switch (activeTab) {
      case 'Courses': return courses;
      case 'Class Groups': return classGroups;
      case 'Classrooms': return classrooms;
      case 'Instructors': return instructors;
      default: return [];
    }
  };

  const getCurrentSetter = () => {
    switch (activeTab) {
      case 'Courses': return setCourses;
      case 'Class Groups': return setClassGroups;
      case 'Classrooms': return setClassrooms;
      case 'Instructors': return setInstructors;
      default: return () => {};
    }
  };

  const handleEdit = (item: any) => {
    setEditValues({ 
      ...item,
      name: item.name,
      ...(item.code && { code: item.code }),
      ...(item.location && { location: item.location }),
      ...(item.email && { email: item.email })
    });
  };

  const handleDelete = (id: number) => {
    const setter = getCurrentSetter();
    setter((prev: any[]) => prev.filter(i => i.id !== id));
    if (editId === id) resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name) {
      alert("Please fill out all required fields.");
      return;
    }

    const setter = getCurrentSetter();
    const currentList = getCurrentList();

    if (isEditing && editId) {
      setter((prev: any[]) => 
        prev.map(i => i.id === editId ? { ...i, ...values } : i)
      );
    } else {
      const newItem = {
        ...values,
        id: Math.max(0, ...currentList.map(i => i.id)) + 1
      };
      setter((prev: any[]) => [...prev, newItem]);
    }

    resetForm();
  };

  const getFields = () => {
    switch (activeTab) {
      case 'Courses': return [
        { label: "Name", name: "name" },
        { label: "Code", name: "code" }
      ];
      case 'Class Groups': return [
        { label: "Name", name: "name" }
      ];
      case 'Classrooms': return [
        { label: "Name", name: "name" },
        { label: "Location", name: "location" }
      ];
      case 'Instructors': return [
        { label: "Name", name: "name" },
        { label: "Email", name: "email" }
      ];
      default: return [];
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
              className={activeTab === tab ? "tab active" : "tab"}
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
            getCurrentList().map((item: any) => (
              <div key={`${activeTab}-${item.id}`} className="class-session">
                <h3>{item.name}{item.code ? ` (${item.code})` : ""}</h3>
                {item.location && <p>Location: {item.location}</p>}
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
          {getFields().map(field => (
            <div className="form-group" key={field.name}>
              <label>{field.label}: </label>
              <input
                type="text"
                name={field.name}
                value={values[field.name as keyof FormValues] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
          <button className="create-button" type="submit">
            {isEditing ? "Save Changes" : `Create ${activeTab.slice(0, -1)}`}
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