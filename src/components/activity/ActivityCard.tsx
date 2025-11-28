/**
 * ActivityCard Component
 * 
 * Composant réutilisable pour afficher une carte d'activité récente dans Suivi.
 * 
 * Design :
 * - Carte horizontale avec bloc graphique à gauche et texte à droite
 * - Bloc graphique : couleur de fond selon source/eventType + icône MaterialCommunityIcons
 * - Texte : 3 lignes (titre, contexte workspace/board/portail, meta avec avatar + temps)
 * - Support dark/light mode complet
 * - Utilise exclusivement le design system Suivi (tokens, typographies, couleurs)
 * 
 * Couleurs des blocs graphiques :
 * - BOARD events → violet / bleu foncé (brand.primary)
 * - PORTAL events → turquoise / vert (semantic.success)
 * - TASK / OBJECTIVE events → bleu Suivi (brand.primary)
 * 
 * Usage :
 * ```tsx
 * <ActivityCard
 *   event={activityEvent}
 *   onPress={() => handleSelectActivity(activityEvent)}
 * />
 * ```
 * 
 * Props :
 * - event: SuiviActivityEvent - L'événement d'activité à afficher
 * - onPress?: () => void - Callback appelé lors du clic sur la carte
 * - style?: ViewStyle - Style personnalisé pour le conteneur
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from '../ui/SuiviCard';
import { SuiviText } from '../ui/SuiviText';
import { UserAvatar } from '../ui/UserAvatar';
import { tokens } from '@theme';
import type { SuiviActivityEvent } from '../../types/activity';

// Import des icônes PNG
import TaskIcon from '../../assets/activity-icons/Task.png';
import BoardIcon from '../../assets/activity-icons/Board.png';
import PortalIcon from '../../assets/activity-icons/Portal.png';

export interface ActivityCardProps {
  /** Événement d'activité à afficher */
  event: SuiviActivityEvent;
  /** Callback appelé lors du clic sur la carte, reçoit l'événement en paramètre */
  onPress?: (event: SuiviActivityEvent) => void;
  /** Style personnalisé pour le conteneur */
  style?: ViewStyle;
  /** Mode compact : réduit padding, taille d'icône et fontSize */
  compact?: boolean;
}

/**
 * ActivityCard
 * 
 * Affiche une carte d'activité récente avec :
 * - Bloc graphique à gauche (couleur + icône)
 * - 3 lignes de texte à droite (titre, contexte, meta)
 */
