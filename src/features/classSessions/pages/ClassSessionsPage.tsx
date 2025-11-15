import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Import hooks from react-hook-form
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormPersistence } from '../hooks/useFormPersistence';

// Import hooks for fetching data
import { useAuth } from '../../auth/hooks/useAuth';
import { useClassSessions, checkCrossDepartmentResources } from '../hooks/useClassSessions';

// FIXED: Corrected import paths for the refactored components
import { ClassSessionForm } from './components/classSession';
import { ClassSessionCard } from './components/classSession';

// Import the specific type for a class session
import type { ClassSession } from '../types/classSession';
import { Instructor } from '../../classSessionComponents/types/instructor';
import { Classroom } from '../../classSessionComponents/types/classroom';
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

// Define the form data type directly from the Zod schema
type ClassSessionFormData = z.infer<typeof classSessionSchema>;

/**
 * Gets the name of a resource (instructor or classroom) from its ID.
 *
 * @param resourceType The type of the resource ('instructor' or 'classroom').
 * @param resourceId The ID of the resource.
 * @param instructors An array of instructors.
 * @param classrooms An array of classrooms.
 * @returns The name of the resource.
 */
const getResourceName = (
  resourceType: 'instructor' | 'classroom',
  resourceId: string,
  instructors: Instructor[],
  classrooms: Classroom[]
) => {
  if (resourceType === 'instructor') {
    const instructor = instructors.find((i) => i.id === resourceId);
    return instructor ? `${instructor.first_name} ${instructor.last_name}` : 'Unknown';
  } else {
    const classroom = classrooms.find((c) => c.id === resourceId);
    return classroom ? classroom.name : 'Unknown';
  }
};

/**
 * The main page for managing Class Sessions.
 * This page orchestrates data fetching and state management for creating, updating,
 * and displaying class sessions in a two-column layout.
 *
 * @returns The rendered Class Sessions page.
 */
const ClassSessionsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Enable form persistence
  const { clearPersistedData } = useFormPersistence({
    formMethods,
    isEditing: !!editingSession,
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

  const handleCrossDepartmentRequest = (
    crossDeptCheck: {
      isCrossDept: boolean;
      resourceType: 'instructor' | 'classroom' | null;
      resourceId: string | null;
      departmentId: string | null;
    },
    data: ClassSessionFormData
  ) => {
    if (
      !crossDeptCheck.resourceId ||
      !crossDeptCheck.resourceType ||
      !crossDeptCheck.departmentId
    ) {
      toast.error('Invalid cross-department resource information');
      return;
    }

    const resourceName = getResourceName(
      crossDeptCheck.resourceType,
      crossDeptCheck.resourceId,
      instructors,
      classrooms
    );

    setCrossDeptInfo({
      resourceType: crossDeptCheck.resourceType,
      resourceId: crossDeptCheck.resourceId,
      departmentId: crossDeptCheck.departmentId,
      resourceName,
    });
    setPendingFormData(data);
  };

  const handleAdd = async (data: ClassSessionFormData) => {
    if (!user || !user.program_id) {
      toast.error('User is not assigned to a program');
      return;
    }

    try {
      const crossDeptCheck = await checkCrossDepartmentResources(data, user.program_id);

      if (crossDeptCheck.isCrossDept) {
        handleCrossDepartmentRequest(crossDeptCheck, data);
        return;
      }

      const program_id = data.program_id || user.program_id;
      await addClassSession({ ...data, user_id: user.id, program_id });
      formMethods.reset();
      clearPersistedData();
      toast.success('Class session created successfully!');
    } catch (error) {
      console.error('Error creating class session:', error);
      toast.error('Failed to create class session');
    }
  };

  const handleConfirmCrossDept = async () => {
    if (!pendingFormData || !user || !crossDeptInfo) return;

    if (!user.program_id) {
      toast.error('User is not assigned to a program');
      return;
    }

    try {
      const program_id = pendingFormData.program_id || user.program_id;
      const newSession = await addClassSession({
        ...pendingFormData,
        user_id: user.id,
        program_id,
      });

      if (!newSession || !newSession.id) {
        throw new Error('Failed to create class session: No ID returned');
      }

      const params = new URLSearchParams({
        pendingSessionId: newSession.id,
        resourceType: crossDeptInfo.resourceType || '',
        resourceId: crossDeptInfo.resourceId || '',
        departmentId: crossDeptInfo.departmentId || '',
      });

      formMethods.reset();
      clearPersistedData();
      setCrossDeptInfo(null);
      setPendingFormData(null);

      toast.success('Session created! Now drag it to the timetable to submit your request.');
      navigate(`/scheduler?${params.toString()}`, { replace: false });
    } catch (error) {
      console.error('Error creating class session:', error);
      toast.error('Failed to create class session');
    }
  };

  const handleSave = async (data: ClassSessionFormData) => {
    if (!editingSession) return;
    try {
      await updateClassSession(editingSession.id, data);
      setEditingSession(null);
      toast('Success', { description: 'Class session updated successfully!' });
    } catch (error) {
      console.error('Error updating class session:', error);
      toast.error('Failed to update class session');
    }
  };

  const handleCancel = () => setEditingSession(null);
  const handleEdit = (session: ClassSession) => setEditingSession(session);
  const handleDeleteRequest = (id: string) =>
    setSessionToDelete(classSessions.find((s) => s.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    await removeClassSession(sessionToDelete.id);
    toast.success('Class session removed successfully.');
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
        confirmText="Create Session & Go to Timetable"
      >
        <div className="space-y-2">
          <p>
            The selected {crossDeptInfo?.resourceType} (
            <strong>{crossDeptInfo?.resourceName}</strong>) belongs to a different department.
          </p>
          <p className="text-sm text-muted-foreground">
            You'll be redirected to the timetable where you can drag the session to a time slot.
            After placement, a a request will be sent to the{' '}
            <strong>
              {departments.find((d) => d.id === crossDeptInfo?.departmentId)?.name || 'department'}
            </strong>{' '}
            head for approval.
          </p>
        </div>
      </ConfirmModal>
    </>
  );
};

export default ClassSessionsPage;
