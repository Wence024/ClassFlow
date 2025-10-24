import { ResourceSelectorModal, type PrioritizedItem } from '../../../../../../components/ui';
import type { Classroom } from '../../../../../classSessionComponents/types';

interface ClassroomSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (classroom: Classroom) => void;
  classrooms: Classroom[];
  userDepartmentId?: string | null;
  isLoading?: boolean;
}

/**
 * Transforms a Classroom into a PrioritizedItem for use with ResourceSelectorModal.
 *
 * @param c The classroom to transform.
 * @param userDepartmentId The current user's department ID for prioritization.
 * @returns The classroom extended with PrioritizedItem properties.
 */
function toPrioritizedClassroom(
  c: Classroom,
  userDepartmentId?: string | null
): Classroom & PrioritizedItem {
  return {
    ...c,
    searchTerm: `${c.name} ${c.code || ''} ${c.location || ''}`,
    isPriority: !!userDepartmentId && c.preferred_department_id === userDepartmentId,
  };
}

/**
 * A modal for selecting a classroom from a list.
 *
 * @param cs The props for the component.
 * @param cs.isOpen Whether the modal is open.
 * @param cs.onClose Callback to close the modal.
 * @param cs.onSelect Callback when a classroom is selected.
 * @param cs.classrooms Array of classrooms to choose from.
 * @param cs.userDepartmentId The user's department ID for prioritization.
 * @param cs.isLoading Whether classrooms are loading.
 * @returns A classroom selection modal.
 */
export function ClassroomSelector({
  isOpen,
  onClose,
  onSelect,
  classrooms,
  userDepartmentId,
  isLoading = false,
}: ClassroomSelectorProps) {
  const prioritizedClassrooms = classrooms.map((c) =>
    toPrioritizedClassroom(c, userDepartmentId)
  );

  return (
    <ResourceSelectorModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectItem={onSelect}
      items={prioritizedClassrooms}
      title="Select Classroom"
      isLoading={isLoading}
      renderItem={(classroom: Classroom & PrioritizedItem, onSelectItem: () => void) => (
        <div
          onClick={onSelectItem}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
        >
          {classroom.color && (
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: classroom.color }}
              aria-hidden="true"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{classroom.name}</div>
            <div className="text-sm text-muted-foreground">
              {classroom.code && <span className="mr-2">{classroom.code}</span>}
              {classroom.capacity !== undefined && (
                <span className="mr-2">Capacity: {classroom.capacity}</span>
              )}
              {classroom.location && <span>{classroom.location}</span>}
            </div>
          </div>
        </div>
      )}
    />
  );
}
