import { Card } from '@/components/ui/card';
import type { InstructorReport } from '../types/instructorReport';

interface LoadSummaryWidgetProps {
  report: InstructorReport;
}

/**
 * Displays a summary of teaching load calculations with color-coded status.
 *
 * @param root0 The component props.
 * @param root0.report The full instructor report including totals and status.
 * @returns The load summary card.
 */
export function LoadSummaryWidget({ report }: LoadSummaryWidgetProps) {
  const { totals, loadStatus } = report;

  const statusColors = {
    UNDERLOADED: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    AT_STANDARD: 'text-green-600 bg-green-50 border-green-200',
    OVERLOADED: 'text-red-600 bg-red-50 border-red-200',
  };

  const statusColor = statusColors[loadStatus];
  const progressColorClass = (() => {
    if (loadStatus === 'OVERLOADED') return 'bg-red-500';
    if (loadStatus === 'UNDERLOADED') return 'bg-yellow-500';
    return 'bg-green-500';
  })();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Teaching Load Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Lecture Hours:</span>
          <span className="font-medium">{totals.lecHours.toFixed(1)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Lab Hours:</span>
          <span className="font-medium">{totals.labHours.toFixed(1)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Units:</span>
          <span className="font-medium">{totals.totalUnits.toFixed(1)}</span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Teaching Load:</span>
            <span className="text-xl font-bold">{totals.totalLoad.toFixed(2)}</span>
          </div>

          <div className="text-sm text-muted-foreground mt-1">Formula: Total Units / 3 = Load</div>
        </div>

        <div className={`p-3 rounded-md border ${statusColor} mt-4`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">Status:</span>
            <span className="font-bold">{loadStatus}</span>
          </div>
          <div className="text-xs mt-1">Standard Load: 7.0</div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">Load Progress</div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${progressColorClass}`}
              style={{ width: `${Math.min((totals.totalLoad / 7.0) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
