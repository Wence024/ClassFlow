import { useCallback } from 'react';
import { useTimetable } from './useTimetable';
import { useClassSessions } from './useClassSessions';
import type { DragSource } from '../components/timetabling/Drawer';

const DRAG_DATA_KEY = 'application/json';

let notifyConflictCallback: (message: string) => void = () => {};

export const setNotifyConflict = (fn: (message: string) => void) => {
  notifyConflictCallback = fn;
};

export const useTimetableDnd = () => {
  const { assignSession, removeSession, moveSession } = useTimetable();
  const { classSessions } = useClassSessions();

  const handleDragStart = useCallback((e: React.DragEvent, source: DragSource) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(source));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDropToGrid = useCallback(
    (e: React.DragEvent, groupId: string, periodIndex: number) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      if (source.from === 'drawer') {
        const sessionToAssign = classSessions.find((cs) => cs.id === source.sessionId);
        if (sessionToAssign) {
          const error = assignSession(groupId, periodIndex, sessionToAssign);
          if (error) {
            notifyConflictCallback(error);
          }
        }
      } else if (source.from === 'timetable') {
        if (source.groupId && source.periodIndex !== undefined) {
          const error = moveSession(
            { groupId: source.groupId, periodIndex: source.periodIndex },
            { groupId, periodIndex }
          );
          if (error) {
            notifyConflictCallback(error);
          }
        }
      }
    },
    [classSessions, assignSession, moveSession]
  );

  const handleDropToDrawer = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      // Only handle drops from the timetable back to the drawer
      if (source.from === 'timetable' && source.groupId && source.periodIndex !== undefined) {
        removeSession(source.groupId, source.periodIndex);
      }
    },
    [removeSession]
  );

  return {
    handleDragStart,
    handleDropToGrid,
    handleDropToDrawer,
  };
};

