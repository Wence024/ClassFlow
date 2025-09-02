import React from 'react';
import { useTimetableContext } from './TimetableContext';

interface EmptyCellProps {
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
}

/**
 * Renders an empty, droppable cell in the timetable grid.
 * These cells represent available time slots where a class session can be placed.
 * @param {EmptyCellProps} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const EmptyCell: React.FC<EmptyCellProps> = ({
  groupId,
  periodIndex,
  isLastInDay,
  isNotLastInTable,
}) => {
  const { dragOverCell, onDragEnter, onDragOver, onDropToGrid } = useTimetableContext();

  const isDragOver = dragOverCell?.groupId === groupId && dragOverCell?.periodIndex === periodIndex;
  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  return (
    <td className={`p-0.5 align-top relative ${borderClass}`}>
      <div
        className="h-20 rounded-md bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200"
        onDragEnter={(e) => onDragEnter(e, groupId, periodIndex)}
        onDragOver={onDragOver}
        onDrop={(e) => onDropToGrid(e, groupId, periodIndex)}
      >
        {isDragOver && <div className="w-full h-full bg-blue-200 bg-opacity-50 rounded-md"></div>}
      </div>
    </td>
  );
};

export default EmptyCell;
