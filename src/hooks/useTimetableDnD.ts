import { useState } from 'react';
import type { ClassSession } from '../types/classSessions';

export type DragSource = {
  from: 'drawer' | 'timetable';
  className: string;
  groupIndex?: number;
  periodIndex?: number;
};

export const useTimetableDnD = (
  classSessions: ClassSession[],
  timetable: (ClassSession | null)[][],
  setTimetable: React.Dispatch<React.SetStateAction<(ClassSession | null)[][]>>
) => {
  const [dragSource, setDragSource] = useState<DragSource | null>(null);

  // Get all assigned session IDs in the timetable
  const assignedSessionIds = new Set(
    timetable
      .flat()
      .filter(Boolean)
      .map((cs) => cs?.id)
  );

  // Get unassigned sessions for the drawer
  const drawerSessions = classSessions.filter((cs) => !assignedSessionIds.has(cs.id));

  // Format drawer class names
  const drawerClasses = drawerSessions.map((cs) => `${cs.course.name} - ${cs.group.name}`);

  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    setDragSource(source);
    e.dataTransfer.setData('text/plain', source.className);
  };

  const handleDropToGrid = (e: React.DragEvent, groupIndex: number, periodIndex: number) => {
    e.preventDefault();
    if (!dragSource) return;

    // Find the session being dragged
    const session =
      drawerSessions.find(
        (cs) => `${cs.course.name} - ${cs.group.name}` === dragSource.className
      ) ||
      (dragSource.groupIndex !== undefined && dragSource.periodIndex !== undefined
        ? timetable[dragSource.groupIndex][dragSource.periodIndex]
        : null);

    if (!session) return;

    setTimetable((prev) => {
      const updated = prev.map((row) => [...row]);

      // Don't overwrite if destination is already occupied
      if (updated[groupIndex][periodIndex]) return prev;

      // Place in new location
      updated[groupIndex][periodIndex] = session;

      // Clear original location if moving from timetable
      if (
        dragSource.from === 'timetable' &&
        dragSource.groupIndex !== undefined &&
        dragSource.periodIndex !== undefined
      ) {
        updated[dragSource.groupIndex][dragSource.periodIndex] = null;
      }

      return updated;
    });
  };

  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      dragSource?.from === 'timetable' &&
      dragSource.groupIndex !== undefined &&
      dragSource.periodIndex !== undefined
    ) {
      setTimetable((prev) => {
        const updated = prev.map((row) => [...row]);
        updated[dragSource.groupIndex!][dragSource.periodIndex!] = null;
        return updated;
      });
    }
  };

  return {
    drawerClasses,
    dragSource,
    handleDragStart,
    handleDropToGrid,
    handleDropToDrawer,
  };
};
