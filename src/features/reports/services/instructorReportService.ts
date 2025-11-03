import { supabase } from '@/integrations/supabase/client';
import type { InstructorReport, InstructorScheduleEntry } from '../types/instructorReport';
import { getLoadConfig, calculateInstructorLoad } from './loadCalculationService';

/**
 * Maps day combinations to day indices (0=Mon, 1=Tue, etc.).
 */
const DAY_GROUPS = {
  mondayWednesday: [0, 2],
  tuesdayThursday: [1, 3],
  friday: [4],
  saturday: [5],
} as const;

/**
 * Fetches complete instructor schedule data for a given semester.
 *
 * @param instructorId The instructor to generate the report for.
 * @param semesterId The semester whose schedule should be fetched.
 * @returns The instructor report or null when no sessions exist.
 */
export async function getInstructorScheduleData(
  instructorId: string,
  semesterId: string
): Promise<InstructorReport | null> {
  // Fetch instructor details
  const { data: instructor, error: instructorError } = await supabase
    .from('instructors')
    .select(`
      *,
      department:departments(name)
    `)
    .eq('id', instructorId)
    .single();

  if (instructorError || !instructor) {
    throw new Error('Instructor not found');
  }

  // Fetch semester details
  const { data: semester, error: semesterError } = await supabase
    .from('semesters')
    .select('id, name')
    .eq('id', semesterId)
    .single();

  if (semesterError || !semester) {
    throw new Error('Semester not found');
  }

  // Fetch schedule configuration
  const { data: scheduleConfig, error: configError } = await supabase
    .from('schedule_configuration')
    .select('*')
    .eq('semester_id', semesterId)
    .maybeSingle();

  if (configError) throw configError;
  if (!scheduleConfig) {
    throw new Error('No schedule configuration found for this semester. Please configure the schedule first.');
  }

  // Step 1: Get all class session IDs for the instructor
  const { data: instructorSessions, error: sessionsError } = await supabase
    .from('class_sessions')
    .select('id')
    .eq('instructor_id', instructorId);

  if (sessionsError) {
    throw new Error('Failed to fetch instructor sessions');
  }

  const sessionIds = instructorSessions?.map(s => s.id) || [];

  // If no sessions found, return early with empty data
  if (sessionIds.length === 0) {
    return {
      instructor: {
        ...instructor,
        department_name: Array.isArray(instructor.department)
          ? instructor.department[0]?.name
          : (instructor.department as { name?: string } | null)?.name,
      },
      semester,
      schedules: {
        mondayWednesday: [],
        tuesdayThursday: [],
        friday: [],
        saturday: [],
      },
      totals: {
        lecHours: 0,
        labHours: 0,
        totalUnits: 0,
        totalLoad: 0,
      },
      loadStatus: 'UNDERLOADED',
    };
  }

  // Step 2: Fetch timetable assignments for those sessions
  const { data: assignments, error: assignmentsError } = await supabase
    .from('timetable_assignments')
    .select(`
      *,
      class_session:class_sessions(
        *,
        course:courses(*),
        classroom:classrooms(*),
        class_group:class_groups(*),
        program:programs(*, department:departments(name, code))
      )
    `)
    .in('class_session_id', sessionIds)
    .eq('semester_id', semesterId)
    .eq('status', 'confirmed');

  if (assignmentsError) {
    throw new Error('Failed to fetch assignments');
  }

  // Process assignments into schedule entries
  type AssignmentRow = {
    period_index: number;
    class_session: {
      period_count: number;
      course: { id: string; code: string; name: string; units?: number | null; lecture_hours?: number | null; lab_hours?: number | null };
      classroom: { code?: string | null; name?: string | null } | null;
      class_group: { student_count?: number | null } | null;
      program: { department?: { name?: string | null; code?: string | null } | null } | null;
    };
  };

  const entries: InstructorScheduleEntry[] = (assignments || []).map((assignment: AssignmentRow) => {
    const session = assignment.class_session;
    const course = session.course;
    const classroom = session.classroom;
    const classGroup = session.class_group;
    const program = session.program;

    const dayIndex = Math.floor(assignment.period_index / scheduleConfig.periods_per_day);
    const periodInDay = assignment.period_index % scheduleConfig.periods_per_day;

    // Calculate time slot
    const startTime = new Date(`1970-01-01T${scheduleConfig.start_time}`);
    startTime.setMinutes(startTime.getMinutes() + periodInDay * scheduleConfig.period_duration_mins);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + session.period_count * scheduleConfig.period_duration_mins);

    const timeSlot = `${startTime.toTimeString().slice(0, 5)} - ${endTime.toTimeString().slice(0, 5)}`;

    const lecHours = Number(course.lecture_hours || 0);
    const labHours = Number(course.lab_hours || 0);
    const units = Number(course.units || 0);

    return {
      timeSlot,
      courses: [{
        id: course.id,
        code: course.code,
        name: course.name,
        units,
        lecHours: Number(course.lecture_hours || 0),
        labHours: Number(course.lab_hours || 0),
      }],
      department: program?.department?.name || 'N/A',
      departmentCode: program?.department?.code || 'N/A',
      classroom: classroom?.code || classroom?.name || 'TBA',
      lecHours,
      labHours,
      units,
      load: 0, // Will be calculated later
      classSize: classGroup?.student_count || 0,
      periodIndex: assignment.period_index,
      dayIndex,
    };
  });

  // Group by day combinations
  const schedules = groupScheduleByDays(entries);

  // Calculate totals
  const totals = calculateReportTotals(entries);

  // Get load configuration and calculate load
  const loadConfig = await getLoadConfig(semesterId, instructor.department_id || undefined);
  const loadResult = calculateInstructorLoad(totals.totalUnits, loadConfig);

  // Update load in each entry
  entries.forEach(entry => {
    entry.load = (entry.units / loadConfig.unitsPerLoad);
  });

  return {
    instructor: {
      ...instructor,
      department_name: Array.isArray(instructor.department)
        ? instructor.department[0]?.name
        : (instructor.department as { name?: string } | null)?.name,
    },
    semester,
    schedules,
    totals: {
      ...totals,
      totalLoad: loadResult.load,
    },
    loadStatus: loadResult.status,
  };
}

