import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviButton } from '../components/ui/SuiviButton';
import { SuiviText } from '../components/ui/SuiviText';
import { TaskItem } from '../components/ui/TaskItem';
import { FilterChip } from '../components/ui/FilterChip';
import { useMyPriorities, useDueSoon, useRecentlyUpdated, useLate } from '../hooks/useTasks';
import { tokens } from '../theme';

type TasksNavigationProp = NativeStackNavigationProp<AppStackParamList>;

type FilterOption = 'all' | 'open' | 'late' | 'done';

/**
 * TasksScreen
 * 
 * Écran des tâches avec sections :
 * - My Priorities : Tâches prioritaires (todo + in_progress)
 * - Due Soon : Tâches dues bientôt (7 prochains jours)
 * - Recently Updated : Tâches récemment mises à jour
 * 
 * Filtres : All | Open | Late | Done
 * 
 * Toutes les données viennent des hooks React Query via les API mockées.
 */
export function TasksScreen() {
  const navigation = useNavigation<TasksNavigationProp>();
  const [filter, setFilter] = useState<FilterOption>('all');

  const { data: priorities, isLoading: isLoadingPriorities, isError: isErrorPriorities, error: errorPriorities, refetch: refetchPriorities } = useMyPriorities();
  const { data: dueSoon, isLoading: isLoadingDueSoon, isError: isErrorDueSoon, error: errorDueSoon, refetch: refetchDueSoon } = useDueSoon();
  const { data: recentlyUpdated, isLoading: isLoadingRecentlyUpdated, isError: isErrorRecentlyUpdated, error: errorRecentlyUpdated, refetch: refetchRecentlyUpdated } = useRecentlyUpdated();
  const { data: late, isLoading: isLoadingLate, isError: isErrorLate, error: errorLate, refetch: refetchLate } = useLate();

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  const renderFilterBar = () => {
    return (
      <View style={styles.filterBar}>
        <FilterChip
          label="All"
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={styles.filterChip}
        />
        <FilterChip
          label="Open"
          selected={filter === 'open'}
          onPress={() => setFilter('open')}
          style={styles.filterChip}
        />
        <FilterChip
          label="Late"
          selected={filter === 'late'}
          onPress={() => setFilter('late')}
          style={styles.filterChip}
        />
        <FilterChip
          label="Done"
          selected={filter === 'done'}
          onPress={() => setFilter('done')}
          style={styles.filterChip}
        />
      </View>
    );
  };

  const renderSection = (
    title: string,
    tasks: any[] | undefined,
    isLoading: boolean,
    isError: boolean,
    error: any,
    refetch: () => void,
  ) => {
    if (isLoading) {
      return (
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {title}
          </SuiviText>
          <View style={styles.skeletonContainer}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '60%', marginTop: tokens.spacing.xs }]} />
              </View>
            ))}
          </View>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {title}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="outlined" style={styles.errorCard}>
            <SuiviText variant="body" color="primary" style={styles.errorText}>
              {String(error?.message || 'Error loading tasks')}
            </SuiviText>
            <SuiviButton
              title="Retry"
              onPress={refetch}
              variant="ghost"
              style={styles.retryButton}
            />
          </SuiviCard>
        </View>
      );
    }

    if (!tasks || tasks.length === 0) {
      return (
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {title}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="outlined" style={styles.emptyCard}>
            <SuiviText variant="body" color="secondary" style={styles.emptyText}>
              No tasks found
            </SuiviText>
          </SuiviCard>
        </View>
      );
    }

    const filteredTasks = getFilteredTasks(tasks, filter);

    if (filteredTasks.length === 0) {
      return (
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {title}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="outlined" style={styles.emptyCard}>
            <SuiviText variant="body" color="secondary" style={styles.emptyText}>
              No tasks match this filter
            </SuiviText>
          </SuiviCard>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <SuiviText variant="h1" style={styles.sectionTitle}>
          {title}
        </SuiviText>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onPress={() => handleTaskPress(task.id)}
            style={styles.taskCard}
          />
        ))}
      </View>
    );
  };

  const getFilteredTasks = (tasks: any[], filterOption: FilterOption) => {
    switch (filterOption) {
      case 'all':
        return tasks;
      case 'open':
        return tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress' || t.status === 'blocked');
      case 'late':
        const today = new Date().toISOString().split('T')[0];
        return tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date(today) && t.status !== 'done');
      case 'done':
        return tasks.filter((t) => t.status === 'done');
      default:
        return tasks;
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Tasks" subtitle="Manage your tasks" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderFilterBar()}

        {renderSection('My Priorities', priorities, isLoadingPriorities, isErrorPriorities, errorPriorities, refetchPriorities)}
        {renderSection('Due Soon', dueSoon, isLoadingDueSoon, isErrorDueSoon, errorDueSoon, refetchDueSoon)}
        {renderSection('Recently Updated', recentlyUpdated, isLoadingRecentlyUpdated, isErrorRecentlyUpdated, errorRecentlyUpdated, refetchRecentlyUpdated)}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.md,
  },
  filterChip: {
    flex: 1,
  },
  section: {
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.md,
  },
  sectionTitle: {
    marginBottom: tokens.spacing.md,
  },
  taskCard: {
    marginBottom: tokens.spacing.md,
  },
  skeletonContainer: {
    gap: tokens.spacing.md,
  },
  skeletonCard: {
    backgroundColor: tokens.colors.background.default,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    height: 80,
  },
  skeletonLine: {
    backgroundColor: tokens.colors.neutral.light,
    borderRadius: tokens.radius.sm,
    height: 16,
    width: '80%',
  },
  emptyCard: {
    marginBottom: tokens.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
  },
  errorCard: {
    marginBottom: tokens.spacing.md,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  retryButton: {
    marginTop: tokens.spacing.sm,
  },
});

