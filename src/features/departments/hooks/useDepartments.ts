import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Department, DepartmentInsert, DepartmentUpdate } from '../types/department';
import * as svc from '../services/departmentsService';

const qk = {
  list: ['departments', 'list'] as const,
};

/**
 * Custom hook to manage departments data.
 *
 * Provides React Query-based operations for fetching, creating, updating, and deleting departments.
 * All mutations automatically invalidate the departments list cache on success.
 *
 * @returns An object containing the list query and CRUD mutation functions.
 */
export function useDepartments() {
  const qc = useQueryClient();

  const listQuery = useQuery<Department[]>({
    queryKey: qk.list,
    queryFn: svc.listDepartments,
  });

  const createMutation = useMutation({
    mutationFn: (payload: DepartmentInsert) => svc.createDepartment(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.list }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: DepartmentUpdate }) =>
      svc.updateDepartment(id, update),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.list }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => svc.deleteDepartment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.list }),
  });

  return { listQuery, createMutation, updateMutation, deleteMutation };
}
