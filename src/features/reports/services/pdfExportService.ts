import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InstructorReport } from '../types/instructorReport';
import { formatDayGroupLabel } from './instructorReportService';

/**
 * Generates an elegant PDF report for an instructor's schedule.
 *
 * @param report The complete instructor report used to populate the PDF.
 */
export function generateInstructorReportPDF(report: InstructorReport): void {
  const doc = new jsPDF('landscape');
  
  // Color scheme
  const primaryColor = [41, 128, 185] as [number, number, number]; // Professional blue
  const accentColor = [52, 152, 219] as [number, number, number];
  const darkGray = [52, 73, 94] as [number, number, number];

  // Add header
  addHeaderSection(doc, report, primaryColor, darkGray);

  let startY = 60;

  // Add schedule tables for each day group
  const dayGroups: Array<keyof InstructorReport['schedules']> = [
    'mondayWednesday',
    'tuesdayThursday',
    'friday',
    'saturday',
  ];

  dayGroups.forEach((dayGroup, index) => {
    const entries = report.schedules[dayGroup];
    if (entries.length > 0) {
      // Add page break if needed
      if (startY > 160 && index > 0) {
        doc.addPage();
        startY = 20;
      }
      startY = addDayGroupTable(doc, formatDayGroupLabel(dayGroup), entries, startY, accentColor);
      startY += 12; // Space between tables
    }
  });

  // Add footer with totals
  addFooterSection(doc, report, startY, primaryColor, darkGray);

  // Download the PDF
  const fileName = `${report.instructor.code || 'instructor'}_${report.semester.name.replace(/\s+/g, '_')}_Schedule.pdf`;
  doc.save(fileName);
}

/**
 * Adds an elegant header section to the PDF.
 *
 * @param doc The jsPDF document.
 * @param report The instructor report metadata.
 * @param primaryColor RGB tuple for the main header color.
 * @param darkGray RGB tuple for header text color.
 */
function addHeaderSection(
  doc: jsPDF, 
  report: InstructorReport,
  primaryColor: [number, number, number],
  darkGray: [number, number, number]
): void {
  const instructorName = [
    report.instructor.prefix,
    report.instructor.first_name,
    report.instructor.last_name,
    report.instructor.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTRUCTOR SCHEDULE REPORT', pageWidth / 2, 18, { align: 'center' });

  // Info box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 30, pageWidth - 30, 20, 2, 2, 'F');
  
  doc.setTextColor(...darkGray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const leftCol = 20;
  const rightCol = pageWidth - 20;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Instructor:', leftCol, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(instructorName, leftCol + 25, 38);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Department:', leftCol, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(report.instructor.department_name || 'N/A', leftCol + 25, 44);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Semester:', rightCol - 60, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(report.semester.name, rightCol - 32, 38);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Generated:', rightCol - 60, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString(), rightCol - 32, 44);
}

/**
 * Adds an elegant day group table to the PDF.
 *
 * @param doc The jsPDF document.
 * @param dayLabel The label for the day-group section.
 * @param entries The schedule entries for the day group.
 * @param startY The starting Y position on the page.
 * @param accentColor RGB tuple for table header color.
 * @returns The Y position after the table to continue rendering.
 */
function addDayGroupTable(
  doc: jsPDF,
  dayLabel: string,
  entries: InstructorReport['schedules'][keyof InstructorReport['schedules']],
  startY: number,
  accentColor: [number, number, number]
): number {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text(dayLabel, 20, startY);

  const tableData = entries.map((entry) => [
    entry.timeSlot,
    entry.courses.map((c) => `${c.name} (${c.code})`).join('\n'),
    entry.departmentCode,
    entry.classroom,
    entry.lecHours.toFixed(1),
    entry.labHours.toFixed(1),
    entry.units.toFixed(1),
    entry.load.toFixed(2),
    entry.classSize.toString(),
  ]);

  autoTable(doc, {
    startY: startY + 6,
    head: [
      [
        { content: 'Time', rowSpan: 2 },
        { content: 'Subject(s)', rowSpan: 2 },
        { content: 'Dept', rowSpan: 2 },
        { content: 'Room', rowSpan: 2 },
        { content: 'Contact hr/wk', colSpan: 2 },
        { content: 'Units', rowSpan: 2 },
        { content: 'Load', rowSpan: 2 },
        { content: 'Class Size', rowSpan: 2 },
      ],
      ['Lec Hrs', 'Lab Hrs'],
    ],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: accentColor,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      cellPadding: 3,
    },
    bodyStyles: { 
      fontSize: 8.5,
      cellPadding: 3,
      valign: 'top',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 28, halign: 'center' },
      1: { cellWidth: 85 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 18, halign: 'center' },
      8: { cellWidth: 22, halign: 'center' },
    },
    margin: { left: 20, right: 20 },
  });

  type AutoTableDoc = jsPDF & { lastAutoTable: { finalY: number } };
  return (doc as AutoTableDoc).lastAutoTable.finalY;
}

/**
 * Adds an elegant footer section with totals.
 *
 * @param doc The jsPDF document.
 * @param report The instructor report totals and status.
 * @param startY The starting Y position for the footer section.
 * @param primaryColor RGB tuple for emphasis text color.
 * @param darkGray RGB tuple for regular text color.
 */
function addFooterSection(
  doc: jsPDF, 
  report: InstructorReport, 
  startY: number,
  primaryColor: [number, number, number],
  darkGray: [number, number, number]
): void {
  const finalY = startY + 15;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Totals box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, finalY - 5, pageWidth - 30, 42, 2, 2, 'F');
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('TEACHING LOAD SUMMARY', 20, finalY + 3);

  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');

  const col1 = 25;
  const col2 = 110;
  
  doc.text(`Total Lecture Hours:`, col1, finalY + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(report.totals.lecHours.toFixed(1), col1 + 50, finalY + 12);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Units:`, col2, finalY + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(report.totals.totalUnits.toFixed(1), col2 + 50, finalY + 12);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Lab Hours:`, col1, finalY + 20);
  doc.setFont('helvetica', 'bold');
  doc.text(report.totals.labHours.toFixed(1), col1 + 50, finalY + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Load:`, col2, finalY + 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(report.totals.totalLoad.toFixed(2), col2 + 50, finalY + 20);
  
  // Load status badge
  const statusColors: Record<string, [number, number, number]> = {
    UNDERLOADED: [241, 196, 15],
    AT_STANDARD: [39, 174, 96],
    OVERLOADED: [231, 76, 60],
  };
  
  const statusColor = statusColors[report.loadStatus] || [149, 165, 166];
  doc.setFillColor(...statusColor);
  doc.roundedRect(col1, finalY + 25, 80, 8, 1, 1, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(`STATUS: ${report.loadStatus}`, col1 + 40, finalY + 30, { align: 'center' });

  // Signature line
  doc.setTextColor(...darkGray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.line(20, finalY + 60, 90, finalY + 60);
  doc.text('Instructor Signature', 20, finalY + 66);
  
  doc.text(`Date: __________________`, pageWidth - 80, finalY + 66);
}
