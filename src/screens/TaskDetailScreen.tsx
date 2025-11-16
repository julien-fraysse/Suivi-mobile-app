import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviButton } from '../components/ui/SuiviButton';
import { SuiviText } from '../components/ui/SuiviText';
import { UserAvatar } from '../components/ui/UserAvatar';
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
  const { taskId } = route.params;
  
  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { task, isLoading: isLoadingTask, error: taskError } = useTaskById(taskId);
  const { updateStatus, isUpdating } = useUpdateTaskStatus();
  
  const { data: user } = useUser();
  const { data: taskActivities = [] } = useTaskActivity(taskId);

  // Status actuel de la tâche (dérivé du store)
  const taskStatus = task?.status;

  // Toggle du statut de la tâche
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
        <ScreenHeader
          title="Task Detail"
          showBackButton
          onBack={() => navigation.goBack()}
        />
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
        <ScreenHeader
          title="Task Detail"
          showBackButton
          onBack={() => navigation.goBack()}
        />
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
      <ScreenHeader
        title={task.title}
        subtitle={taskStatus ? formatStatus(taskStatus) : 'Unknown'}
        showBackButton
        onBack={() => navigation.goBack()}
      />

      {/* Status Selector */}
      <View style={styles.statusSection}>
        <SuiviCard padding="md" elevation="card" variant="default" style={styles.statusCard}>
          <SuiviText variant="label" color="secondary" style={styles.statusLabel}>
            Status
          </SuiviText>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: statusColor }]}
            onPress={() => {
              // Cycle through statuses: todo -> in_progress -> blocked -> done -> todo
              const statusOrder: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done'];
              const currentIndex = statusOrder.indexOf(taskStatus!);
              const nextIndex = (currentIndex + 1) % statusOrder.length;
              const newStatus = statusOrder[nextIndex];
              handleChangeStatus(newStatus);
            }}
            disabled={isUpdating}
          >
            <SuiviText variant="body" color="inverse">
              {formatStatus(taskStatus!)}
            </SuiviText>
            {isUpdating && (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.statusLoader} />
            )}
          </TouchableOpacity>
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
              Project/Board:
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
              Due Date:
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
              Assignee:
            </SuiviText>
            <View style={styles.assigneeContainer}>
              <UserAvatar
                firstName={task.assigneeName.split(' ')[0]}
                lastName={task.assigneeName.split(' ')[1] || ''}
                size="sm"
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
              Updated:
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
          Activity Timeline
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
              No activity yet
            </SuiviText>
          </SuiviCard>
        )}
      </View>
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
 * Formate un statut pour l'affichage
 */
function formatStatus(status: TaskStatus): string {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
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
  statusLoader: {
    marginLeft: tokens.spacing.sm,
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
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
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
