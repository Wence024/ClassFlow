/**
 * Business logic hook for managing users.
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchAllUsers, removeUser, updateUserProfileData } from './service';
import type { UserProfile, Role } from '@/types/user';
import type { UserFilters } from './types';

export type UseManageUsersResult = {
  users: UserProfile[];
  filteredUsers: UserProfile[];
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  updateUser: (userId: string, data: { role?: Role; programId?: string | null; departmentId?: string | null }) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
};

/**
 * Hook for managing users.
 */
export function useManageUsers(): UseManageUsersResult {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (
    userId: string,
    data: { role?: Role; programId?: string | null; departmentId?: string | null }
  ): Promise<boolean> => {
    try {
      await updateUserProfileData(userId, data);
      toast.success('User updated successfully');
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      await removeUser(userId);
      toast.success('User deleted successfully');
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error(errorMessage);
      return false;
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filters.role && user.role !== filters.role) {
      return false;
    }
    if (filters.departmentId && user.department_id !== filters.departmentId) {
      return false;
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const name = user.full_name || '';
      return name.toLowerCase().includes(term);
    }
    return true;
  });

  return {
    users,
    filteredUsers,
    isLoading,
    error,
    filters,
    setFilters,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}
