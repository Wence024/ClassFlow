import React from 'react';
import ClassSessionCard from './ClassSessionCard';
import type { ClassSession } from '../../types/classSession';

/**
 * Props for the ClassSessionList component.
 */
interface ClassSessionListProps {
  /** An array of class session objects to render. */
  classSessions: ClassSession[];
  /** Callback function passed to each card for handling edit actions. */
  onEdit: (classSession: ClassSession) => void;
  /** Callback function passed to each card for handling delete actions. */
  onDelete: (id: string) => void;
  /** A message to display when the `classSessions` array is empty.
   * @default 'No classes created yet.'
   */
  emptyMessage?: string;
}

/**
 * A component that renders a list of `ClassSessionCard`s.
 *
 * It is responsible for iterating over an array of class sessions and rendering
 * a card for each one. It also handles displaying an empty state message if the
 * list is empty.
 *
 * @param {ClassSessionListProps} props - The props for the component.
 */
const ClassSessionList: React.FC<ClassSessionListProps> = ({
  classSessions,
  onEdit,
  onDelete,
  emptyMessage = 'No classes created yet.',
}) => {
  if (classSessions.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {classSessions.map((session) => (
        <ClassSessionCard
          key={session.id}
          classSession={session}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ClassSessionList;
