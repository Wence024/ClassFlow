import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTimetable } from './useTimetable';
import { useScheduleConfig } from '../../scheduleConfig/hooks/useScheduleConfig';
import { toast } from 'sonner';
import checkTimetableConflicts from '../utils/checkConflicts';
import type { DragSource } from '../types/DragSource';
import type { ClassSession } from '../../classSessions/types/classSession';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import type { TimetableViewMode, HydratedTimetableAssignment } from '../types/timetable';
import { User } from '../../shared/auth/types/auth';

const DRAG_DATA_KEY = 'application/json';

const parseDragData = (e: React.DragEvent): DragSource | null => {
  const rawData = e.dataTransfer.getData(DRAG_DATA_KEY);
  if (!rawData) {
    return null;
  }
  try {
    return JSON.parse(rawData);
  } catch (err) {
    console.error('[TimetableDnd] Failed to parse drag data', err);
    toast.error('Invalid drag data');
    return null;
  }
};

const getResourceMismatchError = (
  viewMode: TimetableViewMode,
  session: ClassSession,
  source: DragSource,
  targetId: string
): string => {
  if (source.from !== 'timetable') return '';

  switch (viewMode) {
    case 'classroom':
      if (session.classroom.id !== targetId) {
        return `Cannot move this session to a different classroom. This session is assigned to "${session.classroom.name}". To reassign the classroom, please go to Manage Classes page.`;
      }
      break;
    case 'instructor':
      if (session.instructor.id !== targetId) {
        const instructorName = `${session.instructor.first_name} ${session.instructor.last_name}`;
        return `Cannot move this session to a different instructor. This session is assigned to "${instructorName}". To reassign the instructor, please go to Manage Classes page.`;
      }
      break;
    case 'class-group':
      if (source.class_group_id !== targetId) {
        return `Cannot move this session to a different class group. This session belongs to "${session.group.name}".`;
      }
      break;
  }
  return '';
};

const validateDrop = (
  source: DragSource | null,
  allClassSessions: ClassSession[],
  user: User | null,
  viewMode: TimetableViewMode,
  targetClassGroupId: string
): [DragSource, ClassSession] | [null, null] => {
  if (!source) {
    return [null, null];
  }

  const classSessionToDrop = allClassSessions.find((cs) => cs.id === source.class_session_id);

  if (!classSessionToDrop) {
    toast.error('Could not find the class session to drop.');
    return [null, null];
  }

  if (source.from === 'timetable' && classSessionToDrop.program_id !== user?.program_id) {
    toast.error('You can only move sessions that belong to your own program.');
    return [null, null];
  }

  const resourceMismatchError = getResourceMismatchError(
    viewMode,
    classSessionToDrop,
    source,
    targetClassGroupId
  );
  if (resourceMismatchError) {
    toast.warning(resourceMismatchError);
    return [null, null];
  }

  return [source, classSessionToDrop];
};

const needsReapproval = (
  source: DragSource,
  classSessionToDrop: ClassSession,
  assignments: HydratedTimetableAssignment[] | undefined,
  userDepartmentId: string | null
): boolean => {
  if (source.from !== 'timetable') {
    return false;
  }

  const currentAssignment = assignments?.find(
    (a: HydratedTimetableAssignment) =>
      a.class_session?.id === classSessionToDrop.id &&
      a.class_group_id === source.class_group_id &&
      a.period_index === source.period_index
  );

  const isCurrentlyConfirmed = currentAssignment?.status === 'confirmed';
  const hasCrossDeptResource = Boolean(
    (classSessionToDrop.instructor.department_id &&
      classSessionToDrop.instructor.department_id !== userDepartmentId) ||
      (classSessionToDrop.classroom.preferred_department_id &&
        classSessionToDrop.classroom.preferred_department_id !== userDepartmentId)
  );

  return hasCrossDeptResource && isCurrentlyConfirmed;
};

/**
 * A consolidated hook to manage the entire lifecycle of drag-and-drop (D&D)
 * operations for the timetable. It handles UI state, visual feedback,
 * event handling, and data mutations.
 *
 * @param allClassSessions - All class sessions visible to the user (not just their own).
 * @param viewMode - The current timetable view mode for validation.
 * @param userDepartmentId - The user's department ID for cross-department validation.
 * @param assignments - Current timetable assignments for checking confirmation status.
 * @param pendingPlacementInfo - Optional info about a session awaiting cross-dept placement.
 * @param pendingPlacementInfo.pendingSessionId - Pending session ID for placement.
 * @param pendingPlacementInfo.resourceType - Resource type for pending placement ('instructor' | 'classroom').
 * @param pendingPlacementInfo.resourceId - ID of resource that is pending placement.
 * @param pendingPlacementInfo.departmentId - Target department ID for the resource.
 * @param pendingPlacementInfo.onClearPending - Callback to clear pending placement state.
 * @returns An object containing all necessary state and handlers for D&D functionality.
 */
