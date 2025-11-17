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

  // Couleur du bloc graphique selon source et eventType
  const iconBackgroundColor = getIconBackgroundColor(event.source, event.eventType, isDark);
  const iconColor = getIconColor(event.source, event.eventType, isDark);
  const iconName = getIconName(event.eventType);

  // Formatage du contexte (workspace · board/portail)
  const contextText = formatContext(event);

  // Formatage du temps relatif
  const timeAgo = formatRelativeDate(event.createdAt);

  // Couleurs de texte selon le thème
  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const textColorSecondary = isDark
    ? tokens.colors.text.dark.secondary
    : tokens.colors.text.secondary;

  const content = (
    <View style={styles.container}>
      {/* Bloc graphique à gauche */}
      <View
        style={[
          styles.iconContainer,
          compact && styles.iconContainerCompact,
          {
            backgroundColor: iconBackgroundColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={compact ? 20 : 24}
          color={iconColor}
        />
      </View>

      {/* Contenu texte à droite */}
      <View style={styles.textContainer}>
        {/* Ligne 1 : Titre */}
        <SuiviText
          variant="h2"
          style={[
            styles.title,
            compact && styles.titleCompact,
            {
              color: textColorPrimary,
            },
          ]}
          numberOfLines={compact ? 1 : 2}
        >
          {event.title}
        </SuiviText>

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

        {/* Ligne 3 : Meta (avatar + nom + temps) */}
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
            {event.actor.name} · {timeAgo}
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
 * Formate le temps relatif (ex: "il y a 2h", "il y a 3j")
 */
function formatRelativeDate(dateString: string): string {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  iconContainerCompact: {
    width: 36,
    height: 36,
    marginRight: tokens.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: tokens.spacing.xs,
  },
  titleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  context: {
    marginBottom: tokens.spacing.xs,
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
