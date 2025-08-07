import React from 'react';
import { ItemCard } from '../../../components/ui';
import type { ClassSession } from '../classSession';

interface ClassSessionCardProps {
  classSession: ClassSession;
  onEdit: (classSession: ClassSession) => void;
  onDelete: (id: string) => void;
}

const ClassSessionCard: React.FC<ClassSessionCardProps> = ({
  classSession: classSession,
  onEdit,
  onDelete,
}) => {
  const details = [
    { label: 'Instructor', value: classSession.instructor.name },
    { label: 'Classroom', value: classSession.classroom.name },
  ];

  return (
    <ItemCard
      title={`${classSession.course.name} - ${classSession.group.name}`}
      subtitle={classSession.course.code}
      details={details}
      onEdit={() => onEdit(classSession)}
      onDelete={() => onDelete(classSession.id)}
      editLabel="Edit"
      deleteLabel="Remove"
    />
  );
};

export default ClassSessionCard;
