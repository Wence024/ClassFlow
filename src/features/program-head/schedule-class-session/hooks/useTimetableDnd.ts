import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTimetable } from './useTimetable';
import { useScheduleConfig } from '@/features/admin/schedule-config/hooks/useScheduleConfig';
import { toast } from 'sonner';
import checkTimetableConflicts from '../utils/checkConflicts';
import type { DragSource } from '../types';
import type { ClassSession } from '@/types/classSession';
import { usePrograms } from '@/features/admin/manage-programs/hooks/usePrograms';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import type { TimetableViewMode, HydratedTimetableAssignment } from '../types';
import { User } from '@/features/shared/auth/types/auth';
import { useQueryClient } from '@tanstack/react-query';

const DRAG_DATA_KEY = 'application/json';

// Define a type for resource change metadata
type ResourceChangeMetadata = {
  isChanging: boolean;
  fromId: string;
  toId: string;
  resourceType: 'instructor' | 'classroom';
};

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

/**
 * Gets information about resource changes during drag operations.
 * Returns null if no resource change is occurring.
 *
 * @param viewMode Current view mode
 * @param session Session being dragged
 * @param targetId Target row ID (resource ID)
 * @returns Resource change information or null if no change
 */
const getResourceChangeInfo = (
  viewMode: TimetableViewMode,
  session: ClassSession,
  targetId: string
): { isChanging: boolean; fromId: string; toId: string; resourceType: 'instructor' | 'classroom' } | null => {
  if (viewMode === 'classroom') {
    // Only treat as "changing" if there's an EXISTING classroom being replaced
    if (session.classroom && session.classroom.id !== targetId) {
      const result = {
        isChanging: true,
        fromId: session.classroom.id,
        toId: targetId,
        resourceType: 'classroom' as const
      };
      console.debug('[DND] Resource change detected', result);
      return result;
    }
    // If classroom is null, this is ASSIGNMENT, not reassignment - no confirmation needed
  } else if (viewMode === 'instructor') {
    // Only treat as "changing" if there's an EXISTING instructor being replaced
    if (session.instructor && session.instructor.id !== targetId) {
      const result = {
        isChanging: true,
        fromId: session.instructor.id,
        toId: targetId,
        resourceType: 'instructor' as const
      };
      console.debug('[DND] Resource change detected', result);
      return result;
    }
    // If instructor is null, this is ASSIGNMENT, not reassignment - no confirmation needed
  }
  return null;
};

/**
 * Gets the resource mismatch error message if any.
 *
 * @param viewMode Current view mode
 * @param session Class session being dragged
 * @param source The drag source
 * @param targetId The target ID
 * @returns Error message if there is a mismatch, otherwise empty string
 */
const getResourceMismatchError = (
  viewMode: TimetableViewMode,
  session: ClassSession,
  source: DragSource,
  targetId: string
): string => {
  if (source.from !== 'timetable') return '';

  // Only block class-group view resource mismatches
  // Instructor and classroom views now allow resource reassignment
  if (viewMode === 'class-group') {
    if (source.class_group_id !== targetId) {
      return `Cannot move this session to a different class group. This session belongs to "${session.group.name}".`;
    }
  }
  return '';
};

/**
 * Validates a drop operation.
 *
 * @param source The drag source
 * @param allClassSessions All class sessions visible to the user
 * @param user The currently logged in user
 * @param viewMode The current view mode
 * @param targetClassGroupId The target class group ID
 * @returns A tuple containing the source and session if valid, or [null, null] if invalid
 */
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

/**
 * Determines what type of confirmation is needed for a drop operation.
 *
 * @param source The drag source
 * @param classSessionToDrop The class session being dropped
 * @param assignments Current timetable assignments for checking confirmation status
 * @param userDepartmentId The user's department ID for cross-department validation
 * @param resourceChangeInfo Information about resource changes during drag operations
 * @returns The type of confirmation needed and associated metadata
 */
