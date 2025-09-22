import { useQuery } from '@tanstack/react-query';
import * as programsService from '../services/programsService';
import type { Program } from '../types/program';

export function usePrograms() {
  const queryKey = ['programs'];

  const { data: programs = [] } = useQuery<Program[]>({
    queryKey,
    queryFn: programsService.getPrograms,
  });

  return {
    programs,
  };
}
