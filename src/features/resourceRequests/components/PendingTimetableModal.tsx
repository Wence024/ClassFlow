import React, { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../auth/hooks/useAuth';
import { useActiveSemester } from '../../scheduleConfig/hooks/useActiveSemester';
import { useScheduleConfig } from '../../scheduleConfig/hooks/useScheduleConfig';
import * as timetableService from '../../timetabling/services/timetableService';
import * as classGroupsService from '../../classSessionComponents/services/classGroupsService';
import { buildTimetableGrid } from '../../timetabling/utils/timetableLogic';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { ClassGroup } from '../../classSessionComponents/types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface PendingTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  classSession: ClassSession;
  onPlacementComplete: () => void;
}

/**
 * Modal component that allows users to place a pending cross-department
 * class session on the timetable before submitting the request.
 *
 * @param props - Component props
 * @returns The rendered modal component
 */
export const PendingTimetableModal: React.FC<PendingTimetableModalProps> = ({
  isOpen,
  onClose,
  classSession,
  onPlacementComplete,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: activeSemester } = useActiveSemester();
  const { settings } = useScheduleConfig();
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  const { data: allClassGroups = [] } = useQuery<ClassGroup[]>({
    queryKey: ['allClassGroups'],
    queryFn: classGroupsService.getAllClassGroups,
    enabled: !!user && isOpen,
  });

  const { data: existingAssignments = [] } = useQuery({
    queryKey: ['hydratedTimetable', activeSemester?.id],
    queryFn: () =>
      activeSemester
        ? timetableService.getTimetableAssignments(activeSemester.id)
        : Promise.resolve([]),
    enabled: !!activeSemester && isOpen,
  });

  const totalPeriods = settings ? settings.periods_per_day * settings.class_days_per_week : 0;

  const timetableMap = useMemo(
    () => buildTimetableGrid(existingAssignments, 'class-group', allClassGroups, totalPeriods),
    [existingAssignments, allClassGroups, totalPeriods]
  );

  // Get the cells for this class session's group
  const targetCells = useMemo(() => {
    return timetableMap.get(classSession.group.id) || [];
  }, [timetableMap, classSession.group.id]);

  const handlePlacement = useCallback(async () => {
    if (selectedPeriod === null || !user || !activeSemester) return;

    setIsPlacing(true);
    try {
      // Create the timetable assignment with 'pending' status
      await timetableService.assignClassSessionToTimetable(
        {
          user_id: user.id,
          class_session_id: classSession.id,
          class_group_id: classSession.group.id,
          period_index: selectedPeriod,
          semester_id: activeSemester.id,
        },
        'pending'
      );

      await queryClient.invalidateQueries({ queryKey: ['hydratedTimetable', activeSemester.id] });
      onPlacementComplete();
      toast.success('Session placed on timetable (pending approval)');
      onClose();
    } catch (error) {
      console.error('Error placing session:', error);
      toast.error('Failed to place session on timetable');
    } finally {
      setIsPlacing(false);
    }
  }, [
    selectedPeriod,
    user,
    activeSemester,
    classSession,
    onPlacementComplete,
    onClose,
    queryClient,
  ]);

  if (!targetCells.length || !settings) {
    return null;
  }

  const periodsPerDay = settings.periods_per_day;
  const daysPerWeek = settings.class_days_per_week;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Session on Timetable</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Course:</strong> {classSession.course.name} ({classSession.course.code})
            </p>
            <p>
              <strong>Class Group:</strong> {classSession.group.name}
            </p>
            <p className="mt-2 text-amber-600">
              This session uses a cross-department resource and will be marked as "pending" until
              approved.
            </p>
          </div>

          <div className="border rounded-lg overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left text-sm font-medium">Time</th>
                  {Array.from({ length: daysPerWeek }, (_, dayIdx) => (
                    <th key={dayIdx} className="p-2 text-center text-sm font-medium">
                      Day {dayIdx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: periodsPerDay }, (_, periodIdx) => (
                  <tr key={periodIdx} className="border-b">
                    <td className="p-2 text-sm font-medium">Period {periodIdx + 1}</td>
                    {Array.from({ length: daysPerWeek }, (_, dayIdx) => {
                      const periodIndex = periodIdx * daysPerWeek + dayIdx;
                      const cell = targetCells[periodIndex];
                      const isOccupied = cell && cell.length > 0;
                      const isSelected = selectedPeriod === periodIndex;

                      return (
                        <td
                          key={dayIdx}
                          className={`p-2 text-center cursor-pointer transition-colors ${
                            isOccupied
                              ? 'bg-red-100 cursor-not-allowed'
                              : isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-green-50 hover:bg-green-100'
                          }`}
                          onClick={() => !isOccupied && setSelectedPeriod(periodIndex)}
                        >
                          {isOccupied ? (
                            <span className="text-xs text-red-600">Occupied</span>
                          ) : isSelected ? (
                            <span className="text-xs font-semibold">Selected</span>
                          ) : (
                            <span className="text-xs text-gray-500">Available</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isPlacing}>
              Cancel
            </Button>
            <Button onClick={handlePlacement} disabled={selectedPeriod === null || isPlacing}>
              {isPlacing ? 'Placing...' : 'Place & Submit Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
