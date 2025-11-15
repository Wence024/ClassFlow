import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useTimetable } from '../hooks/useTimetable';
import { toast } from 'sonner';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, CustomTooltip } from '../../../components/ui';
import * as classSessionsService from '../../classSessions/services/classSessionsService';
import type { ClassSession } from '../../classSessions/types/classSession';
import TimetableContext from './components/timetable/TimetableContext';
import { useTimetableViewMode } from '../hooks/useTimetableViewMode';
import { ViewSelector } from '../components/ViewSelector';
import ConfirmDialog from '../../../components/dialogs/ConfirmDialog';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDepartmentId } from '../../auth/hooks/useDepartmentId';
import { usePrograms } from '../../programs/hooks/usePrograms';

/** Represents the state of the tooltip. */
interface TooltipState {
  content: React.ReactNode;
  position: { top: number; left: number };
}

/**
 * Renders the main timetabling interface page.
 *
 * This component acts as the orchestrator for the entire scheduling view.
 * It fetches all necessary data (timetable, groups, all class sessions),
 * initializes the drag-and-drop (D&D) logic via the `useTimetableDnd` hook,
 * and manages tooltip state.
 *
 * Crucially, it provides all D&D state and handlers to its children
 * (`Timetable`, `Drawer`) via the `TimetableContext.Provider`, enabling a fully
 * interactive and decoupled scheduling experience.
 *
 * @returns The rendered Timetable page component.
 */
