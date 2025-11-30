import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';
import { Screen } from '@components/Screen';
import { AppHeader } from '@components/AppHeader';
import { TasksFilterControl } from '@components/ui/TasksFilterControl';
import { SuiviText } from '@components/ui/SuiviText';
import { SwipeableTaskItem } from '@components/tasks/SwipeableTaskItem';
import { AiBriefingButton } from '@components/ui/AiBriefingButton';
import { useMyWork } from '../hooks/useMyWork';
import { useTasksContext } from '../tasks/TasksContext';
import type { Task } from '../types/task';
import type { SectionName } from '../hooks/useMyWork';
import { tokens } from '@theme';

type FilterOption = 'active' | 'completed';

type MyTasksNavigationProp = NativeStackNavigationProp<AppStackParamList>;
type MyTasksRouteProp = RouteProp<MainTabParamList, 'MyTasks'>;

/**
 * MyTasksScreen (TasksScreen)
 * 
 * Liste des tâches avec :
 * - Filtres : Active / Completed
 * - Liste des tâches depuis useMyWork() (hook canonique)
 * - Empty State quand aucune tâche
 */
export function MyTasksScreen() {
  const navigation = useNavigation<MyTasksNavigationProp>();
  const route = useRoute<MyTasksRouteProp>();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.dark;
  const initialFilter: FilterOption = route.params?.initialFilter ?? 'active';
  const [filter, setFilter] = useState<FilterOption>(initialFilter);

  // Source unique de vérité pour les tâches - utilise le hook canonique useMyWork()
  const { tasks, tasksByStatus, sections, tasksBySection, isLoading, error, refresh } = useMyWork();
  
  // Couleur du pull-to-refresh (blanc en dark mode, primary en light mode)
  const refreshColor = isDark ? tokens.colors.text.dark.primary : tokens.colors.brand.primary;
  
  // Contexte pour mettre à jour les tâches (swipe → done)
  const { updateTask } = useTasksContext();
  
  /**
   * Classifie une tâche par sa date d'échéance dans une section chronologique.
   * (Copie locale de la fonction dans useMyWork.ts pour éviter la dépendance)
   */
  const classifyTaskByDate = (task: Task): SectionName => {
    if (!task.dueDate) {
      return 'noDate';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    
    const taskDate = new Date(task.dueDate + 'T00:00:00');
    taskDate.setHours(0, 0, 0, 0);
    
    // Aujourd'hui
    if (task.dueDate === todayStr) {
      return 'today';
    }
    
    // Overdue (strictement avant aujourd'hui, excluant les tâches "done")
    if (taskDate < today && task.status !== 'done') {
      return 'overdue';
    }
    
    // Calculer la différence en jours
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // This week (1-7 jours)
    if (diffDays >= 1 && diffDays <= 7) {
      return 'thisWeek';
    }
    
    // Next week (8-14 jours)
    if (diffDays >= 8 && diffDays <= 14) {
      return 'nextWeek';
    }
    
    // Later (> 14 jours)
    return 'later';
  };
  
  // Mémoriser les sections filtrées selon le filtre actuel
  // Recalcule automatiquement quand tasks ou filter change
  const filteredSections = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        overdue: [],
        today: [],
        thisWeek: [],
        nextWeek: [],
        later: [],
        noDate: [],
      };
    }
    
    const filtered = tasksByStatus(filter);
    const result: Record<SectionName, Task[]> = {
      overdue: [],
      today: [],
      thisWeek: [],
      nextWeek: [],
      later: [],
      noDate: [],
    };
    
    filtered.forEach((task) => {
      const section = classifyTaskByDate(task);
      result[section].push(task);
    });
    
    return result;
  }, [tasks, filter, tasksByStatus]);

  // État collapsible pour les sections
  const [collapsedSections, setCollapsedSections] = useState<Record<SectionName, boolean>>({
    overdue: false,
    today: false,
    thisWeek: false,
    nextWeek: false,
    later: false,
    noDate: false,
  });

  const toggleSection = (sectionName: SectionName) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  // Labels des sections
  const SECTION_LABELS: Record<SectionName, string> = {
    overdue: t('tasks.sections.overdue'),
    today: t('tasks.sections.today'),
    thisWeek: t('tasks.sections.thisWeek'),
    nextWeek: t('tasks.sections.nextWeek'),
    later: t('tasks.sections.later'),
    noDate: t('tasks.sections.noDate'),
  };

  // Ordre d'affichage des sections
  const ORDER: SectionName[] = [
    'overdue',
    'today',
    'thisWeek',
    'nextWeek',
    'later',
    'noDate',
  ];

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

  // Mémoriser le header de date (recalcule uniquement si la langue change)
  const dateHeader = useMemo(() => formatDateHeader(), [i18n.language]);


  const renderSection = (sectionName: SectionName) => {
    // Utiliser les sections filtrées mémorisées (recalculées automatiquement quand tasks ou filter change)
    const sectionTasks = filteredSections[sectionName] || [];
    
    // Masquer les sections vides
    if (sectionTasks.length === 0) {
      return null;
    }
    
    const isCollapsed = collapsedSections[sectionName];
    
    return (
      <View key={sectionName}>
        {/* Header de section */}
        <Pressable
          onPress={() => toggleSection(sectionName)}
          style={styles.sectionHeader}
        >
          <SuiviText variant="h2" style={styles.sectionTitle}>
            {SECTION_LABELS[sectionName]}
          </SuiviText>
          <MaterialCommunityIcons
            name={isCollapsed ? 'chevron-down' : 'chevron-up'}
            size={24}
            color={tokens.colors.text.secondary}
          />
        </Pressable>
        
        {/* Séparateur */}
        <View
          style={[
            styles.sectionSeparator,
            {
              backgroundColor: isDark
                ? tokens.colors.border.darkMode.default
                : tokens.colors.border.default,
            },
          ]}
        />
        
        {/* Tâches de la section (si non collapsed) */}
        {!isCollapsed && (
          <View style={styles.sectionContent}>
            {sectionTasks.map((task) => (
              <SwipeableTaskItem
                key={task.id}
                task={task}
                onPress={() => {
                  navigation.navigate('TaskDetail', { taskId: task.id });
                }}
                onDone={() => {
                  updateTask(task.id, { status: 'done' });
                }}
                style={styles.taskCard}
              />
            ))}
          </View>
        )}
      </View>
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
        <TasksFilterControl
          variant="fullWidth"
          value={filter}
          onChange={(newValue) => setFilter(newValue as FilterOption)}
        />
      </View>

      {/* Task list with sections */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={refresh}
            tintColor={refreshColor}
            colors={[refreshColor]}
          />
        }
      >
        {ORDER.map((sectionName) => renderSection(sectionName))}
        
        {/* Empty state si aucune tâche */}
        {tasks.length === 0 && !isLoading && renderEmptyState()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateTitleHeader: {
    paddingHorizontal: tokens.spacing.lg,
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
    width: '100%',
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
  },
  sectionTitle: {
    flex: 1,
  },
  sectionSeparator: {
    height: 1,
    marginHorizontal: tokens.spacing.lg,
  },
  sectionContent: {
    // paddingHorizontal supprimé car déjà géré par scrollContent
    paddingTop: tokens.spacing.sm,
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

