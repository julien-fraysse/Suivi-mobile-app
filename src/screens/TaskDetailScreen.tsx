import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviText } from '../components/ui/SuiviText';
import { UserAvatar } from '../components/ui/UserAvatar';
import { useTaskById } from '../tasks/useTaskById';
import type { TaskStatus } from '../tasks/tasks.types';
import { useTaskActivity } from '../hooks/useActivity';
import { useUser } from '../hooks/useUser';
import { tokens } from '../theme';
import type { AppStackParamList } from '../navigation/types';
import { QuickActionRenderer } from '../components/tasks/quickactions/QuickActionRenderer';
import type { SuiviActivityEvent } from '../types/activity';

type TaskDetailRoute = RouteProp<AppStackParamList, 'TaskDetail'>;

/**
 * BackPillButton
 * 
 * Bouton retour custom de type pill pour le header de TaskDetailScreen
 */
function BackPillButton() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 24,
        marginLeft: 16,
      }}
    >
      <MaterialIcons name="arrow-back" size={18} color="#333" />
      <Text
        style={{
          marginLeft: 6,
          fontSize: 14,
          fontWeight: '500',
          color: '#333',
        }}
      >
        {t('common.back')}
      </Text>
    </Pressable>
  );
}

/**
 * TaskDetailScreen
 * 
 * Détails d'une tâche avec :
 * - Détails complets de la tâche depuis useTaskById() (source unique de vérité)
 * - Affichage du statut (read-only, les changements se font uniquement via Quick Actions)
 * - Breadcrumb projet
 * - Assigned user (useUser)
 * - Section "Recent updates" (useActivityFeed filtré par taskId)
 * - Quick Actions pour interagir avec la tâche
 * 
 * TODO: Replace useTaskById() with real Suivi API calls when backend is ready.
 */
