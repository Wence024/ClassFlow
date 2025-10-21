import React, { useState, useEffect, useMemo } from 'react';
// Import hooks from react-hook-form
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import hooks for fetching data
import { useAuth } from '../../auth/hooks/useAuth';
import { useClassSessions, checkCrossDepartmentResources } from '../hooks/useClassSessions';

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
  useAllCourses,
  useClassGroups,
  useAllClassrooms,
  useAllInstructors,
} from '../../classSessionComponents/hooks';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { useActiveSemester } from '../../scheduleConfig/hooks/useActiveSemester';
import * as timetableService from '../../timetabling/services/timetableService';
import * as resourceRequestService from '../../resourceRequests/services/resourceRequestService';

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

  const { courses, isLoading: coursesLoading } = useAllCourses();
  const { classGroups, isLoading: groupsLoading } = useClassGroups();
  const { classrooms, isLoading: classroomsLoading } = useAllClassrooms();
  const { instructors, isLoading: instructorsLoading } = useAllInstructors();
  const { listQuery: programsQuery } = usePrograms();

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<ClassSession | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search term
  const [crossDeptInfo, setCrossDeptInfo] = useState<{
    resourceType: 'instructor' | 'classroom' | null;
    resourceId: string | null;
    departmentId: string | null;
    resourceName: string;
  } | null>(null);
  const [pendingFormData, setPendingFormData] = useState<ClassSessionFormData | null>(null);

  const { listQuery: deptQuery } = useDepartments();
  const departments = useMemo(() => deptQuery.data || [], [deptQuery.data]);
  const { data: activeSemester } = useActiveSemester();

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
    if (!user || !user.program_id) return;

    // Check for cross-department resources
    const crossDeptCheck = await checkCrossDepartmentResources(data, user.program_id);

    if (crossDeptCheck.isCrossDept) {
      // Fetch resource name
      let resourceName = 'Unknown';
      if (crossDeptCheck.resourceType === 'instructor') {
        const instructor = instructors.find((i) => i.id === crossDeptCheck.resourceId);
        if (instructor) resourceName = `${instructor.first_name} ${instructor.last_name}`;
      } else if (crossDeptCheck.resourceType === 'classroom') {
        const classroom = classrooms.find((c) => c.id === crossDeptCheck.resourceId);
        if (classroom) resourceName = classroom.name;
      }

      // Show confirmation modal
      setCrossDeptInfo({
        resourceType: crossDeptCheck.resourceType,
        resourceId: crossDeptCheck.resourceId,
        departmentId: crossDeptCheck.departmentId,
        resourceName,
      });
      setPendingFormData(data);
      return;
    }

    // Same-department: create normally
    // Use program_id from form if provided (admin), otherwise use user's program_id
    const program_id = data.program_id || user.program_id || null;
    await addClassSession({ ...data, user_id: user.id, program_id });
    formMethods.reset();
    toast.success('Class session created successfully!');
  };

  const handleConfirmCrossDept = async () => {
    if (!pendingFormData || !user || !crossDeptInfo || !activeSemester) return;

    try {
      // 1. Create class session
      const newSession = await addClassSession({ ...pendingFormData, user_id: user.id });

      // 2. Assign to timetable with 'pending' status (we'll use period 0 as placeholder)
      await timetableService.assignClassSessionToTimetable(
        {
          user_id: user.id,
          class_session_id: newSession.id,
          class_group_id: pendingFormData.class_group_id,
          period_index: 0, // Placeholder period
          semester_id: activeSemester.id,
        },
        'pending'
      );

      // 3. Create resource request
      await resourceRequestService.createRequest({
        requester_id: user.id,
        requesting_program_id: user.program_id!,
        resource_type: crossDeptInfo.resourceType!,
        resource_id: newSession.id, // Store class_session_id here
        target_department_id: crossDeptInfo.departmentId!,
        status: 'pending',
      });

      toast.success('Cross-department request submitted successfully!');
      formMethods.reset();
      setCrossDeptInfo(null);
      setPendingFormData(null);
    } catch (error) {
      console.error('Error creating cross-department request:', error);
      toast.error('Failed to submit request');
    }
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

      <ConfirmModal
        isOpen={!!crossDeptInfo}
        title="Cross-Department Request Required"
        onClose={() => {
          setCrossDeptInfo(null);
          setPendingFormData(null);
        }}
        onConfirm={handleConfirmCrossDept}
        isLoading={isSubmitting}
        confirmText="Submit Request"
      >
        <div className="space-y-2">
          <p>
            The selected {crossDeptInfo?.resourceType} (<strong>{crossDeptInfo?.resourceName}</strong>) belongs to a
            different department.
          </p>
          <p className="text-sm text-gray-600">
            Submit a request to the{' '}
            <strong>
              {departments.find((d) => d.id === crossDeptInfo?.departmentId)?.name || 'department'}
            </strong>{' '}
            head for approval?
          </p>
          <p className="text-xs text-gray-500">
            The session will be marked as pending until approved.
          </p>
        </div>
      </ConfirmModal>
    </>
  );
};

export default ClassSessionsPage;