export const useTimetableDnd = (
  allClassSessions: ClassSession[],
  viewMode: TimetableViewMode = 'class-group',
  userDepartmentId: string | null = null,
  assignments?: HydratedTimetableAssignment[],
  pendingPlacementInfo?: {
    pendingSessionId?: string;
    resourceType?: 'instructor' | 'classroom';
    resourceId?: string;
    departmentId?: string;
    onClearPending?: () => void;
  }
) => {
  // --- Core Hooks ---
  const { user } = useAuth();
  const { timetable, assignClassSession, removeClassSession, moveClassSession } =
    useTimetable(viewMode);
  const { settings } = useScheduleConfig();
  const { listQuery } = usePrograms();
  const programs = useMemo(() => listQuery.data || [], [listQuery.data]);

  // --- D&D State ---
  const [activeDragSource, setActiveDragSource] = useState<DragSource | null>(null);
  const [activeDraggedSession, setActiveDraggedSession] = useState<ClassSession | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ groupId: string; periodIndex: number } | null>(
    null
  );

  // --- State Cleanup ---

  const cleanupDragState = useCallback(() => {
    setActiveDragSource(null);
    setActiveDraggedSession(null);
    setDragOverCell(null);
  }, []);

  // Global listeners to ensure state is always cleaned up.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanupDragState();
      }
    };

    document.addEventListener('dragend', cleanupDragState);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('dragend', cleanupDragState);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cleanupDragState]);

  // --- Visual Feedback Logic ---

  const isViewModeCompliant = (
    viewMode: TimetableViewMode,
    source: DragSource,
    draggedSession: ClassSession,
    targetGroupId: string
  ): boolean => {
    if (source.from === 'timetable') {
      switch (viewMode) {
        case 'class-group':
          return source.class_group_id === targetGroupId;
        case 'classroom':
          return draggedSession.classroom.id === targetGroupId;
        case 'instructor':
          return draggedSession.instructor.id === targetGroupId;
      }
    } else if (source.from === 'drawer') {
      switch (viewMode) {
        case 'class-group':
          return draggedSession.group.id === targetGroupId;
        case 'classroom':
          return draggedSession.classroom.id === targetGroupId;
        case 'instructor':
          return draggedSession.instructor.id === targetGroupId;
      }
    }
    return false;
  };

  const isSlotAvailable = useCallback(
    (groupId: string, periodIndex: number): boolean => {
      if (!activeDraggedSession || !settings || !activeDragSource) {
        return false;
      }

      if (
        activeDragSource.from === 'timetable' &&
        activeDraggedSession.program_id !== user?.program_id
      ) {
        return false;
      }

      if (!isViewModeCompliant(viewMode, activeDragSource, activeDraggedSession, groupId)) {
        return false;
      }

      const isMovingSession = activeDragSource.from === 'timetable';
      const conflictMessage = checkTimetableConflicts(
        timetable,
        activeDraggedSession,
        settings,
        groupId,
        periodIndex,
        programs,
        viewMode,
        isMovingSession
      );

      return conflictMessage === '';
    },
    [activeDraggedSession, settings, timetable, activeDragSource, user, programs, viewMode]
  );

  // --- Event Handlers ---

  const executeDropMutation = useCallback(
    async (
      source: DragSource,
      session: ClassSession,
      dbTargetGroupId: string,
      targetPeriodIndex: number
    ) => {
      if (source.from === 'drawer') {
        return assignClassSession(dbTargetGroupId, targetPeriodIndex, session);
      } else if (source.from === 'timetable') {
        const isSameCell =
          viewMode === 'class-group'
            ? source.class_group_id === dbTargetGroupId && source.period_index === targetPeriodIndex
            : source.period_index === targetPeriodIndex;

        if (isSameCell) return '';

        return moveClassSession(
          { class_group_id: source.class_group_id, period_index: source.period_index },
          { class_group_id: dbTargetGroupId, period_index: targetPeriodIndex },
          session
        );
      }
      return 'Invalid drag source';
    },
    [assignClassSession, moveClassSession, viewMode]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, source: DragSource) => {
      const session = allClassSessions.find((cs) => cs.id === source.class_session_id) || null;
      e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(source));
      e.dataTransfer.effectAllowed = 'move';

      setActiveDragSource(source);
      setActiveDraggedSession(session);
    },
    [allClassSessions]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent, groupId: string, periodIndex: number) => {
      e.stopPropagation();
      setDragOverCell({ groupId, periodIndex });
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !currentTarget.contains(related)) {
      setDragOverCell(null);
    }
  }, []);

  const handlePendingPlacement = useCallback(
    async (classSessionToDrop: ClassSession) => {
      if (
        !pendingPlacementInfo?.resourceType ||
        !pendingPlacementInfo?.resourceId ||
        !pendingPlacementInfo?.departmentId
      )
        return;
      const { createRequest } = await import(
        '@/lib/services/resourceRequestService'
      );
      try {
        await createRequest({
          requester_id: user?.id || '',
          requesting_program_id: user?.program_id || '',
          resource_type: pendingPlacementInfo.resourceType,
          resource_id: pendingPlacementInfo.resourceId,
          class_session_id: classSessionToDrop.id,
          target_department_id: pendingPlacementInfo.departmentId,
          status: 'pending',
        });
        toast.success('Session placed and request submitted! Check notifications for updates.');
        pendingPlacementInfo.onClearPending?.();
      } catch (requestErr) {
        console.error('Failed to create resource request:', requestErr);
        toast.error(
          'Session placed but failed to create request. Please try again from Classes page.'
        );
      }
    },
    [user, pendingPlacementInfo]
  );

  const handleReapproval = useCallback(
    (
      source: DragSource,
      classSessionToDrop: ClassSession,
      dbTargetGroupId: string,
      targetPeriodIndex: number,
      onConfirmMove: (callback: () => void) => void
    ) => {
      onConfirmMove(async () => {
        try {
          const error = await executeDropMutation(
            source,
            classSessionToDrop,
            dbTargetGroupId,
            targetPeriodIndex
          );
          if (error) {
            toast.error(error);
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          toast.error(errorMsg);
        } finally {
          cleanupDragState();
        }
      });
    },
    [executeDropMutation, cleanupDragState]
  );

  const handleDropToGrid = useCallback(
    async (
      e: React.DragEvent,
      targetClassGroupId: string,
      targetPeriodIndex: number,
      onConfirmMove?: (callback: () => void) => void
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const [source, classSessionToDrop] = validateDrop(
        parseDragData(e),
        allClassSessions,
        user,
        viewMode,
        targetClassGroupId
      );

      if (!source || !classSessionToDrop) {
        cleanupDragState();
        return;
      }

      const dbTargetGroupId =
        viewMode === 'class-group' ? targetClassGroupId : classSessionToDrop.group.id;

      if (onConfirmMove && needsReapproval(source, classSessionToDrop, assignments, userDepartmentId)) {
        handleReapproval(
          source,
          classSessionToDrop,
          dbTargetGroupId,
          targetPeriodIndex,
          onConfirmMove
        );
        return;
      }

      const isPendingPlacement = pendingPlacementInfo?.pendingSessionId === classSessionToDrop.id;

      try {
        const error = await executeDropMutation(
          source,
          classSessionToDrop,
          dbTargetGroupId,
          targetPeriodIndex
        );
        if (error) {
          toast.error(error);
        } else if (isPendingPlacement) {
          await handlePendingPlacement(classSessionToDrop);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        toast.error(errorMsg);
      } finally {
        cleanupDragState();
      }
    },
    [
      allClassSessions,
      cleanupDragState,
      user,
      userDepartmentId,
      viewMode,
      executeDropMutation,
      pendingPlacementInfo,
      assignments,
      handlePendingPlacement,
      handleReapproval,
    ]
  );

  const handleDropToDrawer = useCallback(
    async (e: React.DragEvent, onConfirm?: (callback: () => void) => void) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      if (source.from === 'timetable') {
        const session = allClassSessions.find((cs) => cs.id === source.class_session_id);

        if (session && onConfirm) {
          const hasCrossDeptResource =
            (session.instructor.department_id &&
              session.instructor.department_id !== userDepartmentId) ||
            (session.classroom.preferred_department_id &&
              session.classroom.preferred_department_id !== userDepartmentId);

          if (hasCrossDeptResource) {
            onConfirm(async () => {
              const { cancelActiveRequestsForClassSession } = await import(
                '@/lib/services/resourceRequestService'
              );
              try {
                // Cancel active requests and notify department head
                await cancelActiveRequestsForClassSession(session.id);
                await removeClassSession(source.class_group_id, source.period_index);
                toast.success('Session removed and department head notified');
              } catch (err) {
                console.error('Failed to cancel resource requests:', err);
                toast.error('Failed to remove session');
              }
            });
            cleanupDragState();
            return;
          }
        }

        await removeClassSession(source.class_group_id, source.period_index);
      }

      cleanupDragState();
    },
    [removeClassSession, cleanupDragState, allClassSessions, userDepartmentId]
  );

  return {
    activeDraggedSession,
    dragOverCell,
    isSlotAvailable,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDropToGrid,
    handleDropToDrawer,
  };
};
