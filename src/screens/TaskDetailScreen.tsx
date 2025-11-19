import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../components/Screen';
import { AppHeader } from '../components/AppHeader';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviText } from '../components/ui/SuiviText';
import { UserAvatar } from '../components/ui/UserAvatar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviStatusPicker } from '../components/ui/SuiviStatusPicker';
import { useTaskById } from '../tasks/useTaskById';
import { useUpdateTaskStatus } from '../tasks/useUpdateTaskStatus';
import type { TaskStatus } from '../tasks/tasks.types';
import { useTaskActivity } from '../hooks/useActivity';
import { useUser } from '../hooks/useUser';
import { tokens } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type TaskDetailRoute = RouteProp<AppStackParamList, 'TaskDetail'>;

/**
 * TaskDetailScreen
 * 
 * Détails d'une tâche avec :
 * - Détails complets de la tâche depuis useTaskById() (source unique de vérité)
 * - Status toggle qui met à jour via useUpdateTaskStatus() (synchronise avec MyTasksScreen et HomeScreen)
 * - Breadcrumb projet
 * - Assigned user (useUser)
 * - Section "Recent updates" (useActivityFeed filtré par taskId)
 * 
 * TODO: Replace useTaskById() and useUpdateTaskStatus() with real Suivi API calls when backend is ready.
 */
export function TaskDetailScreen() {
  const route = useRoute<TaskDetailRoute>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { taskId } = route.params;
  
  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { task, isLoading: isLoadingTask, error: taskError } = useTaskById(taskId);
  const { updateStatus, isUpdating } = useUpdateTaskStatus();
  
  const { data: user } = useUser();
  const { data: taskActivities = [] } = useTaskActivity(taskId);

  // Status actuel de la tâche (dérivé du store)
  const taskStatus = task?.status;

  // State for status picker visibility
  const [isStatusPickerVisible, setIsStatusPickerVisible] = useState(false);

  // Handle status change from picker
  // TODO: When Suivi API is ready, add error handling for failed API calls
  const handleChangeStatus = async (newStatus: TaskStatus) => {
    if (!taskId || !task || isUpdating) return;
    try {
      await updateStatus(taskId, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
      // TODO: Afficher une notification d'erreur à l'utilisateur
    }
  };

  // Loading state
  if (isLoadingTask) {
    return (
      <Screen>
        <AppHeader showBackButton onBack={() => navigation.goBack()} />
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
        <AppHeader showBackButton onBack={() => navigation.goBack()} />
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

  const statusColor = getStatusColor(taskStatus!);

  return (
    <Screen scrollable>
      <AppHeader showBackButton onBack={() => navigation.goBack()} />

      {/* Status Selector */}
      <View style={styles.statusSection}>
        <SuiviCard padding="md" elevation="card" variant="default" style={styles.statusCard}>
          <SuiviText variant="label" color="secondary" style={styles.statusLabel}>
            {t('taskDetail.status')}
          </SuiviText>
          <Pressable
            onPress={() => setIsStatusPickerVisible(true)}
            disabled={isUpdating}
            style={({ pressed }) => [
              styles.statusButton,
              {
                backgroundColor: `${statusColor}14`, // Fond très clair (~8% opacité)
                borderColor: statusColor,
                opacity: pressed ? 0.7 : 1,
                elevation: 2, // Ombre légère
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.12,
                shadowRadius: 2,
              },
            ]}
          >
            <View style={styles.statusButtonContent}>
              <SuiviText variant="body" style={{ color: statusColor, fontWeight: '500' }}>
                {formatStatus(taskStatus!, t)}
              </SuiviText>
              {isUpdating ? (
                <ActivityIndicator
                  size="small"
                  color={statusColor}
                  style={styles.statusButtonLoader}
                />
              ) : (
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={statusColor}
                />
              )}
            </View>
          </Pressable>
        </SuiviCard>
      </View>

      {/* Task Details Card */}
      <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
        {/* Description */}
        {task.description ? (
          <View style={styles.descriptionRow}>
            <SuiviText variant="body" color="primary">
              {task.description}
            </SuiviText>
          </View>
        ) : (
          <View style={styles.descriptionRow}>
            <SuiviText variant="body" color="secondary">
              No description
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

      {/* Activity Timeline Section */}
      <View style={styles.section}>
        <SuiviText variant="h1" style={styles.sectionTitle}>
          {t('taskDetail.activityTimeline')}
        </SuiviText>
        {taskActivities.length > 0 ? (
          taskActivities.map((activity, index) => (
            <View key={activity.id} style={styles.timelineItem}>
              {index < taskActivities.length - 1 && <View style={styles.timelineLine} />}
              <View style={styles.timelineDot} />
              <SuiviCard
                padding="md"
                elevation="sm"
                variant="default"
                style={styles.activityCard}
              >
                <SuiviText variant="body" color="primary">
                  {activity.actor.name} {activity.message} "{activity.target.name}"
                </SuiviText>
                <SuiviText variant="body" color="secondary" style={styles.activityMeta}>
                  {formatActivityDate(activity.createdAt)}
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

      {/* Status Picker Modal - Rendu à la fin pour être au-dessus de tout */}
      {taskStatus && (
        <SuiviStatusPicker
          visible={isStatusPickerVisible}
          onClose={() => setIsStatusPickerVisible(false)}
          currentStatus={taskStatus}
          onSelectStatus={handleChangeStatus}
        />
      )}
    </Screen>
  );
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
 * Formate une date d'activité pour l'affichage
 */
function formatActivityDate(dateString: string): string {
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
  statusSection: {
    marginBottom: tokens.spacing.lg,
  },
  statusCard: {
    marginBottom: tokens.spacing.md,
  },
  statusLabel: {
    marginBottom: tokens.spacing.sm,
  },
  statusButton: {
    paddingVertical: 14,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  statusButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  statusButtonLoader: {
    marginLeft: tokens.spacing.xs,
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
    marginBottom: tokens.spacing.md,
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
});
