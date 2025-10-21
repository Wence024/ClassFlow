import React, { useState, useEffect, useMemo } from 'react';
// Import hooks from react-hook-form
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import hooks for fetching data
import { useAuth } from '../../auth/hooks/useAuth';
import { useClassSessions } from '../hooks/useClassSessions';

// FIXED: Corrected import paths for the refactored components
import { ClassSessionForm } from './components/classSession';
import { ClassSessionCard } from './components/classSession';

// Import the specific type for a class session
import type { ClassSession } from '../types/classSession';
// FIXED: Import the schema from its correct, new location
import { classSessionSchema } from '../types/validation';
// Import all necessary UI components
import { LoadingSpinner, ErrorMessage, ConfirmModal, FormField } from '../../../components/ui';
import { toast } from 'sonner';
import {
  useCourses,
  useClassGroups,
  useClassrooms,
  useInstructors,
} from '../../classSessionComponents/hooks';
import { usePrograms } from '../../programs/hooks/usePrograms';

// Define the form data type directly from the Zod schema
type ClassSessionFormData = z.infer<typeof classSessionSchema>;

/**
 * The main page for managing Class Sessions.
 * This page orchestrates data fetching and state management for creating, updating,
 * and displaying class sessions in a two-column layout.
 *
 * @returns The rendered Class Sessions page.
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
  const { listQuery: programsQuery } = usePrograms();

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<ClassSession | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search term

  // Form management is now handled here, at the page level
  const formMethods = useForm<ClassSessionFormData>({
    resolver: zodResolver(classSessionSchema),
    defaultValues: {
      course_id: '',
      class_group_id: '',
      classroom_id: '',
      instructor_id: '',
      period_count: 1,
      program_id: '',
    },
  });

  useEffect(() => {
    if (editingSession && editingSession.course) {
      formMethods.reset({
        course_id: editingSession.course.id,
        instructor_id: editingSession.instructor.id,
        class_group_id: editingSession.group.id,
        classroom_id: editingSession.classroom.id,
        period_count: editingSession.period_count ?? 1,
        program_id: editingSession.program_id || '',
      });
    } else {
      // Reset to default values when not editing
      formMethods.reset({
        course_id: '',
        instructor_id: '',
        class_group_id: '',
        classroom_id: '',
        period_count: 1,
        program_id: user?.program_id || '',
      });
    }
  }, [editingSession, formMethods, user]);

  // NEW: Memoize the filtered list to avoid re-calculating on every render
  const filteredClassSessions = useMemo(() => {
    if (!searchTerm) return classSessions;
    return classSessions.filter(
      (classSession) =>
        classSession.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classSession.course?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classSession.group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classSession.group.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classSessions, searchTerm]);

  const handleAdd = async (data: ClassSessionFormData) => {
    if (!user) return;
    // Use program_id from form if provided (admin), otherwise use user's program_id
    const program_id = data.program_id || user.program_id || null;
    await addClassSession({ ...data, user_id: user.id, program_id });
    formMethods.reset();
    toast('Success', { description: 'Class session created successfully!' });
  };

  const handleSave = async (data: ClassSessionFormData) => {
    if (!editingSession) return;
    await updateClassSession(editingSession.id, data);
    setEditingSession(null);
    toast('Success', { description: 'Class session updated successfully!' });
  };

  const handleCancel = () => setEditingSession(null);
  const handleEdit = (session: ClassSession) => setEditingSession(session);
  const handleDeleteRequest = (id: string) =>
    setSessionToDelete(classSessions.find((s) => s.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    await removeClassSession(sessionToDelete.id);
    toast('Success', { description: 'Class session removed successfully.' });
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
    instructorsLoading ||
    programsQuery.isLoading;

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          {/* We now pass the form methods directly to the form component */}
          <FormProvider {...formMethods}>
            <ClassSessionForm
              formMethods={formMethods}
              onSubmit={editingSession ? handleSave : handleAdd}
              onCancel={editingSession ? handleCancel : undefined}
              loading={isSubmitting}
              courses={courses}
              classGroups={classGroups}
              instructors={instructors}
              classrooms={classrooms}
              programs={programsQuery.data || []}
              isEditing={!!editingSession}
            />
          </FormProvider>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-6">Classes</h1>

          {/* NEW: Search input */}
          <div className="mb-4">
            <FormField
              id="search-classSessions"
              label="Search Classes"
              placeholder="Search by course or class group..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {isDataLoading && <LoadingSpinner text="Loading classes..." />}
          {error && <ErrorMessage message={error} />}
          {!isDataLoading && !error && (
            <>
              {/* Use the filtered list for rendering */}
              {filteredClassSessions.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No classes created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClassSessions.map((session) => (
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
        Are you sure you want to delete the class session for "{sessionToDelete?.course?.name} -{' '}
        {sessionToDelete?.group.name}"?
      </ConfirmModal>
    </>
  );
};

export default ClassSessionsPage;
