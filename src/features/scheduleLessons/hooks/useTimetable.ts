import { useTimetable as useTimetableContext } from '../contexts/timetable/TimetableProvider';

export function useTimetable() {
  return useTimetableContext();
}
