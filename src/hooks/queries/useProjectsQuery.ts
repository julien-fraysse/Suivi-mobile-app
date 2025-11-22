/**
 * Projects Query Hook
 * 
 * Hook React Query pour les projets (désactivé volontairement).
 * Ne s'exécute jamais car enabled = false.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchProjectsMock } from '../../services/projectsService';

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: false, // INACTIF volontairement
  });
}

export function useProjectsMockQuery() {
  return useQuery({
    queryKey: ['projectsMock'],
    queryFn: fetchProjectsMock,
    enabled: false, // INACTIF volontairement
  });
}

