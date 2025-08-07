import React, { useState } from 'react';
import { useClassSessions } from './useClassSessions';
import { ClassSessionList, ClassSessionForm } from './components';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from './classSession';
import { LoadingSpinner, ErrorMessage } from '../../components/ui';
import {
  useClassGroups,
  useClassrooms,
  useCourses,
  useInstructors,
} from '../classSessionComponents/hooks';

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

  const [editingSession, setEditingClassSession] = useState<ClassSession | null>(null);

  // Add new classSession
  const handleAddClassSession = async (sessionData: ClassSessionInsert | ClassSessionUpdate) => {
    await addClassSession(sessionData as ClassSessionInsert);
    setEditingClassSession(null);
  };

  // Edit classSession
  const handleEditClassSession = (classSession: ClassSession) =>
    setEditingClassSession(classSession);

  // Save changes to classSession
  const handleSaveClassSession = async (sessionData: ClassSessionInsert | ClassSessionUpdate) => {
    if (!editingSession) return;
    await updateClassSession(editingSession.id, sessionData as ClassSessionUpdate);
    setEditingClassSession(null);
  };

  // Remove classSession
  const handleRemoveClassSession = async (id: string) => {
    await removeClassSession(id);
    setEditingClassSession(null);
  };

  // Cancel editing
  const handleCancel = () => setEditingClassSession(null);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-center mb-6">Class Management</h1>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Classes</h2>
          {classSessionsLoading && <LoadingSpinner text="Loading sessions..." />}
          {error && <ErrorMessage message={error} />}
          {!classSessionsLoading && !error && (
            <ClassSessionList
              classSessions={classSessions}
              onEdit={handleEditClassSession}
              onDelete={handleRemoveClassSession}
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
          editingClassSession={editingSession}
          onCancel={editingSession ? handleCancel : undefined}
          onSubmit={editingSession ? handleSaveClassSession : handleAddClassSession}
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
