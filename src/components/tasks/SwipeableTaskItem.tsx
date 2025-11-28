/**
 * SwipeableTaskItem
 * 
 * Composant qui wrap TaskItem avec une fonctionnalité de swipe pour marquer une tâche comme "done".
 * 
 * Fonctionnalités :
 * - Swipe du bord droit vers le bord gauche (swipe LEFT) pour révéler l'action "Done"
 * - Appelle onDone() quand le swipe est complété (direction === 'right')
 * - Fallback Web : retourne TaskItem directement (swipe non supporté)
 * - Utilise exclusivement tokens.* pour les styles
 * 
 * Usage :
 *   <SwipeableTaskItem
 *     task={task}
 *     onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
 *     onDone={() => updateTask(task.id, { status: 'done' })}
 *   />
 */

import React, { useRef } from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TaskItem } from '../ui/TaskItem';
import { SuiviText } from '../ui/SuiviText';
import type { Task } from '../../types/task';
import { tokens } from '@theme';

export interface SwipeableTaskItemProps {
  task: Task;
  onPress?: () => void;
  onDone: () => void;
  style?: ViewStyle;
}

/**
 * SwipeableTaskItem
 * 
 * Wrapper de TaskItem avec fonctionnalité de swipe pour marquer comme "done".
 * Swipe du bord droit vers le bord gauche (swipe LEFT).
 * Sur Web, retourne simplement TaskItem (swipe non supporté).
 */
export function SwipeableTaskItem({
  task,
  onPress,
  onDone,
  style,
}: SwipeableTaskItemProps) {
  const { t } = useTranslation();
  const swipeableRef = useRef<Swipeable>(null);
  const hasCompletedRef = useRef(false);

  // Fallback Web : retourner TaskItem directement
  if (Platform.OS === 'web') {
    return <TaskItem task={task} onPress={onPress} style={style} />;
  }

  /**
   * Gère l'ouverture complète du swipe
   * Appelle onDone() une seule fois pour éviter les doubles appels
   * Uniquement si direction === 'right' (swipe du bord droit vers la gauche)
   */
  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    if (direction === 'right' && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onDone();
      // Fermer le swipe après l'action
      setTimeout(() => {
        swipeableRef.current?.close();
        hasCompletedRef.current = false;
      }, 300);
    }
  };

  /**
   * Render l'action "Done" révélée lors du swipe (du bord droit vers la gauche)
   */
  const renderRightActions = () => {
    return (
      <View style={styles.rightAction}>
        <View style={styles.rightActionContent}>
          <View style={styles.rightActionTextContainer}>
            <SuiviText variant="body" style={styles.rightActionText}>
              {t('tasks.status.done')}
            </SuiviText>
          </View>
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={tokens.colors.text.onPrimary}
          />
        </View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleSwipeableOpen}
      rightThreshold={40}
      overshootRight={false}
    >
      <TaskItem task={task} onPress={onPress} style={style} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    flex: 1,
    backgroundColor: tokens.colors.semantic.success,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.md,
    minWidth: tokens.spacing.xxl * 6,
  },
  rightActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 80,
  },
  rightActionTextContainer: {
    marginRight: tokens.spacing.sm,
  },
  rightActionText: {
    color: tokens.colors.text.onPrimary,
  },
});

