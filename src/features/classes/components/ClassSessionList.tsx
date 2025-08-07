import React from 'react';
import ClassSessionCard from './ClassSessionCard';
import type { ClassSession } from '../classSession';

interface ClassSessionListProps {
  classSessions: ClassSession[];
  onEdit: (classSession: ClassSession) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

const ClassSessionList: React.FC<ClassSessionListProps> = ({
  classSessions: classSessions,
  onEdit,
  onDelete,
  emptyMessage = 'No classes created yet.',
}) => {
  if (classSessions.length === 0) {
    return (
      <div className="text-center py-8">
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
