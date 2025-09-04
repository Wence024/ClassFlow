import React from 'react';
import { useTimetableContext } from './useTimetableContext';

interface EmptyCellProps {
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
}

/**
 * Renders an empty, droppable cell in the timetable grid.
 * These cells represent available time slots where a class session can be placed.
 * Shows visual feedback during drag operations with green indicators for available slots.
 * @param {EmptyCellProps} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const EmptyCell: React.FC<EmptyCellProps> = ({
  groupId,
  periodIndex,
  isLastInDay,
  isNotLastInTable,
}) => {
  const {
    dragOverCell,
    currentDraggedSession,
    isSlotAvailable,
    onDragEnter,
    onDragOver,
    onDropToGrid,
    onDragLeave,
  } = useTimetableContext();

  const isDragOver = dragOverCell?.groupId === groupId && dragOverCell?.periodIndex === periodIndex;
  const isDragging = currentDraggedSession !== null;
  const isAvailable = isDragging && isSlotAvailable(groupId, periodIndex);
  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  const cellClasses =
    'h-20 rounded-md border-2 border-dashed transition-all duration-200 bg-gray-50 hover:bg-gray-100 border-gray-200';

  return (
    <td
      className={`p-0.5 align-top relative ${borderClass}`}
      data-testid={`cell-${groupId}-${periodIndex}`}
    >
      <div
        className={`${cellClasses} flex items-center justify-center`}
        onDragEnter={(e) => onDragEnter(e, groupId, periodIndex)}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDropToGrid(e, groupId, periodIndex)}
      >
        {isDragOver && (
          <div
            className={`w-full h-full rounded-md ${
              isAvailable ? 'bg-green-200/50' : 'bg-red-200/50'
            }`}
          ></div>
        )}
        {isDragging && isAvailable && !isDragOver && (
          <div className="w-2 h-2 bg-green-500 rounded-full opacity-60"></div>
        )}
      </div>
    </td>
  );
};

export default EmptyCell;
