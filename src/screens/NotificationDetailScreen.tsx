import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviText } from '../components/ui/SuiviText';
import { UserAvatar } from '../components/ui/UserAvatar';
import { useNotificationsStore } from '../features/notifications/notificationsStore';
import { useTaskById } from '../tasks/useTaskById';
import type { TaskStatus } from '../api/tasks';
import { tokens } from '../theme';
import type { AppStackParamList } from '../navigation/types';

/**
 * Formate un statut pour l'affichage
 */
function formatStatus(status: TaskStatus, t: any): string {
  switch (status) {
    case 'todo':
      return t('tasks.status.todo');
    case 'in_progress':
      return t('tasks.status.inProgress');
    case 'blocked':
      return t('tasks.status.blocked');
    case 'done':
      return t('tasks.status.done');
    default:
      return status;
  }
}

type NotificationDetailRoute = RouteProp<AppStackParamList, 'NotificationDetail'>;

/**
 * NotificationDetailScreen
 * 
 * Écran de détail d'une notification avec :
 * - Informations complètes de la notification
 * - Avatar et nom de l'acteur (si applicable)
 * - Bloc "Lié à" (tâche, board, workspace)
 * - Quick Actions selon le type de notification
 * 
 * MVP Scope:
 * - 100% mock, aucune logique API réelle
 * - Structure prête pour intégration API Suivi Desktop
 * - Navigation vers TaskDetail depuis les quick actions
 * 
 * TODO: When Suivi API is ready, replace mock data with real API calls.
 */
