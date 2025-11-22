/**
 * Activity Query Hook
 * 
 * Hook React Query pour les activités (désactivé volontairement).
 * Ne s'exécute jamais car enabled = false.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchRecentActivity, fetchRecentActivityMock } from '../../services/activityService';

export function useActivityQuery() {
  return useQuery({
    queryKey: ['activity', 'recent'],
    queryFn: fetchRecentActivity,
    enabled: false, // INACTIF volontairement
  });
}

export function useActivityMockQuery() {
  return useQuery({
    queryKey: ['activityMock', 'recent'],
    queryFn: fetchRecentActivityMock,
    enabled: false, // INACTIF volontairement
  });
}

