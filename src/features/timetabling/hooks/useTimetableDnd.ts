import { useCallback } from 'react';
import { useTimetable } from './useTimetable';
import { showNotification } from '../../../lib/notificationsService';
import type { DragSource } from '../types/DragSouuce';
import { useClassSessions } from '../../classes/useClassSessions';

const DRAG_DATA_KEY = 'application/json';

export const useTimetableDnd = () => {
  const { assignClassSession, removeClassSession, moveClassSession } = useTimetable();
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
        const classSessionToAssign = classSessions.find((cs) => cs.id === source.class_session_id);
        if (classSessionToAssign) {
          const error = await assignClassSession(class_group_id, period_index, classSessionToAssign);
          if (error) {
            showNotification(error);
          }
        }
      } else if (source.from === 'timetable') {
        const error = await moveClassSession(
          { class_group_id: source.class_group_id, period_index: source.period_index },
          { class_group_id, period_index },
          classSessions.find((cs) => cs.id === source.class_session_id)!
        );
        if (error) {
          showNotification(error);
        }
      }
    },
    [classSessions, assignClassSession, moveClassSession]
  );

  const handleDropToDrawer = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      if (source.from === 'timetable') {
        await removeClassSession(source.class_group_id, source.period_index);
      }
    },
    [removeClassSession]
  );

  return {
    handleDragStart,
    handleDropToGrid,
    handleDropToDrawer,
  };
};
