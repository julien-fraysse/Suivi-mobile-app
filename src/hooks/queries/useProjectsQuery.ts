/**
 * Projects Query Hook
 * 
 * Hook React Query pour les projets.
 * S'active uniquement en mode API (API_MODE === 'api').
 * En mode mock, le hook est désactivé car les mocks sont utilisés directement.
 */

import { useQuery } from '@tanstack/react-query';
import { API_MODE } from '../../config/apiMode';
import { fetchProjects } from '../../services/projectsService';

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: API_MODE === 'api', // Actif uniquement en mode API
  });
}

