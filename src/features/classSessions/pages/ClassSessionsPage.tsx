import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '../../auth/hooks/useAuth';
import { useClassSessions } from '../hooks/useClassSessions';
import {
  useClassGroups,
  useClassrooms,
  useCourses,
  useInstructors,
} from '../../classSessionComponents/hooks';

// Import the specific card and the form directly
import { ClassSessionForm, ClassSessionCard } from './components';

import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../types/classSession';
import { classSessionSchema } from '../../classSessionComponents/types/validation';
import { LoadingSpinner, ErrorMessage, ConfirmModal, ActionButton } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';

type ClassSessionFormData = z.infer<typeof classSessionSchema>;

/**
 * The main page for managing Class Sessions.
 * This page orchestrates data fetching and state management for creating, updating,
 * and displaying class sessions in a two-column layout.
 */
const ClassSessionsPage: React.FC = () => {
  const { user } = useAuth();
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

  const { courses, isLoading: coursesLoading } = useCourses();
  const { classGroups, isLoading: groupsLoading } = useClassGroups();
  const { classrooms, isLoading: classroomsLoading } = useClassrooms();
  const { instructors, isLoading: instructorsLoading } = useInstructors();

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<ClassSession | null>(null);

  // Form management is now handled here, at the page level.
  const formMethods = useForm<ClassSessionFormData>({
    resolver: zodResolver(classSessionSchema),
    defaultValues: {
      course_id: '',
      instructor_id: '',
      class_group_id: '',
      classroom_id: '',
      period_count: 1,
    },
  });

  useEffect(() => {
    if (editingSession) {
      formMethods.reset({
        course_id: editingSession.course.id,
        instructor_id: editingSession.instructor.id,
        class_group_id: editingSession.group.id,
        classroom_id: editingSession.classroom.id,
        period_count: editingSession.periodCount ?? 1,
      });
    } else {
      formMethods.reset();
    }
  }, [editingSession, formMethods]);

  const handleAdd = async (data: ClassSessionFormData) => {
    if (!user) return;
    await addClassSession({ ...data, user_id: user.id });
    formMethods.reset();
    showNotification('Class session created successfully!');
  };

  const handleSave = async (data: ClassSessionFormData) => {
    if (!editingSession) return;
    await updateClassSession(editingSession.id, data);
    setEditingSession(null);
    showNotification('Class session updated successfully!');
  };

  const handleCancel = () => setEditingSession(null);
  const handleEdit = (session: ClassSession) => setEditingSession(session);
  const handleDeleteRequest = (id: string) =>
    setSessionToDelete(classSessions.find((s) => s.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    await removeClassSession(sessionToDelete.id);
    showNotification('Class session removed successfully.');
    setSessionToDelete(null);
    if (editingSession?.id === sessionToDelete.id) {
      setEditingSession(null);
    }
  };

  const isDataLoading =
    classSessionsLoading ||
    coursesLoading ||
    groupsLoading ||
    classroomsLoading ||
    instructorsLoading;

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          {/* We now pass the form methods directly to the form component */}
          <ClassSessionForm
            formMethods={formMethods}
            onSubmit={editingSession ? handleSave : handleAdd}
            onCancel={editingSession ? handleCancel : undefined}
            loading={isSubmitting}
            courses={courses}
            classGroups={classGroups}
            instructors={instructors}
            classrooms={classrooms}
            isEditing={!!editingSession}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-6">Classes</h1>
          {isDataLoading && <LoadingSpinner text="Loading classes..." />}
          {error && <ErrorMessage message={error} />}
          {!isDataLoading && !error && (
            <>
              {classSessions.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No classes created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classSessions.map((session) => (
                    <ClassSessionCard
                      key={session.id}
                      classSession={session}
                      onEdit={handleEdit}
                      onDelete={handleDeleteRequest}
                    />
                  ))}
                </div>
              )}
            </>
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
        {sessionToDelete?.group.name}"?
      </ConfirmModal>
    </>
  );
};

export default ClassSessionsPage;
