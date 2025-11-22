/**
 * RecentActivityModal Component
 * 
 * Modal pour afficher les activités récentes avec :
 * - Liste verticale de ActivityCard
 * - Tri anti-chronologique
 * - Grouping par date (Aujourd'hui, Hier, Cette semaine, Plus ancien)
 * - Filtres "Tous / Boards / Portails"
 * - Swipe-to-delete (suppression locale uniquement)
 * 
 * Logique de filtrage :
 * - Filtre "Tous" : affiche tous les événements (BOARD et PORTAL)
 * - Filtre "Boards" : affiche uniquement les événements avec source === 'BOARD'
 * - Filtre "Portails" : affiche uniquement les événements avec source === 'PORTAL'
 * 
 * Comportement de swipe :
 * - Swipe de droite à gauche sur une ActivityCard
 * - Affiche une action de suppression (rouge)
 * - Supprime l'événement du state local uniquement (pas de synchronisation backend)
 * - L'événement réapparaîtra au prochain chargement depuis l'API
 * 
 * Grouping par date :
 * - Utilise la fonction groupEventsByDate() pour grouper les événements
 * - Affiche les groupes dans l'ordre : Aujourd'hui, Hier, Cette semaine, Plus ancien
 * - Chaque groupe affiche son label et la liste des événements
 * 
 * Usage futur :
 * - Navigation vers le détail d'une activité via onSelect(event)
 * - Synchronisation avec le backend pour la suppression (TODO)
 * - Pagination si beaucoup d'activités (TODO)
 * - Marquer comme lu / non lu (TODO)
 * 
 * IMPORTANT :
 * - N'utilise QUE getRecentActivity() de src/api/activity.ts
 * - N'importe AUCUN hook legacy (useActivityFeed, etc.)
 * - N'utilise PAS ActivityItem (seulement SuiviActivityEvent)
 * - Gère son propre state local pour les événements
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { SuiviText } from '../ui/SuiviText';
import { FilterChip } from '../ui/FilterChip';
import { ActivityCard } from './ActivityCard';
import { getRecentActivity } from '../../api/activity';
import { tokens } from '@theme';
import type { SuiviActivityEvent } from '../../types/activity';

export interface RecentActivityModalProps {
  /** Contrôle la visibilité du modal */
  visible: boolean;
  /** Callback appelé lors de la fermeture du modal */
  onClose: () => void;
  /** Callback appelé lors de la sélection d'une activité (optionnel) */
  onSelect?: (event: SuiviActivityEvent) => void;
}

type FilterType = 'ALL' | 'BOARD' | 'PORTAL';

/**
 * RecentActivityModal
 * 
 * Modal slide-up pour afficher les activités récentes avec filtres et swipe-to-delete.
 */
