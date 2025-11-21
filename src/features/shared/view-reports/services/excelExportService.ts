import * as XLSX from 'xlsx-js-style';
import type { InstructorReport } from '../types/instructorReport';
import { formatDayGroupLabel } from './instructorReportService';

/**
 * Generates a beautifully formatted Excel workbook for an instructor's schedule.
 * Includes styled headers, borders, colors, and proper number formatting.
 *
 * @param report The complete instructor report used to populate the workbook.
 */
export function generateInstructorReportExcel(report: InstructorReport): void {
  const workbook = XLSX.utils.book_new();

  const worksheetData = buildWorksheetData(report);
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  setColumnWidths(worksheet);
  styleWorksheet(worksheet);
  mergeTitleAndSummary(worksheet);
  setRowHeights(worksheet);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule');

  const fileName = buildExcelFilename(report);
  XLSX.writeFile(workbook, fileName);
}

/**
 * Builds the Excel filename for the instructor report.
 *
 * @param report - The instructor report data.
 * @returns The formatted filename string.
 */
export function buildExcelFilename(report: InstructorReport): string {
  return `${report.instructor.code || 'instructor'}_${report.semester.name.replace(/\s+/g, '_')}_Schedule.xlsx`;
}

/**
 * Builds the worksheet data as an array of arrays for export.
 *
 * @param report - The instructor report data.
 * @returns Array of worksheet rows for Excel export.
 */
function buildWorksheetData(report: InstructorReport): (string | number)[][] {
  const instructorName = [
    report.instructor.prefix,
    report.instructor.first_name,
    report.instructor.last_name,
    report.instructor.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const headerData: (string | number)[][] = [
    ['INSTRUCTOR SCHEDULE REPORT'],
    [],
    ['Instructor:', instructorName],
    ['Department:', report.instructor.department_name || 'N/A'],
    ['Semester:', report.semester.name],
    ['Generated:', new Date().toLocaleDateString()],
    [],
  ];

  const worksheetData: (string | number)[][] = [...headerData];

  const dayGroups: Array<keyof InstructorReport['schedules']> = [
    'mondayWednesday',
    'tuesdayThursday',
    'friday',
    'saturday',
  ];

  dayGroups.forEach((dayGroup) => {
    const entries = report.schedules[dayGroup];
    if (entries.length === 0) return;
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
  });

  worksheetData.push(['TEACHING LOAD SUMMARY']);
  worksheetData.push([]);
  worksheetData.push(['Total Lecture Hours:', report.totals.lecHours.toFixed(1)]);
  worksheetData.push(['Total Lab Hours:', report.totals.labHours.toFixed(1)]);
  worksheetData.push(['Total Units:', report.totals.totalUnits.toFixed(1)]);
  worksheetData.push(['Total Load:', report.totals.totalLoad.toFixed(2)]);
  worksheetData.push(['Load Status:', report.loadStatus]);

  return worksheetData;
}

function setColumnWidths(worksheet: XLSX.WorkSheet): void {
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 40 },
    { wch: 8 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
  ];
}

function styleWorksheet(worksheet: XLSX.WorkSheet): void {
  const setCellStyle = (cell: XLSX.CellObject, style: XLSX.CellStyle): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - xlsx-js-style adds .s to CellObject
    cell.s = style;
  };
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  applyStylesToRange(worksheet, range, setCellStyle);
}

function applyStylesToRange(
  worksheet: XLSX.WorkSheet,
  range: XLSX.Range,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): void {
  for (let row = range.s.r; row <= range.e.r; ++row) {
    for (let col = range.s.c; col <= range.e.c; ++col) {
      const address = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[address] as XLSX.CellObject | undefined;
      if (!cell) continue;
      styleCell(row, col, cell, setCellStyle);
    }
  }
}

function styleCell(
  row: number,
  col: number,
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): void {
  const handlers: Array<(r: number, c: number, cell: XLSX.CellObject) => boolean> = [
    (r, _c, current) => styleTitleRow(r, current, setCellStyle),
    (r, c, current) => styleHeaderInfo(r, c, current, setCellStyle),
    (r, _c, current) => styleDayOrSummary(r, current, setCellStyle),
    (_r, _c, current) => styleTableHeaderCell(current, setCellStyle),
    (r, _c, current) => styleTimeRow(r, current, setCellStyle),
    (_r, _c, current) => styleTotalsLabel(current, setCellStyle),
    (r, c, current) => styleNumberCell(r, c, current, setCellStyle),
  ];
  for (const handle of handlers) {
    if (handle(row, col, cell)) break;
  }
}

