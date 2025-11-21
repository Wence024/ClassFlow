import { ResourceSelectorModal, type PrioritizedItem } from '../../../../../../components/ui';
import type { Course } from '../../../../../classSessionComponents/types';

interface CourseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (course: Course) => void;
  courses: Course[];
  userProgramId?: string | null;
  isLoading?: boolean;
}

/**
 * Transforms a Course into a PrioritizedItem for use with ResourceSelectorModal.
 *
 * @param c The course to transform.
 * @param userProgramId The current user's program ID for prioritization.
 * @returns The course extended with PrioritizedItem properties.
 */
function toPrioritizedCourse(c: Course, userProgramId?: string | null): Course & PrioritizedItem {
  return {
    ...c,
    searchTerm: `${c.name} ${c.code}`,
    isPriority: !!userProgramId && c.program_id === userProgramId,
  };
}

/**
 * A modal for selecting a course from a list.
 *
 * @param cs The props for the component.
 * @param cs.isOpen Whether the modal is open.
 * @param cs.onClose Callback to close the modal.
 * @param cs.onSelect Callback when a course is selected.
 * @param cs.courses Array of courses to choose from.
 * @param cs.userProgramId The user's program ID for prioritization.
 * @param cs.isLoading Whether courses are loading.
 * @returns A course selection modal.
 */
export function CourseSelector({
  isOpen,
  onClose,
  onSelect,
  courses,
  userProgramId,
  isLoading = false,
}: CourseSelectorProps) {
  const prioritizedCourses = courses.map((c) => toPrioritizedCourse(c, userProgramId));

  return (
    <ResourceSelectorModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectItem={onSelect}
      items={prioritizedCourses}
      title="Select Course"
      isLoading={isLoading}
      renderItem={(course: Course & PrioritizedItem, onSelectItem: () => void) => (
        <div
          onClick={onSelectItem}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
        >
          {course.color && (
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: course.color }}
              aria-hidden="true"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{course.name}</div>
            <div className="text-sm text-muted-foreground">{course.code}</div>
          </div>
        </div>
      )}
    />
  );
}
