import React, { useState } from 'react';
import { useComponents } from '../contexts/ComponentsContext';
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
    setCourses,
    classGroups,
    setClassGroups,
    classrooms,
    setClassrooms,
    instructors,
    setInstructors,
  } = useComponents();

  const [activeTab, setActiveTab] = useState<ComponentType>('course');
  const [editingItem, setEditingItem] = useState<ComponentItem | null>(null);

  // Get current list and setter
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

  const getSetter = () => {
    switch (activeTab) {
      case 'course':
        return setCourses;
      case 'classGroup':
        return setClassGroups;
      case 'classroom':
        return setClassrooms;
      case 'instructor':
        return setInstructors;
      default:
        return () => {};
    }
  };

  // Add new item
  const handleAddItem = (itemData: Omit<ComponentItem, 'id'>) => {
    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      ...itemData,
    } as ComponentItem;
    getSetter()((prev: ComponentItem[]) => [...prev, newItem]);
    setEditingItem(null);
  };

  // Edit item
  const handleEditItem = (item: ComponentItem) => {
    setEditingItem(item);
  };

  // Save changes to item
  const handleSaveItem = (itemData: Omit<ComponentItem, 'id'>) => {
    if (!editingItem) return;
    const updatedItem = {
      id: editingItem.id,
      ...itemData,
    } as ComponentItem;
    getSetter()((prev: ComponentItem[]) =>
      prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    getSetter()((prev: ComponentItem[]) => prev.filter((item) => item.id !== id));
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
