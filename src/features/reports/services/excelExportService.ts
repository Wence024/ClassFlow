import * as XLSX from 'xlsx';
import type { InstructorReport } from '../types/instructorReport';
import { formatDayGroupLabel } from './instructorReportService';

/**
 * Generates an Excel workbook for an instructor's schedule with improved formatting.
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
    ['Instructor:', instructorName],
    ['Department:', report.instructor.department_name || 'N/A'],
    ['Semester:', report.semester.name],
    ['Generated:', new Date().toLocaleDateString()],
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
      worksheetData.push(['', '', '', '', 'Contact hr/wk', '', '', '', '']);
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
          entry.courses.map((c) => `${c.name} (${c.code})`).join('; '),
          entry.departmentCode,
          entry.classroom,
          Number(entry.lecHours.toFixed(1)),
          Number(entry.labHours.toFixed(1)),
          Number(entry.units.toFixed(1)),
          Number(entry.load.toFixed(2)),
          entry.classSize,
        ]);
      });

      worksheetData.push([]);
    }
  });

  // Add totals section
  worksheetData.push(['TEACHING LOAD SUMMARY']);
  worksheetData.push([]);
  worksheetData.push(['Total Lecture Hours:', report.totals.lecHours.toFixed(1)]);
  worksheetData.push(['Total Lab Hours:', report.totals.labHours.toFixed(1)]);
  worksheetData.push(['Total Units:', report.totals.totalUnits.toFixed(1)]);
  worksheetData.push(['Total Load:', report.totals.totalLoad.toFixed(2)]);
  worksheetData.push(['Load Status:', report.loadStatus]);

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 15 },  // Time
    { wch: 40 },  // Subject(s)
    { wch: 8 },   // Dept
    { wch: 12 },  // Room
    { wch: 10 },  // Lec Hrs
    { wch: 10 },  // Lab Hrs
    { wch: 10 },  // Units
    { wch: 10 },  // Load
    { wch: 12 },  // Class Size
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule');

  // Download the Excel file
  const fileName = `${report.instructor.code || 'instructor'}_${report.semester.name.replace(/\s+/g, '_')}_Schedule.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
