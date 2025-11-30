import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, Platform, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviText } from './SuiviText';
import { SuiviCard } from './SuiviCard';
import { UserAvatar } from './UserAvatar';
import { useTasksContext } from '../../tasks/TasksContext';
import { useNotificationsStore } from '../../features/notifications/notificationsStore';
import { tokens } from '@theme';
import type { AppStackParamList } from '../../navigation/types';

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

type NotificationItemNavigationProp = NativeStackNavigationProp<AppStackParamList>;

/**
 * NotificationItem
 * 
 * Composant pour afficher un item de notification dans la liste.
 * 
 * Design :
 * - Utilise SuiviCard avec elevation="sm" et variant="default"
 * - Radius: tokens.radius.lg (16px) - géré par SuiviCard
 * - Shadow: tokens.shadows.sm - géré par SuiviCard
 * - Background: géré par SuiviCard (light: #FFFFFF, dark: #242424)
 * - Liseret gauche: borderLeftWidth: 4px (seulement si non lue) via style prop
 * - Badge non lue (point bleu) en position absolute
 * - Typography Suivi (h2 pour titre, body pour message)
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */
export function NotificationItem({ notification, onPress, style }: NotificationItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<NotificationItemNavigationProp>();
  const { getTaskByIdStrict } = useTasksContext();
  const { markAsRead, deleteNotification } = useNotificationsStore();
  const swipeableRef = useRef<Swipeable>(null);
  const hasCompletedActionRef = useRef(false);
  const notificationTitle = getNotificationTypeLabel(notification.type, t);
  
  /**
   * Handler centralisé pour le clic sur une notification
   * 
   * 1. Marque la notification comme lue immédiatement
   * 2. Vérifie si la tâche existe avant de naviguer
   * 3. Navigue vers TaskDetailScreen si la tâche existe
   * 4. Affiche une alerte si la tâche n'existe pas ou n'est pas liée
   */
  const handleNotificationClick = () => {
    if (onPress) {
      // Si un onPress custom est fourni, l'utiliser
      onPress();
      return;
    }
    
    // 1. Marquer la notification comme lue immédiatement
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // 2. Vérifier si la notification est liée à une tâche
    const taskId = notification.relatedTaskId;
    if (!taskId) {
      // Fallback si pas de tâche associée
      Alert.alert(
        t('notifications.taskNotFound') || 'Tâche introuvable',
        t('notifications.taskNotFoundMessage') || 'Cette notification n\'est pas liée à une tâche.',
        [{ text: t('common.ok') || 'OK' }]
      );
      return;
    }
    
    // 3. Vérifier que la tâche existe AVANT de naviguer
    const task = getTaskByIdStrict(taskId);
    if (!task) {
      // Tâche introuvable - afficher une alerte
      Alert.alert(
        t('notifications.taskNotFound') || 'Tâche introuvable',
        t('notifications.taskNotFoundMessage') || 'Cette tâche n\'existe plus ou a été supprimée.',
        [{ text: t('common.ok') || 'OK' }]
      );
      return;
    }
    
    // 4. Navigation directe vers TaskDetailScreen (la tâche existe)
    // Ouvrir l'onglet "comments" pour les notifications de commentaires
    const openTab = (notification.type === 'comment' || notification.type === 'mention_in_comment') 
      ? 'comments' 
      : 'overview';
    navigation.navigate('TaskDetail', { taskId, openTab });
  };
  
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

  /**
   * Détermine le type de badge à afficher sur l'avatar selon le type de notification
   */
  const getBadgeType = (): 'assigned' | 'mentioned' | null => {
    if (notification.type === 'task_assigned') {
      return 'assigned';
    }
    if (notification.type === 'mention_in_comment') {
      return 'mentioned';
    }
    return null;
  };

  // Rendre l'icône ou l'avatar selon le type
  const renderIconOrAvatar = () => {
    const iconColor = getBorderColor();
    
    // Si c'est un événement humain, afficher l'avatar
    if (isHumanEvent(notification)) {
      const avatarUrl = getAvatarUrl();
      const actorName = getActorName();
      
      // Utiliser UserAvatar avec fallback initiales et badge
      return (
        <UserAvatar
          size={36}
          imageSource={avatarUrl}
          fullName={actorName}
          badge={getBadgeType()}
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
          size={28}
          color={iconColor}
        />
      </View>
    );
  };
  
  // Couleur du liseret selon le type de notification
  const liseretColor = getBorderColor();

  /**
   * Gère l'ouverture complète du swipe
   */
  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    if (hasCompletedActionRef.current) return;

    if (direction === 'right') {
      // Swipe gauche → Delete
      hasCompletedActionRef.current = true;
      deleteNotification(notification.id);
      setTimeout(() => {
        swipeableRef.current?.close();
        hasCompletedActionRef.current = false;
      }, 300);
    } else if (direction === 'left') {
      // Swipe droite → Mark as read
      hasCompletedActionRef.current = true;
      if (!notification.read) {
        markAsRead(notification.id);
      }
      setTimeout(() => {
        swipeableRef.current?.close();
        hasCompletedActionRef.current = false;
      }, 300);
    }
  };

  /**
   * Render l'action "Delete" révélée lors du swipe gauche
   */
  const renderRightActions = () => {
    return (
      <View style={styles.rightAction}>
        <View style={styles.rightActionContent}>
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={tokens.colors.text.onPrimary}
          />
          <SuiviText variant="body" style={styles.rightActionText}>
            {t('notifications.delete')}
          </SuiviText>
        </View>
      </View>
    );
  };

  /**
   * Render l'action "Mark as read" révélée lors du swipe droite
   */
  const renderLeftActions = () => {
    if (notification.read) {
      return null;
    }
    return (
      <View style={styles.leftAction}>
        <View style={styles.leftActionContent}>
          <MaterialCommunityIcons
            name="check"
            size={24}
            color={tokens.colors.text.onPrimary}
          />
          <SuiviText variant="body" style={styles.leftActionText}>
            {t('notifications.markAsRead')}
          </SuiviText>
        </View>
      </View>
    );
  };

  // Contenu principal de la notification
  const notificationContent = (
    <SuiviCard
      onPress={handleNotificationClick}
      elevation="sm"
      variant="default"
      padding="md"
      style={[
        styles.card,
        // Liseret via borderLeftWidth (seulement si non lue)
        !notification.read && {
          borderLeftWidth: 4,
          borderLeftColor: liseretColor,
        },
        style,
      ]}
    >
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
    </SuiviCard>
  );

  // Fallback Web : retourner le SuiviCard sans Swipeable
  if (Platform.OS === 'web') {
    return notificationContent;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={handleSwipeableOpen}
      rightThreshold={40}
      leftThreshold={40}
      overshootRight={false}
      overshootLeft={false}
    >
      {notificationContent}
    </Swipeable>
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
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
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
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
    paddingRight: tokens.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginBottom: tokens.spacing.xs,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: tokens.radius.xs,
    backgroundColor: tokens.colors.brand.primary, // #4F5DFF
    position: 'absolute',
    top: 10,
    right: 10,
  },
  message: {
    marginBottom: tokens.spacing.xs,
    lineHeight: 20,
  },
  date: {
    marginTop: tokens.spacing.xs,
    lineHeight: 20,
  },
  rightAction: {
    flex: 1,
    backgroundColor: tokens.colors.semantic.error,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },
  rightActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  rightActionText: {
    color: tokens.colors.text.onPrimary,
    marginLeft: tokens.spacing.sm,
  },
  leftAction: {
    flex: 1,
    backgroundColor: tokens.colors.semantic.success,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },
  leftActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  leftActionText: {
    color: tokens.colors.text.onPrimary,
    marginLeft: tokens.spacing.sm,
  },
});

