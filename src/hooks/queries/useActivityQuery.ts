/**
 * Activity Query Hook
 * 
 * Hook React Query pour les activités.
 * S'active uniquement en mode API (API_MODE === 'api').
 * En mode mock, le hook est désactivé car les mocks sont utilisés directement.
 */

import { useQuery } from '@tanstack/react-query';
import { API_MODE } from '../../config/apiMode';
import { fetchRecentActivity } from '../../services/activityService';

export function useActivityQuery() {
  return useQuery({
    queryKey: ['activity', 'recent'],
    queryFn: fetchRecentActivity,
    enabled: API_MODE === 'api', // Actif uniquement en mode API
  });
}

