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
 * - Utilise SuiviCard avec elevation="none" (pas de shadow)
 * - Liseret gauche via borderLeftWidth (4px) avec couleur selon le statut
 * - Radius : tokens.radius.lg (16px) - géré par SuiviCard
 * - Padding : tokens.spacing.md (12px) - géré par SuiviCard
 * - Typography Suivi (body pour titre, label pour projet)
 * - Project name en texte secondaire
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */
export function TaskItem({ task, onPress, style }: TaskItemProps) {
  const statusColor = getStatusColor(task.status);

  return (
    <SuiviCard
      onPress={onPress}
      elevation="none"
      variant="default"
      padding="md"
      style={[
        styles.card,
        {
          borderLeftWidth: 4,
          borderLeftColor: statusColor,
        },
        style,
      ]}
    >
      <View style={styles.horizontalRow}>
        <View style={styles.titleSection}>
          <SuiviText variant="body">
            {task.title}
          </SuiviText>
          {task.projectName && (
            <SuiviText
              variant="label"
              color="secondary"
              style={styles.projectText}
            >
              {task.projectName}
            </SuiviText>
          )}
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={tokens.colors.text.secondary}
        />
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

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.md,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  projectText: {
    marginTop: tokens.spacing.xs / 2,
  },
});


