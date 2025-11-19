import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { useTranslation } from 'react-i18next';
import { Screen } from '../components/Screen';
import { AppHeader } from '../components/AppHeader';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { SuiviText } from '../components/ui/SuiviText';
import { ActivityCard } from '../components/activity/ActivityCard';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { AIDailyPulseCard } from '../components/home/AIDailyPulseCard';
import { DailyKPIs } from '../components/home/DailyKPIs';
import { SeeMoreActivitiesButton } from '../components/ui/SeeMoreActivitiesButton';
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
  // Note: Les KPIs sont maintenant gérés par DailyKPIs component avec mock data
  // TODO: When Suivi API is ready, pass real data to DailyKPIs component

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


  // Handler pour la recherche (prêt pour intégration future avec les APIs Suivi)
  const handleSearch = (query: string) => {
    // TODO: wire this search to real Suivi APIs (tasks, notifications, boards) later.
    console.log('Search query:', query);
  };


  return (
    <Screen>
      <AppHeader />
      <View style={styles.searchBarWrapper}>
        <HomeSearchBar onSearch={handleSearch} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* AI Daily Pulse Card */}
        <View style={styles.pulseContainer}>
          <AIDailyPulseCard />
        </View>

        {/* Spacer */}
        <View style={{ height: 16 }} />

        {/* Daily KPIs */}
        <View style={styles.kpisContainer}>
          <DailyKPIs />
        </View>

        {/* Spacer */}
        <View style={{ height: 24 }} />

        {/* Activités récentes */}
        <View style={styles.section}>
          {/**
           * Titre de section "Activités récentes"
           * 
           * Standardisé pour utiliser exactement le même style que toutes
           * les sections de l'app (Mes Tâches, Notifications, etc.).
           * 
           * Le variant typographique provient des tokens Suivi :
           * - tokens.typography.h1 (Inter_600SemiBold, 22px)
           * - Couleur gérée automatiquement par SuiviText selon le thème
           * 
           * Header Row: Titre et filtres sur la même ligne
           * 
           * Pourquoi ce layout est meilleur:
           * - Gain d'espace vertical (titre et filtres sur une seule ligne)
           * - Meilleure utilisation de l'espace horizontal sur les grands écrans
           * - Alignement moderne et clean, conforme aux standards iOS/Android
           * - Filtres toujours visibles sans scroll
           * 
           * Composant utilisé: SegmentedControl (même composant que MyTasksScreen)
           * - Rendu visuel identique à "Mes Tâches" (Tous / Actives / Terminées)
           * - Design unifié dans toute l'application
           * 
           * Comment brancher les filtres réels demain via API:
           * - SegmentedControl appelle onChange qui met à jour le state local
           * - Pour l'API: remplacer setFilter par un appel API avec debounce
           * - Exemple: onChange={(value) => debouncedFetchActivities(value)}
           * - Les filtres backend seront: ?type=board, ?type=portal, ou sans param pour "all"
           * - Le state filter reste identique, seul le fetch change
           */}
          <View style={styles.headerRow}>
            <SuiviText variant="h1" style={styles.titleText}>
              {t('home.recentActivities')}
            </SuiviText>
            <View style={styles.filtersRow}>
              <SegmentedControl
                options={[
                  { key: 'all', label: t('home.filters.all') },
                  { key: 'board', label: t('home.filters.boards') },
                  { key: 'portal', label: t('home.filters.portals') },
                ]}
                value={filter}
                onChange={(key) => {
                  setFilter(key as 'all' | 'board' | 'portal');
                  setLimit(5);
                }}
              />
            </View>
          </View>

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
                <SeeMoreActivitiesButton
                  onPress={() => setLimit(limit + 5)}
                  label={t('home.viewMore')}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 0,
    width: '100%',
  },
  titleText: {
    // fontWeight est déjà géré par variant="h1" (Inter_600SemiBold)
    // fontSize, fontFamily, color sont également gérés par SuiviText selon le variant et le thème
    flexShrink: 1, // Permet au titre de se rétrécir si nécessaire dans le layout horizontal
  },
  filtersRow: {
    flexShrink: 0,
    alignItems: 'center',
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
  searchBarWrapper: {
    paddingHorizontal: tokens.spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  pulseContainer: {
    marginTop: tokens.spacing.md,
  },
  kpisContainer: {
    width: '100%',
  },
  card: {
    marginBottom: tokens.spacing.md,
  },
  cardTitle: {
    marginBottom: tokens.spacing.xs,
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
