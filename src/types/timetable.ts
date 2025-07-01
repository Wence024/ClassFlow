import type { ClassSession } from './classSessions';

export type DragSource = {
  from: 'drawer' | 'timetable';
  className: string;
  groupIndex?: number;
  periodIndex?: number;
};

export type TimetableProps = {
  groups: string[];
  timetable: (ClassSession | null)[][];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupIndex: number, periodIndex: number) => void;
};

export type DrawerProps = {
  drawerClasses: string[];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToDrawer: (e: React.DragEvent) => void;
};