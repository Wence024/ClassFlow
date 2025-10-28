import { ResourceSelectorModal, type PrioritizedItem } from '../../../../../../components/ui';
import type { ClassGroup } from '../../../../../classSessionComponents/types';

interface ClassGroupSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (classGroup: ClassGroup) => void;
  classGroups: ClassGroup[];
  userProgramId?: string | null;
  isLoading?: boolean;
}

/**
 * Transforms a ClassGroup into a PrioritizedItem for use with ResourceSelectorModal.
 *
 * @param cg The class group to transform.
 * @param userProgramId The current user's program ID for prioritization.
 * @returns The class group extended with PrioritizedItem properties.
 */
function toPrioritizedClassGroup(
  cg: ClassGroup,
  userProgramId?: string | null
): ClassGroup & PrioritizedItem {
  return {
    ...cg,
    searchTerm: `${cg.name} ${cg.code || ''}`,
    isPriority: !!userProgramId && cg.program_id === userProgramId,
  };
}

/**
 * A modal for selecting a class group from a list.
 *
 * @param cgs The props for the component.
 * @param cgs.isOpen Whether the modal is open.
 * @param cgs.onClose Callback to close the modal.
 * @param cgs.onSelect Callback when a class group is selected.
 * @param cgs.classGroups Array of class groups to choose from.
 * @param cgs.userProgramId The user's program ID for prioritization.
 * @param cgs.isLoading Whether class groups are loading.
 * @returns A class group selection modal.
 */
export function ClassGroupSelector({
  isOpen,
  onClose,
  onSelect,
  classGroups,
  userProgramId,
  isLoading = false,
}: ClassGroupSelectorProps) {
  const prioritizedGroups = classGroups.map((cg) =>
    toPrioritizedClassGroup(cg, userProgramId)
  );

  return (
    <ResourceSelectorModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectItem={onSelect}
      items={prioritizedGroups}
      title="Select Class Group"
      isLoading={isLoading}
      renderItem={(group: ClassGroup & PrioritizedItem, onSelectItem: () => void) => (
        <div
          onClick={onSelectItem}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
        >
          {group.color && (
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: group.color }}
              aria-hidden="true"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{group.name}</div>
            <div className="text-sm text-muted-foreground">
              {group.code && <span className="mr-2">{group.code}</span>}
              {group.student_count !== undefined && (
                <span>{group.student_count} students</span>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
