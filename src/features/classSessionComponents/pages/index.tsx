import React, { useState } from 'react';
import { TabNavigation } from '../../../components/ui';
import CourseManagement from './CourseTab';
import ClassGroupManagement from './ClassGroupTab';
import ClassroomManagement from './ClassroomTab';
import InstructorManagement from './InstructorTab';

/** The configuration for the navigation tabs on this page. */
const TABS = [
  { id: 'course', label: 'Courses' },
  { id: 'classGroup', label: 'Class Groups' },
  { id: 'classroom', label: 'Classrooms' },
  { id: 'instructor', label: 'Instructors' },
];

/** A type representing the valid ID for one of the tabs. */
type ComponentType = 'course' | 'classGroup' | 'classroom' | 'instructor';

/**
 * The main page for managing the core components of a class session.
 *
 * This component acts as a container and router for the different management tabs
 * (Courses, Class Groups, Classrooms, Instructors). It manages the active tab
 * state and conditionally renders the corresponding management component.
 */
const ComponentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ComponentType>('course');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Component Management</h1>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as ComponentType)}
      />
      <div className="mt-6">
        {activeTab === 'course' && <CourseManagement />}
        {activeTab === 'classGroup' && <ClassGroupManagement />}
        {activeTab === 'classroom' && <ClassroomManagement />}
        {activeTab === 'instructor' && <InstructorManagement />}
      </div>
    </div>
  );
};

export default ComponentManagementPage;
