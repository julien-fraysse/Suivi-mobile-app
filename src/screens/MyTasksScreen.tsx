import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { AppHeader } from '../components/AppHeader';
import { TasksFilterControl } from '../components/ui/TasksFilterControl';
import { SuiviText } from '../components/ui/SuiviText';
import { TaskItem } from '../components/ui/TaskItem';
import { AiBriefingButton } from '../components/ui/AiBriefingButton';
import { useTasks } from '../tasks/useTasks';
import type { Task, TaskFilter } from '../tasks/tasks.types';
import { tokens } from '../theme';

type FilterOption = 'all' | 'active' | 'completed';

type MyTasksNavigationProp = NativeStackNavigationProp<AppStackParamList>;
type MyTasksRouteProp = RouteProp<MainTabParamList, 'MyTasks'>;

/**
 * MyTasksScreen (TasksScreen)
 * 
 * Liste des tâches avec :
 * - Filtres : All / Active / Completed
 * - Liste des tâches depuis useTasks() (source unique de vérité)
 * - Empty State quand aucune tâche
 * 
 * TODO: Replace useTasks() with real Suivi API calls when backend is ready.
 */
export function MyTasksScreen() {
  const navigation = useNavigation<MyTasksNavigationProp>();
  const route = useRoute<MyTasksRouteProp>();
  const { t, i18n } = useTranslation();
  const initialFilter: FilterOption = route.params?.initialFilter ?? 'all';
  const [filter, setFilter] = useState<FilterOption>(initialFilter);

  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { tasks: visibleTasks, isLoading, error, refresh } = useTasks(filter);

  // Mettre à jour le filtre si le paramètre de route change
  useEffect(() => {
    if (route.params?.initialFilter) {
      setFilter(route.params.initialFilter);
    }
  }, [route.params?.initialFilter]);

  // Formater la date du jour selon la locale de l'app (ex: "MERCREDI 19 NOVEMBRE" ou "WEDNESDAY 19 NOVEMBER")
  const formatDateHeader = (): string => {
    const today = new Date();
    // Mapper la locale i18n vers la locale JavaScript
    const appLocale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
    const dayName = today.toLocaleDateString(appLocale, { weekday: 'long' });
    const day = today.getDate();
    const monthName = today.toLocaleDateString(appLocale, { month: 'long' });
    return `${dayName.toUpperCase()} ${day} ${monthName.toUpperCase()}`;
  };

  const dateHeader = formatDateHeader();


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
      </View>
    );
  };

  return (
    <Screen>
      <AppHeader />
      
      {/* Date and Title Header */}
      <View style={styles.dateTitleHeader}>
        <SuiviText variant="label" color="secondary" style={styles.dateText}>
          {dateHeader}
        </SuiviText>
        <SuiviText variant="h1" style={styles.titleText}>
          {t('tasks.title')}
        </SuiviText>
      </View>
      
      {/* AI Daily Briefing Button */}
      <AiBriefingButton
        onPress={() => {
          // TODO: When Suivi API is ready, navigate to BriefingScreen
          // navigation.navigate('Briefing', { date: new Date() });
        }}
        style={styles.aiButtonContainer}
      />
      
      {/* Filters */}
      <View style={styles.filterBar}>
        <View style={{ alignSelf: 'flex-start', marginTop: 12 }}>
          <TasksFilterControl
            value={filter}
            onChange={(newValue) => setFilter(newValue as FilterOption)}
          />
        </View>
      </View>

      {/* Task list or empty state */}
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={visibleTasks.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={visibleTasks.length === 0 && !isLoading ? renderEmptyState : null}
        refreshing={isLoading}
        onRefresh={refresh}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateTitleHeader: {
    marginBottom: tokens.spacing.lg,
  },
  dateText: {
    marginBottom: tokens.spacing.xs,
    textTransform: 'uppercase',
  },
  titleText: {
    // fontWeight est déjà géré par variant="h1" (Inter_600SemiBold)
  },
  aiButtonContainer: {
    marginBottom: tokens.spacing.lg,
  },
  filterBar: {
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
});

