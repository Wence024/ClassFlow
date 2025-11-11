import { ResourceSelectorModal, type PrioritizedItem } from '../../../../../../components/ui';
import type { Instructor } from '../../../../../classSessionComponents/types';

interface InstructorSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (instructor: Instructor) => void;
  instructors: Instructor[];
  userDepartmentId?: string | null;
  isLoading?: boolean;
}

/**
 * Transforms an Instructor into a PrioritizedItem for use with ResourceSelectorModal.
 *
 * @param i The instructor to transform.
 * @param userDepartmentId The current user's department ID for prioritization.
 * @returns The instructor extended with PrioritizedItem properties.
 */
function toPrioritizedInstructor(
  i: Instructor,
  userDepartmentId?: string | null
): Instructor & PrioritizedItem {
  const fullName = [i.prefix, i.first_name, i.last_name, i.suffix].filter(Boolean).join(' ');

  return {
    ...i,
    searchTerm: `${fullName} ${i.code || ''} ${i.email || ''}`,
    isPriority: !!userDepartmentId && i.department_id === userDepartmentId,
  };
}

/**
 * A modal for selecting an instructor from a list.
 *
 * @param ins The props for the component.
 * @param ins.isOpen Whether the modal is open.
 * @param ins.onClose Callback to close the modal.
 * @param ins.onSelect Callback when an instructor is selected.
 * @param ins.instructors Array of instructors to choose from.
 * @param ins.userDepartmentId The user's department ID for prioritization.
 * @param ins.isLoading Whether instructors are loading.
 * @returns An instructor selection modal.
 */
export function InstructorSelector({
  isOpen,
  onClose,
  onSelect,
  instructors,
  userDepartmentId,
  isLoading = false,
}: InstructorSelectorProps) {
  const prioritizedInstructors = instructors.map((i) =>
    toPrioritizedInstructor(i, userDepartmentId)
  );

  return (
    <ResourceSelectorModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectItem={onSelect}
      items={prioritizedInstructors}
      title="Select Instructor"
      isLoading={isLoading}
      showAllItemsWhenNoPriority={true}
      renderItem={(instructor: Instructor & PrioritizedItem, onSelectItem: () => void) => {
        const fullName = [
          instructor.prefix,
          instructor.first_name,
          instructor.last_name,
          instructor.suffix,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            onClick={onSelectItem}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
          >
            {instructor.color && (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: instructor.color }}
                aria-hidden="true"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{fullName}</div>
              <div className="text-sm text-muted-foreground">
                {instructor.code && <span className="mr-2">{instructor.code}</span>}
                {instructor.email && <span className="mr-2">{instructor.email}</span>}
                {!instructor.isPriority && instructor.department_name && (
                  <span className="text-xs italic">({instructor.department_name})</span>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
