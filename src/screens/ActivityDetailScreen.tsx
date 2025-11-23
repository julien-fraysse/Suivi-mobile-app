/**
 * ActivityDetailScreen
 * 
 * Écran de détail d'une activité récente.
 * Affiche toutes les informations d'un événement d'activité.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import { UserAvatar } from '@components/ui/UserAvatar';
import { Screen } from '@components/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { tokens } from '@theme';
import { getRecentActivity } from '../api/activity';
import { useActivityFeed } from '@hooks/useActivity';
import type { AppStackParamList } from '../navigation/types';
import type { SuiviActivityEvent } from '../types/activity';

type ActivityDetailRoute = RouteProp<AppStackParamList, 'ActivityDetail'>;

/**
 * Retourne la couleur de fond de l'icône selon source et eventType
 */
function getIconBackgroundColor(
  source: 'BOARD' | 'PORTAL',
  eventType: string,
  isDark: boolean,
): string {
  // BOARD events → rose (#FF82E9) - même couleur en light et dark mode
  if (eventType.startsWith('BOARD_')) {
    return '#FF82E9';
  }

  // PORTAL events → turquoise / vert
  if (source === 'PORTAL') {
    return isDark ? '#00A86B' : tokens.colors.semantic.success;
  }

  // TASK / OBJECTIVE events → violet officiel Suivi (#4D5BFF) - même couleur en light et dark mode
  if (eventType.startsWith('TASK_') || eventType === 'OBJECTIVE_STATUS_CHANGED') {
    return '#4D5BFF';
  }

  // Par défaut : violet officiel Suivi
  return '#4D5BFF';
}

/**
 * Retourne la couleur de l'icône
 * Toutes les icônes utilisent blanc pour un bon contraste sur les fonds colorés
 */
function getIconColor(
  source: 'BOARD' | 'PORTAL',
  eventType: string,
  isDark: boolean,
): string {
  // Toutes les icônes utilisent blanc pour un bon contraste sur les fonds colorés
  return '#FFFFFF';
}

/**
 * Retourne le nom de l'icône MaterialCommunityIcons
 */
function getIconName(eventType: string): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (eventType) {
    case 'TASK_CREATED':
      return 'plus-circle';
    case 'TASK_COMPLETED':
      return 'check-circle';
    case 'TASK_REPLANNED':
      return 'calendar-clock';
    case 'OBJECTIVE_STATUS_CHANGED':
      return 'target';
    case 'BOARD_CREATED':
      return 'view-dashboard';
    case 'BOARD_UPDATED':
      return 'view-dashboard-edit';
    case 'BOARD_ARCHIVED':
      return 'archive';
    case 'PORTAL_CREATED':
      return 'web';
    case 'PORTAL_UPDATED':
      return 'web';
    case 'PORTAL_SHARED':
      return 'share-variant';
    default:
      return 'information';
  }
}

/**
 * Formate une date en format lisible
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formate le temps relatif
 */
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'à l\'instant';
    if (diffMins < 60) return `il y a ${diffMins}min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays < 7) return `il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

/**
 * Formate le contexte (workspace · board/portail)
 */
function formatContext(event: SuiviActivityEvent): string {
  const parts = [event.workspaceName];

  if (event.source === 'PORTAL' && event.portalName) {
    parts.push(`Portail "${event.portalName}"`);
  } else if (event.boardName) {
    parts.push(`Board "${event.boardName}"`);
  }

  return parts.join(' · ');
}

