/**
 * Notifications Query Hook
 * 
 * Hook React Query pour les notifications (désactivé volontairement).
 * Ne s'exécute jamais car enabled = false.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchNotifications, fetchNotificationsMock } from '../../services/notificationsService';

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: false, // INACTIF volontairement
  });
}

export function useNotificationsMockQuery() {
  return useQuery({
    queryKey: ['notificationsMock'],
    queryFn: fetchNotificationsMock,
    enabled: false, // INACTIF volontairement
  });
}

