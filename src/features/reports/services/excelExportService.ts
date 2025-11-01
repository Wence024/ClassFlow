import * as XLSX from 'xlsx';
import type { InstructorReport } from '../types/instructorReport';
import { formatDayGroupLabel } from './instructorReportService';

/**
 * Generates an Excel workbook for an instructor's schedule.
 */
export function generateInstructorReportExcel(report: InstructorReport): void {
  const workbook = XLSX.utils.book_new();

  // Create header data
  const instructorName = [
    report.instructor.prefix,
    report.instructor.first_name,
    report.instructor.last_name,
    report.instructor.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const headerData = [
    ['INSTRUCTOR SCHEDULE REPORT'],
    [],
    [`Instructor: ${instructorName}`],
    [`Department: ${report.instructor.department_name || 'N/A'}`],
    [`Semester: ${report.semester.name}`],
    [`Generated: ${new Date().toLocaleDateString()}`],
    [],
  ];

  const worksheetData: any[][] = [...headerData];

  // Add schedule tables for each day group
  const dayGroups: Array<keyof InstructorReport['schedules']> = [
    'mondayWednesday',
    'tuesdayThursday',
    'friday',
    'saturday',
  ];

  dayGroups.forEach((dayGroup) => {
    const entries = report.schedules[dayGroup];
    if (entries.length > 0) {
      worksheetData.push([formatDayGroupLabel(dayGroup)]);
      worksheetData.push([
        'Time',
        'Subject(s)',
        'Dept',
        'Room',
        'Lec Hrs',
        'Lab Hrs',
        'Units',
        'Load',
        'Class Size',
      ]);

      entries.forEach((entry) => {
        worksheetData.push([
          entry.timeSlot,
          entry.courses.map((c) => c.code).join(', '),
          entry.department,
          entry.classroom,
          entry.lecHours,
          entry.labHours,
          entry.units,
          entry.load,
          entry.classSize,
        ]);
      });

      worksheetData.push([]);
    }
  });

  // Add totals
  worksheetData.push(['TOTALS:']);
  worksheetData.push([`Total Lecture Hours: ${report.totals.lecHours.toFixed(1)}`]);
  worksheetData.push([`Total Lab Hours: ${report.totals.labHours.toFixed(1)}`]);
  worksheetData.push([`Total Units: ${report.totals.totalUnits.toFixed(1)}`]);
  worksheetData.push([`Total Load: ${report.totals.totalLoad.toFixed(2)}`]);
  worksheetData.push([`Load Status: ${report.loadStatus}`]);

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule');

  // Download the Excel file
  const fileName = `${report.instructor.code || 'instructor'}_${report.semester.name.replace(/\s+/g, '_')}_Schedule.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
