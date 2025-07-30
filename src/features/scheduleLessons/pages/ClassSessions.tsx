import React, { useState } from 'react';
import { useClassSessions } from '../hooks/useClassSessions';
import { useCourses, useClassGroups, useClassrooms, useInstructors } from '../hooks/';
import ClassSessionList from '../components/classSessions/ClassSessionList';
import ClassSessionForm from '../components/classSessions/ClassSessionForm';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../types/classSession';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const ClassSessions: React.FC = () => {
  const {
    classSessions,
    addClassSession,
    updateClassSession,
    removeClassSession,
    loading: classSessionsLoading, // Standardize to 'loading'
    error,
  } = useClassSessions();
  const { courses, loading: coursesLoading } = useCourses();
  const { classGroups, loading: groupsLoading } = useClassGroups();
  const { classrooms, loading: classroomsLoading } = useClassrooms();
  const { instructors, loading: instructorsLoading } = useInstructors();

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  // Add new session
  const handleAddSession = async (sessionData: ClassSessionInsert | ClassSessionUpdate) => {
    await addClassSession(sessionData as ClassSessionInsert);
    setEditingSession(null);
  };

  // Edit session
  const handleEditSession = (session: ClassSession) => setEditingSession(session);

  // Save changes to session
  const handleSaveSession = async (sessionData: ClassSessionInsert | ClassSessionUpdate) => {
    if (!editingSession) return;
    await updateClassSession(editingSession.id, sessionData as ClassSessionUpdate);
    setEditingSession(null);
  };

  // Remove session
  const handleRemoveSession = async (id: string) => {
    await removeClassSession(id);
    setEditingSession(null);
  };

  // Cancel editing
  const handleCancel = () => setEditingSession(null);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-center mb-6">Class Session Management</h1>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Class Sessions</h2>
          {classSessionsLoading && <LoadingSpinner text="Loading sessions..." />}
          {error && <ErrorMessage message={error} />}
          {!classSessionsLoading && !error && (
            <ClassSessionList
              sessions={classSessions}
              onEdit={handleEditSession}
              onDelete={handleRemoveSession}
            />
          )}
        </div>
      </div>
      <div className="w-full md:w-96">
        <ClassSessionForm
          courses={courses}
          classGroups={classGroups}
          instructors={instructors}
          classrooms={classrooms}
          editingSession={editingSession}
          onCancel={editingSession ? handleCancel : undefined}
          onSubmit={editingSession ? handleSaveSession : handleAddSession}
          loading={
            classSessionsLoading ||
            coursesLoading ||
            groupsLoading ||
            classroomsLoading ||
            instructorsLoading
          }
        />
      </div>
    </div>
  );
};

export default ClassSessions;
