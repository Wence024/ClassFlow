import React from 'react';
import ItemCard from '../common/ItemCard';
import type { Course, ClassGroup, Classroom, Instructor } from '../../types/scheduleLessons';

type ComponentItem = Course | ClassGroup | Classroom | Instructor;

interface ComponentCardProps {
  item: ComponentItem;
  onEdit: (item: ComponentItem) => void;
  onDelete: (id: string) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const getDetails = (item: ComponentItem) => {
