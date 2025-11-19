import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from './SuiviCard';
import { SuiviText } from './SuiviText';
import { tokens } from '../../theme';

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'project_update' | 'comment';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedTaskId?: string | null; // ID de la tâche liée (pour navigation vers TaskDetail)
  projectId?: string; // ID du projet lié (pour navigation future)
}

export interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * NotificationItem
 * 
 * Composant pour afficher un item de notification dans la liste.
 * 
 * Design :
 * - Utilise SuiviCard avec elevation selon l'état (lue/non lue)
 * - Variant outlined pour lues, default pour non lues
 * - Badge non lue (point bleu)
 * - Bordure gauche bleue pour non lues (4px)
 * - Typography Suivi (h2 pour titre, body pour message, caption pour date)
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */
export function NotificationItem({ notification, onPress, style }: NotificationItemProps) {
  const { t } = useTranslation();
  const notificationTitle = getNotificationTypeLabel(notification.type, t);
  
  return (
    <SuiviCard
      padding="md"
      elevation={notification.read ? 'sm' : 'card'}
      variant={notification.read ? 'outlined' : 'default'}
      onPress={onPress}
      style={[
        styles.card,
        !notification.read && styles.unreadCard,
        style,
      ]}
    >
      {/* Header avec titre et badge non lue */}
      <View style={styles.header}>
        <SuiviText variant="h2" style={styles.title}>
          {notificationTitle}
        </SuiviText>
        {!notification.read && (
          <View style={styles.unreadBadge} />
        )}
      </View>

      {/* Message */}
      <SuiviText variant="body" color="secondary" style={styles.message}>
        {notification.message}
      </SuiviText>

      {/* Date */}
      <SuiviText variant="body" color="secondary" style={styles.date}>
        {formatNotificationDate(notification.createdAt)}
      </SuiviText>
    </SuiviCard>
  );
}

/**
 * Retourne le label traduit pour un type de notification
 */
function getNotificationTypeLabel(type: string, t: any): string {
  switch (type) {
    case 'task_assigned':
      return t('notifications.newTaskAssigned');
    case 'task_completed':
      return t('notifications.taskCompleted');
    case 'task_overdue':
      return t('notifications.taskOverdue');
    case 'project_update':
      return t('notifications.projectUpdate');
    case 'comment':
      return t('notifications.newComment');
    default:
      return type;
  }
}

/**
 * Formate une date de notification pour l'affichage
 */
function formatNotificationDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.md,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: tokens.colors.brand.primary, // #4F5DFF
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  title: {
    flex: 1,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.brand.primary, // #4F5DFF
    marginLeft: tokens.spacing.sm,
  },
  message: {
    marginBottom: tokens.spacing.xs,
  },
  date: {
    marginTop: tokens.spacing.xs,
  },
});

