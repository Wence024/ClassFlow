import { useCallback } from 'react';
import { useTimetable } from './useTimetable';
import { useClassSessions } from './useClassSessions';
import { showNotification } from '../components/ui/Notification';
import type { DragSource } from '../components/timetabling/Drawer';

const DRAG_DATA_KEY = 'application/json';

export const useTimetableDnd = () => {
  const { assignSession, removeSession, moveSession } = useTimetable();
  const { classSessions } = useClassSessions();

  const handleDragStart = useCallback((e: React.DragEvent, source: DragSource) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(source));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDropToGrid = useCallback(
    async (e: React.DragEvent, class_group_id: string, period_index: number) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      if (source.from === 'drawer') {
        const sessionToAssign = classSessions.find((cs) => cs.id === source.class_session_id);
        if (sessionToAssign) {
          const error = await assignSession(class_group_id, period_index, sessionToAssign);
          if (error) {
            showNotification(error);
          }
        }
      } else if (source.from === 'timetable') {
        const error = await moveSession(
          { class_group_id: source.class_group_id, period_index: source.period_index },
          { class_group_id, period_index },
          classSessions.find((cs) => cs.id === source.class_session_id)!
        );
        if (error) {
          showNotification(error);
        }
      }
    },
    [classSessions, assignSession, moveSession]
  );

  const handleDropToDrawer = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      if (source.from === 'timetable') {
        await removeSession(source.class_group_id, source.period_index);
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
