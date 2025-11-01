import type { InstructorScheduleEntry } from '../types/instructorReport';

interface DayGroupTableProps {
  dayLabel: string;
  entries: InstructorScheduleEntry[];
}

/**
 * Displays a schedule table for a specific day combination.
 */
export function DayGroupTable({ dayLabel, entries }: DayGroupTableProps) {
  if (entries.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{dayLabel}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Time</th>
              <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Subject(s)</th>
              <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Dept</th>
              <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Room</th>
              <th className="border border-border px-3 py-2 text-right text-sm font-semibold">Lec Hrs</th>
              <th className="border border-border px-3 py-2 text-right text-sm font-semibold">Lab Hrs</th>
              <th className="border border-border px-3 py-2 text-right text-sm font-semibold">Units</th>
              <th className="border border-border px-3 py-2 text-right text-sm font-semibold">Load</th>
              <th className="border border-border px-3 py-2 text-right text-sm font-semibold">Class Size</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="hover:bg-muted/50">
                <td className="border border-border px-3 py-2 text-sm">{entry.timeSlot}</td>
                <td className="border border-border px-3 py-2 text-sm">
                  {entry.courses.map((c) => c.code).join(', ')}
                </td>
                <td className="border border-border px-3 py-2 text-sm">{entry.department}</td>
                <td className="border border-border px-3 py-2 text-sm">{entry.classroom}</td>
                <td className="border border-border px-3 py-2 text-sm text-right">
                  {entry.lecHours.toFixed(1)}
                </td>
                <td className="border border-border px-3 py-2 text-sm text-right">
                  {entry.labHours.toFixed(1)}
                </td>
                <td className="border border-border px-3 py-2 text-sm text-right">
                  {entry.units.toFixed(1)}
                </td>
                <td className="border border-border px-3 py-2 text-sm text-right">
                  {entry.load.toFixed(2)}
                </td>
                <td className="border border-border px-3 py-2 text-sm text-right">
                  {entry.classSize}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
