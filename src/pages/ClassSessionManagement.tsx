import React, { useState } from 'react';
import CrudManager from '../components/CrudManager';
import { CourseProvider, useCourses } from '../context/CourseContext';
import type { Course } from '../types/classSessions';
import './ClassSessionManagement.css';

const TABS = ['Courses', 'Instructors', 'Groups', 'Classrooms', 'Class Sessions'] as const;
type Tab = typeof TABS[number];

const CoursesTab: React.FC = () => {
  const { courses, addCourse, editCourse, deleteCourse } = useCourses();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Omit<Course, 'id'>>>({});

  // Split list and form containers
  const editingCourse = editingId !== null ? courses.find(c => c.id === editingId) : null;

  return (
    <div className="main-flex">
      {/* List Container */}
      <div className="sessions-list-container">
        <h2>Courses</h2>
        <ul>
          {courses.length === 0 && <li>No courses found.</li>}
          {courses.map(course => (
            <li key={course.id} style={{ marginBottom: 8 }}>
              <span style={{ marginRight: 16 }}><b>Name:</b> {course.name}</span>
              <button onClick={() => {
                setEditingId(course.id);
                setForm({ name: course.name });
              }} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => deleteCourse(course.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Create/Edit Form Container */}
      <div className="form-container">
        <h2>{editingId === null ? 'Add Course' : 'Edit Course'}</h2>
        <form onSubmit={e => {
          e.preventDefault();
          if (!form.name) {
            alert('Please fill out the course name.');
            return;
          }
          if (editingId === null) {
            addCourse(form as Omit<Course, 'id'>);
          } else {
            editCourse(editingId, form as Omit<Course, 'id'>);
          }
          setForm({});
          setEditingId(null);
        }}>
          <div className="form-group">
            <label>Course Name:</label>
            <input
              type="text"
              value={form.name ?? ''}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <button type="submit">{editingId === null ? 'Add Course' : 'Save Course'}</button>
          {editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm({}); }} style={{ marginLeft: 8 }}>Cancel</button>}
        </form>
      </div>
    </div>
  );
};

const ClassSessionManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Courses');
  return (
    <CourseProvider>
      <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Tabs Container */}
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                borderBottom: activeTab === tab ? '2px solid #007bff' : '2px solid transparent',
                background: 'none',
                border: 'none',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                color: activeTab === tab ? '#007bff' : '#333',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Main Flex Container for List/Form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
          {activeTab === 'Courses' && <CoursesTab />}
          {activeTab === 'Instructors' && <div className="main-flex"><div className="sessions-list-container"><h2>Instructors</h2><div>List here</div></div><div className="form-container"><h2>Add/Edit Instructor</h2><div>Form here</div></div></div>}
          {activeTab === 'Groups' && <div className="main-flex"><div className="sessions-list-container"><h2>Groups</h2><div>List here</div></div><div className="form-container"><h2>Add/Edit Group</h2><div>Form here</div></div></div>}
          {activeTab === 'Classrooms' && <div className="main-flex"><div className="sessions-list-container"><h2>Classrooms</h2><div>List here</div></div><div className="form-container"><h2>Add/Edit Classroom</h2><div>Form here</div></div></div>}
          {activeTab === 'Class Sessions' && <div className="main-flex"><div className="sessions-list-container"><h2>Class Sessions</h2><div>List here</div></div><div className="form-container"><h2>Add/Edit Class Session</h2><div>Form here</div></div></div>}
        </div>
      </div>
    </CourseProvider>
  );
};

export default ClassSessionManagement; 