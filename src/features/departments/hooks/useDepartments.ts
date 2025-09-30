import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Department, DepartmentInsert, DepartmentUpdate } from '../types/department';
import * as svc from '../services/departmentsService';

const qk = {
  list: ['departments', 'list'] as const,
};

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


