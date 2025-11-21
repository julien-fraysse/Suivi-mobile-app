import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from './SuiviCard';
import { SuiviText } from './SuiviText';
import { Task, TaskStatus } from '../../api/tasks';
import { tokens } from '../../theme';
import { QuickActionPreview } from '../tasks/QuickActionPreview';

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
  const breadcrumb = "WORKSPACE > BOARD";

  return (
    <SuiviCard
      padding="md"
      elevation="card"
      variant="default"
      onPress={onPress}
      style={style}
    >
      {/* Catégorie et badge de statut en haut */}
      <View style={styles.topRow}>
        <SuiviText variant="label" color="secondary" style={styles.category}>
          {breadcrumb}
        </SuiviText>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: `${statusColor}20`, // Fond très clair (12% opacité)
              borderColor: statusColor,
            },
          ]}
        >
          <SuiviText variant="caption" style={{ color: statusColor }}>
            {formatStatus(task.status, t)}
          </SuiviText>
        </View>
      </View>

      {/* Titre */}
      <SuiviText variant="h2" style={styles.title}>
        {task.title}
      </SuiviText>

      {/* Due date avec icône calendrier */}
      {task.dueDate && (
        <View style={styles.dueDateRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={tokens.colors.neutral.medium}
            style={styles.calendarIcon}
          />
          <SuiviText variant="body2" color="secondary">
            {`${t('tasks.due')}${formatDate(task.dueDate)}`}
          </SuiviText>
        </View>
      )}

      {/* Quick Action Preview */}
      <QuickActionPreview actionType={task.quickAction?.actionType} />
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  category: {
    opacity: 0.7,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  statusPill: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs / 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  title: {
    marginBottom: tokens.spacing.sm,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tokens.spacing.xs,
  },
  calendarIcon: {
    marginRight: tokens.spacing.xs,
  },
});