function RecentActivityModal({
  visible,
  onClose,
  onSelect,
}: RecentActivityModalProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  // State pour les événements (chargés depuis l'API)
  const [events, setEvents] = useState<SuiviActivityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // State pour le filtre actif
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // Charger les activités quand le modal devient visible
  useEffect(() => {
    if (visible) {
      loadActivities();
    }
  }, [visible]);

  /**
   * Charge les activités depuis l'API
   * Utilise UNIQUEMENT getRecentActivity() de src/api/activity.ts
   */
  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const activities = await getRecentActivity(null, { limit: 50 });
      // Tri anti-chronologique (plus récent en premier)
      const sorted = [...activities].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setEvents(sorted);
    } catch (error) {
      console.error('Error loading recent activities:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filtre les événements selon le filtre actif
   * - "Tous" : tous les événements
   * - "Boards" : source === 'BOARD'
   * - "Portails" : source === 'PORTAL'
   */
  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'ALL') return true;
    return event.source === activeFilter;
  });

  /**
   * Groupe les événements par date
   */
  const groupedEvents = groupEventsByDate(filteredEvents);

  /**
   * Supprime un événement du state local (swipe-to-delete)
   * Ne touche PAS aux mocks ni au backend
   */
  const handleDelete = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }, []);

  /**
   * Gère le clic sur une ActivityCard
   * Appelle onSelect(event) si fourni, sinon log
   */
  const handleCardPress = useCallback(
    (event: SuiviActivityEvent) => {
      if (onSelect) {
        onSelect(event);
      } else {
        console.log('Activity selected:', event);
      }
    },
    [onSelect],
  );

  // Couleurs selon le thème
  const modalBackground = isDark
    ? tokens.colors.surface.darkElevated // #242424
    : tokens.colors.background.default; // #FFFFFF

  const headerBackground = isDark
    ? tokens.colors.surface.dark // #1A1A1A
    : tokens.colors.background.surface; // #F4F2EE

  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;

  const textColorSecondary = isDark
    ? tokens.colors.text.dark.secondary
    : tokens.colors.text.secondary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Content */}
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: modalBackground,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: headerBackground,
              },
            ]}
          >
            <View style={styles.headerText}>
              <SuiviText
                variant="h1"
                style={{
                  color: textColorPrimary,
                }}
              >
                Activités récentes
              </SuiviText>
              <SuiviText
                variant="body"
                color="secondary"
                style={{
                  color: textColorSecondary,
                  marginTop: tokens.spacing.xs,
                }}
              >
                Ce qui a bougé dans vos projets
              </SuiviText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={textColorSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Barre de filtres */}
          <View style={styles.filtersContainer}>
            <FilterChip
              label="Tous"
              selected={activeFilter === 'ALL'}
              onPress={() => setActiveFilter('ALL')}
              style={styles.filterChip}
            />
            <FilterChip
              label="Boards"
              selected={activeFilter === 'BOARD'}
              onPress={() => setActiveFilter('BOARD')}
              style={styles.filterChip}
            />
            <FilterChip
              label="Portails"
              selected={activeFilter === 'PORTAL'}
              onPress={() => setActiveFilter('PORTAL')}
              style={styles.filterChip}
            />
          </View>

          {/* Liste scrollable */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <SuiviText variant="body" color="secondary">
                  Chargement...
                </SuiviText>
              </View>
            ) : groupedEvents.length === 0 ? (
              <View style={styles.emptyContainer}>
                <SuiviText variant="body" color="secondary">
                  Aucune activité récente
                </SuiviText>
              </View>
            ) : (
              groupedEvents.map((group) => (
                <React.Fragment key={group.dateLabel}>
                  <View style={styles.dateGroup}>
                    {/* En-tête de groupe */}
                    <SuiviText
                      variant="label"
                      style={[
                        styles.dateLabel,
                        {
                          color: textColorSecondary,
                        },
                      ]}
                    >
                      {group.dateLabel}
                    </SuiviText>

                    {/* Liste des événements du groupe */}
                    {group.events.map((event) => (
                      <SwipeableActivityCard
                        key={event.id}
                        event={event}
                        onPress={() => handleCardPress(event)}
                        onDelete={() => handleDelete(event.id)}
                        isDark={isDark}
                      />
                    ))}
                  </View>
                </React.Fragment>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Composant interne pour ActivityCard avec swipe-to-delete
 */
interface SwipeableActivityCardProps {
  event: SuiviActivityEvent;
  onPress: () => void;
  onDelete: () => void;
  isDark: boolean;
}

function SwipeableActivityCard({
  event,
  onPress,
  onDelete,
  isDark,
}: SwipeableActivityCardProps) {
  /**
   * Render l'action de suppression (affichée lors du swipe)
   */
  const renderRightAction = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={onDelete}
        style={[
          styles.deleteAction,
          {
            backgroundColor: tokens.colors.semantic.error, // #D32F2F
          },
        ]}
      >
        <Animated.View
          style={[
            styles.deleteActionContent,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color="#FFFFFF"
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightAction}
      rightThreshold={40}
      overshootRight={false}
    >
      <ActivityCard event={event} onPress={onPress} style={styles.activityCard} />
    </Swipeable>
  );
}

/**
 * Interface pour un groupe d'événements par date
 */
interface DateGroup {
  dateLabel: string;
  events: SuiviActivityEvent[];
}

/**
 * Groupe les événements par date (Aujourd'hui, Hier, Cette semaine, Plus ancien)
 */
function groupEventsByDate(events: SuiviActivityEvent[]): DateGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: Record<string, SuiviActivityEvent[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  events.forEach((event) => {
    const eventDate = new Date(event.createdAt);
    const eventDateOnly = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
    );

    if (eventDateOnly.getTime() === today.getTime()) {
      groups.today.push(event);
    } else if (eventDateOnly.getTime() === yesterday.getTime()) {
      groups.yesterday.push(event);
    } else if (eventDate >= weekAgo) {
      groups.thisWeek.push(event);
    } else {
      groups.older.push(event);
    }
  });

  // Construire le tableau de groupes avec labels
  const result: DateGroup[] = [];

  if (groups.today.length > 0) {
    result.push({
      dateLabel: 'Aujourd\'hui',
      events: groups.today,
    });
  }

  if (groups.yesterday.length > 0) {
    result.push({
      dateLabel: 'Hier',
      events: groups.yesterday,
    });
  }

  if (groups.thisWeek.length > 0) {
    result.push({
      dateLabel: 'Cette semaine',
      events: groups.thisWeek,
    });
  }

  if (groups.older.length > 0) {
    result.push({
      dateLabel: 'Plus ancien',
      events: groups.older,
    });
  }

  return result;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : tokens.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  },
  headerText: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  closeButton: {
    padding: tokens.spacing.xs,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  filterChip: {
    flex: 0,
    minWidth: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.lg,
  },
  loadingContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
  },
  dateGroup: {
    marginBottom: tokens.spacing.lg,
  },
  dateLabel: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityCard: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.sm,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: tokens.spacing.lg,
    width: 80,
    borderRadius: tokens.radius.sm,
    marginRight: tokens.spacing.lg,
    marginBottom: tokens.spacing.sm,
  },
  deleteActionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecentActivityModal;
