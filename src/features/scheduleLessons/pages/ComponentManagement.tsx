import React, { useState } from 'react';
import TabNavigation from '../components/ui/TabNavigation';
import CourseManagement from './classSessionComponents/CourseManagement';
import ClassGroupManagement from './classSessionComponents/ClassGroupManagement';
import ClassroomManagement from './classSessionComponents/ClassroomManagement';
import InstructorManagement from './classSessionComponents/InstructorManagement';

const TABS = [
  { id: 'course', label: 'Courses' },
  { id: 'classGroup', label: 'Class Groups' },
  { id: 'classroom', label: 'Classrooms' },
  { id: 'instructor', label: 'Instructors' },
];

type ComponentType = 'course' | 'classGroup' | 'classroom' | 'instructor';

const ComponentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ComponentType>('course');

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-center mb-6">Component Management</h1>
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as ComponentType)}
        />
        <div className="mt-4">
          {activeTab === 'course' && <CourseManagement />}
          {activeTab === 'classGroup' && <ClassGroupManagement />}
          {activeTab === 'classroom' && <ClassroomManagement />}
          {activeTab === 'instructor' && <InstructorManagement />}
        </div>
      </div>
    </div>
  );
};

export default ComponentManagement;