function styleTitleRow(
  row: number,
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): boolean {
  if (row !== 0) return false;
  setCellStyle(cell, {
    font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '2563EB' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderBlack(),
  });
  return true;
}

function styleHeaderInfo(
  row: number,
  col: number,
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): boolean {
  if (!(row >= 2 && row <= 5 && col === 0)) return false;
  setCellStyle(cell, { font: { bold: true, sz: 11 }, alignment: { horizontal: 'left' } });
  return true;
}

function styleDayOrSummary(
  _row: number,
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): boolean {
  const value = cell.v as unknown;
  if (typeof value !== 'string') return false;
  if (!(isDayHeader(value) || value === 'TEACHING LOAD SUMMARY')) return false;
  setCellStyle(cell, {
    font: { bold: true, sz: 13, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '1E40AF' } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: borderBlack(),
  });
  return true;
}

function styleTableHeaderCell(
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): boolean {
  const value = cell.v as unknown;
  if (typeof value !== 'string') return false;
  if (!isTableHeader(value)) return false;
  setCellStyle(cell, {
    font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '3B82F6' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderBlack(),
  });
  return true;
}

function styleTimeRow(
  row: number,
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): boolean {
  const value = cell.v as unknown;
  if (typeof value !== 'string') return false;
  if (!/^\d{1,2}:\d{2}/.test(value)) return false;
  const isEvenRow = row % 2 === 0;
  setCellStyle(cell, {
    fill: { fgColor: { rgb: isEvenRow ? 'F3F4F6' : 'FFFFFF' } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: borderGray(),
  });
  return true;
}

function styleTotalsLabel(
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): boolean {
  const value = cell.v as unknown;
  if (typeof value !== 'string') return false;
  if (!(value.includes('Total') || value === 'Load Status:')) return false;
  setCellStyle(cell, { font: { bold: true, sz: 11 }, alignment: { horizontal: 'left' } });
  return true;
}

function styleNumberCell(
  row: number,
  col: number,
  cell: XLSX.CellObject,
  setCellStyle: (cell: XLSX.CellObject, style: XLSX.CellStyle) => void
): boolean {
  const value = cell.v as unknown;
  if (typeof value !== 'number') return false;
  const isEvenRow = row % 2 === 0;
  setCellStyle(cell, {
    fill: { fgColor: { rgb: isEvenRow ? 'F3F4F6' : 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderGray(),
  });
  if (col >= 4 && col <= 7) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - xlsx-js-style allows .z for number format
    (cell as unknown as { z: string }).z = '0.0';
  }
  return true;
}

/**
 * Helper to make a black border style for Excel cells.
 *
 * @returns A plain JS object compatible with XLSX cell style (cast for package).
 */
function borderBlack(): Record<string, unknown> {
  return {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };
}

/**
 * Helper to make a gray border style for Excel cells.
 *
 * @returns A plain JS object compatible with XLSX cell style (cast for package).
 */
function borderGray(): Record<string, unknown> {
  return {
    top: { style: 'thin', color: { rgb: 'D1D5DB' } },
    bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
    left: { style: 'thin', color: { rgb: 'D1D5DB' } },
    right: { style: 'thin', color: { rgb: 'D1D5DB' } },
  };
}

function isDayHeader(value: string): boolean {
  return (
    value.includes('Monday') ||
    value.includes('Tuesday') ||
    value.includes('Friday') ||
    value.includes('Saturday')
  );
}

function isTableHeader(value: string): boolean {
  return [
    'Time',
    'Subject(s)',
    'Dept',
    'Room',
    'Lec Hrs',
    'Lab Hrs',
    'Units',
    'Load',
    'Class Size',
  ].includes(value);
}

function mergeTitleAndSummary(worksheet: XLSX.WorkSheet): void {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  let summaryRowIndex = -1;
  for (let R = range.s.r; R <= range.e.r; ++R) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: 0 })] as XLSX.CellObject | undefined;
    if (cell && cell.v === 'TEACHING LOAD SUMMARY') {
      summaryRowIndex = R;
      break;
    }
  }
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
  if (summaryRowIndex !== -1) {
    worksheet['!merges'].push({ s: { r: summaryRowIndex, c: 0 }, e: { r: summaryRowIndex, c: 8 } });
  }
}

function setRowHeights(worksheet: XLSX.WorkSheet): void {
  worksheet['!rows'] = [] as unknown as XLSX.RowInfo[];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - xlsx-js-style supports !rows
  worksheet['!rows'][0] = { hpt: 25 };
}
