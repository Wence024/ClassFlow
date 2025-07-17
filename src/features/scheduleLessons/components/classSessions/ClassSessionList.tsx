import React from 'react';
import ClassSessionCard from './ClassSessionCard';
import type { ClassSession } from '../../types/scheduleLessons';

interface ClassSessionListProps {
  sessions: ClassSession[];
  onEdit: (session: ClassSession) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

const ClassSessionList: React.FC<ClassSessionListProps> = ({
  sessions,
  onEdit,
  onDelete,
  emptyMessage = 'No class sessions created yet.',
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <ClassSessionCard
          key={session.id}
          session={session}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ClassSessionList;
