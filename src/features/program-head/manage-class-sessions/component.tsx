/**
 * Component for managing class sessions (create, browse, edit, delete).
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useManageClassSessions } from './hook';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import { useFormPersistence } from './hooks/useFormPersistence';
import { classSessionSchema } from '@/types/validation/classSession';
import { ClassSessionForm, ClassSessionCard } from './components/classSession';
import { LoadingSpinner, ErrorMessage, ConfirmModal, FormField } from '@/components/ui';
import { toast } from 'sonner';
import {
  useAllCourses,
  useClassGroups,
  useAllClassrooms,
  useAllInstructors,
} from '@/features/classSessionComponents/hooks';
import { usePrograms } from '@/features/admin/manage-programs/hooks/usePrograms';
import { useDepartments } from '@/features/admin/manage-departments/hooks/useDepartments';
import type { ClassSession } from './types';
import type { Instructor, Classroom } from '@/types';

type FormData = z.infer<typeof classSessionSchema>;

/**
 * Gets resource name for cross-department requests.
 *
 * @param resourceType
 * @param resourceId
 * @param instructors
 * @param classrooms
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
 * Main page for managing class sessions.
 */
export function ManageClassSessionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    sessions,
    isLoading: sessionsLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createSession,
    updateSession,
    deleteSession,
    checkCrossDepartment,
  } = useManageClassSessions();

  const { courses, isLoading: coursesLoading } = useAllCourses();
  const { classGroups, isLoading: groupsLoading } = useClassGroups();
  const { classrooms, isLoading: classroomsLoading } = useAllClassrooms();
  const { instructors, isLoading: instructorsLoading } = useAllInstructors();
  const { listQuery: programsQuery } = usePrograms();
  const { listQuery: deptQuery } = useDepartments();
  const departments = useMemo(() => deptQuery.data || [], [deptQuery.data]);

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<ClassSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [crossDeptInfo, setCrossDeptInfo] = useState<{
    resourceType: 'instructor' | 'classroom' | null;
    resourceId: string | null;
    departmentId: string | null;
    resourceName: string;
  } | null>(null);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const formMethods = useForm<FormData>({
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

  const filteredSessions = useMemo(() => {
    if (!searchTerm) return sessions;
    return sessions.filter(
      (session) =>
        session.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.course?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.group.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sessions, searchTerm]);

  const handleCrossDepartmentRequest = (
    crossDeptCheck: {
      isCrossDept: boolean;
      resourceType: 'instructor' | 'classroom' | null;
      resourceId: string | null;
      departmentId: string | null;
    },
    data: FormData
  ) => {
    if (!crossDeptCheck.resourceId || !crossDeptCheck.resourceType || !crossDeptCheck.departmentId) {
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

  const handleAdd = async (data: FormData) => {
    if (!user || !user.program_id) {
      toast.error('User is not assigned to a program');
      return;
    }

    try {
      const crossDeptCheck = await checkCrossDepartment(data.instructor_id, data.classroom_id);

      if (crossDeptCheck) {
        handleCrossDepartmentRequest({ isCrossDept: true, ...crossDeptCheck }, data);
        return;
      }

      const program_id = data.program_id || user.program_id;
      await createSession({ ...data, user_id: user.id, program_id });
      formMethods.reset();
      clearPersistedData();
    } catch (error) {
      console.error('Error creating class session:', error);
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
      const newSession = await createSession({
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
    }
  };

  const handleSave = async (data: FormData) => {
    if (!editingSession) return;
    try {
      await updateSession(editingSession.id, data);
      setEditingSession(null);
    } catch (error) {
      console.error('Error updating class session:', error);
    }
  };

  const handleCancel = () => setEditingSession(null);
  const handleEdit = (session: ClassSession) => setEditingSession(session);
  const handleDeleteRequest = (id: string) =>
    setSessionToDelete(sessions.find((s) => s.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    await deleteSession(sessionToDelete.id);
    setSessionToDelete(null);
    if (editingSession?.id === sessionToDelete.id) {
      setEditingSession(null);
    }
  };

  const isDataLoading =
    sessionsLoading ||
    coursesLoading ||
    groupsLoading ||
    classroomsLoading ||
    instructorsLoading ||
    programsQuery.isLoading;

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <FormProvider {...formMethods}>
            <ClassSessionForm
              formMethods={formMethods}
              onSubmit={editingSession ? handleSave : handleAdd}
              onCancel={editingSession ? handleCancel : undefined}
              loading={isCreating || isUpdating}
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
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No classes created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
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
        isLoading={isDeleting}
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
        isLoading={isCreating}
        confirmText="Create Session & Go to Timetable"
      >
        <div className="space-y-2">
          <p>
            The selected {crossDeptInfo?.resourceType} (
            <strong>{crossDeptInfo?.resourceName}</strong>) belongs to a different department.
          </p>
          <p className="text-sm text-muted-foreground">
            You'll be redirected to the timetable where you can drag the session to a time slot.
            After placement, a request will be sent to the{' '}
            <strong>
              {departments.find((d) => d.id === crossDeptInfo?.departmentId)?.name || 'department'}
            </strong>{' '}
            head for approval.
          </p>
        </div>
      </ConfirmModal>
    </>
  );
}
