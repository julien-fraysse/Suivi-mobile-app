import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SuiviText } from './SuiviText';
import { UserAvatar } from './UserAvatar';
import { tokens } from '../../theme';

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'project_update' | 'comment' | 'mention_in_comment' | 'status_changed' | 'task_due_today';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedTaskId?: string | null; // ID de la tâche liée (pour navigation vers TaskDetail)
  projectId?: string; // ID du projet lié (pour navigation future)
  // Champs pour les actions humaines (createdBy, assignedBy, commentedBy, updatedBy, etc.)
  actor?: {
    id?: string;
    name?: string;
    avatar?: string;
    avatarUrl?: string; // Alias pour compatibilité
    imageUrl?: string; // Alias supplémentaire
  };
  // Alias pour compatibilité avec l'ancien format
  author?: {
    avatar?: string;
    avatarUrl?: string;
    name?: string;
  };
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
  const theme = useTheme();
  const notificationTitle = getNotificationTypeLabel(notification.type, t);
  
  // Map des icônes MaterialIcons par type de notification (pour événements système uniquement)
  const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    task_assigned: 'assignment',
    task_completed: 'check-circle',
    task_overdue: 'error-outline',
    project_update: 'bolt',
    task_due_today: 'schedule',
  };
  
  // Déterminer la couleur du liseret selon le type
  const getBorderColor = () => {
    switch (notification.type) {
      case 'task_assigned':
        return tokens.colors.brand.primary;
      case 'task_completed':
        return tokens.colors.semantic.success;
      case 'task_overdue':
        return tokens.colors.semantic.error;
      case 'project_update':
        return tokens.colors.accent.maize;
      case 'comment':
      case 'mention_in_comment':
        return tokens.colors.brand.primary;
      case 'status_changed':
        return tokens.colors.brand.primary;
      case 'task_due_today':
        return tokens.colors.accent.maize;
      default:
        return tokens.colors.brand.primary;
    }
  };

  /**
   * Détermine si une notification provient d'un acteur humain
   * (createdBy, assignedBy, commentedBy, updatedBy, etc.)
   */
  const isHumanEvent = (notification: Notification): boolean => {
    // Vérifier la présence d'un acteur (nouveau format)
    if (notification.actor && (notification.actor.name || notification.actor.avatar || notification.actor.avatarUrl || notification.actor.imageUrl)) {
      return true;
    }
    // Vérifier l'ancien format author (pour compatibilité)
    if (notification.author && (notification.author.name || notification.author.avatar || notification.author.avatarUrl)) {
      return true;
    }
    // Types qui sont toujours des événements humains
    const humanEventTypes = ['comment', 'mention_in_comment', 'status_changed', 'task_assigned'];
    return humanEventTypes.includes(notification.type);
  };

  /**
   * Récupère l'URL de l'avatar depuis actor ou author (compatibilité)
   */
  const getAvatarUrl = (): string | undefined => {
    return notification.actor?.avatarUrl || 
           notification.actor?.avatar || 
           notification.actor?.imageUrl ||
           notification.author?.avatarUrl || 
           notification.author?.avatar;
  };

  /**
   * Récupère le nom de l'acteur depuis actor ou author (compatibilité)
   */
  const getActorName = (): string | undefined => {
    return notification.actor?.name || notification.author?.name;
  };

  // Rendre l'icône ou l'avatar selon le type
  const renderIconOrAvatar = () => {
    const iconColor = getBorderColor();
    
    // Si c'est un événement humain, afficher l'avatar
    if (isHumanEvent(notification)) {
      const avatarUrl = getAvatarUrl();
      const actorName = getActorName();
      
      // Utiliser UserAvatar avec fallback initiales
      return (
        <UserAvatar
          size={36}
          imageSource={avatarUrl}
          fullName={actorName}
          style={theme.dark ? {
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
          } : undefined}
        />
      );
    }

    // Pour les événements système (overdue, reminder, system event), utiliser l'icône
    const iconName = iconMap[notification.type] || 'notifications';

    return (
      <View style={[styles.iconCircle, { backgroundColor: `${iconColor}20` }]}>
        <MaterialIcons
          name={iconName}
          size={22}
          color={iconColor}
        />
      </View>
    );
  };
  
  const cardBackgroundColor = theme.dark 
    ? tokens.colors.surface.dark 
    : tokens.colors.background.default;
  
  const cardShadow = theme.dark 
    ? {} // Pas de shadow en dark mode
    : Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          opacity: pressed ? 0.8 : 1,
          ...cardShadow,
        },
        style,
      ]}
    >
      {/* Liseret latéral - affiché seulement si non lue */}
      {!notification.read && (
        <View
          style={[
            styles.liseret,
            { backgroundColor: getBorderColor() },
          ]}
        />
      )}
      
      {/* Pastille unread en position absolute sur la carte */}
      {!notification.read && (
        <View style={styles.unreadBadge} />
      )}
      
      <View style={styles.contentRow}>
        {/* Icône ou Avatar à gauche */}
        <View style={styles.iconContainer}>
          {renderIconOrAvatar()}
        </View>

        {/* Contenu principal à droite */}
        <View style={styles.textContainer}>
          {/* Header avec titre */}
          <View style={styles.header}>
            <SuiviText variant="h2" style={styles.title}>
              {notificationTitle}
            </SuiviText>
          </View>

          {/* Message */}
          <SuiviText variant="body" color="secondary" style={styles.message}>
            {notification.message}
          </SuiviText>

          {/* Date */}
          <SuiviText variant="body" color="secondary" style={styles.date}>
            {formatNotificationDate(notification.createdAt)}
          </SuiviText>
        </View>
      </View>
    </Pressable>
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
    case 'mention_in_comment':
      return t('notifications.newComment');
    case 'status_changed':
      return t('notifications.statusChanged');
    case 'task_due_today':
      return t('notifications.taskDueToday');
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
    position: 'relative',
    overflow: 'hidden',
  },
  liseret: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    marginRight: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.colors.brand.primary, // #4F5DFF
    position: 'absolute',
    top: 10,
    right: 10,
  },
  message: {
    marginBottom: tokens.spacing.xs,
  },
  date: {
    marginTop: tokens.spacing.xs,
  },
});

