import React from 'react';
import { Calendar, Building, User } from 'lucide-react';
import type { TimetableViewMode } from '../types/timetable';

interface ViewSelectorProps {
  viewMode: TimetableViewMode;
  onViewModeChange: (mode: TimetableViewMode) => void;
}

/**
 * A tab-based navigation component for switching between timetable view modes.
 *
 * @param vs - The component props.
 * @param vs.viewMode - The currently active view mode.
 * @param vs.onViewModeChange - Callback function to handle view mode changes.
 * @returns The rendered ViewSelector component.
 */
export const ViewSelector: React.FC<ViewSelectorProps> = ({ viewMode, onViewModeChange }) => {
  const views: Array<{ mode: TimetableViewMode; label: string; icon: React.ReactNode }> = [
    { mode: 'class-group', label: 'Class Groups', icon: <Calendar className="h-4 w-4" /> },
    { mode: 'classroom', label: 'Classrooms', icon: <Building className="h-4 w-4" /> },
    { mode: 'instructor', label: 'Instructors', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg w-fit" data-cy="view-selector">
      {views.map((view) => (
        <button
          key={view.mode}
          data-cy={`view-option-${view.mode}`}
          onClick={() => onViewModeChange(view.mode)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md transition-all
            ${
              viewMode === view.mode
                ? 'bg-background text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }
          `}
          aria-label={`Switch to ${view.label} view`}
        >
          {view.icon}
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};
