import { useQuery } from '@tanstack/react-query';
import { getInstructorScheduleData } from '../services/instructorReportService';
import type { InstructorReport } from '../types/instructorReport';

/**
 * Hook to fetch and manage instructor report data.
 *
 * @param instructorId The selected instructor ID or null when not selected.
 * @param semesterId The selected semester ID or null when not selected.
 * @returns React Query result containing the instructor report or null.
 */
export function useInstructorReport(instructorId: string | null, semesterId: string | null) {
  return useQuery<InstructorReport | null>({
    queryKey: ['instructorReport', instructorId, semesterId],
    queryFn: async () => {
      if (!instructorId || !semesterId) return null;
      return await getInstructorScheduleData(instructorId, semesterId);
    },
    enabled: !!instructorId && !!semesterId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
