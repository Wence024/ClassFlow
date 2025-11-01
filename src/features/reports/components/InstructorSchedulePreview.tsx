import type { InstructorReport } from '../types/instructorReport';
import { DayGroupTable } from './DayGroupTable';
import { formatDayGroupLabel } from '../services/instructorReportService';

interface InstructorSchedulePreviewProps {
  report: InstructorReport;
}

/**
 * Displays a print-friendly preview of the instructor schedule report.
 */
export function InstructorSchedulePreview({ report }: InstructorSchedulePreviewProps) {
  const instructorName = [
    report.instructor.prefix,
    report.instructor.first_name,
    report.instructor.last_name,
    report.instructor.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const dayGroups: Array<keyof InstructorReport['schedules']> = [
    'mondayWednesday',
    'tuesdayThursday',
    'friday',
    'saturday',
  ];

  return (
    <div className="bg-background p-8 print:p-0">
      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          INSTRUCTOR SCHEDULE REPORT
        </h1>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-semibold">Instructor:</span> {instructorName}</p>
            <p><span className="font-semibold">Department:</span> {report.instructor.department_name || 'N/A'}</p>
            <p><span className="font-semibold">Semester:</span> {report.semester.name}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Generated:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Schedule Tables */}
      <div className="space-y-6">
        {dayGroups.map((dayGroup) => (
          <DayGroupTable
            key={dayGroup}
            dayLabel={formatDayGroupLabel(dayGroup)}
            entries={report.schedules[dayGroup]}
          />
        ))}
      </div>

      {/* Footer with Totals */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-bold mb-4">TOTALS</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-8">
          <div className="space-y-2">
            <p><span className="font-semibold">Total Lecture Hours:</span> {report.totals.lecHours.toFixed(1)}</p>
            <p><span className="font-semibold">Total Lab Hours:</span> {report.totals.labHours.toFixed(1)}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-semibold">Total Units:</span> {report.totals.totalUnits.toFixed(1)}</p>
            <p><span className="font-semibold">Total Load:</span> {report.totals.totalLoad.toFixed(2)}</p>
            <p><span className="font-semibold">Load Status:</span> {report.loadStatus}</p>
          </div>
        </div>

        {/* Signature Line */}
        <div className="mt-12 pt-8">
          <div className="w-64">
            <div className="border-t border-foreground pt-2">
              <p className="text-sm">Instructor Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
