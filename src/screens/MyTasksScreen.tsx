import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { FilterChip } from '../components/ui/FilterChip';
import { SuiviButton } from '../components/ui/SuiviButton';
import { SuiviText } from '../components/ui/SuiviText';
import { TaskItem } from '../components/ui/TaskItem';
import { QuickCaptureModal } from '../components/ui/QuickCaptureModal';
import { useTasksStore } from '../features/tasks/taskStore';
import type { Task, TaskStatus } from '../features/tasks/taskStore';
import { tokens } from '../theme';

type FilterOption = 'all' | 'active' | 'completed';

type MyTasksNavigationProp = NativeStackNavigationProp<AppStackParamList>;
type MyTasksRouteProp = RouteProp<MainTabParamList, 'MyTasks'>;

/**
 * MyTasksScreen (TasksScreen)
 * 
 * Liste des tâches avec :
 * - Filtres : All / Active / Completed
 * - Liste des tâches depuis le store (source unique de vérité)
 * - Empty State quand aucune tâche
 * - Action : Quick Capture
 * 
 * TODO: Replace useTasksStore() with real Suivi API calls when backend is ready.
 */
export function MyTasksScreen() {
  const navigation = useNavigation<MyTasksNavigationProp>();
  const route = useRoute<MyTasksRouteProp>();
  const initialFilter: FilterOption = route.params?.initialFilter ?? 'all';
  const [filter, setFilter] = useState<FilterOption>(initialFilter);
  const [quickCaptureVisible, setQuickCaptureVisible] = useState(false);

  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { tasks: allTasks } = useTasksStore();

  // Mettre à jour le filtre si le paramètre de route change
  useEffect(() => {
    if (route.params?.initialFilter) {
      setFilter(route.params.initialFilter);
    }
  }, [route.params?.initialFilter]);

  // Filtrer les tâches côté client selon le filtre sélectionné
  // Logique cohérente : active = todo, in_progress, blocked (tout sauf done)
  const visibleTasks = useMemo(() => {
    if (filter === 'completed') {
      return allTasks.filter((t) => t.status === 'done');
    }
    if (filter === 'active') {
      return allTasks.filter((t) => t.status === 'todo' || t.status === 'in_progress' || t.status === 'blocked');
    }
    // filter === 'all'
    return allTasks;
  }, [allTasks, filter]);

  // Ouvrir le modal Quick Capture
  const handleOpenQuickCapture = () => {
    setQuickCaptureVisible(true);
  };

  // Fermer le modal Quick Capture
  const handleCloseQuickCapture = () => {
    setQuickCaptureVisible(false);
  };

  // Après capture rapide, la liste se met à jour automatiquement via le store
  // TODO: When Suivi API is ready, trigger a refresh from API here if needed
  const handleQuickCaptureSuccess = () => {
    // Le store se met à jour automatiquement via quickCapture dans tasksApi.mock.ts
    // Plus tard, on pourra ajouter un refresh explicite si nécessaire
  };

  const renderFilterButton = (option: FilterOption, label: string) => {
    return (
      <FilterChip
        key={option}
        label={label}
        selected={filter === option}
        onPress={() => setFilter(option)}
      />
    );
  };

  const renderTaskItem = ({ item }: { item: any }) => {
    return (
      <TaskItem
        task={item}
        onPress={() => {
          navigation.navigate('TaskDetail', { taskId: item.id });
        }}
        style={styles.taskCard}
      />
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <SuiviText variant="h2" style={styles.emptyTitle}>
          No tasks found
        </SuiviText>
        <SuiviText variant="body" color="secondary" style={styles.emptyText}>
          Create your first task to get started
        </SuiviText>
        <View style={styles.emptyButton}>
          <SuiviButton
            title="Quick Capture"
            onPress={handleOpenQuickCapture}
            variant="primary"
          />
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <ScreenHeader title="My Tasks" />
      
      {/* Action bar with Quick Capture */}
      <View style={styles.actionBar}>
        <SuiviButton
          title="Quick Capture"
          onPress={handleOpenQuickCapture}
          variant="primary"
        />
      </View>

      {/* Filters */}
      <View style={styles.filterBar}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('active', 'Active')}
        {renderFilterButton('completed', 'Completed')}
      </View>

      {/* Task list or empty state */}
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={visibleTasks.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={visibleTasks.length === 0 ? renderEmptyState : null}
        refreshing={false}
        onRefresh={handleQuickCaptureSuccess}
      />

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        visible={quickCaptureVisible}
        onClose={handleCloseQuickCapture}
        onSuccess={handleQuickCaptureSuccess}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    marginBottom: tokens.spacing.md,
  },
  filterBar: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  listContent: {
    paddingBottom: tokens.spacing.md,
    flexGrow: 1,
  },
  emptyList: {
    flexGrow: 1,
  },
  taskCard: {
    marginBottom: tokens.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
  },
  emptyTitle: {
    marginBottom: tokens.spacing.sm,
  },
  emptyText: {
    marginBottom: tokens.spacing.lg,
    textAlign: 'center',
  },
  emptyButton: {
    width: '100%',
    maxWidth: 200,
  },
});

