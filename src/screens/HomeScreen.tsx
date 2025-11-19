import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { useTranslation } from 'react-i18next';
import { Screen } from '../components/Screen';
import { AppHeader } from '../components/AppHeader';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { SuiviButton } from '../components/ui/SuiviButton';
import { StatCard } from '../components/ui/StatCard';
import { SuiviText } from '../components/ui/SuiviText';
import { ActivityCard } from '../components/activity/ActivityCard';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { useActivityFeed } from '../hooks/useActivity';
import { useTasks } from '../tasks/useTasks';
import { tokens } from '../theme';
import type { SuiviActivityEvent } from '../types/activity';

type HomeNavigationProp = NativeStackNavigationProp<AppStackParamList>;

/**
 * Espacement vertical entre les cartes d'activité
 * Ajustez cette valeur pour modifier l'espacement entre les cartes (en pixels)
 */
const ACTIVITY_CARD_SPACING = 4;

/**
 * HomeScreen
 * 
 * Écran d'accueil avec :
 * - Quick Actions : Statistiques rapides (calculées depuis useTasks avec helpers de filtre)
 * - Activity Feed : Fil d'activité récent (useActivityFeed)
 * 
 * Note : Les filtres de tâches sont disponibles sur l'écran Tasks, pas sur Home.
 * 
 * Toutes les données viennent de api.ts (mocks pour l'instant).
 */

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  
  const [filter, setFilter] = useState<'all' | 'board' | 'portal'>('all');
  const [limit, setLimit] = useState(5);
  
  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { tasks: allTasks } = useTasks('all');
  
  // Calculer les statistiques depuis les tâches
  const activeCount = useMemo(() => {
    return allTasks.filter((t) => t.status !== 'done').length;
  }, [allTasks]);

  const dueTodayCount = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    return allTasks.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = t.dueDate.split('T')[0]; // Comparer uniquement la date (ignore l'heure)
      return taskDate === todayStr;
    }).length;
  }, [allTasks]);

  // Données activité depuis api.ts via hooks
  const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities } = useActivityFeed(50);

  /**
   * Réordonne les activités pour que la première soit un board si disponible
   */
  const reorderActivitiesToStartWithBoard = (list: SuiviActivityEvent[]): SuiviActivityEvent[] => {
    if (!list || list.length === 0) return list;
    
    const boards = list.filter((a) => a.eventType.startsWith('BOARD_'));
    const others = list.filter((a) => !a.eventType.startsWith('BOARD_'));
    
    if (boards.length > 0) {
      // Mettre le premier board en premier, puis les autres activités
      return [boards[0], ...others, ...boards.slice(1)];
    }
    
    return list;
  };

  // Réordonner les activités pour commencer par un board si disponible
  const orderedActivities = useMemo(() => {
    if (!activities) return [];
    return reorderActivitiesToStartWithBoard(activities);
  }, [activities]);

  // Filtrer les activités selon le filtre actif
  const filteredActivities = useMemo(() => {
    if (!orderedActivities || orderedActivities.length === 0) return [];
    
    switch (filter) {
      case 'board':
        return orderedActivities.filter((a) => a.eventType.startsWith('BOARD_'));
      case 'portal':
        return orderedActivities.filter((a) => a.eventType.startsWith('PORTAL_'));
      default:
        return orderedActivities;
    }
  }, [orderedActivities, filter]);

  // Calculer les activités visibles avec pagination
  const visibleActivities = filteredActivities.slice(0, limit);

  // Navigation vers les tâches actives
  const handleViewActiveTasks = () => {
    navigation.navigate('Main', { screen: 'MyTasks', params: { initialFilter: 'active' } });
  };

  // Navigation vers les tâches dues aujourd'hui
  // NOTE: For now we just open the Active filter.
  // TODO: when Suivi backend exposes a "due today" view, wire it here.
  const handleViewDueToday = () => {
    navigation.navigate('Main', { screen: 'MyTasks', params: { initialFilter: 'active' } });
  };

  // Handler pour la recherche (prêt pour intégration future avec les APIs Suivi)
  const handleSearch = (query: string) => {
    // TODO: wire this search to real Suivi APIs (tasks, notifications, boards) later.
    console.log('Search query:', query);
  };


  return (
    <Screen>
      <AppHeader />
      <HomeSearchBar onSearch={handleSearch} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* What's new - Statistiques calculées depuis useTasks() avec helpers de filtre partagés */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('home.whatsNew')}
          </SuiviText>
          <View style={styles.tileRow}>
            <StatCard
              title={t('home.activeTasks')}
              value={activeCount}
              color="primary"
              onPress={handleViewActiveTasks}
              style={styles.tile}
            />
            <StatCard
              title={t('home.dueToday')}
              value={dueTodayCount}
              color="accent"
              onPress={handleViewDueToday}
              style={styles.tile}
            />
          </View>
        </View>

        {/* Activités récentes */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('home.recentActivities')}
          </SuiviText>

          {isLoadingActivities ? (
            <View style={styles.activityPreview}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, { width: '60%', marginTop: tokens.spacing.xs }]} />
            </View>
          ) : isErrorActivities ? (
            <View style={styles.activityPreview}>
              <SuiviText variant="body" color="secondary">
                {t('home.errorLoading')}
              </SuiviText>
            </View>
          ) : (
            <>
              {/* Filtres Material 3 - toujours visibles */}
              <View style={styles.filtersContainer}>
                <View style={{ alignSelf: 'flex-start', marginBottom: tokens.spacing.md }}>
                  <SegmentedControl
                    options={[
                      { key: 'all', label: t('home.filters.all') },
                      { key: 'board', label: t('home.filters.boards') },
                      { key: 'portal', label: t('home.filters.portals') },
                    ]}
                    value={filter}
                    onChange={(newValue) => {
                      setFilter(newValue as 'all' | 'board' | 'portal');
                      setLimit(5);
                    }}
                  />
                </View>
              </View>

              {/* Liste d'activités */}
              {filteredActivities.length === 0 ? (
                <View style={styles.activityPreview}>
                  <SuiviText variant="body" color="secondary" style={styles.emptyText}>
                    {t('home.noActivities')}
                  </SuiviText>
                </View>
              ) : (
                <View style={styles.fullListContainer}>
                  {visibleActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      event={activity}
                      onPress={(event) => navigation.navigate('ActivityDetail', { eventId: event.id })}
                      style={styles.activityCard}
                    />
                  ))}
                </View>
              )}

              {/* Bouton "Voir plus d'activités" */}
              {filteredActivities.length > limit && (
                <SuiviButton
                  title={t('home.viewMore')}
                  onPress={() => setLimit(limit + 5)}
                  variant="ghost"
                  fullWidth
                  style={styles.viewMoreButton}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    marginBottom: tokens.spacing.md,
  },
  loadingContainer: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
  },
  skeletonContainer: {
    gap: tokens.spacing.md,
  },
  skeletonCard: {
    backgroundColor: tokens.colors.background.default,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    height: 100,
  },
  skeletonLine: {
    backgroundColor: tokens.colors.neutral.light,
    borderRadius: tokens.radius.sm,
    height: 16,
    width: '80%',
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
  emptyCard: {
    marginBottom: tokens.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
  },
  tileRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  tile: {
    flex: 1,
  },
  card: {
    marginBottom: tokens.spacing.md,
  },
  cardTitle: {
    marginBottom: tokens.spacing.xs,
  },
  filtersContainer: {
    marginTop: 4, // Espacement réduit entre le titre et les filtres
  },
  activityCard: {
    marginBottom: ACTIVITY_CARD_SPACING,
  },
  activityPreview: {
    marginBottom: tokens.spacing.md,
  },
  viewMoreButton: {
    marginTop: tokens.spacing.md,
  },
  fullListContainer: {
    gap: tokens.spacing.md,
  },
});
