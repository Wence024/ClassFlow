// src/features/timetabling/pages/components/timetable/useDragAndDrop.ts
import { useState, useCallback } from 'react';

/**
 * Custom hook for managing drag-and-drop state and event handlers.
 */
export const useDragAndDrop = (
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void
) => {
  const [dragOverCell, setDragOverCell] = useState<{ groupId: string; periodIndex: number } | null>(
    null
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

  const handleGlobalDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCell(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, groupId: string, periodIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      onDropToGrid(e, groupId, periodIndex);
      setDragOverCell(null);
    },
    [onDropToGrid]
  );

  return {
    dragOverCell,
    handleDragOver,
    handleDragEnter,
    handleGlobalDragLeave,
    handleDrop,
  };
};
