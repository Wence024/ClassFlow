export type DragSource =
  | {
      from: 'drawer';
      class_session_id: string;
    }
  | {
      from: 'timetable';
      class_session_id: string;
      class_group_id: string;
      period_index: number;
    };
