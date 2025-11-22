/**
 * Notifications Query Hook
 * 
 * Hook React Query pour les notifications.
 * S'active uniquement en mode API (API_MODE === 'api').
 * En mode mock, le hook est désactivé car les mocks sont utilisés directement.
 */

import { useQuery } from '@tanstack/react-query';
import { API_MODE } from '../../config/apiMode';
import { fetchNotifications } from '../../services/notificationsService';

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: API_MODE === 'api', // Actif uniquement en mode API
  });
}

