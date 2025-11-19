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
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '../ui/SuiviCard';
import { SuiviText } from '../ui/SuiviText';
import { UserAvatar } from '../ui/UserAvatar';
import { tokens } from '../../theme';
import type { SuiviActivityEvent } from '../../types/activity';

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
  const iconColor = getIconColor(event.source, event.eventType, isDark);
  const iconName = getIconName(event.eventType);

  // Formatage du contexte (workspace · board/portail)
  const contextText = formatContext(event);

  // Formatage du temps relatif
  const timeAgo = formatRelativeDate(event.createdAt);

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
          <MaterialCommunityIcons
            name={iconName}
            size={compact ? 18 : 22}
            color={iconBackgroundColor}
          />
        </View>
      </View>

      {/* Contenu texte à droite */}
      <View style={styles.textContainer}>
        {/* Ligne 1 : Titre avec badge et date en haut à droite */}
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
          {/* Badge et date en haut à droite */}
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

        {/* Ligne 3 : Meta (avatar + nom) */}
        <View style={styles.metaRow}>
          <UserAvatar
            size={34}
            fullName={event.actor.name}
            imageSource={event.actor.avatarUrl}
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
 * Retourne la couleur de l'icône selon source et eventType
 * Toutes les icônes utilisent blanc (fond coloré : violet pour task/objective, rose pour board, vert pour portal)
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
 * Retourne le nom de l'icône MaterialCommunityIcons selon eventType
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
 */
function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // À l'instant
    if (diffMins < 1) return 'À l\'instant';
    
    // Il y a X min
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    // Il y a X h
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    
    // Hier — HH:mm
    if (diffDays === 1) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Hier — ${hours}:${minutes}`;
    }
    
    // Il y a X j (moins de 7 jours)
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
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
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.lg,
  },
  iconBlockContainerCompact: {
    width: 36,
    marginRight: tokens.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerCompact: {
    width: 32,
    height: 32,
    borderRadius: 10,
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
    marginTop: tokens.spacing.xs,
  },
  avatar: {
    marginRight: tokens.spacing.xs,
  },
  metaText: {
    flex: 1,
  },
  card: {
    marginBottom: 0,
  },
  cardSpacing: {
    minHeight: 80,
  },
});