/**
 * Groups schedule entries by day combinations (MW, TTh, F, Sat).
 *
 * @param entries The flat list of schedule entries.
 * @returns An object with entries grouped by day combination.
 */
export function groupScheduleByDays(entries: InstructorScheduleEntry[]) {
  const grouped = {
    mondayWednesday: [] as InstructorScheduleEntry[],
    tuesdayThursday: [] as InstructorScheduleEntry[],
    friday: [] as InstructorScheduleEntry[],
    saturday: [] as InstructorScheduleEntry[],
  };

  entries.forEach(entry => {
    if (DAY_GROUPS.mondayWednesday.includes(entry.dayIndex as 0 | 2)) {
      grouped.mondayWednesday.push(entry);
    } else if (DAY_GROUPS.tuesdayThursday.includes(entry.dayIndex as 1 | 3)) {
      grouped.tuesdayThursday.push(entry);
    } else if (DAY_GROUPS.friday.includes(entry.dayIndex as 4)) {
      grouped.friday.push(entry);
    } else if (DAY_GROUPS.saturday.includes(entry.dayIndex as 5)) {
      grouped.saturday.push(entry);
    }
  });

  // Sort each group by time slot
  Object.values(grouped).forEach(group => {
    group.sort((a, b) => a.periodIndex - b.periodIndex);
  });

  return grouped;
}

/**
 * Calculates summary totals for the report.
 *
 * @param entries The list of entries to aggregate.
 * @returns Totals for lecture hours, lab hours, units, and load placeholder.
 */
export function calculateReportTotals(entries: InstructorScheduleEntry[]) {
  return entries.reduce(
    (acc, entry) => ({
      lecHours: acc.lecHours + entry.lecHours,
      labHours: acc.labHours + entry.labHours,
      totalUnits: acc.totalUnits + entry.units,
      totalLoad: 0, // Calculated separately
    }),
    { lecHours: 0, labHours: 0, totalUnits: 0, totalLoad: 0 }
  );
}

/**
 * Formats day group label for display.
 *
 * @param key The day-group key to format.
 * @returns The formatted label for UI/export.
 */
export function formatDayGroupLabel(key: keyof InstructorReport['schedules']): string {
  const labels: Record<keyof InstructorReport['schedules'], string> = {
    mondayWednesday: 'MONDAY AND WEDNESDAY',
    tuesdayThursday: 'TUESDAY AND THURSDAY',
    friday: 'FRIDAY',
    saturday: 'SATURDAY',
  };
  return labels[key];
}
