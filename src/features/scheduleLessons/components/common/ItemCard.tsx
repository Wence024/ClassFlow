import React from 'react';
import ActionButton from './ActionButton';

interface ItemCardProps {
  title: string;
  subtitle?: string;
  details?: Array<{ label: string; value: string }>;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subtitle,
  details = [],
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Remove',
  className = '',
  children,
}) => {
  return (
    <div className={`bg-gray-50 p-4 mb-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between ${className}`}>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        
        {details.map((detail, index) => (
          <p key={index} className="text-gray-700">
            {detail.label}: {detail.value}
          </p>
        ))}
        
        {children}
      </div>
      
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 md:mt-0">
          {onDelete && (
            <ActionButton
              variant="danger"
              size="sm"
              onClick={onDelete}
            >
              {deleteLabel}
            </ActionButton>
          )}
          {onEdit && (
            <ActionButton
              variant="success"
              size="sm"
              onClick={onEdit}
            >
              {editLabel}
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
