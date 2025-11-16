import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../auth';
import * as notificationsAPI from '../api/notifications';
import type { Notification } from '../api/notifications';

/**
 * Hook pour marquer toutes les notifications comme lues
 */
export function useMarkAllNotificationsRead() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsAPI.markAllNotificationsRead(accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * Hook pour récupérer toutes les notifications
 */
export function useNotifications(
  options?: Omit<UseQueryOptions<Notification[]>, 'queryKey' | 'queryFn'>,
) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['notifications'],
    enabled: !!accessToken,
    queryFn: () => notificationsAPI.getNotifications(accessToken),
    ...options,
  });
}

/**
 * Hook pour marquer une notification comme lue
 */
export function useMarkNotificationAsRead() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsAPI.markNotificationAsRead(notificationId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