const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const userDepartmentId = useDepartmentId();
  const { listQuery: programsQuery } = usePrograms();
  const { viewMode, setViewMode } = useTimetableViewMode();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract pending placement info from URL
  const pendingSessionId = searchParams.get('pendingSessionId');
  const resourceType = searchParams.get('resourceType') as 'instructor' | 'classroom' | null;
  const resourceId = searchParams.get('resourceId');
  const departmentId = searchParams.get('departmentId');

  // Extract highlight info from URL
  const highlightPeriod = searchParams.get('highlightPeriod');
  const highlightGroup = searchParams.get('highlightGroup');

  // Fetches ALL class sessions from the database for a global view.
  const { data: allClassSessions = [], isLoading: isLoadingSessions } = useQuery<ClassSession[]>({
    queryKey: ['allClassSessions'],
    queryFn: classSessionsService.getAllClassSessions,
  });

  // Store pending session info in localStorage for persistence across navigation
  useEffect(() => {
    if (pendingSessionId && resourceType && resourceId && departmentId) {
      const pendingInfo = { pendingSessionId, resourceType, resourceId, departmentId };
      localStorage.setItem('pendingCrossDeptSession', JSON.stringify(pendingInfo));
    } else {
      // Clear from localStorage if no pending session in URL
      const stored = localStorage.getItem('pendingCrossDeptSession');
      if (stored && !pendingSessionId) {
        localStorage.removeItem('pendingCrossDeptSession');
      }
    }
  }, [pendingSessionId, resourceType, resourceId, departmentId]);

  // Load pending session info from localStorage if not in URL (persistence across navigation)
  useEffect(() => {
    if (!pendingSessionId) {
      try {
        const stored = localStorage.getItem('pendingCrossDeptSession');
        if (stored) {
          const {
            pendingSessionId: storedId,
            resourceType: storedType,
            resourceId: storedResId,
            departmentId: storedDeptId,
          } = JSON.parse(stored);
          // Restore URL params from localStorage
          searchParams.set('pendingSessionId', storedId);
          searchParams.set('resourceType', storedType);
          searchParams.set('resourceId', storedResId);
          searchParams.set('departmentId', storedDeptId);
          window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${searchParams.toString()}`
          );
        }
      } catch (error) {
        console.error('Failed to restore pending session from localStorage:', error);
      }
    }
  }, [pendingSessionId, searchParams]);

  // Validate session existence with delayed retry to avoid false positives on fresh redirects
  useEffect(() => {
    if (pendingSessionId && !isLoadingSessions) {
      // Wait a bit for the query to settle after redirect
      const timeoutId = setTimeout(() => {
        const sessionExists = allClassSessions.some((s) => s.id === pendingSessionId);
        if (!sessionExists) {
          toast.error('Session not found. It may have been deleted.');
          // Clear both URL params and localStorage
          searchParams.delete('pendingSessionId');
          searchParams.delete('resourceType');
          searchParams.delete('resourceId');
          searchParams.delete('departmentId');
          window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${searchParams.toString()}`
          );
          localStorage.removeItem('pendingCrossDeptSession');
        }
      }, 1000); // 1 second delay to allow query cache to update

      return () => clearTimeout(timeoutId);
    }
  }, [pendingSessionId, allClassSessions, isLoadingSessions, searchParams]);

  // Clear pending placement when active semester changes (edge case)
  useEffect(() => {
    if (pendingSessionId) {
      const clearPendingPlacement = () => {
        searchParams.delete('pendingSessionId');
        searchParams.delete('resourceType');
        searchParams.delete('resourceId');
        searchParams.delete('departmentId');
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}?${searchParams.toString()}`
        );
        localStorage.removeItem('pendingCrossDeptSession');
        toast.info('Pending placement cleared due to semester change');
      };

      // Subscribe to semester changes
      const channel = supabase
        .channel('semester-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'semesters',
            filter: 'is_active=eq.true',
          },
          () => {
            clearPendingPlacement();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [pendingSessionId, searchParams]);

  const {
    timetable,
    groups,
    resources,
    assignments,
    loading: loadingTimetable,
    pendingSessionIds,
  } = useTimetable(viewMode);

  const clearPendingPlacement = useCallback(() => {
    searchParams.delete('pendingSessionId');
    searchParams.delete('resourceType');
    searchParams.delete('resourceId');
    searchParams.delete('departmentId');
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    localStorage.removeItem('pendingCrossDeptSession');
  }, [searchParams]);

  const dnd = useTimetableDnd(allClassSessions, viewMode, userDepartmentId, assignments, {
    pendingSessionId: pendingSessionId || undefined,
    resourceType: resourceType || undefined,
    resourceId: resourceId || undefined,
    departmentId: departmentId || undefined,
    onClearPending: clearPendingPlacement,
  });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Show toast notification for pending placement
  useEffect(() => {
    if (pendingSessionId && !isLoadingSessions) {
      const session = allClassSessions.find((s) => s.id === pendingSessionId);
      if (session) {
        toast.info('Drag the highlighted session to the timetable to submit your request', {
          duration: 8000,
        });
      }
    }
  }, [pendingSessionId, allClassSessions, isLoadingSessions]);

  // Confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const handleShowTooltip = (content: React.ReactNode, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setTooltip({ content, position: { top: rect.top, left: rect.left + rect.width / 2 } });
  };
  const handleHideTooltip = () => setTooltip(null);

  // Confirmation callback for DnD operations
  const handleConfirmAction = (callback: () => void, title: string, description: string) => {
    setConfirmDialogConfig({ title, description, onConfirm: callback });
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogConfirm = () => {
    if (confirmDialogConfig) {
      confirmDialogConfig.onConfirm();
    }
    setConfirmDialogOpen(false);
    setConfirmDialogConfig(null);
  };

  // Wrap DnD handlers with confirmation logic
  const handleDropToGridWithConfirm: typeof dnd.handleDropToGrid = async (
    e,
    targetGroupId,
    targetPeriodIndex
  ) => {
    return dnd.handleDropToGrid(e, targetGroupId, targetPeriodIndex, (callback) =>
      handleConfirmAction(
        callback,
        'Move Confirmed Session',
        'This session uses cross-department resources and is currently confirmed. Moving it will require department head approval again. Continue?'
      )
    );
  };

  const handleDropToDrawerWithConfirm: typeof dnd.handleDropToDrawer = async (e) => {
    return dnd.handleDropToDrawer(e, (callback) =>
      handleConfirmAction(
        callback,
        'Remove Cross-Department Session',
        'This session uses cross-department resources. Removing it will cancel the approval and notify the department head. Continue?'
      )
    );
  };

  // Memoized calculation for the sessions to show in the drawer.
  // Use DB assignments (source of truth) instead of view-dependent grid.
  // Filter by program/department based on user role.
  const unassignedClassSessions = useMemo(() => {
    const assignedIds = new Set<string>();

    // Extract assigned session IDs from DB assignments (not view grid)
    for (const assignment of assignments) {
      if (assignment.class_session?.id) {
        assignedIds.add(assignment.class_session.id);
      }
    }

    let filtered = allClassSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));

    // Filter by program ownership for non-admins (drawer scoping)
    if (user && user.role !== 'admin') {
      if (user.role === 'program_head' && user.program_id) {
        // Program heads: only their program's sessions
        filtered = filtered.filter((cs) => cs.program_id === user.program_id);
      } else if (user.role === 'department_head' && userDepartmentId) {
        // Department heads: sessions from programs in their department
        const programs = programsQuery.data || [];
        const departmentProgramIds = new Set(
          programs.filter((p) => p.department_id === userDepartmentId).map((p) => p.id)
        );
        filtered = filtered.filter((cs) => cs.program_id && departmentProgramIds.has(cs.program_id));
      }
    }

    // Defensive filtering to prevent crashes from orphaned data
    const validUnassigned = filtered.filter((session) => {
      if (!session.course || !session.group) {
        console.warn(
          'Filtered out an invalid class session with missing course or group data. Session ID:',
          session.id
        );
        return false;
      }
      return true;
    });

    return validUnassigned;
  }, [assignments, allClassSessions, user, userDepartmentId, programsQuery.data]);

  const drawerClassSessions = unassignedClassSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
    course: cs.course,
    group: cs.group,
    instructor: cs.instructor,
    classroom: cs.classroom,
  }));

  // Auto-scroll to highlighted cell and clear params after scroll
  useEffect(() => {
    if (highlightPeriod && highlightGroup && !loadingTimetable) {
      const timer = setTimeout(() => {
        const cellElement = document.querySelector(
          `[data-testid="cell-${highlightGroup}-${highlightPeriod}"]`
        );
        if (cellElement) {
          cellElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

          // Clear highlight params after 5 seconds
          setTimeout(() => {
            searchParams.delete('highlightPeriod');
            searchParams.delete('highlightGroup');
            setSearchParams(searchParams, { replace: true });
          }, 5000);
        }
      }, 300); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    }
  }, [highlightPeriod, highlightGroup, loadingTimetable, searchParams, setSearchParams]);

  // Combine D&D handlers and tooltip handlers into a single object for the context
  const contextValue = {
    ...dnd,
    handleDropToGrid: handleDropToGridWithConfirm,
    handleDropToDrawer: handleDropToDrawerWithConfirm,
    onShowTooltip: handleShowTooltip,
    onHideTooltip: handleHideTooltip,
    pendingSessionIds,
    pendingPlacementSessionId: pendingSessionId || undefined,
    highlightPeriod: highlightPeriod ? parseInt(highlightPeriod) : undefined,
    highlightGroup: highlightGroup || undefined,
  };

  const isInitialLoading = (loadingTimetable || isLoadingSessions) && timetable.size === 0;

  return (
    <div className="relative flex flex-col h-full" data-cy="timetable-page">
      {tooltip && <CustomTooltip content={tooltip.content} position={tooltip.position} />}
      <div className="flex-1 space-y-6 min-w-0 overflow-auto">
        <ViewSelector viewMode={viewMode} onViewModeChange={setViewMode} />

        {isInitialLoading ? (
          <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow-sm">
            <LoadingSpinner size={'lg'} text="Loading Timetable..." />
          </div>
        ) : (
          <TimetableContext.Provider value={contextValue}>
            <Timetable
              viewMode={viewMode}
              groups={groups}
              resources={resources}
              timetable={timetable}
            />
            <Drawer
              drawerClassSessions={drawerClassSessions}
              onDragStart={dnd.handleDragStart}
              onDropToDrawer={handleDropToDrawerWithConfirm}
              pendingPlacementSessionId={pendingSessionId || undefined}
            />
          </TimetableContext.Provider>
        )}
      </div>

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmDialogConfirm}
        title={confirmDialogConfig?.title || ''}
        description={confirmDialogConfig?.description || ''}
        confirmText="Continue"
        cancelText="Cancel"
        variant="default"
      />
    </div>
  );
};

export default TimetablePage;
