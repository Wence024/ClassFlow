import React, { useState } from 'react';
import { useClassSessions } from '../hooks/useClassSessions';
import { ClassSessionList, ClassSessionForm } from './components';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../types/classSession';
import { LoadingSpinner, ErrorMessage } from '../../../components/ui';
import {
  useClassGroups,
  useClassrooms,
  useCourses,
  useInstructors,
} from '../../classSessionComponents/hooks';
import { showNotification } from '../../../lib/notificationsService';

/**
 * The main page for managing Class Sessions.
 *
 * This page serves as the primary orchestrator for the class session feature.
 * It fetches all necessary data from multiple custom hooks (class sessions, courses,
 * instructors, etc.), manages the combined loading state, and handles the UI state
 * for editing sessions. It then passes the data and callbacks down to the
 * `ClassSessionList` and `ClassSessionForm` components.
 */
const ClassSessionsPage: React.FC = () => {
  // Fetch class sessions and their mutation functions.
  const {
    classSessions,
    addClassSession,
    updateClassSession,
    removeClassSession,
    isLoading: classSessionsLoading,
    isSubmitting,
    error,
  } = useClassSessions();

  // Fetch all the component data needed for the form dropdowns.
  const { courses, isLoading: coursesLoading } = useCourses();
  const { classGroups, isLoading: groupsLoading } = useClassGroups();
  const { classrooms, isLoading: classroomsLoading } = useClassrooms();
  const { instructors, isLoading: instructorsLoading } = useInstructors();

  /** The local state for the session currently being edited. */
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  /** Handles the creation of a new class session. */
  const handleAdd = async (sessionData: ClassSessionInsert | ClassSessionUpdate) => {
    await addClassSession(sessionData as ClassSessionInsert);
    showNotification('Class session created successfully!');
  };

  /** Sets a session into the form for editing. */
  const handleEdit = (classSession: ClassSession) => setEditingSession(classSession);

  /** Handles saving changes to an existing class session. */
  const handleSave = async (sessionData: ClassSessionInsert | ClassSessionUpdate) => {
    if (!editingSession) return;
    await updateClassSession(editingSession.id, sessionData as ClassSessionUpdate);
    setEditingSession(null);
    showNotification('Class session updated successfully!');
  };

  /** Handles the deletion of a class session. */
  const handleRemove = async (id: string) => {
    await removeClassSession(id);
    setEditingSession(null); // Clear form if the deleted item was being edited.
    showNotification('Class session removed successfully.');
  };

  /** Clears the form and cancels the editing state. */
  const handleCancel = () => setEditingSession(null);

  /** A combined loading state that is true if any of the required data is being fetched. */
  const isLoading =
    classSessionsLoading ||
    coursesLoading ||
    groupsLoading ||
    classroomsLoading ||
    instructorsLoading;

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8">
      {/* Form Section */}
      <div className="w-full md:w-96">
        <ClassSessionForm
          courses={courses}
          classGroups={classGroups}
          instructors={instructors}
          classrooms={classrooms}
          editingClassSession={editingSession}
          onCancel={editingSession ? handleCancel : undefined}
          onSubmit={editingSession ? handleSave : handleAdd}
          loading={isSubmitting}
        />
      </div>

      {/* List Section */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold mb-6">Classes</h1>
        {isLoading && <LoadingSpinner text="Loading classes..." />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && !error && (
          <ClassSessionList
            classSessions={classSessions}
            onEdit={handleEdit}
            onDelete={handleRemove}
          />
        )}
      </div>
    </div>
  );
};

export default ClassSessionsPage;
