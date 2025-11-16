import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { SuiviButton } from '../components/ui/SuiviButton';
import { SuiviText } from '../components/ui/SuiviText';
import { SuiviCard } from '../components/ui/SuiviCard';
import { NotificationItem } from '../components/ui/NotificationItem';
import { useNotificationsStore } from '../features/notifications/notificationsStore';
import { tokens } from '../theme';

type NotificationsNavigationProp = NativeStackNavigationProp<AppStackParamList>;

/**
 * NotificationsScreen
 * 
 * Liste des notifications avec :
 * - Liste des notifications depuis le store (source unique de vérité)
 * - Mark as read / Mark all as read
 * - Navigation vers TaskDetail quand une notification est liée à une tâche
 * 
 * TODO: Replace useNotificationsStore() with real Suivi API calls when backend is ready.
 */
export function NotificationsScreen() {
  const navigation = useNavigation<NotificationsNavigationProp>();
  
  // Source unique de vérité pour les notifications - TODO: Replace with real Suivi API
  const { notifications, markAsRead, markAllAsRead } = useNotificationsStore();

  // Marquer une notification comme lue et naviguer vers la tâche si applicable
  // 
  // IMPORTANT: Si relatedTaskId est défini, navigue vers TaskDetail.
  // Si relatedTaskId est absent/null, ne fait rien (pas de navigation, pas de crash).
  // 
  // TODO: When Suivi backend API is ready, relatedTaskId will come from the backend response.
  // The linking mechanism (navigation to TaskDetail when relatedTaskId is set) remains unchanged.
  const handleNotificationPress = (notification: any) => {
    // Marquer comme lue
    markAsRead(notification.id);

    // Naviguer vers TaskDetail UNIQUEMENT si relatedTaskId est défini et non null
    if (notification.relatedTaskId) {
      navigation.navigate('TaskDetail', { taskId: notification.relatedTaskId });
      return;
    }

    // Si la notification n'est pas liée à une tâche, ne rien faire (pas de crash)
    // TODO: Ajouter la navigation vers les projets quand implémentée
    // if (notification.projectId) {
    //   navigation.navigate('ProjectDetail', { projectId: notification.projectId });
    // }
  };

  // Marquer toutes comme lues
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    // TODO: When Suivi API is ready, add error handling for failed API calls
  };

  const renderNotificationItem = ({ item }: { item: any }) => {
    return (
      <NotificationItem
        key={item.id}
        notification={item}
        onPress={() => handleNotificationPress(item)}
      />
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <SuiviText variant="h2" style={styles.emptyTitle}>
          No notifications
        </SuiviText>
        <SuiviText variant="body" color="secondary" style={styles.emptyText}>
          You're all caught up!
        </SuiviText>
      </View>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Screen>
      <ScreenHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
      />

      {/* Action bar with Mark All as Read */}
      {unreadCount > 0 && (
        <View style={styles.actionBar}>
          <SuiviButton
            title="Mark All as Read"
            onPress={handleMarkAllAsRead}
            variant="ghost"
            fullWidth
          />
        </View>
      )}

      {/* Notifications list or empty state */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={notifications.length === 0 ? renderEmptyState : null}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    marginBottom: tokens.spacing.md,
  },
  listContent: {
    paddingBottom: tokens.spacing.md,
    flexGrow: 1,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
  },
  emptyTitle: {
    marginBottom: tokens.spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
  },
});