const needsConfirmation = (
  source: DragSource,
  classSessionToDrop: ClassSession,
  assignments: HydratedTimetableAssignment[] | undefined,
  userDepartmentId: string | null,
  resourceChangeInfo: ReturnType<typeof getResourceChangeInfo>
): { type: 'cross-department' | 'resource-reassignment' | null; metadata?: ResourceChangeMetadata } => {
  // Check for resource reassignment
  if (resourceChangeInfo && resourceChangeInfo.isChanging) {
    console.debug('[DND] Confirmation check - resource reassignment needed', {
      hasResourceChange: true,
      resourceType: resourceChangeInfo.resourceType
    });
    return { type: 'resource-reassignment', metadata: resourceChangeInfo };
  }

  // Check for cross-department reapproval
  if (source.from !== 'timetable') {
    return { type: null };
  }

  const currentAssignment = assignments?.find(
    (a: HydratedTimetableAssignment) =>
      a.class_session?.id === classSessionToDrop.id &&
      a.class_group_id === source.class_group_id &&
      a.period_index === source.period_index
  );

  const isCurrentlyConfirmed = currentAssignment?.status === 'confirmed';
  const hasCrossDeptResource = Boolean(
    (classSessionToDrop.instructor?.department_id &&
      classSessionToDrop.instructor.department_id !== userDepartmentId) ||
      (classSessionToDrop.classroom?.preferred_department_id &&
        classSessionToDrop.classroom.preferred_department_id !== userDepartmentId)
  );

  if (hasCrossDeptResource && isCurrentlyConfirmed) {
    console.debug('[DND] Confirmation check - cross-department reapproval needed');
    return { type: 'cross-department' };
  }

  console.debug('[DND] Confirmation check - no confirmation needed');
  return { type: null };
};

/**
 * A consolidated hook to manage the entire lifecycle of drag-and-drop (D&D)
 * operations for the timetable. It handles UI state, visual feedback,
 * event handling, and data mutations.
 *
 * @param allClassSessions All class sessions visible to the user (not just their own).
 * @param viewMode The current timetable view mode for validation.
 * @param userDepartmentId The user's department ID for cross-department validation.
 * @param assignments Current timetable assignments for checking confirmation status.
 * @param pendingPlacementInfo Optional info about a session awaiting cross-dept placement.
 * @returns An object containing all necessary state and handlers for D&D functionality.
 */
