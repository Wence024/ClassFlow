import * as XLSX from 'xlsx';
import type { InstructorReport } from '../types/instructorReport';
import { formatDayGroupLabel } from './instructorReportService';

/**
 * Generates a beautifully formatted Excel workbook for an instructor's schedule.
 * Includes styled headers, borders, colors, and proper number formatting.
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

  // Apply styling to make it beautiful
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;
      
      const cell = worksheet[cellAddress];
      
      // Initialize cell style
      if (!cell.s) cell.s = {};
      
      // Title row (row 0)
      if (R === 0) {
        cell.s = {
          font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2563EB" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
      // Header info rows (2-5)
      else if (R >= 2 && R <= 5 && C === 0) {
        cell.s = {
          font: { bold: true, sz: 11 },
          alignment: { horizontal: "left" }
        };
      }
      // Day group headers (e.g., "Monday & Wednesday")
      else if (typeof cell.v === 'string' && 
               (cell.v.includes('Monday') || cell.v.includes('Tuesday') || 
                cell.v.includes('Friday') || cell.v.includes('Saturday') ||
                cell.v === 'TEACHING LOAD SUMMARY')) {
        cell.s = {
          font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1E40AF" } },
          alignment: { horizontal: "left", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
      // Table headers (Time, Subject(s), etc.)
      else if (typeof cell.v === 'string' && 
               ['Time', 'Subject(s)', 'Dept', 'Room', 'Lec Hrs', 'Lab Hrs', 
                'Units', 'Load', 'Class Size'].includes(cell.v)) {
        cell.s = {
          font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "3B82F6" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
      // Data rows with alternating colors
      else if (typeof cell.v === 'string' && /^\d{1,2}:\d{2}/.test(cell.v)) {
        // This is a time slot row - apply alternating row color
        const isEvenRow = R % 2 === 0;
        cell.s = {
          fill: { fgColor: { rgb: isEvenRow ? "F3F4F6" : "FFFFFF" } },
          alignment: { horizontal: "left", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "D1D5DB" } },
            bottom: { style: "thin", color: { rgb: "D1D5DB" } },
            left: { style: "thin", color: { rgb: "D1D5DB" } },
            right: { style: "thin", color: { rgb: "D1D5DB" } }
          }
        };
      }
      // Totals section
      else if (typeof cell.v === 'string' && 
               (cell.v.includes('Total') || cell.v === 'Load Status:')) {
        cell.s = {
          font: { bold: true, sz: 11 },
          alignment: { horizontal: "left" }
        };
      }
      // Number cells - format with proper decimals
      else if (typeof cell.v === 'number') {
        const isEvenRow = R % 2 === 0;
        cell.s = {
          fill: { fgColor: { rgb: isEvenRow ? "F3F4F6" : "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "D1D5DB" } },
            bottom: { style: "thin", color: { rgb: "D1D5DB" } },
            left: { style: "thin", color: { rgb: "D1D5DB" } },
            right: { style: "thin", color: { rgb: "D1D5DB" } }
          }
        };
        // Apply number format
        if (C >= 4 && C <= 7) { // Lec Hrs, Lab Hrs, Units, Load columns
          cell.z = '0.0';
        }
      }
    }
  }

  // Merge title cell across all columns
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }
  ];

  // Set row heights for better appearance
  worksheet['!rows'] = [];
  worksheet['!rows'][0] = { hpt: 25 }; // Title row

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule');

  // Download the Excel file
  const fileName = `${report.instructor.code || 'instructor'}_${report.semester.name.replace(/\s+/g, '_')}_Schedule.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
