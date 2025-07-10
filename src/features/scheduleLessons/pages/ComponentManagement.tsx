import React, { useState } from 'react';
// import './ClassSessions.css'; // Remove old CSS
import { useComponents } from '../contexts/ComponentsContext';

const TABS = ['Courses', 'Class Groups', 'Classrooms', 'Instructors'];

const ComponentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
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

  // Form states
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<number | null>(null);

  // Handlers for each tab
  const getList = () => [courses, classGroups, classrooms, instructors][activeTab];
  const setList = (fn: any) =>
    [setCourses, setClassGroups, setClassrooms, setInstructors][activeTab](fn);
  const getFields = () => {
    switch (activeTab) {
      case 0:
        return [
          { label: 'Course Name', key: 'name' },
          { label: 'Course Code', key: 'code' },
        ];
      case 1:
        return [{ label: 'Group Name', key: 'name' }];
      case 2:
        return [
          { label: 'Classroom Name', key: 'name' },
          { label: 'Location', key: 'location' },
        ];
      case 3:
        return [
          { label: 'Instructor Name', key: 'name' },
          { label: 'Email', key: 'email' },
        ];
      default:
        return [];
    }
  };

  const resetForm = () => {
    setForm({});
    setEditId(null);
  };

  const handleEdit = (item: any) => {
    setForm(item);
    setEditId(item.id);
  };

  const handleDelete = (id: number) => {
    setList((prev: any[]) => prev.filter((i) => i.id !== id));
    if (editId === id) resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = getFields();
    if (fields.some((f) => !form[f.key])) {
      alert('Please fill out all fields.');
      return;
    }
    if (editId) {
      setList((prev: any[]) => prev.map((i) => (i.id === editId ? { ...i, ...form } : i)));
    } else {
      setList((prev: any[]) => [
        ...prev,
        { ...form, id: Math.max(...[...getList()].map((i) => i.id), 0) + 1 },
      ]);
    }
    resetForm();
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      {/* Tabs and List */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-center mb-6">Component Management</h1>
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                activeTab === idx
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => {
                setActiveTab(idx);
                resetForm();
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">{TABS[activeTab]} List</h2>
          {getList().length === 0 ? (
            <p className="text-gray-500">No {TABS[activeTab].toLowerCase()} created yet.</p>
          ) : (
            getList().map((item: any) => {
              // Ensure each item has a unique key, fall back to a different identifier if needed
              const key = item.id
                ? `${TABS[activeTab]}-${item.id}`
                : `${TABS[activeTab]}-${Math.random()}`;
              return (
                <div
                  key={key}
                  className="bg-gray-50 p-4 mb-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">
                      {item.name}
                      {item.code ? ` (${item.code})` : ''}
                    </h3>
                    {item.location && <p className="text-gray-700">Location: {item.location}</p>}
                    {item.email && <p className="text-gray-700">Email: {item.email}</p>}
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Form */}
      <div className="w-full md:w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editId
            ? `Edit ${TABS[activeTab].slice(0, -1)}`
            : `Create ${TABS[activeTab].slice(0, -1)}`}
        </h2>
        <form className="bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
          {getFields().map((f) => (
            <div className="mb-4" key={f.key}>
              <label className="block font-semibold mb-1">{f.label}: </label>
              <input
                type="text"
                value={form[f.key] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
          <button
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold mt-2"
            type="submit"
          >
            {editId ? 'Save Changes' : `Create ${TABS[activeTab].slice(0, -1)}`}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-2 mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ComponentManagement;
