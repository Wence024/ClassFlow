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
 *
 * @param ec The props for the component.
 * @param ec.groupId The ID of the group row this cell belongs to.
 * @param ec.periodIndex The period index of this cell within the timetable.
 * @param ec.isLastInDay Whether this cell is the last in a day's block.
 * @param ec.isNotLastInTable Whether this cell is not the last in the entire timetable row.
 * @returns The rendered empty cell component.
 */
const EmptyCell: React.FC<EmptyCellProps> = ({
  groupId,
  periodIndex,
  isLastInDay,
  isNotLastInTable,
}) => {
  const {
    dragOverCell,
    activeDraggedSession,
    isSlotAvailable,
    handleDragEnter,
    handleDragOver,
    handleDropToGrid,
    handleDragLeave,
    highlightPeriod,
    highlightGroup,
  } = useTimetableContext();

  const isDragOver = dragOverCell?.groupId === groupId && dragOverCell?.periodIndex === periodIndex;
  const isDragging = activeDraggedSession !== null;
  const isAvailable = isDragging && isSlotAvailable(groupId, periodIndex);
  const isHighlighted = highlightPeriod === periodIndex && highlightGroup === groupId;
  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  const cellClasses = isHighlighted
    ? 'h-20 rounded-md border-2 transition-all duration-200 bg-green-100 hover:bg-green-200 border-green-500 shadow-lg shadow-green-500/50'
    : 'h-20 rounded-md border-2 border-dashed transition-all duration-200 bg-gray-50 hover:bg-gray-100 border-gray-200';

  return (
    <td
      className={`p-0.5 align-top relative ${borderClass}`}
      data-testid={`cell-${groupId}-${periodIndex}`}
    >
      <div
        className={`${cellClasses} flex items-center justify-center`}
        onDragEnter={(e) => handleDragEnter(e, groupId, periodIndex)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          handleDropToGrid(e, groupId, periodIndex);
        }}
      >
        {isDragOver && (
          <div
            className={`w-full h-full rounded-md pointer-events-none ${
              isAvailable ? 'bg-green-200/50' : 'bg-red-200/50'
            }`}
          ></div>
        )}
        {isDragging && isAvailable && !isDragOver && (
          <div className="w-2 h-2 bg-green-500 rounded-full opacity-60 pointer-events-none"></div>
        )}
      </div>
    </td>
  );
};

export default EmptyCell;