export function TaskDetailScreen() {
  const route = useRoute<TaskDetailRoute>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { taskId } = route.params;
  
  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { task, isLoading: isLoadingTask, error: taskError } = useTaskById(taskId);
  
  const { data: user } = useUser();
  const { data: taskActivities = [] } = useTaskActivity(taskId);

  // Status actuel de la tâche (dérivé du store)
  const taskStatus = task?.status;

  // Local activity history for Quick Actions (mock)
  const [localActivities, setLocalActivities] = useState<SuiviActivityEvent[]>([]);

  // Animation pour le point violet du titre Quick action
  const pulse = useRef(new Animated.Value(1)).current;

  // Configure header avec bouton pill custom
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerShadowVisible: false,
      headerLeft: () => <BackPillButton />,
      headerTitle: () => null,
    });
  }, [navigation, theme]);

  // Animation en boucle pour le point violet
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Style animé pour l'opacité du point
  const animatedOpacityStyle = { opacity: pulse };

  // Handle Quick Action completion (mock)
  function handleMockAction(result: { actionType: string; details: Record<string, any> }) {
    if (!task || !user) return;

    // Create a local activity entry
    const activityEntry: SuiviActivityEvent = {
      id: `local-${Date.now()}`,
      source: 'BOARD',
      eventType: getEventTypeFromActionType(result.actionType),
      title: getActivityTitle(result.actionType, result.details, t),
      workspaceName: task.workspaceName || 'Default',
      boardName: task.boardName,
      actor: {
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
        userId: user.id,
      },
      createdAt: new Date().toISOString(),
      severity: 'INFO',
      taskInfo: {
        taskId: task.id,
        taskTitle: task.title,
      },
    };

    // Add to local activities state
    setLocalActivities((prev) => [activityEntry, ...prev]);
  }

  // Merge API activities with local activities, sorted by createdAt DESC
  const allActivities = [...localActivities, ...taskActivities].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // DESC
  });

  // Loading state
  if (isLoadingTask) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={tokens.colors.brand.primary} />
          <SuiviText variant="body" color="secondary" style={styles.loadingText}>
            Loading task...
          </SuiviText>
        </View>
      </Screen>
    );
  }

  // Error state: tâche introuvable
  if (taskError || !task) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <SuiviText variant="body" color="primary" style={styles.errorText}>
            {taskError?.message || 'Task not found'}
          </SuiviText>
          <SuiviText variant="body" color="secondary" style={styles.errorSubtext}>
            {/* TODO: handle this case properly when wired to real API */}
            The task may have been deleted or moved.
          </SuiviText>
        </View>
      </Screen>
    );
  }

  const isDark = theme.dark;
  const statusColors = getStatusColors(taskStatus!, isDark);

  // Diagnostic log for Quick Actions
  console.log(
    "QA-DIAG: TaskDetailScreen rendering for",
    task?.id,
    "quickAction =",
    task?.quickAction
  );

  return (
    <Screen scrollable>
      <View style={styles.pagePadding}>
        {/* Task Overview Title */}
        <SuiviText variant="label" color="secondary" style={styles.overviewTitle}>
          {t('taskDetail.overview')}
        </SuiviText>

        {/* Task Title (display only, no label) */}
        <View style={styles.taskTitleContainer}>
        <SuiviText variant="h1" style={styles.taskTitleText}>
          {task.title}
        </SuiviText>
      </View>

      {/* Status Display (read-only) */}
      <View style={styles.statusSection}>
        <SuiviCard 
          padding="md" 
          elevation="card" 
          variant="default" 
          style={[
            styles.statusCard,
            {
              borderWidth: 1.5,
              borderColor: statusColors.border,
              borderLeftWidth: 6,
              borderLeftColor: statusColors.border,
              borderRadius: 10,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <SuiviText variant="label" color="secondary" style={[styles.statusLabel, { opacity: 0.7 }]}>
            {t('taskDetail.status')}
          </SuiviText>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColors.bg,
              },
            ]}
          >
            <SuiviText variant="body" style={{ color: statusColors.text, fontWeight: '600', fontSize: 13 }}>
              {formatStatus(taskStatus!, t)}
            </SuiviText>
          </View>
        </SuiviCard>
      </View>

      {/* Quick Action Renderer */}
      {task && task.quickAction && (
        <View style={styles.section}>
          <View style={styles.quickActionHeader}>
            <SuiviText variant="h1" style={styles.quickActionTitle}>
              {t('taskDetail.quickAction')}
            </SuiviText>
            <Animated.View style={[styles.quickActionDot, { backgroundColor: tokens.colors.brand.primary }, animatedOpacityStyle]} />
          </View>
          <SuiviText variant="caption" color="secondary" style={styles.quickActionSubtitle}>
            {t('taskDetail.quickActionSubtitle')}
          </SuiviText>
          <QuickActionRenderer task={task} onActionComplete={handleMockAction} />
        </View>
      )}

      {/* Task Details Card */}
      <View style={styles.section}>
        <SuiviText variant="h1" style={styles.sectionTitle}>
          {t('taskDetail.details')}
        </SuiviText>
        <SuiviCard padding="md" elevation="card" variant="default" style={[styles.card, styles.detailsCard]}>
        {/* Description */}
        {task.description ? (
          <View style={styles.descriptionRow}>
            <SuiviText variant="body" color="primary">
              {task.description}
            </SuiviText>
          </View>
        ) : (
          <View style={styles.descriptionRow}>
            <SuiviText variant="body" color="secondary" style={{ opacity: 0.6 }}>
              {t('taskDetail.noDescription')}
            </SuiviText>
          </View>
        )}

        {/* Project/Board Label */}
        {task.projectName && (
          <View style={styles.infoRow}>
            <SuiviText variant="label" color="secondary" style={styles.label}>
              {t('taskDetail.projectBoard')}
            </SuiviText>
            <SuiviText variant="body" color="primary">
              {task.projectName}
            </SuiviText>
          </View>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <View style={styles.infoRow}>
            <SuiviText variant="label" color="secondary" style={styles.label}>
              {t('taskDetail.dueDate')}
            </SuiviText>
            <SuiviText variant="body" color="primary">
              {formatDate(task.dueDate)}
            </SuiviText>
          </View>
        )}

        {/* Assigned User */}
        {task.assigneeName && (
          <View style={styles.infoRow}>
            <SuiviText variant="label" color="secondary" style={styles.label}>
              {t('taskDetail.assignee')}
            </SuiviText>
            <View style={styles.assigneeContainer}>
              <UserAvatar
                size={32}
                fullName={task.assigneeName}
                style={styles.avatar}
              />
              <SuiviText variant="body" color="primary" style={styles.assigneeText}>
                {task.assigneeName}
              </SuiviText>
            </View>
          </View>
        )}

        {/* Updated At */}
        {task.updatedAt && (
          <View style={styles.infoRow}>
            <SuiviText variant="label" color="secondary" style={styles.label}>
              {t('taskDetail.updated')}
            </SuiviText>
            <SuiviText variant="body" color="secondary">
              {formatDate(task.updatedAt)}
            </SuiviText>
          </View>
        )}
      </SuiviCard>
      </View>

      {/* Activity Timeline Section */}
      <View style={styles.section}>
        <SuiviText variant="h1" style={[styles.sectionTitle, styles.activityTimelineTitle]}>
          {t('taskDetail.activityTimeline')}
        </SuiviText>
        {allActivities.length > 0 ? (
          allActivities.map((activity, index) => (
            <View key={activity.id} style={styles.timelineItem}>
              {index < allActivities.length - 1 && <View style={styles.timelineLine} />}
              <View style={styles.timelineDot} />
              <SuiviCard
                padding="md"
                elevation="sm"
                variant="default"
                style={styles.activityCard}
              >
                <SuiviText variant="body" color="primary">
                  {t('activity.user_action', { actor: activity.actor.name, action: activity.title })}
                </SuiviText>
                {activity.taskInfo?.taskTitle && (
                  <SuiviText variant="body" color="secondary" style={styles.activityMeta}>
                    {t('activity.on_task', { taskTitle: activity.taskInfo.taskTitle })}
                  </SuiviText>
                )}
                <SuiviText variant="body" color="secondary" style={styles.activityMeta}>
                  {formatActivityDate(activity.createdAt, t)}
                </SuiviText>
              </SuiviCard>
            </View>
          ))
        ) : (
          <SuiviCard padding="md" elevation="sm" variant="outlined" style={styles.activityCard}>
            <SuiviText variant="body" color="secondary">
              {t('taskDetail.noActivity')}
            </SuiviText>
          </SuiviCard>
        )}
      </View>
      </View>
    </Screen>
  );
}

