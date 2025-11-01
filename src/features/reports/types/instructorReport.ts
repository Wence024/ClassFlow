import type { Instructor } from '@/features/classSessionComponents/types';

export interface CourseScheduleInfo {
  id: string;
  code: string;
  name: string;
  units: number;
  lecHours: number;
  labHours: number;
}

export interface InstructorScheduleEntry {
  timeSlot: string;
  courses: CourseScheduleInfo[];
  department: string;
  classroom: string;
  lecHours: number;
  labHours: number;
  units: number;
  load: number;
  classSize: number;
  periodIndex: number;
  dayIndex: number;
}

export interface DayGroupSchedule {
  dayLabel: string;
  entries: InstructorScheduleEntry[];
}

export interface InstructorReport {
  instructor: Instructor & { department_name?: string };
  semester: {
    id: string;
    name: string;
  };
  schedules: {
    mondayWednesday: InstructorScheduleEntry[];
    tuesdayThursday: InstructorScheduleEntry[];
    friday: InstructorScheduleEntry[];
    saturday: InstructorScheduleEntry[];
  };
  totals: {
    lecHours: number;
    labHours: number;
    totalUnits: number;
    totalLoad: number;
  };
  loadStatus: 'UNDERLOADED' | 'AT_STANDARD' | 'OVERLOADED';
}

export interface LoadCalculationConfig {
  unitsPerLoad: number;
  standardLoad: number;
}

export interface LoadCalculationResult {
  load: number;
  status: 'UNDERLOADED' | 'AT_STANDARD' | 'OVERLOADED';
  standardLoad: number;
}
