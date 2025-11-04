import { describe, it, expect } from 'vitest';
import { formatDayGroupLabel, groupScheduleByDays, calculateReportTotals } from '../instructorReportService';
import type { InstructorScheduleEntry } from '../../types/instructorReport';

describe('instructorReportService helpers', () => {
  it('formatDayGroupLabel returns expected labels', () => {
    expect(formatDayGroupLabel('mondayWednesday')).toBe('MONDAY AND WEDNESDAY');
    expect(formatDayGroupLabel('tuesdayThursday')).toBe('TUESDAY AND THURSDAY');
    expect(formatDayGroupLabel('friday')).toBe('FRIDAY');
    expect(formatDayGroupLabel('saturday')).toBe('SATURDAY');
  });

  it('groupScheduleByDays groups by day indices', () => {
    const entries: InstructorScheduleEntry[] = [
      // Monday (0)
      { timeSlot: '07:30 - 09:00', courses: [], department: 'CS', departmentCode: 'CS', classroom: 'R1', lecHours: 1, labHours: 0, units: 1, load: 0, classSize: 30, periodIndex: 0, dayIndex: 0 },
      // Wednesday (2)
      { timeSlot: '09:00 - 10:30', courses: [], department: 'CS', departmentCode: 'CS', classroom: 'R2', lecHours: 1, labHours: 0, units: 1, load: 0, classSize: 25, periodIndex: 1, dayIndex: 2 },
      // Tuesday (1)
      { timeSlot: '07:30 - 09:00', courses: [], department: 'IT', departmentCode: 'IT', classroom: 'R3', lecHours: 1, labHours: 0, units: 1, load: 0, classSize: 28, periodIndex: 0, dayIndex: 1 },
      // Friday (4)
      { timeSlot: '10:30 - 12:00', courses: [], department: 'IT', departmentCode: 'IT', classroom: 'R4', lecHours: 1, labHours: 0, units: 1, load: 0, classSize: 22, periodIndex: 2, dayIndex: 4 },
      // Saturday (5)
      { timeSlot: '13:00 - 14:30', courses: [], department: 'IT', departmentCode: 'IT', classroom: 'R5', lecHours: 1, labHours: 0, units: 1, load: 0, classSize: 18, periodIndex: 3, dayIndex: 5 },
    ];

    const grouped = groupScheduleByDays(entries);
    expect(grouped.mondayWednesday).toHaveLength(2);
    expect(grouped.tuesdayThursday).toHaveLength(1);
    expect(grouped.friday).toHaveLength(1);
    expect(grouped.saturday).toHaveLength(1);
    // ensure sort by periodIndex
    expect(grouped.mondayWednesday[0].periodIndex).toBeLessThan(grouped.mondayWednesday[1].periodIndex);
  });

  it('calculateReportTotals sums up hours and units', () => {
    const entries: InstructorScheduleEntry[] = [
      { timeSlot: 't1', courses: [], department: 'CS', departmentCode: 'CS', classroom: 'R1', lecHours: 1.5, labHours: 0.5, units: 2, load: 0, classSize: 30, periodIndex: 0, dayIndex: 0 },
      { timeSlot: 't2', courses: [], department: 'CS', departmentCode: 'CS', classroom: 'R2', lecHours: 2, labHours: 1, units: 3, load: 0, classSize: 25, periodIndex: 1, dayIndex: 2 },
    ];
    const totals = calculateReportTotals(entries);
    expect(totals.lecHours).toBeCloseTo(3.5);
    expect(totals.labHours).toBeCloseTo(1.5);
    expect(totals.totalUnits).toBeCloseTo(5);
    expect(totals.totalLoad).toBe(0);
  });
});


