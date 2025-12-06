import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { Screen } from '@components/Screen';
import { AppHeader } from '@components/AppHeader';
import { HomeSearchBar } from '@components/HomeSearchBar';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviCard } from '@components/ui/SuiviCard';
import { ActivityCard } from '@components/activity/ActivityCard';
import { SegmentedControl } from '@components/ui/SegmentedControl';
import { AIDailyPulseCard } from '@components/home/AIDailyPulseCard';
import { SeeMoreActivitiesButton } from '@components/ui/SeeMoreActivitiesButton';
import { useActivityFeed } from '@hooks/useActivity';
import { tokens } from '@theme';
import type { SuiviActivityEvent } from '../types/activity';
import {
  useSearchResults,
  useSearchStatus,
  useSearchQuery,
  usePerformSearch,
  useClearSearch,
  useHasSearchQuery,
} from '../features/search/searchSelectors';
import type { SearchResult } from '../features/search/searchTypes';

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
 * - AI Daily Pulse Card : Résumé intelligent de la journée
 * - Activity Feed : Fil d'activité récent (useActivityFeed)
 * 
 * Note : Les filtres de tâches sont disponibles sur l'écran Tasks, pas sur Home.
 * 
 * Toutes les données viennent de api.ts (mocks pour l'instant).
 */

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.dark;
  
  const [filter, setFilter] = useState<'all' | 'tasks' | 'board' | 'portal'>('all');
  const [limit, setLimit] = useState(5);
  const [refreshing, setRefreshing] = useState(false);
  
  // Données activité depuis api.ts via hooks
  const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities, refetch: refetchActivities } = useActivityFeed(50);
  
  // Couleur du pull-to-refresh (blanc en dark mode, primary en light mode)
  const refreshColor = isDark ? tokens.colors.text.dark.primary : tokens.colors.brand.primary;
  
  // === SEARCH FEATURE ===
  const searchResults = useSearchResults();
  const searchStatus = useSearchStatus();
  const searchQuery = useSearchQuery();
  const performSearch = usePerformSearch();
  const clearSearch = useClearSearch();
  const hasSearchQuery = useHasSearchQuery();
  
  // State local pour l'input (UX immédiate)
  const [searchInputValue, setSearchInputValue] = useState('');
  
  // Ref pour le debounce (compatible React Native)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Debounce de 300ms pour la recherche
  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        clearSearch();
      }
    }, 300);
  }, [performSearch, clearSearch]);
  
  // Cleanup du debounce au démontage
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  // Handler pour le changement de query
  const handleSearchChange = useCallback((query: string) => {
    setSearchInputValue(query);
    debouncedSearch(query);
  }, [debouncedSearch]);
  
  // Handler pour la soumission (Enter ou tap sur icône)
  const handleSearchSubmit = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (query.trim()) {
      performSearch(query);
    }
  }, [performSearch]);
  
  // Navigation vers le résultat de recherche
  const handleSearchResultPress = useCallback((result: SearchResult) => {
    if (result.type === 'task' && result.taskId) {
      navigation.navigate('TaskDetail', { taskId: result.taskId });
    } else if (result.type === 'notification' && result.notificationId) {
      // TODO: Navigation vers NotificationDetail quand disponible
      // Pour l'instant, aller vers l'écran Notifications
      navigation.navigate('MainTabs', { screen: 'Notifications' });
    }
    // Pour les projets, pas de navigation pour l'instant (futur)
  }, [navigation]);

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
      case 'tasks':
        return orderedActivities.filter((a) => a.eventType.startsWith('TASK_') || a.eventType === 'OBJECTIVE_STATUS_CHANGED');
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

  // Fonction de refresh (pull-to-refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Recharger les activités via React Query (respecte API_MODE automatiquement)
      await refetchActivities();
    } catch (error) {
      console.error('Error refreshing activities:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Screen>
      <AppHeader />
      <View style={styles.searchBarWrapper}>
        <HomeSearchBar 
          value={searchInputValue}
          onChangeQuery={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={refreshColor}
            colors={[refreshColor]}
          />
        }
      >
        {/* === SEARCH RESULTS === */}
        {hasSearchQuery && (
          <View style={styles.section}>
            <View style={styles.titleContainer}>
              <SuiviText variant="h1">
                {t('search.results')}
              </SuiviText>
            </View>
            
            {searchStatus === 'loading' && (
              <View style={styles.searchStatusContainer}>
                <SuiviText variant="body" color="secondary">
                  {t('search.searching')}
                </SuiviText>
              </View>
            )}
            
            {searchStatus === 'success' && searchResults.length === 0 && (
              <View style={styles.searchStatusContainer}>
                <SuiviText variant="body" color="secondary">
                  {t('search.noResults', { query: searchQuery })}
                </SuiviText>
              </View>
            )}
            
            {searchStatus === 'success' && searchResults.length > 0 && (
              <View style={styles.searchResultsContainer}>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    onPress={() => handleSearchResultPress(result)}
                    activeOpacity={0.7}
                  >
                    <SuiviCard style={styles.searchResultCard}>
                      <View style={styles.searchResultContent}>
                        <View style={styles.searchResultHeader}>
                          <SuiviText 
                            variant="caption" 
                            color="secondary"
                            style={styles.searchResultType}
                          >
                            {t(`search.${result.type}s`)}
                          </SuiviText>
                        </View>
                        <SuiviText variant="body" numberOfLines={1}>
                          {result.title}
                        </SuiviText>
                        {result.subtitle && (
                          <SuiviText variant="caption" color="secondary" numberOfLines={1}>
                            {result.subtitle}
                          </SuiviText>
                        )}
                      </View>
                    </SuiviCard>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {searchStatus === 'error' && (
              <View style={styles.searchStatusContainer}>
                <SuiviText variant="body" color="secondary">
                  {t('home.errorLoading')}
                </SuiviText>
              </View>
            )}
          </View>
        )}
        
        {/* === CONTENU NORMAL (masqué si recherche active) === */}
        {!hasSearchQuery && (
          <>
            {/* AI Daily Pulse Card */}
            <View style={styles.pulseContainer}>
              <AIDailyPulseCard />
            </View>

            {/* KPI mock removed (placeholder until real API metrics) */}
          </>
        )}
        
        {/* Activités récentes (masquées si recherche active) */}
        {!hasSearchQuery && (
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
           * Layout vertical: Titre sur sa propre ligne, filtres en dessous
           * 
           * Pourquoi ce layout est meilleur pour mobile:
           * - Meilleure lisibilité sur petits écrans (titre et filtres séparés)
           * - Filtres full-width pour meilleure accessibilité tactile
           * - Alignement moderne et clean, conforme aux standards mobile
           * - Padding vertical augmenté pour meilleure ergonomie
           * 
           * Composant utilisé: SegmentedControl avec variant="fullWidth"
           * - Style Gemini 3 avec largeur pleine et padding vertical augmenté
           * - Design unifié dans toute l'application
           * 
           * Comment brancher les filtres réels demain via API:
           * - SegmentedControl appelle onChange qui met à jour le state local
           * - Pour l'API: remplacer setFilter par un appel API avec debounce
           * - Exemple: onChange={(value) => debouncedFetchActivities(value)}
           * - Les filtres backend seront: ?type=board, ?type=portal, ou sans param pour "all"
           * - Le state filter reste identique, seul le fetch change
           */}
          {/* Titre de section */}
          <View style={styles.titleContainer}>
            <SuiviText variant="h1">
              {t('home.recentActivities')}
            </SuiviText>
          </View>

          {/* Barre de filtres */}
          <View style={styles.filterBar}>
            <SegmentedControl
              variant="fullWidth"
              options={[
                { key: 'all', label: t('home.filters.all') },
                { key: 'tasks', label: t('home.filters.tasks') },
                { key: 'board', label: t('home.filters.boards') },
                { key: 'portal', label: t('home.filters.portals') },
              ]}
              value={filter}
              onChange={(key) => {
                setFilter(key as 'all' | 'tasks' | 'board' | 'portal');
                setLimit(5);
              }}
            />
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
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: tokens.spacing.xl,
  },
  titleContainer: {
    marginBottom: tokens.spacing.md,
  },
  filterBar: {
    marginBottom: tokens.spacing.lg,
    width: '100%',
  },
  // Search results styles
  searchStatusContainer: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
  },
  searchResultsContainer: {
    gap: tokens.spacing.sm,
  },
  searchResultCard: {
    marginBottom: tokens.spacing.xs,
  },
  searchResultContent: {
    padding: tokens.spacing.md,
  },
  searchResultHeader: {
    marginBottom: tokens.spacing.xs,
  },
  searchResultType: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    marginBottom: tokens.spacing.lg,
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
