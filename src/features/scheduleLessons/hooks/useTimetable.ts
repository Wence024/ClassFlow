import { useContext } from 'react';
import { TimetableContext } from '../contexts/timetable/TimetableContext';

export function useTimetable() {
  const ctx = useContext(TimetableContext);
  if (!ctx) throw new Error('useTimetable must be used within a TimetableProvider');
  return ctx;
}
