import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from './SuiviCard';
import { SuiviText } from './SuiviText';
import type { Task, TaskStatus } from '../../types/task';
import { tokens } from '@theme';

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
  const statusColor = getStatusColor(task.status);

  console.log("TASKITEM QA", task.quickActions);

  return (
    <SuiviCard
      padding="md"
      elevation="card"
      variant="default"
      onPress={onPress}
      style={style}
    >
      <View style={styles.horizontalRow}>
        {/* Status dot (8px) */}
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />

        {/* Title + Project (flex: 1) */}
        <View style={styles.titleSection}>
          <SuiviText variant="body">
            {task.title}
          </SuiviText>
          {task.projectName && (
            <SuiviText variant="body2" color="secondary" style={styles.projectText}>
              {task.projectName}
            </SuiviText>
          )}
        </View>

        {/* Due date (si présente) */}
        {task.dueDate && (
          <SuiviText variant="body2" color={getDueDateColor(task.dueDate)} style={styles.dueDateText}>
            {formatTaskDueDate(task.dueDate)}
          </SuiviText>
        )}

        {/* Quick Action icon ou chevron */}
        {getQuickActionIcon(task.quickActions?.[0]?.type) || (
          <MaterialCommunityIcons name="chevron-right" size={20} color={tokens.colors.text.secondary} />
        )}
      </View>
    </SuiviCard>
  );
}

/**
 * Retourne la couleur du statut d'une tâche
 * Garantit toujours un string hex valide (#RRGGBB)
 */
function getStatusColor(status: TaskStatus): string {
  const fallbackColor = tokens.colors.neutral.medium; // Fallback safe
  const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked', 'cancelled'];
  
  // Guard initial : vérifier que status est valide
  if (!status || typeof status !== 'string' || !validStatuses.includes(status as TaskStatus)) {
    // Console.warn uniquement en DEV
    if (__DEV__) {
      console.warn('Invalid task.status received in TaskItem:', status);
    }
    return fallbackColor;
  }
  
  let color: string;
  switch (status) {
    case 'todo':
      color = tokens.colors.brand.primary; // Bleu
      break;
    case 'in_progress':
      color = '#FF6B35'; // Orange (couleur accent standard, pas de token disponible)
      break;
    case 'blocked':
      color = tokens.colors.semantic.error; // Rouge
      break;
    case 'done':
      color = tokens.colors.semantic.success; // Vert
      break;
    case 'cancelled':
      color = tokens.colors.neutral.medium; // Gris (utiliser neutral.medium au lieu de neutral[500])
      break;
    default:
      // Ce cas ne devrait jamais arriver grâce au guard initial, mais sécurité supplémentaire
      if (__DEV__) {
        console.warn('Invalid task.status received in TaskItem:', status);
      }
      return fallbackColor;
  }
  
  // Vérifier que la couleur est un string hex valide
  if (typeof color !== 'string' || !color.startsWith('#') || color.length !== 7) {
    return fallbackColor;
  }
  
  return color;
}


/**
 * Formate une date d'échéance pour l'affichage (format: "Nov 24, 2025")
 */
function formatTaskDueDate(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00'); // Ajouter l'heure pour éviter les problèmes de timezone
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Détermine la couleur de la due date selon son statut (overdue, today, other)
 */
function getDueDateColor(dueDate: string): 'error' | 'primary' | 'secondary' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  
  const taskDate = new Date(dueDate + 'T00:00:00');
  taskDate.setHours(0, 0, 0, 0);
  
  // Overdue (strictement avant aujourd'hui)
  if (taskDate < today) {
    return 'error'; // Rouge
  }
  
  // Due today
  if (dueDate === todayStr) {
    return 'primary'; // Violet
  }
  
  // Other (future)
  return 'secondary'; // Gris
}

/**
 * Retourne une icône MaterialCommunityIcons pour le type de Quick Action
 */
function getQuickActionIcon(actionType?: string): React.ReactElement | null {
  if (!actionType) {
    return null;
  }

  const iconConfig: { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string } = (() => {
    switch (actionType) {
      case 'COMMENT':
        return { name: 'message-text', color: tokens.colors.neutral.medium };
      case 'APPROVAL':
        return { name: 'check-circle', color: tokens.colors.semantic.success };
      case 'RATING':
        return { name: 'star', color: tokens.colors.accent.maize };
      case 'PROGRESS':
        return { name: 'speedometer', color: tokens.colors.brand.primary };
      case 'WEATHER':
        return { name: 'weather-cloudy', color: tokens.colors.neutral.medium };
      case 'CALENDAR':
        return { name: 'calendar', color: tokens.colors.brand.primary };
      case 'CHECKBOX':
        return { name: 'checkbox-marked', color: tokens.colors.semantic.success };
      case 'SELECT':
        return { name: 'menu-down', color: tokens.colors.neutral.medium };
      default:
        return { name: 'circle', color: tokens.colors.neutral.medium };
    }
  })();

  return (
    <MaterialCommunityIcons
      name={iconConfig.name}
      size={18}
      color={iconConfig.color}
    />
  );
}

const styles = StyleSheet.create({
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: tokens.spacing.sm,
  },
  titleSection: {
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  projectText: {
    marginTop: tokens.spacing.xs / 2,
  },
  dueDateText: {
    marginRight: tokens.spacing.sm,
  },
});