export const useTimetableDnd = (
  allClassSessions: ClassSession[],
  viewMode: TimetableViewMode = 'class-group',
  userDepartmentId: string | null = null,
  assignments?: HydratedTimetableAssignment[],
  pendingPlacementInfo?: {
    /**
     * Pending session ID for placement.
     */
    pendingSessionId?: string;
    /**
     * Resource type for pending placement ('instructor' | 'classroom').
     */
    resourceType?: 'instructor' | 'classroom';
    /**
     * ID of resource that is pending placement.
     */
    resourceId?: string;
    /**
     * Target department ID for the resource.
     */
    departmentId?: string;
    /**
     * Callback to clear pending placement state.
     */
    onClearPending?: () => void;
  }
) => {
  // --- Core Hooks ---
  const { user } = useAuth();
  const {
    timetable,
    assignClassSession,
    removeClassSession,
    moveClassSession,
    moveSessionWithResourceChange, // NEW: Get resource reassignment wrapper
  } = useTimetable(viewMode);
  const { settings } = useScheduleConfig();
  const { listQuery } = usePrograms();
  const programs = useMemo(() => listQuery.data || [], [listQuery.data]);
  const queryClient = useQueryClient();

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
      if (viewMode === 'class-group') {
        // In class-group view, can only move within same group
        return draggedSession.group.id === targetGroupId;
      } else if (viewMode === 'classroom' || viewMode === 'instructor') {
        // In resource views, allow moving to ANY row (resource will be reassigned via confirmation)
        return true;
      }
    } else if (source.from === 'drawer') {
      switch (viewMode) {
        case 'class-group':
          return draggedSession.group.id === targetGroupId;
        case 'classroom':
        case 'instructor':
          // In resource views, always allow drops from drawer (conflicts checked separately)
          // Resource assignment/reassignment will trigger confirmation when needed
          return true;
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
      
      // Allow resource changes for classroom/instructor views when moving sessions
      // This enables green indicators to show on all available resource rows
      const allowResourceChanges = 
        isMovingSession && 
        (viewMode === 'classroom' || viewMode === 'instructor');
      
      console.log('🔍 isSlotAvailable check:', {
        groupId,
        periodIndex,
        viewMode,
        isMovingSession,
        allowResourceChanges,
        sessionClassroom: activeDraggedSession.classroom?.name,
        sessionInstructor: activeDraggedSession.instructor ? 
          `${activeDraggedSession.instructor.first_name} ${activeDraggedSession.instructor.last_name}` : null
      });
      
      const conflictMessage = checkTimetableConflicts(
        timetable,
        activeDraggedSession,
        settings,
        groupId,
        periodIndex,
        programs,
        viewMode,
        isMovingSession,
        allowResourceChanges
      );
      
      console.log('✅ Conflict result:', conflictMessage || 'AVAILABLE');

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
      targetPeriodIndex: number,
      targetResourceId: string, // NEW: UI row ID (resource ID in resource views)
      resourceChangeMetadata?: ResourceChangeMetadata
    ) => {
      if (source.from === 'drawer') {
        let sessionToAssign = session; // Default to original session

        // Handle resource assignment/reassignment for drawer drops in resource views
        if (viewMode === 'classroom' || viewMode === 'instructor') {
          const resourceType = viewMode === 'classroom' ? 'classroom' : 'instructor';
          const currentResourceId = viewMode === 'classroom' 
            ? session.classroom?.id 
            : session.instructor?.id;
          
          // Use targetResourceId (UI row ID) as the actual resource ID
          // NOT dbTargetGroupId (which is always the session's class_group_id)
          if (currentResourceId !== targetResourceId) {
            console.debug('[DND] Drawer drop - reassigning resource', {
              sessionId: session.id,
              resourceType,
              fromId: currentResourceId || 'null',
              toId: targetResourceId
            });
            
            try {
              // Step 1: Update the database
              const { reassignSessionResource } = await import('@/lib/services/classSessionService');
              await reassignSessionResource(session.id, resourceType, targetResourceId);
              
              // Step 2: Invalidate and WAIT for complete refetch
              await queryClient.invalidateQueries({ queryKey: ['allClassSessions'] });
              await queryClient.refetchQueries({ queryKey: ['allClassSessions'] });

              // Step 3: Get the FRESH session from cache with updated resource
              const freshSessions = queryClient.getQueryData<ClassSession[]>(['allClassSessions']);
              const freshSession = freshSessions?.find(cs => cs.id === session.id);

              if (freshSession) {
                sessionToAssign = freshSession;
                console.debug('[DND] Using fresh session with updated resource', {
                  sessionId: freshSession.id,
                  newClassroom: freshSession.classroom?.name,
                  newInstructor: freshSession.instructor 
                    ? `${freshSession.instructor.first_name} ${freshSession.instructor.last_name}`
                    : null
                });
              } else {
                console.warn('[DND] Fresh session not found in cache, using original');
              }
            } catch (err) {
              console.error('[DND] Failed to reassign resource:', err);
              const errorMsg = err instanceof Error ? err.message : 'Failed to update resource';
              toast.error(`Could not assign ${resourceType}: ${errorMsg}`);
              cleanupDragState();
              return errorMsg;
            }
          }
        }
        
        // ✅ FIX: Now uses fresh session with correct resource data
        return assignClassSession(dbTargetGroupId, targetPeriodIndex, sessionToAssign);
      } else if (source.from === 'timetable') {
        // Check if this is the same cell (no action needed)
        const isSameCell =
          viewMode === 'class-group'
            ? source.class_group_id === dbTargetGroupId && source.period_index === targetPeriodIndex
            : source.class_group_id === dbTargetGroupId && 
              source.period_index === targetPeriodIndex &&
              !resourceChangeMetadata?.isChanging; // Allow resource change even at same period

        console.debug('[DND] executeDropMutation - isSameCell check', {
          viewMode,
          isSameCell,
          sourceGroupId: source.class_group_id,
          dbTargetGroupId,
          sourcePeriod: source.period_index,
          targetPeriod: targetPeriodIndex,
          isResourceChanging: resourceChangeMetadata?.isChanging
        });

        if (isSameCell) return '';

        // Use resource reassignment wrapper if resource is changing
        if (resourceChangeMetadata?.isChanging) {
          console.debug('[DND] executeDropMutation - Using resource reassignment', {
            resourceType: resourceChangeMetadata.resourceType,
            fromId: resourceChangeMetadata.fromId,
            toId: resourceChangeMetadata.toId
          });
          await moveSessionWithResourceChange(
            {
              class_group_id: source.class_group_id,
              period_index: source.period_index,
            },
            {
              class_group_id: dbTargetGroupId,
              period_index: targetPeriodIndex,
            },
            session.id,
            resourceChangeMetadata.resourceType,
            resourceChangeMetadata.toId
          );
          return '';
        }

        return moveClassSession(
          { class_group_id: source.class_group_id, period_index: source.period_index },
          { class_group_id: dbTargetGroupId, period_index: targetPeriodIndex },
          session
        );
      }
      return 'Invalid drag source';
    },
    [assignClassSession, moveClassSession, moveSessionWithResourceChange, viewMode, user]
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

  const handleConfirmation = useCallback(
    (
      source: DragSource,
      classSessionToDrop: ClassSession,
      dbTargetGroupId: string,
      targetPeriodIndex: number,
      targetResourceId: string, // NEW: Pass UI row ID
      onConfirmMove: (
        callback: () => void,
        confirmationType: 'cross-department' | 'resource-reassignment',
        metadata?: ResourceChangeMetadata
      ) => void,
      confirmationType: 'cross-department' | 'resource-reassignment',
      metadata?: ResourceChangeMetadata
    ) => {
      onConfirmMove(
        async () => {
          try {
            const error = await executeDropMutation(
              source,
              classSessionToDrop,
              dbTargetGroupId,
              targetPeriodIndex,
              targetResourceId, // Pass UI row ID
              metadata
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
        },
        confirmationType,
        metadata
      );
    },
    [executeDropMutation, cleanupDragState]
  );

  const handleDropToGrid = useCallback(
    async (
      e: React.DragEvent,
      targetClassGroupId: string,
      targetPeriodIndex: number,
      onConfirmMove?: (
        callback: () => void,
        confirmationType: 'cross-department' | 'resource-reassignment',
        metadata?: ResourceChangeMetadata
      ) => void
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

      // Check for resource change info
      const resourceChangeInfo = getResourceChangeInfo(viewMode, classSessionToDrop, targetClassGroupId);

      // Check if confirmation is needed
      const confirmationCheck = needsConfirmation(
        source,
        classSessionToDrop,
        assignments,
        userDepartmentId,
        resourceChangeInfo
      );

      if (onConfirmMove && confirmationCheck.type) {
        handleConfirmation(
          source,
          classSessionToDrop,
          dbTargetGroupId,
          targetPeriodIndex,
          targetClassGroupId, // Pass UI row ID (resource ID in resource views)
          onConfirmMove,
          confirmationCheck.type,
          confirmationCheck.metadata
        );
        return;
      }

      const isPendingPlacement = pendingPlacementInfo?.pendingSessionId === classSessionToDrop.id;

      try {
        const error = await executeDropMutation(
          source,
          classSessionToDrop,
          dbTargetGroupId,
          targetPeriodIndex,
          targetClassGroupId, // Pass UI row ID (resource ID in resource views)
          resourceChangeInfo || undefined
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
      handleConfirmation,
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
            (session.instructor?.department_id &&
              session.instructor.department_id !== userDepartmentId) ||
            (session.classroom?.preferred_department_id &&
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