/**
 * Convertit une couleur hex en rgba avec opacité
 */
function addOpacityToColor(color: string, opacity: number): string {
  // Supprimer le # si présent
  const hex = color.replace('#', '');
  
  // Convertir en RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Retourner rgba
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Retourne les couleurs spécifiques pour un statut (pour TaskDetailScreen)
 * Supporte le dark mode avec des couleurs adaptées
 */
function getStatusColors(status: TaskStatus, isDark: boolean): { border: string; text: string; bg: string } {
  const opacity = isDark ? 0.15 : 0.12; // 15% en dark mode, 12% en light mode
  
  switch (status) {
    case 'in_progress': {
      const color = '#F38F20';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    case 'todo': {
      const color = '#4F46E5';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    case 'done': {
      const color = '#10B981';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    case 'blocked': {
      const color = '#EF4444';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    default: {
      const color = isDark ? '#E5E7EB' : '#6B7280';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
  }
}

/**
 * Retourne la couleur du statut d'une tâche
 */
function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return tokens.colors.brand.primary; // #4F5DFF
    case 'in_progress':
      return tokens.colors.accent.maize; // #FDD447
    case 'blocked':
      return tokens.colors.semantic.error; // #D32F2F
    case 'done':
      return tokens.colors.semantic.success; // #00C853
    default:
      return tokens.colors.neutral.medium; // #98928C
  }
}

/**
 * Formate un statut pour l'affichage avec i18n
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

/**
 * Formate une date pour l'affichage
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Convertit un actionType en SuiviActivityEventType
 */
function getEventTypeFromActionType(actionType: string): SuiviActivityEvent['eventType'] {
  switch (actionType) {
    case 'COMMENT':
      return 'TASK_CREATED'; // Approximation pour commentaire
    case 'APPROVAL':
      return 'TASK_COMPLETED'; // Approximation pour approbation
    case 'RATING':
    case 'PROGRESS':
    case 'WEATHER':
    case 'CALENDAR':
    case 'CHECKBOX':
    case 'SELECT':
      return 'TASK_REPLANNED'; // Approximation pour autres actions
    default:
      return 'TASK_CREATED';
  }
}

/**
 * Génère un titre d'activité depuis le résultat d'action
 * 
 * Utilise les clés i18n pour toutes les actions standardisées.
 * 
 * @see Les mêmes clés i18n seront utilisées pour l'API backend
 */
function getActivityTitle(actionType: string, details: Record<string, any>, t: any): string {
  switch (actionType) {
    case 'COMMENT':
      return t('activity.actions.comment_added', { comment: details.comment || t('quickActions.comment.label') });
    case 'APPROVAL':
      return details.decision === 'approved' 
        ? t('activity.actions.approval_approved') 
        : t('activity.actions.approval_rejected');
    case 'RATING':
      return t('activity.actions.rating', { rating: details.rating || 'N/A' });
    case 'PROGRESS':
      return t('activity.actions.progress', { progress: details.progress || 'N/A' });
    case 'WEATHER':
      return t('activity.actions.weather', { weather: details.weather || 'N/A' });
    case 'CALENDAR':
      return t('activity.actions.calendar', { date: details.date || 'N/A' });
    case 'CHECKBOX':
      return details.checked 
        ? t('activity.actions.checkbox_checked') 
        : t('activity.actions.checkbox_unchecked');
    case 'SELECT':
      return t('activity.actions.selected_option', { option: details.selectedOption || 'N/A' });
    default:
      return t('activity.actions.generic', { actionType });
  }
}

/**
 * Formate une date d'activité pour l'affichage
 * 
 * Utilise les clés i18n pour tous les timestamps relatifs.
 * 
 * @see Les mêmes clés i18n seront utilisées pour l'API backend
 */
function formatActivityDate(dateString: string, t: any): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('activity.timestamps.just_now');
    if (diffMins < 60) return t('activity.timestamps.minutes_ago', { count: diffMins });
    if (diffHours < 24) return t('activity.timestamps.hours_ago', { count: diffHours });
    if (diffDays === 1) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return t('activity.timestamps.yesterday', { time: `${hours}:${minutes}` });
    }
    if (diffDays < 7) return t('activity.timestamps.days_ago', { count: diffDays });
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: tokens.spacing.md,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  errorSubtext: {
    textAlign: 'center',
    marginTop: tokens.spacing.xs,
  },
  pagePadding: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
  },
  overviewTitle: {
    marginTop: tokens.spacing.lg + 14,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  taskTitleContainer: {
    marginTop: 4,
    marginBottom: tokens.spacing.lg + 10, // +10px en bas
  },
  taskTitleText: {
    fontSize: 22,
    fontWeight: '700',
  },
  statusSection: {
    marginBottom: tokens.spacing.lg,
  },
  statusCard: {
    marginBottom: tokens.spacing.md,
  },
  statusLabel: {
    marginBottom: tokens.spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  card: {
    marginBottom: tokens.spacing.lg,
  },
  descriptionRow: {
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
    marginBottom: tokens.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  },
  label: {
    width: 120,
    marginRight: tokens.spacing.md,
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: tokens.spacing.sm,
  },
  assigneeText: {
    flex: 1,
  },
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  quickActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  quickActionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -1,
  },
  quickActionSubtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: -4, // Ajustement pour être juste sous le titre
    marginBottom: 12,
  },
  detailsCard: {
    marginTop: 10, // 10px de marge au-dessus du bloc blanc
  },
  activityTimelineTitle: {
    marginTop: 14, // Réduit de ~10px (24 -> 14)
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 24,
    width: 2,
    height: '100%',
    backgroundColor: tokens.colors.border.default,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.brand.primary,
    marginRight: tokens.spacing.md,
    borderWidth: 3,
    borderColor: tokens.colors.background.default,
    zIndex: 1,
  },
  activityCard: {
    flex: 1,
    marginBottom: 0,
  },
  activityMeta: {
    marginTop: tokens.spacing.xs,
  },
  quickActionSection: {
    marginBottom: tokens.spacing.lg,
  },
});
