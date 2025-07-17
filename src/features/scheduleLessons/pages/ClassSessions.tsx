import React, { useState } from 'react';
import { useClassSessions } from '../contexts/ClassSessionsContext';
import { useComponents } from '../contexts/ComponentsContext';
import ClassSessionList from '../components/classSessions/ClassSessionList';
import ClassSessionForm from '../components/classSessions/ClassSessionForm';
import type { ClassSession } from '../types/scheduleLessons';

const ClassSessions: React.FC = () => {
  const { classSessions, setClassSessions } = useClassSessions();
  const { courses, classGroups, classrooms, instructors } = useComponents();

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  // Add new session
  const handleAddSession = (sessionData: Omit<ClassSession, 'id'>) => {
    const newSession: ClassSession = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      ...sessionData,
    };
    setClassSessions((prev) => [...prev, newSession]);
    setEditingSession(null);
  };

  // Edit session
  const handleEditSession = (session: ClassSession) => {
    setEditingSession(session);
  };

  // Save changes to session
  const handleSaveSession = (sessionData: Omit<ClassSession, 'id'>) => {
    if (!editingSession) return;
    const updatedSession: ClassSession = {
      id: editingSession.id,
      ...sessionData,
    };
    setClassSessions((prev) =>
      prev.map((session) => (session.id === editingSession.id ? updatedSession : session))
    );
    setEditingSession(null);
  };

  // Remove session
  const handleRemoveSession = (id: string) => {
    setClassSessions((prev) => prev.filter((session) => session.id !== id));
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
