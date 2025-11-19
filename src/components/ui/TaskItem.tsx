import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from './SuiviCard';
import { SuiviText } from './SuiviText';
import { Task, TaskStatus } from '../../api/tasks';
import { tokens } from '../../theme';

export interface TaskItemProps {
  task: Task;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * TaskItem
 * 
 * Composant pour afficher un item de tâche dans la liste.
 * 
 * Design :
 * - Utilise SuiviCard avec elevation card
 * - Typography Suivi (h2 pour titre, body2 pour détails)
 * - Status pill coloré selon le statut
 * - Project name et due date en texte secondaire
 * - Radius : radius.lg (16px)
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */
export function TaskItem({ task, onPress, style }: TaskItemProps) {
  const { t } = useTranslation();
  const statusColor = getStatusColor(task.status);

  return (
    <SuiviCard
      padding="md"
      elevation="card"
      variant="default"
      onPress={onPress}
      style={style}
    >
      {/* Header avec titre et statut */}
      <View style={styles.header}>
        <SuiviText variant="h2" style={styles.title}>
          {task.title}
        </SuiviText>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: statusColor,
            },
          ]}
        >
          <SuiviText variant="caption" color="inverse">
            {formatStatus(task.status, t)}
          </SuiviText>
        </View>
      </View>

      {/* Project name */}
      {task.projectName && (
        <SuiviText variant="body2" color="secondary" style={styles.projectName}>
          {task.projectName}
        </SuiviText>
      )}

      {/* Due date */}
      <SuiviText variant="body2" color="secondary">
        {task.dueDate
          ? `${t('tasks.due')}${formatDate(task.dueDate)}`
          : 'No due date'}
      </SuiviText>
    </SuiviCard>
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
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.xs,
  },
  title: {
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  statusPill: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
  },
  projectName: {
    marginBottom: tokens.spacing.xs,
  },
});