export function NotificationDetailScreen() {
  const route = useRoute<NotificationDetailRoute>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = route.params;
  
  // Récupérer la notification depuis le store
  const { notifications, markAsRead } = useNotificationsStore();
  const notification = notifications.find(n => n.id === id);
  
  // État pour quick reply (comment/mention)
  const [quickReply, setQuickReply] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  
  // Titre dynamique selon le type de notification
  // Cette fonction est définie avant le useEffect pour être accessible
  const getNotificationTitle = (notif: typeof notification): string => {
    if (!notif) return t('notifications.empty') || 'Notification introuvable';
    
    switch (notif.type) {
      case 'task_assigned':
        return t('notifications.newTaskAssigned');
      case 'comment':
      case 'mention_in_comment':
        return t('notifications.newComment');
      case 'status_changed':
        return t('notifications.statusChanged');
      case 'task_due_today':
        return t('notifications.taskDueToday');
      case 'task_overdue':
        return t('notifications.taskOverdue');
      default:
        return notif.title;
    }
  };
  
  // Configurer le header natif avec titre dynamique
  // 
  // IMPORTANT: Utilise le header natif du stack (React Navigation) pour :
  // - Bouton retour automatique (arrow-left) avec navigation.goBack()
  // - Support natif du swipe back iOS
  // - Design cohérent avec les autres écrans (ActivityDetail, etc.)
  // 
  // Le titre est défini dynamiquement selon le type de notification.
  // TODO: When Suivi API is ready, le titre pourra être enrichi avec des données
  //       supplémentaires (nom de la tâche, nom de l'acteur, etc.)
  React.useEffect(() => {
    const title = getNotificationTitle(notification);
    navigation.setOptions({
      title: title,
    });
  }, [notification, navigation, t]);

  // Si la notification n'existe pas, afficher un message d'erreur
  if (!notification) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <SuiviText variant="h2">Notification introuvable</SuiviText>
          <SuiviText variant="body" color="secondary" style={styles.errorText}>
            Cette notification n'existe plus ou a été supprimée.
          </SuiviText>
        </View>
      </Screen>
    );
  }
  
  // Récupérer la tâche liée si relatedTaskId existe
  const { task } = notification.relatedTaskId 
    ? useTaskById(notification.relatedTaskId) 
    : { task: null };
  
  // Formater la date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return t('notifications.justNow') || 'À l\'instant';
      if (diffMins < 60) return `${diffMins}${t('notifications.minutesAgo') || ' min'}`;
      if (diffHours < 24) return `${diffHours}${t('notifications.hoursAgo') || ' h'}`;
      if (diffDays < 7) return `${diffDays}${t('notifications.daysAgo') || ' j'}`;
      
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };
  
  // Récupérer l'avatar et le nom de l'acteur
  const getActorInfo = () => {
    const actor = notification.actor || notification.author;
    return {
      name: actor?.name || 'Utilisateur',
      avatarUrl: actor?.avatarUrl || actor?.avatar || actor?.imageUrl,
    };
  };
  
  const actorInfo = getActorInfo();
  const isHumanEvent = notification.actor || notification.author;
  
  // Handler pour marquer comme lu
  const handleMarkAsRead = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };
  
  // Handler pour voir la tâche
  const handleViewTask = () => {
    if (notification.relatedTaskId) {
      navigation.navigate('TaskDetail', { taskId: notification.relatedTaskId });
    }
  };
  
  // Handler pour envoyer une réponse rapide
  const handleSendReply = async () => {
    if (!quickReply.trim()) return;
    
    setIsSendingReply(true);
    // TODO: When Suivi API is ready, add API call here:
    // await api.post(`/tasks/${notification.relatedTaskId}/comments`, { body: quickReply });
    
    // Simuler un délai
    setTimeout(() => {
      setIsSendingReply(false);
      setQuickReply('');
      // Optionnel: naviguer vers TaskDetail pour voir le commentaire
      if (notification.relatedTaskId) {
        navigation.navigate('TaskDetail', { taskId: notification.relatedTaskId });
      }
    }, 1000);
  };
  
  // Marquer comme lu au montage si non lue
  React.useEffect(() => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  }, []);
  
  return (
    <Screen>
      {/* 
        NOTE: Le header natif du stack est utilisé (configuré dans RootNavigator).
        Pas besoin d'AppHeader ici car le header natif fournit :
        - Bouton retour automatique (arrow-left) avec navigation.goBack()
        - Support natif du swipe back iOS
        - Design cohérent avec ActivityDetailScreen et autres écrans modaux
      */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header avec date (le titre est dans le header natif) */}
        <View style={styles.header}>
          <SuiviText variant="h1" style={styles.title}>
            {getNotificationTitle(notification)}
          </SuiviText>
          <SuiviText variant="body" color="secondary" style={styles.date}>
            {formatDate(notification.createdAt)}
          </SuiviText>
        </View>
        
        {/* Bloc principal d'information */}
        <SuiviCard padding="lg" elevation="card" variant="default" style={styles.mainCard}>
          {/* Avatar + Nom de l'acteur (si applicable) */}
          {isHumanEvent && (
            <View style={styles.actorRow}>
              <UserAvatar
                size={48}
                imageSource={actorInfo.avatarUrl}
                fullName={actorInfo.name}
              />
              <View style={styles.actorInfo}>
                <SuiviText variant="h3" style={styles.actorName}>
                  {actorInfo.name}
                </SuiviText>
                <SuiviText variant="body2" color="secondary">
                  {notification.type === 'task_assigned' && 'a assigné cette tâche'}
                  {notification.type === 'comment' && 'a commenté'}
                  {notification.type === 'mention_in_comment' && 'vous a mentionné'}
                  {notification.type === 'status_changed' && 'a modifié le statut'}
                </SuiviText>
              </View>
            </View>
          )}
          
          {/* Message complet */}
          <View style={styles.messageContainer}>
            <SuiviText variant="body" style={styles.message}>
              {notification.message}
            </SuiviText>
          </View>
          
          {/* Description supplémentaire pour status_changed */}
          {notification.type === 'status_changed' && task && (
            <View style={styles.statusChangeInfo}>
              <SuiviText variant="body2" color="secondary">
                Statut modifié : {formatStatus(task.status as TaskStatus, t)}
              </SuiviText>
            </View>
          )}
        </SuiviCard>
        
        {/* Bloc "Lié à" */}
        {task && (
          <SuiviCard padding="lg" elevation="card" variant="default" style={styles.linkedCard}>
            <SuiviText variant="h3" style={styles.linkedTitle}>
              {t('notificationDetail.linkedTo') || 'Lié à'}
            </SuiviText>
            
            <Pressable
              onPress={handleViewTask}
              style={({ pressed }) => [
                styles.taskLink,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.taskLinkContent}>
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  size={20}
                  color={tokens.colors.brand.primary}
                  style={styles.taskIcon}
                />
                <View style={styles.taskInfo}>
                  <SuiviText variant="h3" style={styles.taskTitle}>
                    {task.title}
                  </SuiviText>
                  <View style={styles.taskMeta}>
                    <SuiviText variant="body2" color="secondary">
                      {formatStatus(task.status as TaskStatus, t)}
                    </SuiviText>
                    {task.dueDate && (
                      <>
                        <SuiviText variant="body2" color="secondary" style={styles.metaSeparator}>
                          {' • '}
                        </SuiviText>
                        <SuiviText variant="body2" color="secondary">
                          {t('tasks.due')}{new Date(task.dueDate).toLocaleDateString('fr-FR')}
                        </SuiviText>
                      </>
                    )}
                  </View>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={tokens.colors.neutral.medium}
                />
              </View>
            </Pressable>
          </SuiviCard>
        )}
        
        {/* Quick Actions selon le type */}
        <View style={styles.actionsContainer}>
          {/* Quick Reply pour comment/mention_in_comment */}
          {(notification.type === 'comment' || notification.type === 'mention_in_comment') && (
            <SuiviCard padding="lg" elevation="card" variant="default" style={styles.quickReplyCard}>
              <SuiviText variant="h3" style={styles.quickReplyTitle}>
                {t('notificationDetail.quickReply') || 'Réponse rapide'}
              </SuiviText>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.dark 
                      ? tokens.colors.surface.dark 
                      : tokens.colors.background.default,
                    color: theme.dark 
                      ? tokens.colors.text.dark.primary 
                      : tokens.colors.text.primary,
                    borderColor: theme.dark 
                      ? tokens.colors.border.darkMode.default 
                      : tokens.colors.border.default,
                  },
                ]}
                placeholder={t('notificationDetail.replyPlaceholder') || 'Tapez votre réponse...'}
                placeholderTextColor={tokens.colors.neutral.medium}
                value={quickReply}
                onChangeText={setQuickReply}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.quickReplyActions}>
                <Pressable
                  onPress={handleSendReply}
                  disabled={!quickReply.trim() || isSendingReply}
                  style={({ pressed }) => [
                    styles.sendButton,
                    {
                      backgroundColor: tokens.colors.brand.primary,
                      opacity: (!quickReply.trim() || isSendingReply) ? 0.5 : pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  {isSendingReply ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
                      <SuiviText variant="body" color="inverse" style={styles.sendButtonText}>
                        {t('notificationDetail.send') || 'Envoyer'}
                      </SuiviText>
                    </>
                  )}
                </Pressable>
              </View>
            </SuiviCard>
          )}
          
          {/* Actions communes */}
          <View style={styles.actionButtons}>
            {notification.relatedTaskId && (
              <Pressable
                onPress={handleViewTask}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.primaryAction,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <SuiviText variant="body" color="inverse" style={styles.actionButtonText}>
                  {t('notificationDetail.viewTask') || 'Voir la tâche'}
                </SuiviText>
              </Pressable>
            )}
            
            {!notification.read && (
              <Pressable
                onPress={handleMarkAsRead}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.secondaryAction,
                  {
                    opacity: pressed ? 0.8 : 1,
                    borderColor: theme.dark 
                      ? tokens.colors.border.darkMode.default 
                      : tokens.colors.border.default,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="check-all"
                  size={20}
                  color={tokens.colors.brand.primary}
                />
                <SuiviText variant="body" style={[styles.actionButtonText, { color: tokens.colors.brand.primary }]}>
                  {t('notificationDetail.markAsRead') || 'Marquer comme lu'}
                </SuiviText>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl * 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  errorText: {
    marginTop: tokens.spacing.md,
    textAlign: 'center',
  },
  header: {
    marginBottom: tokens.spacing.lg,
  },
  title: {
    marginBottom: tokens.spacing.xs,
  },
  date: {
    opacity: 0.7,
  },
  mainCard: {
    marginBottom: tokens.spacing.lg,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  actorInfo: {
    marginLeft: tokens.spacing.md,
    flex: 1,
  },
  actorName: {
    marginBottom: tokens.spacing.xs / 2,
  },
  messageContainer: {
    marginTop: tokens.spacing.md,
  },
  message: {
    lineHeight: 22,
  },
  statusChangeInfo: {
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.default,
  },
  linkedCard: {
    marginBottom: tokens.spacing.lg,
  },
  linkedTitle: {
    marginBottom: tokens.spacing.md,
  },
  taskLink: {
    marginTop: tokens.spacing.sm,
  },
  taskLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    marginRight: tokens.spacing.sm,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    marginBottom: tokens.spacing.xs / 2,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaSeparator: {
    marginHorizontal: tokens.spacing.xs / 2,
  },
  actionsContainer: {
    marginTop: tokens.spacing.md,
  },
  quickReplyCard: {
    marginBottom: tokens.spacing.lg,
  },
  quickReplyTitle: {
    marginBottom: tokens.spacing.md,
  },
  textInput: {
    minHeight: 100,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: tokens.typography.body.fontFamily,
    marginBottom: tokens.spacing.md,
  },
  quickReplyActions: {
    alignItems: 'flex-end',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    gap: tokens.spacing.xs,
  },
  sendButtonText: {
    fontWeight: '500',
  },
  actionButtons: {
    gap: tokens.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    gap: tokens.spacing.sm,
  },
  primaryAction: {
    backgroundColor: tokens.colors.brand.primary,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionButtonText: {
    fontWeight: '500',
  },
});

