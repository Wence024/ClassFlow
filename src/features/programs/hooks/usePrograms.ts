import { useQuery } from '@tanstack/react-query';
import * as programsService from '../services/programsService';
import type { Program } from '../types/program';

/**
 * Custom hook for fetching and managing programs data.
 * 
 * @returns Object containing programs data, loading state, and error state.
 */
export function usePrograms() {
  const queryKey = ['programs'];

  const {
    data: programs = [],
    isSuccess,
    isError,
    error,
  } = useQuery<Program[]>({
    queryKey,
    queryFn: programsService.getPrograms,
  });

  return {
    programs,
    isSuccess,
    isError,
    error,
  };
}
