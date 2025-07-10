import React, { useState } from "react";
import "./ClassSessions.css";
import { useComponents } from '../context/ComponentsContext';

const TABS = ["Courses", "Class Groups", "Classrooms", "Instructors"];

const ComponentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    courses, setCourses,
    classGroups, setClassGroups,
    classrooms, setClassrooms,
    instructors, setInstructors
  } = useComponents();

  // Form states
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<number | null>(null);

  // Handlers for each tab
  const getList = () => [courses, classGroups, classrooms, instructors][activeTab];
  const setList = (fn: any) => [setCourses, setClassGroups, setClassrooms, setInstructors][activeTab](fn);
  const getFields = () => {
    switch (activeTab) {
      case 0: return [
        { label: "Course Name", key: "name" },
        { label: "Course Code", key: "code" }
      ];
      case 1: return [
        { label: "Group Name", key: "name" }
      ];
      case 2: return [
        { label: "Classroom Name", key: "name" },
        { label: "Location", key: "location" }
      ];
      case 3: return [
        { label: "Instructor Name", key: "name" },
        { label: "Email", key: "email" }
      ];
      default: return [];
    }
  };

  const resetForm = () => { setForm({}); setEditId(null); };

  const handleEdit = (item: any) => {
    setForm(item);
    setEditId(item.id);
  };

  const handleDelete = (id: number) => {
    setList((prev: any[]) => prev.filter(i => i.id !== id));
    if (editId === id) resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = getFields();
    if (fields.some(f => !form[f.key])) {
      alert("Please fill out all fields.");
      return;
    }
    if (editId) {
      setList((prev: any[]) => prev.map(i => i.id === editId ? { ...i, ...form } : i));
    } else {
      setList((prev: any[]) => [...prev, { ...form, id: Math.max(...[...getList()].map(i => i.id), 0) + 1 }]);
    }
    resetForm();
  };

  return (
    <div className="container main-flex">
      {/* Tabs */}
      <div className="sessions-list-container">
        <h1>Component Management</h1>
        <div className="tabs">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              className={activeTab === idx ? "tab active" : "tab"}
              onClick={() => { setActiveTab(idx); resetForm(); }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="class-sessions">
          <h2>{TABS[activeTab]} List</h2>
          {getList().length === 0 ? (
            <p>No {TABS[activeTab].toLowerCase()} created yet.</p>
          ) : (
            getList().map((item: any) => {
              // Ensure each item has a unique key, fall back to a different identifier if needed
              const key = item.id ? `${TABS[activeTab]}-${item.id}` : `${TABS[activeTab]}-${Math.random()}`;
              return (
                <div key={key} className="class-session">
                  <h3>{item.name}{item.code ? ` (${item.code})` : ""}</h3>
                  {item.location && <p>Location: {item.location}</p>}
                  {item.email && <p>Email: {item.email}</p>}
                  <div className="buttons">
                    <button onClick={() => handleDelete(item.id)}>Remove</button>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Form */}
      <div className="form-container">
        <h2>{editId ? `Edit ${TABS[activeTab].slice(0, -1)}` : `Create ${TABS[activeTab].slice(0, -1)}`}</h2>
        <form className="create-session-form" onSubmit={handleSubmit}>
          {getFields().map(f => (
            <div className="form-group" key={f.key}>
              <label>{f.label}: </label>
              <input
                type="text"
                value={form[f.key] ?? ""}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
          <button className="create-button" type="submit">
            {editId ? "Save Changes" : `Create ${TABS[activeTab].slice(0, -1)}`}
          </button>
          {editId && <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>Cancel</button>}
        </form>
      </div>
    </div>
  );
};

export default ComponentManagement;