import { ResourceSelectorModal, type PrioritizedItem } from '../../../../../../components/ui';
import type { Program } from '../../../../../programs/types/program';

interface ProgramSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (program: Program) => void;
  programs: Program[];
  isLoading?: boolean;
}

/**
 * Transforms a Program into a PrioritizedItem for use with ResourceSelectorModal.
 *
 * @param p The program to transform.
 * @returns The program extended with PrioritizedItem properties.
 */
function toPrioritizedProgram(p: Program): Program & PrioritizedItem {
  return {
    ...p,
    searchTerm: `${p.name} ${p.short_code}`,
    isPriority: false, // Programs don't have department-based prioritization
  };
}

/**
 * A modal for selecting a program from a list.
 *
 * @param ps The props for the component.
 * @param ps.isOpen Whether the modal is open.
 * @param ps.onClose Callback to close the modal.
 * @param ps.onSelect Callback when a program is selected.
 * @param ps.programs Array of programs to choose from.
 * @param ps.isLoading Whether programs are loading.
 * @returns A program selection modal.
 */
export function ProgramSelector({
  isOpen,
  onClose,
  onSelect,
  programs,
  isLoading = false,
}: ProgramSelectorProps) {
  const prioritizedPrograms = programs.map(toPrioritizedProgram);

  return (
    <ResourceSelectorModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectItem={onSelect}
      items={prioritizedPrograms}
      title="Select Program"
      isLoading={isLoading}
      renderItem={(program: Program & PrioritizedItem, onSelectItem: () => void) => (
        <div
          onClick={onSelectItem}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{program.name}</div>
            <div className="text-sm text-muted-foreground">{program.short_code}</div>
          </div>
        </div>
      )}
    />
  );
}
