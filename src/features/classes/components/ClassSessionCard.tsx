import React from 'react';
import { ItemCard } from '../../../components/ui';
import type { ClassSession } from '../classSession';

interface ClassSessionCardProps {
  session: ClassSession;
  onEdit: (session: ClassSession) => void;
  onDelete: (id: string) => void;
}

const ClassSessionCard: React.FC<ClassSessionCardProps> = ({ session, onEdit, onDelete }) => {
  const details = [
    { label: 'Instructor', value: session.instructor.name },
    { label: 'Classroom', value: session.classroom.name },
  ];

  return (
    <ItemCard
      title={`${session.course.name} - ${session.group.name}`}
      subtitle={session.course.code}
      details={details}
      onEdit={() => onEdit(session)}
      onDelete={() => onDelete(session.id)}
      editLabel="Edit"
      deleteLabel="Remove"
    />
  );
};

export default ClassSessionCard;
