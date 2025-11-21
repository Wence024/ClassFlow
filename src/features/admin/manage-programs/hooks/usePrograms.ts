import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Program, ProgramInsert, ProgramUpdate } from '@/types/program';
import * as svc from '@/lib/services/programService';

const qk = {
  list: ['programs', 'list'] as const,
};

/**
 * Custom hook to manage programs data.
 *
 * Provides React Query-based operations for fetching, creating, updating, and deleting programs.
 * All mutations automatically invalidate the programs list cache on success.
 *
 * @returns An object containing the list query and CRUD mutation functions.
 */
export function usePrograms() {
  const qc = useQueryClient();

  const listQuery = useQuery<Program[]>({
    queryKey: qk.list,
    queryFn: svc.listPrograms,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ProgramInsert) => svc.createProgram(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.list }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: ProgramUpdate }) =>
      svc.updateProgram(id, update),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.list }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => svc.deleteProgram(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.list }),
  });

  return { listQuery, createMutation, updateMutation, deleteMutation };
}
