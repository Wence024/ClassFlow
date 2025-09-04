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
    onDropToGrid 
  } = useTimetableContext();

  const isDragOver = dragOverCell?.groupId === groupId && dragOverCell?.periodIndex === periodIndex;
  const isDragging = currentDraggedSession !== null;
  const isAvailable = isDragging && isSlotAvailable(groupId, periodIndex);
  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  // Dynamic styling based on drag state and availability
  let cellClasses = "h-20 rounded-md border-2 border-dashed transition-all duration-200";
  
  if (isDragging && isAvailable) {
    // Available slot during drag - green highlight
    cellClasses += " bg-green-50 border-green-300 hover:bg-green-100";
  } else if (isDragging && !isAvailable) {
    // Unavailable slot during drag - red highlight
    cellClasses += " bg-red-50 border-red-300";
  } else {
    // Default state
    cellClasses += " bg-gray-50 hover:bg-gray-100 border-gray-200";
  }

  return (
    <td className={`p-0.5 align-top relative ${borderClass}`}>
      <div
        className={cellClasses}
        onDragEnter={(e) => onDragEnter(e, groupId, periodIndex)}
        onDragOver={onDragOver}
        onDrop={(e) => onDropToGrid(e, groupId, periodIndex)}
      >
        {isDragOver && (
          <div className={`w-full h-full rounded-md ${
            isAvailable ? 'bg-green-200 bg-opacity-50' : 'bg-red-200 bg-opacity-50'
          }`}></div>
        )}
        {isDragging && isAvailable && !isDragOver && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full opacity-60"></div>
          </div>
        )}
      </div>
    </td>
  );
};

export default EmptyCell;