export function ActivityCard({ event, onPress, style, compact = false }: ActivityCardProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();

  // Couleur du bloc graphique selon source et eventType
  const iconBackgroundColor = getIconBackgroundColor(event.source, event.eventType, isDark);
  const iconSource = getActivityIcon(event.eventType, event.source);

  // Formatage du contexte (workspace · board/portail)
  const contextText = formatContext(event, t);

  // Formatage du temps relatif
  const timeAgo = formatRelativeDate(event.createdAt, t);

  // Type d'activité pour le badge
  const activityTypeLabel = getActivityTypeLabel(event.eventType, event.source, t);

  // Couleurs de texte selon le thème
  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const textColorSecondary = isDark
    ? tokens.colors.text.dark.secondary
    : tokens.colors.text.secondary;

  const content = (
    <View style={styles.container}>
      {/* Bloc graphique à gauche (centré verticalement) */}
      <View style={[
        styles.iconBlockContainer,
        compact && styles.iconBlockContainerCompact,
      ]}>
        <View
          style={[
            styles.iconContainer,
            compact && styles.iconContainerCompact,
            {
              backgroundColor: `${iconBackgroundColor}20`,
            },
          ]}
        >
          <Image
            source={iconSource}
            style={[
              styles.iconImage,
              compact && styles.iconImageCompact,
            ]}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Contenu texte à droite */}
      <View style={styles.textContainer}>
        {/* Ligne 1 : Titre avec badge en haut à droite */}
        <View style={styles.titleRow}>
          <SuiviText
            variant="h2"
            style={[
              styles.title,
              compact && styles.titleCompact,
              {
                color: textColorPrimary,
              },
            ]}
          >
            {event.title}
          </SuiviText>
          {/* Badge en haut à droite */}
          <View style={styles.topRightContainer}>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor: `${iconBackgroundColor}20`,
                },
              ]}
            >
              <SuiviText
                variant="body"
                style={[
                  styles.typeBadgeText,
                  {
                    color: iconBackgroundColor,
                  },
                ]}
              >
                {activityTypeLabel}
              </SuiviText>
            </View>
          </View>
        </View>

        {/* Ligne 2 : Contexte (workspace · board/portail) */}
        <SuiviText
          variant="body"
          color="secondary"
          style={[
            styles.context,
            {
              color: textColorSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {contextText}
        </SuiviText>

        {/* Ligne 3 : Meta (avatar + nom + date) */}
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <UserAvatar
              size={24}
              fullName={event.actor.name}
              imageSource={event.actor.avatarUrl}
              userId={event.actor.userId}
              style={styles.avatar}
            />
            <SuiviText
              variant="body"
              color="secondary"
              style={[
                styles.metaText,
                {
                  color: textColorSecondary,
                },
              ]}
            >
              {event.actor.name}
            </SuiviText>
          </View>
          <SuiviText
            variant="label"
            style={[
              styles.timeAgo,
              {
                color: textColorSecondary,
              },
            ]}
          >
            {timeAgo}
          </SuiviText>
        </View>
      </View>
    </View>
  );

  const handlePress = () => {
    if (onPress) {
      onPress(event);
    }
  };

  const cardContent = (
    <SuiviCard 
      padding={compact ? "sm" : "md"} 
      elevation="card" 
      variant="default" 
      style={[
        onPress ? styles.card : undefined,
        styles.cardSpacing,
        {
          borderLeftWidth: 5,
          borderLeftColor: iconBackgroundColor,
        },
      ]}
    >
      {content}
    </SuiviCard>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={style}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{cardContent}</View>;
}

/**
 * Retourne la couleur de fond du bloc graphique selon source et eventType
 * 
 * Couleurs :
 * - BOARD events → rose (#FF82E9) - même couleur en light et dark mode
 * - PORTAL events → turquoise / vert (semantic.success)
 * - TASK / OBJECTIVE events → violet officiel Suivi (#4D5BFF) - même couleur en light et dark mode
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
    return isDark
      ? '#00A86B' // Vert foncé pour dark mode
      : tokens.colors.semantic.success; // #00C853 pour light mode
  }

  // TASK / OBJECTIVE events → violet officiel Suivi (#4D5BFF) - même couleur en light et dark mode
  if (eventType.startsWith('TASK_') || eventType === 'OBJECTIVE_STATUS_CHANGED') {
    return '#4D5BFF';
  }

  // Par défaut : violet officiel Suivi
  return '#4D5BFF';
}

/**
 * Retourne l'icône PNG selon eventType et source
 */
function getActivityIcon(
  eventType: string,
  source: 'BOARD' | 'PORTAL',
): ImageSourcePropType {
  // TASK / OBJECTIVE events → Task.png
  if (eventType.startsWith('TASK_') || eventType === 'OBJECTIVE_STATUS_CHANGED') {
    return TaskIcon;
  }

  // BOARD events → Board.png
  if (eventType.startsWith('BOARD_')) {
    return BoardIcon;
  }

  // PORTAL events → Portal.png
  if (eventType.startsWith('PORTAL_')) {
    return PortalIcon;
  }

  // Par défaut : Task.png
  return TaskIcon;
}

/**
 * Formate le contexte (workspace · board/portail)
 * 
 * Utilise les clés i18n pour formater le contexte de l'activité.
 * 
 * @see Les mêmes clés i18n seront utilisées pour l'API backend
 */
function formatContext(event: SuiviActivityEvent, t: any): string {
  const parts = [event.workspaceName];
  const separator = t('activity.context.separator');

  if (event.source === 'PORTAL' && event.portalName) {
    parts.push(t('activity.context.portal', { name: event.portalName }));
  } else if (event.boardName) {
    parts.push(t('activity.context.board', { name: event.boardName }));
  }

  return parts.join(separator);
}

/**
 * Retourne le label du type d'activité pour le badge
 */
function getActivityTypeLabel(eventType: string, source: 'BOARD' | 'PORTAL', t: any): string {
  if (eventType.startsWith('BOARD_')) {
    return t('activity.types.board');
  }
  if (eventType.startsWith('PORTAL_')) {
    return t('activity.types.portal');
  }
  return t('activity.types.task');
}

/**
 * Formate le temps relatif (ex: "Il y a 3 min", "Il y a 2 h", "Hier — 17:23")
 * 
 * Utilise les clés i18n pour tous les timestamps relatifs.
 * 
 * @see Les mêmes clés i18n seront utilisées pour l'API backend
 */
function formatRelativeDate(dateString: string, t: any): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // À l'instant
    if (diffMins < 1) return t('activity.timestamps.just_now');
    
    // Il y a X min
    if (diffMins < 60) return t('activity.timestamps.minutes_ago', { count: diffMins });
    
    // Il y a X h
    if (diffHours < 24) return t('activity.timestamps.hours_ago', { count: diffHours });
    
    // Hier — HH:mm
    if (diffDays === 1) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return t('activity.timestamps.yesterday', { time: `${hours}:${minutes}` });
    }
    
    // Il y a X j (moins de 7 jours)
    if (diffDays < 7) return t('activity.timestamps.days_ago', { count: diffDays });
    
    // Date formatée (mois court + jour)
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBlockContainer: {
    width: tokens.spacing.xxl + tokens.spacing.lg + tokens.spacing.sm + tokens.spacing.sm, // 32 + 16 + 8 + 8 = 64
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.lg,
  },
  iconBlockContainerCompact: {
    width: tokens.spacing.xl + tokens.spacing.md + tokens.spacing.md + tokens.spacing.sm, // 24 + 12 + 12 + 8 = 56
    marginRight: tokens.spacing.md,
  },
  iconContainer: {
    width: tokens.spacing.xxl + tokens.spacing.lg, // 32 + 16 = 48
    height: tokens.spacing.xxl + tokens.spacing.lg, // 32 + 16 = 48
    borderRadius: tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerCompact: {
    width: tokens.spacing.xl + tokens.spacing.lg, // 24 + 16 = 40
    height: tokens.spacing.xl + tokens.spacing.lg, // 24 + 16 = 40
    borderRadius: tokens.radius.md,
  },
  iconImage: {
    width: tokens.spacing.xxl + tokens.spacing.sm, // 32 + 8 = 40
    height: tokens.spacing.xxl + tokens.spacing.sm, // 32 + 8 = 40
  },
  iconImageCompact: {
    width: tokens.spacing.xl + tokens.spacing.sm, // 24 + 8 = 32
    height: tokens.spacing.xl + tokens.spacing.sm, // 24 + 8 = 32
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    flex: 1,
    marginRight: tokens.spacing.xs,
    lineHeight: 22,
    includeFontPadding: false,
  },
  titleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  topRightContainer: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: tokens.spacing.xs / 2,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  timeAgo: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'right',
  },
  context: {
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.xs,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: tokens.spacing.xs,
  },
  metaText: {
    flexShrink: 1,
  },
  card: {
    marginBottom: 0,
  },
  cardSpacing: {
    minHeight: 80,
  },
});
