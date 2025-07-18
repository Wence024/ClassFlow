import React, { useState } from 'react';
import { useClassSessions } from '../hooks/useClassSessions';
import { useCourses, useClassGroups, useClassrooms, useInstructors } from '../hooks/useComponents';
import ClassSessionList from '../components/classSessions/ClassSessionList';
import ClassSessionForm from '../components/classSessions/ClassSessionForm';
import type { ClassSession } from '../types/scheduleLessons';

const ClassSessions: React.FC = () => {
  const { classSessions, addClassSession, updateClassSession, removeClassSession } =
    useClassSessions();
  const { courses } = useCourses()
  const { classGroups } = useClassGroups()
  const { classrooms } = useClassrooms()
  const { instructors } = useInstructors()

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  // Add new session
  const handleAddSession = (sessionData: Omit<ClassSession, 'id'>) => {
    addClassSession(sessionData);
    setEditingSession(null);
  };

  // Edit session
  const handleEditSession = (session: ClassSession) => {
    setEditingSession(session);
  };

  // Save changes to session
  const handleSaveSession = (sessionData: Omit<ClassSession, 'id'>) => {
    if (!editingSession) return;
    updateClassSession(editingSession.id, sessionData);
    setEditingSession(null);
  };

  // Remove session
  const handleRemoveSession = (id: string) => {
    removeClassSession(id);
    setEditingSession(null);
  };

  // Cancel editing
  const handleCancel = () => setEditingSession(null);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      {/* Class Sessions List */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-center mb-6">Class Session Management</h1>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Class Sessions</h2>
          <ClassSessionList
            sessions={classSessions}
            onEdit={handleEditSession}
            onDelete={handleRemoveSession}
          />
        </div>
      </div>

      {/* Create/Edit Form */}
      <div className="w-full md:w-96">
        <ClassSessionForm
          courses={courses}
          classGroups={classGroups}
          instructors={instructors}
          classrooms={classrooms}
          editingSession={editingSession}
          onSubmit={editingSession ? handleSaveSession : handleAddSession}
          onCancel={editingSession ? handleCancel : undefined}
        />
      </div>
    </div>
  );
};

export default ClassSessions;
