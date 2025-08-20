import React, { useState } from 'react';
import { useClassSessions } from '../hooks/useClassSessions';
import { ClassSessionList, ClassSessionForm } from './components';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../types/classSession';
import { LoadingSpinner, ErrorMessage, ConfirmModal } from '../../../components/ui';
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
 * This page orchestrates the class session feature, fetching all necessary data from multiple
 * custom hooks, managing the combined loading state, and handling the UI state for editing and
 * safely deleting sessions via a confirmation modal. It then passes the data and callbacks down to the
 * `ClassSessionList` and `ClassSessionForm` components.
 */
const ClassSessionsPage: React.FC = () => {
  const {
    classSessions,
    addClassSession,
    updateClassSession,
    removeClassSession,
    isLoading: classSessionsLoading,
    isSubmitting,
    isRemoving,
    error,
  } = useClassSessions();

  // Fetch all the component data needed for the form dropdowns.
  const { courses, isLoading: coursesLoading } = useCourses();
  const { classGroups, isLoading: groupsLoading } = useClassGroups();
  const { classrooms, isLoading: classroomsLoading } = useClassrooms();
  const { instructors, isLoading: instructorsLoading } = useInstructors();

  /** The local state for the session currently being edited. */
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<ClassSession | null>(null);

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

  /** Opens the delete confirmation modal for the selected session. */
  const handleDeleteRequest = (id: string) => {
    const session = classSessions.find((s) => s.id === id);
    if (session) {
      setSessionToDelete(session);
    }
  };

  /** Executes the deletion after confirmation. */
  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    await removeClassSession(sessionToDelete.id);
    showNotification('Class session removed successfully.');
    setSessionToDelete(null);
    if (editingSession?.id === sessionToDelete.id) {
      setEditingSession(null);
    }
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
    <>
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
              onDelete={handleDeleteRequest}
            />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!sessionToDelete}
        title="Confirm Deletion"
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the class session for "{sessionToDelete?.course.name} -{' '}
        {sessionToDelete?.group.name}"? This action cannot be undone.
      </ConfirmModal>
    </>
  );
};

export default ClassSessionsPage;
