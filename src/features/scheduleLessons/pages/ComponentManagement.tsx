import React, { useState } from 'react';
import { useComponents } from '../hooks/useComponents';
import TabNavigation from '../components/ui/TabNavigation';
import ComponentList from '../components/componentManagement/ComponentList';
import ComponentForm from '../components/componentManagement/ComponentForm';
import type { Course, ClassGroup, Classroom, Instructor } from '../types/scheduleLessons';

const TABS = [
  { id: 'course', label: 'Courses' },
  { id: 'classGroup', label: 'Class Groups' },
  { id: 'classroom', label: 'Classrooms' },
  { id: 'instructor', label: 'Instructors' },
];

type ComponentType = 'course' | 'classGroup' | 'classroom' | 'instructor';
type ComponentItem = Course | ClassGroup | Classroom | Instructor;

const ComponentManagement: React.FC = () => {
  const {
    courses,
    classGroups,
    classrooms,
    instructors,
    addCourse,
    updateCourse,
    removeCourse,
    addClassGroup,
    updateClassGroup,
    removeClassGroup,
    addClassroom,
    updateClassroom,
    removeClassroom,
    addInstructor,
    updateInstructor,
    removeInstructor,
  } = useComponents();

  const [activeTab, setActiveTab] = useState<ComponentType>('course');
  const [editingItem, setEditingItem] = useState<ComponentItem | null>(null);

  // Get current list and CRUD handlers
  const getList = (): ComponentItem[] => {
    switch (activeTab) {
      case 'course':
        return courses;
      case 'classGroup':
        return classGroups;
      case 'classroom':
        return classrooms;
      case 'instructor':
        return instructors;
      default:
        return [];
    }
  };

  const getAdd = () => {
    switch (activeTab) {
      case 'course':
        return addCourse;
      case 'classGroup':
        return addClassGroup;
      case 'classroom':
        return addClassroom;
      case 'instructor':
        return addInstructor;
      default:
        return () => {};
    }
  };

  const getUpdate = () => {
    switch (activeTab) {
      case 'course':
        return updateCourse;
      case 'classGroup':
        return updateClassGroup;
      case 'classroom':
        return updateClassroom;
      case 'instructor':
        return updateInstructor;
      default:
        return () => {};
    }
  };

  const getRemove = () => {
    switch (activeTab) {
      case 'course':
        return removeCourse;
      case 'classGroup':
        return removeClassGroup;
      case 'classroom':
        return removeClassroom;
      case 'instructor':
        return removeInstructor;
      default:
        return () => {};
    }
  };

  // Add new item
  const handleAddItem = (itemData: Omit<ComponentItem, 'id'>) => {
    getAdd()(itemData);
    setEditingItem(null);
  };

  // Edit item
  const handleEditItem = (item: ComponentItem) => {
    setEditingItem(item);
  };

  // Save changes to item
  const handleSaveItem = (itemData: Omit<ComponentItem, 'id'>) => {
    if (!editingItem) return;
    getUpdate()(editingItem.id, itemData);
    setEditingItem(null);
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    getRemove()(id);
    setEditingItem(null);
  };

  // Cancel editing
  const handleCancel = () => setEditingItem(null);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-center mb-6">Component Management</h1>
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId as ComponentType);
            setEditingItem(null);
          }}
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">
            {TABS.find((t) => t.id === activeTab)?.label} List
          </h2>
          <ComponentList
            items={getList()}
            onEdit={handleEditItem}
            onDelete={handleRemoveItem}
            emptyMessage={`No ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} created yet.`}
          />
        </div>
      </div>

      <div className="w-full md:w-96">
        <ComponentForm
          type={activeTab}
          editingItem={editingItem}
          onSubmit={editingItem ? handleSaveItem : handleAddItem}
          onCancel={editingItem ? handleCancel : undefined}
        />
      </div>
    </div>
  );
};

export default ComponentManagement;
