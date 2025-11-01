import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InstructorReport } from '../types/instructorReport';
import { formatDayGroupLabel } from './instructorReportService';

/**
 * Generates a PDF report for an instructor's schedule.
 */
export function generateInstructorReportPDF(report: InstructorReport): void {
  const doc = new jsPDF('landscape');

  // Add header
  addHeaderSection(doc, report);

  let startY = 50;

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
      startY = addDayGroupTable(doc, formatDayGroupLabel(dayGroup), entries, startY);
      startY += 10; // Space between tables
    }
  });

  // Add footer with totals
  addFooterSection(doc, report, startY);

  // Download the PDF
  const fileName = `${report.instructor.code || 'instructor'}_${report.semester.name.replace(/\s+/g, '_')}_Schedule.pdf`;
  doc.save(fileName);
}

/**
 * Adds the header section to the PDF.
 */
function addHeaderSection(doc: jsPDF, report: InstructorReport): void {
  const instructorName = [
    report.instructor.prefix,
    report.instructor.first_name,
    report.instructor.last_name,
    report.instructor.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  doc.setFontSize(16);
  doc.text('INSTRUCTOR SCHEDULE REPORT', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Instructor: ${instructorName}`, 20, 25);
  doc.text(`Department: ${report.instructor.department_name || 'N/A'}`, 20, 32);
  doc.text(`Semester: ${report.semester.name}`, 20, 39);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 20, 25, { align: 'right' });
}

/**
 * Adds a day group table to the PDF.
 */
function addDayGroupTable(
  doc: jsPDF,
  dayLabel: string,
  entries: InstructorReport['schedules'][keyof InstructorReport['schedules']],
  startY: number
): number {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(dayLabel, 20, startY);

  const tableData = entries.map((entry) => [
    entry.timeSlot,
    entry.courses.map((c) => c.code).join(', '),
    entry.department,
    entry.classroom,
    entry.lecHours.toFixed(1),
    entry.labHours.toFixed(1),
    entry.units.toFixed(1),
    entry.load.toFixed(2),
    entry.classSize.toString(),
  ]);

  autoTable(doc, {
    startY: startY + 5,
    head: [['Time', 'Subject(s)', 'Dept', 'Room', 'Lec Hrs', 'Lab Hrs', 'Units', 'Load', 'Class Size']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 20, right: 20 },
  });

  return (doc as any).lastAutoTable.finalY;
}

/**
 * Adds the footer section with totals.
 */
function addFooterSection(doc: jsPDF, report: InstructorReport, startY: number): void {
  const finalY = startY + 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTALS:', 20, finalY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Total Lecture Hours: ${report.totals.lecHours.toFixed(1)}`, 20, finalY + 7);
  doc.text(`Total Lab Hours: ${report.totals.labHours.toFixed(1)}`, 20, finalY + 14);
  doc.text(`Total Units: ${report.totals.totalUnits.toFixed(1)}`, 20, finalY + 21);
  doc.text(`Total Load: ${report.totals.totalLoad.toFixed(2)}`, 20, finalY + 28);
  doc.text(`Load Status: ${report.loadStatus}`, 20, finalY + 35);

  // Signature line
  doc.text('_____________________________', 20, finalY + 50);
  doc.text('Instructor Signature', 20, finalY + 57);
}
