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
 * - Project name en texte secondaire
 * - Radius : radius.lg (16px)
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */
export function TaskItem({ task, onPress, style }: TaskItemProps) {
  const statusColor = getStatusColor(task.status);

  return (
    <View style={[styles.cardWrapper, style]}>
      <View style={styles.statusLineWrapper}>
        <View
          style={[
            styles.liseret,
            { backgroundColor: statusColor },
          ]}
        />
      </View>

      <SuiviCard
        padding="xs"
        elevation="card"
        variant="default"
        onPress={onPress}
        noShadow={true}
        style={styles.cardNoPadding}
      >
        <View style={styles.innerContent}>
          <View style={styles.horizontalRow}>
            <View style={styles.titleSection}>
              <SuiviText variant="body">
                {task.title}
              </SuiviText>
              {task.projectName && (
                <SuiviText
                  variant="body2"
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
        </View>
      </SuiviCard>
    </View>
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
  cardWrapper: {
    position: 'relative',
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  cardNoPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  statusLineWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    zIndex: 2,
    overflow: 'hidden',
  },
  liseret: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: tokens.radius.lg,
    borderBottomLeftRadius: tokens.radius.lg,
  },
  innerContent: {
    padding: tokens.spacing.md,
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


