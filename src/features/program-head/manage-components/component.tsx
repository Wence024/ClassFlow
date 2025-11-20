/**
 * Component for managing class session components.
 */

import { useState } from 'react';
import { TabNavigation } from '@/components/ui';
import CourseManagement from '@/features/classSessionComponents/pages/CourseTab';
import ClassGroupManagement from '@/features/classSessionComponents/pages/ClassGroupTab';
import ClassroomManagement from '@/features/classSessionComponents/pages/ClassroomTab';
import InstructorManagement from '@/features/classSessionComponents/pages/InstructorTab';
import type { ComponentType } from './types';

const TABS = [
  { id: 'course' as const, label: 'Courses' },
  { id: 'classGroup' as const, label: 'Class Groups' },
  { id: 'classroom' as const, label: 'Classrooms' },
  { id: 'instructor' as const, label: 'Instructors' },
];

/**
 * Main page for managing class session components.
 */
export function ManageComponentsPage() {
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
}
