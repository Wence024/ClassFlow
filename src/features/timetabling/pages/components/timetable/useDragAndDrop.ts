import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage drag-and-drop state and event handlers for the timetable grid.
 *
 * @function useDragAndDrop
 * @param {Function} onDropToGrid - Function to handle dropping the dragged item onto the grid.
 * @returns {Object} - The handlers and state used to manage drag-and-drop interaction.
 * @returns {Object} dragOverCell - The cell currently being dragged over for visual feedback.
 * @returns {Function} handleDragOver - Handler for the drag over event.
 * @returns {Function} handleDragEnter - Handler for the drag enter event on grid cells.
 * @returns {Function} handleGlobalDragLeave - Handler for the global drag leave event.
 * @returns {Function} handleDrop - Handler for handling drop events.
 */
export const useDragAndDrop = (
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void
) => {
  const [dragOverCell, setDragOverCell] = useState<{ groupId: string; periodIndex: number } | null>(
    null
  );

  // This effect adds a global event listener for 'dragend'.
  // The 'dragend' event is fired on the source element when a drag operation ends,
  // whether it was successful (dropped) or canceled (e.g., by pressing Escape).
  // This is crucial for cleaning up the drag-related state (like hover effects)
  // in case the drag is canceled mid-air, which doesn't trigger drop or dragleave events.
  useEffect(() => {
    const handleDragEnd = () => {
      setDragOverCell(null);
    };

    // We listen on the document because the 'dragend' event does not bubble.
    document.addEventListener('dragend', handleDragEnd);

    // Cleanup the event listener when the component unmounts.
    return () => {
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

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