export function ActivityDetailScreen() {
  const route = useRoute<ActivityDetailRoute>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.dark;
  const { eventId } = route.params;

  const [event, setEvent] = useState<SuiviActivityEvent | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'événement depuis la liste des activités
  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        // Charger toutes les activités et trouver celle avec l'ID correspondant
        const activities = await getRecentActivity(null, { limit: 100 });
        const foundEvent = activities.find((e) => e.id === eventId);
        setEvent(foundEvent || null);
      } catch (error) {
        console.error('Error loading activity event:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <SuiviText variant="body" color="secondary">
            {t('common.loading')}
          </SuiviText>
        </View>
      </Screen>
    );
  }

  if (!event) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <SuiviText variant="h2">{t('activityDetail.notFound')}</SuiviText>
          <SuiviText variant="body" color="secondary" style={styles.errorText}>
            {t('activityDetail.loadError')}
          </SuiviText>
          <SuiviButton
            title={t('common.back')}
            onPress={() => navigation.goBack()}
            variant="primary"
            style={styles.backButton}
          />
        </View>
      </Screen>
    );
  }

  // Couleurs selon le thème
  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const textColorSecondary = isDark
    ? tokens.colors.text.dark.secondary
    : tokens.colors.text.secondary;

  // Couleur de l'icône
  const iconBackgroundColor = getIconBackgroundColor(event.source, event.eventType, isDark);
  const iconColor = getIconColor(event.source, event.eventType, isDark);
  const iconName = getIconName(event.eventType);

  // Formatage
  const formattedDate = formatDate(event.createdAt);
  const timeAgo = formatTimeAgo(event.createdAt);
  const contextText = formatContext(event);

  // Gestion de l'ouverture du lien Suivi web
  const handleOpenInSuivi = async () => {
    const url = 'https://run.suivi.co';
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <Screen scrollable noTopBackground>
      <View style={[styles.pagePadding, { paddingTop: insets.top + tokens.spacing.md }]}>
        {/* Screen Header avec bouton retour */}
        <ScreenHeader 
          title={t('activityDetail.overview')} 
          showBackButton 
          onBack={() => navigation.goBack()} 
        />
        {/* Icône */}
        <View style={styles.iconSection}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconBackgroundColor,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={48}
              color={iconColor}
            />
          </View>
        </View>

        {/* Titre */}
        <SuiviText
          variant="h1"
          style={[
            styles.title,
            {
              color: textColorPrimary,
            },
          ]}
        >
          {event.title}
        </SuiviText>

        {/* Heure relative et exacte */}
        <View style={styles.metaRow}>
          <SuiviText
            variant="body"
            color="secondary"
            style={{
              color: textColorSecondary,
            }}
          >
            {timeAgo}
          </SuiviText>
          <SuiviText
            variant="body"
            color="secondary"
            style={[
              styles.exactDate,
              {
                color: textColorSecondary,
              },
            ]}
          >
            {formattedDate}
          </SuiviText>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor: isDark
                ? tokens.colors.border.darkMode.default
                : tokens.colors.border.default,
            },
          ]}
        />

        {/* Acteur */}
        <View style={styles.section}>
          <SuiviText
            variant="label"
            style={[
              styles.sectionLabel,
              {
                color: textColorSecondary,
              },
            ]}
          >
            Acteur
          </SuiviText>
          <View style={styles.actorRow}>
            <UserAvatar
              size={40}
              fullName={event.actor.name}
              imageSource={event.actor.avatarUrl}
            />
            <SuiviText
              variant="body"
              style={[
                styles.actorName,
                {
                  color: textColorPrimary,
                },
              ]}
            >
              {event.actor.name}
            </SuiviText>
          </View>
        </View>

        {/* Workspace / Board / Portail */}
        <View style={styles.section}>
          <SuiviText
            variant="label"
            style={[
              styles.sectionLabel,
              {
                color: textColorSecondary,
              },
            ]}
          >
            Contexte
          </SuiviText>
          <SuiviText
            variant="body"
            style={{
              color: textColorPrimary,
            }}
          >
            {contextText}
          </SuiviText>
        </View>

        {/* Ancien statut / Nouveau statut */}
        {(event.taskInfo?.taskStatus || event.objectiveInfo) && (
          <View style={styles.section}>
            <SuiviText
              variant="label"
              style={[
                styles.sectionLabel,
                {
                  color: textColorSecondary,
                },
              ]}
            >
              Statut
            </SuiviText>
            {event.objectiveInfo && (
              <View style={styles.statusRow}>
                <SuiviText
                  variant="body"
                  style={{
                    color: textColorSecondary,
                  }}
                >
                  {event.objectiveInfo.previousStatus} → {event.objectiveInfo.newStatus}
                </SuiviText>
              </View>
            )}
            {event.taskInfo?.taskStatus && (
              <SuiviText
                variant="body"
                style={{
                  color: textColorPrimary,
                }}
              >
                {event.taskInfo.taskStatus}
              </SuiviText>
            )}
          </View>
        )}

        {/* Date prévue / Date finale */}
        {event.taskInfo?.newDueDate && (
          <View style={styles.section}>
            <SuiviText
              variant="label"
              style={[
                styles.sectionLabel,
                {
                  color: textColorSecondary,
                },
              ]}
            >
              Date d'échéance
            </SuiviText>
            <SuiviText
              variant="body"
              style={{
                color: textColorPrimary,
              }}
            >
              {new Date(event.taskInfo.newDueDate).toLocaleDateString('fr-FR')}
            </SuiviText>
            {event.taskInfo.previousDueDate && (
              <SuiviText
                variant="body"
                color="secondary"
                style={styles.previousDate}
              >
                Précédemment : {new Date(event.taskInfo.previousDueDate).toLocaleDateString('fr-FR')}
              </SuiviText>
            )}
          </View>
        )}

        {/* Bouton Ouvrir dans Suivi */}
        <View style={styles.buttonSection}>
          <SuiviButton
            title={t('activityDetail.openInSuivi')}
            onPress={handleOpenInSuivi}
            variant="primary"
            fullWidth
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pagePadding: {
    paddingHorizontal: tokens.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  errorText: {
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
    textAlign: 'center',
  },
  backButton: {
    marginTop: tokens.spacing.md,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: tokens.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: tokens.spacing.md,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  exactDate: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: tokens.spacing.lg,
  },
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionLabel: {
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  actorName: {
    flex: 1,
  },
  statusRow: {
    marginTop: tokens.spacing.xs,
  },
  previousDate: {
    marginTop: tokens.spacing.xs,
    fontSize: 12,
  },
  buttonSection: {
    marginTop: tokens.spacing.xl,
    marginBottom: tokens.spacing.lg,
  },
});

