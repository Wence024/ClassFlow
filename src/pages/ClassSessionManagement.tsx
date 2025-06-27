import React, { useState } from 'react';
import CrudManager from '../components/CrudManager';
import { CourseProvider, useCourses } from '../context/CourseContext';
import type { Course } from '../types/classSessions';

const TABS = ['Courses', 'Instructors', 'Groups', 'Classrooms', 'Class Sessions'] as const;
type Tab = typeof TABS[number];

const CoursesTab: React.FC = () => {
  const { courses, addCourse, editCourse, deleteCourse } = useCourses();
  return (
    <CrudManager<Course>
      items={courses}
      fields={[{ key: 'name', label: 'Course Name' }]}
      itemName="Course"
      onAdd={addCourse}
      onEdit={editCourse}
      onDelete={deleteCourse}
    />
  );
};

const ClassSessionManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Courses');

  return (
    <CourseProvider>
      <div className="container">
        <h1>Class Session Management</h1>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {TABS.map(tab => (
            <button
              key={tab}
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
        <div style={{ marginTop: 24 }}>
          {activeTab === 'Courses' && <CoursesTab />}
          {activeTab === 'Instructors' && <div>Instructors CRUD UI (to be implemented)</div>}
          {activeTab === 'Groups' && <div>Groups CRUD UI (to be implemented)</div>}
          {activeTab === 'Classrooms' && <div>Classrooms CRUD UI (to be implemented)</div>}
          {activeTab === 'Class Sessions' && <div>Class Session Assembly UI (to be implemented)</div>}
        </div>
      </div>
    </CourseProvider>
  );
};

export default ClassSessionManagement; 