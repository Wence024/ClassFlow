import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserProfile, UserProfileUpdate } from '../types/user';
import * as svc from '../services/usersService';

const qk = {
  list: ['users', 'list'] as const,
};

/**
 * Custom hook to manage user profiles (admin only).
 *
 * Provides React Query-based operations for fetching and updating user profiles.
 * All mutations automatically invalidate the users list cache on success.
 *
 * @returns An object containing the list query and update mutation.
 */
export function useUsers() {
  const qc = useQueryClient();

  const listQuery = useQuery<UserProfile[]>({
    queryKey: qk.list,
    queryFn: svc.getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: UserProfileUpdate }) =>
      svc.updateUserProfile(userId, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.list }),
  });

  return { listQuery, updateMutation };
}
