import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviButton } from '../components/ui/SuiviButton';
import { StatCard } from '../components/ui/StatCard';
import { SuiviText } from '../components/ui/SuiviText';
import { QuickCaptureModal } from '../components/ui/QuickCaptureModal';
import { useActivityFeed } from '../hooks/useActivity';
import { useTasksStore } from '../features/tasks/taskStore';
import { tokens } from '../theme';

type HomeNavigationProp = NativeStackNavigationProp<AppStackParamList>;

/**
 * HomeScreen
 * 
 * Écran d'accueil avec :
 * - Quick Actions : Statistiques rapides (calculées depuis useTasks avec helpers de filtre)
 * - Activity Feed : Fil d'activité récent (useActivityFeed)
 * - Actions : Quick Capture (inbox mobile) et View All Tasks
 * 
 * Note : Les filtres de tâches sont disponibles sur l'écran Tasks, pas sur Home.
 * Les tâches complexes sont créées côté desktop. Le mobile permet uniquement
 * une capture rapide (Quick Capture) pour l'inbox mobile.
 * 
 * Toutes les données viennent de api.ts (mocks pour l'instant).
 */
export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const [quickCaptureVisible, setQuickCaptureVisible] = useState(false);
  
  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { stats } = useTasksStore();
  const { activeCount, dueTodayCount } = stats;

  // Données activité depuis api.ts via hooks
  const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities, error: errorActivities, refetch: refetchActivities } = useActivityFeed(5);

  // Navigation vers les tâches filtrées
  const handleViewAllTasks = () => {
    navigation.navigate('Main', { screen: 'MyTasks', params: { initialFilter: 'all' } });
  };

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
  
  // Après Quick Capture, rafraîchir les activités
  const handleQuickCaptureSuccess = () => {
    refetchActivities();
    // TODO: When Suivi API is ready, refresh tasks from API here if needed
  };

  // Ouvrir le modal Quick Capture
  const handleOpenQuickCapture = () => {
    setQuickCaptureVisible(true);
  };

  // Fermer le modal Quick Capture
  const handleCloseQuickCapture = () => {
    setQuickCaptureVisible(false);
  };

  return (
    <Screen>
      <ScreenHeader
        title="Home"
        subtitle="Welcome to Suivi"
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions - Statistiques calculées depuis useTasks() avec helpers de filtre partagés */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            Quick Actions
          </SuiviText>
          <View style={styles.tileRow}>
            <StatCard
              title="Active Tasks"
              value={activeCount}
              color="primary"
              onPress={handleViewActiveTasks}
              style={styles.tile}
            />
            <StatCard
              title="Due Today"
              value={dueTodayCount}
              color="accent"
              onPress={handleViewDueToday}
              style={styles.tile}
            />
          </View>
        </View>

        {/* Activity Feed - Fil d'activité depuis api.getActivityFeed() */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            Recent Activity
          </SuiviText>
          {isLoadingActivities ? (
            <View style={styles.skeletonContainer}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.skeletonCard}>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, { width: '60%', marginTop: tokens.spacing.xs }]} />
                </View>
              ))}
            </View>
          ) : isErrorActivities ? (
            <SuiviCard padding="md" elevation="card" variant="outlined" style={styles.errorCard}>
              <SuiviText variant="body" color="primary" style={styles.errorText}>
                {String(errorActivities?.message || 'Error loading activity')}
              </SuiviText>
              <SuiviButton
                title="Retry"
                onPress={() => refetchActivities()}
                variant="ghost"
                style={styles.retryButton}
              />
            </SuiviCard>
          ) : activities && activities.length > 0 ? (
            activities.map((activity) => (
              <SuiviCard
                key={activity.id}
                padding="md"
                elevation="card"
                variant="default"
                style={styles.card}
              >
                <SuiviText variant="h2" style={styles.cardTitle}>
                  {activity.message}
                </SuiviText>
                <SuiviText variant="body" color="secondary">
                  {activity.actor.name} • {formatActivityDate(activity.createdAt)}
                </SuiviText>
              </SuiviCard>
            ))
          ) : (
            <SuiviCard
              padding="md"
              elevation="card"
              variant="outlined"
              style={styles.card}
            >
              <SuiviText variant="body" color="secondary" style={styles.emptyText}>
                No recent activity
              </SuiviText>
            </SuiviCard>
          )}
        </View>

        {/* Calls to Action - Boutons d'action */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            Actions
          </SuiviText>
          
          <View style={styles.buttonRow}>
            <SuiviButton
              title="Quick Capture"
              onPress={handleOpenQuickCapture}
              variant="primary"
              fullWidth
            />
          </View>
          
          <View style={styles.buttonRow}>
            <SuiviButton
              title="View All Tasks"
              onPress={handleViewAllTasks}
              variant="ghost"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        visible={quickCaptureVisible}
        onClose={handleCloseQuickCapture}
        onSuccess={handleQuickCaptureSuccess}
      />
    </Screen>
  );
}

/**
 * Formate une date d'activité pour l'affichage
 */
function formatActivityDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
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
  buttonRow: {
    marginBottom: tokens.spacing.md,
  },
});
