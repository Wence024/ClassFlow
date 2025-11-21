/**
 * Business logic hook for managing departments.
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  fetchDepartments,
  createNewDepartment,
  updateDepartmentData,
  removeDepartment,
} from './service';
import type { Department, DepartmentInsert, DepartmentUpdate } from '@/types/department';

export type UseManageDepartmentsResult = {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  createDepartment: (data: DepartmentInsert) => Promise<boolean>;
  updateDepartment: (departmentId: string, data: DepartmentUpdate) => Promise<boolean>;
  deleteDepartment: (departmentId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
};

/**
 * Hook for managing departments.
 */
export function useManageDepartments(): UseManageDepartmentsResult {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load departments';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const createDepartment = async (data: DepartmentInsert): Promise<boolean> => {
    try {
      await createNewDepartment(data);
      toast.success('Department created successfully');
      await fetch();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create department';
      toast.error(errorMessage);
      return false;
    }
  };

  const updateDepartment = async (
    departmentId: string,
    data: DepartmentUpdate
  ): Promise<boolean> => {
    try {
      await updateDepartmentData(departmentId, data);
      toast.success('Department updated successfully');
      await fetch();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update department';
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteDepartment = async (departmentId: string): Promise<boolean> => {
    try {
      await removeDepartment(departmentId);
      toast.success('Department deleted successfully');
      await fetch();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete department';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    departments,
    isLoading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: fetch,
  };
}
