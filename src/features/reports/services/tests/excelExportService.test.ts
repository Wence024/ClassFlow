import { describe, it, expect } from 'vitest';
import { buildExcelFilename } from '../excelExportService';
import type { InstructorReport } from '../../types/instructorReport';

describe('excelExportService', () => {
  it('uses expected filename format', () => {
    const report = buildReport();
    const filename = buildExcelFilename(report);
    expect(filename).toMatch(/^INS123_First_Semester_S\.Y\._2025-2026_Schedule\.xlsx$/);
  });
});

function buildReport(): InstructorReport {
  return {
    instructor: {
      id: 'ins',
      code: 'INS123',
      first_name: 'Jane',
      last_name: 'Doe',
      prefix: null,
      suffix: null,
      department_name: 'CS',
    } as any,
    semester: { id: 'sem', name: 'First Semester S.Y. 2025-2026' } as any,
    schedules: { mondayWednesday: [], tuesdayThursday: [], friday: [], saturday: [] },
    totals: { lecHours: 0, labHours: 0, totalUnits: 0, totalLoad: 0 },
    loadStatus: 'AT_STANDARD',
  };
}


