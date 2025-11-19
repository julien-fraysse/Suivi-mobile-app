/**
 * ActivityDetailModal Component
 * 
 * Modal pour afficher le détail d'une activité récente.
 * 
 * Affiche :
 * - Icône / illustration selon le type d'événement
 * - Titre de l'événement
 * - Heure relative et exacte
 * - Acteur (avatar + nom)
 * - Workspace / Board / Portail
 * - Type d'événement
 * - Ancien statut / nouveau statut si applicable (pour TASK_COMPLETED, TASK_REPLANNED, OBJECTIVE_STATUS_CHANGED)
 * - Date prévue / date finale si applicable (pour TASK_REPLANNED)
 * 
 * Actions :
 * - Bouton "Ouvrir dans Suivi (web)" qui ouvre une URL deep-linkée
 * 
 * Intégration future avec Suivi web :
 * - Les URLs deep-linkées suivront le format :
 *   - Tâches : https://app.suivi.fr/workspaces/{workspaceId}/boards/{boardId}/tasks/{taskId}
 *   - Objectifs : https://app.suivi.fr/workspaces/{workspaceId}/boards/{boardId}/objectives/{objectiveId}
 *   - Boards : https://app.suivi.fr/workspaces/{workspaceId}/boards/{boardId}
 *   - Portails : https://app.suivi.fr/portals/{portalId}
 * 
 * Pour l'instant, utilise une URL placeholder. L'intégration réelle nécessitera :
 * 1. Récupérer les IDs réels (workspaceId, boardId, taskId, etc.) depuis l'événement
 * 2. Construire l'URL selon le type d'événement
 * 3. Gérer l'authentification (token dans l'URL ou header)
 * 4. Tester les deep links sur iOS/Android
 * 
 * TODO :
 * - Implémenter la construction d'URLs deep-linkées selon le type d'événement
 * - Ajouter la gestion d'erreur si le lien ne peut pas être ouvert
 * - Ajouter un indicateur de chargement lors de l'ouverture du lien
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviText } from '../ui/SuiviText';
import { SuiviButton } from '../ui/SuiviButton';
import { UserAvatar } from '../ui/UserAvatar';
import { tokens } from '../../theme';
import type { SuiviActivityEvent } from '../../types/activity';

export interface ActivityDetailModalProps {
  /** Contrôle la visibilité du modal */
  visible: boolean;
  /** Événement d'activité à afficher (null si modal fermé) */
  event: SuiviActivityEvent | null;
  /** Callback appelé lors de la fermeture du modal */
  onClose: () => void;
}

/**
 * ActivityDetailModal
 * 
 * Modal slide-up pour afficher le détail d'une activité récente.
 */
export function ActivityDetailModal({
  visible,
  event,
  onClose,
}: ActivityDetailModalProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  if (!event) {
    return null;
  }

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

  // Couleur de l'icône selon source et eventType
  const iconBackgroundColor = getIconBackgroundColor(event.source, event.eventType, isDark);
  const iconColor = getIconColor(event.source, event.eventType, isDark);
  const iconName = getIconName(event.eventType);

  // Formatage de la date
  const formattedDate = formatDate(event.createdAt);
  const timeAgo = formatTimeAgo(event.createdAt);

  // Formatage du contexte
  const contextText = formatContext(event);

  // Gestion de l'ouverture du lien Suivi web
  const handleOpenInSuivi = async () => {
    // TODO: Construire l'URL deep-linkée selon le type d'événement
    // Pour l'instant, utiliser une URL placeholder
    const url = 'https://app.suivi.fr';
    
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

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Icône / Illustration */}
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

            {/* Type d'événement */}
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
                Type d'événement
              </SuiviText>
              <View
                style={[
                  styles.eventTypeBadge,
                  {
                    backgroundColor: isDark
                      ? tokens.colors.surface.dark
                      : tokens.colors.neutral.light,
                  },
                ]}
              >
                <SuiviText
                  variant="body"
                  style={{
                    color: textColorPrimary,
                  }}
                >
                  {formatEventType(event.eventType)}
                </SuiviText>
              </View>
            </View>

            {/* Ancien statut / Nouveau statut (si applicable) */}
            {(event.eventType === 'TASK_COMPLETED' ||
              event.eventType === 'TASK_REPLANNED' ||
              event.eventType === 'OBJECTIVE_STATUS_CHANGED') &&
              (event.taskInfo || event.objectiveInfo) && (
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
                  <View style={styles.statusRow}>
                    {event.objectiveInfo?.previousStatus && (
                      <View style={styles.statusBadge}>
                        <SuiviText
                          variant="body"
                          color="secondary"
                          style={{
                            color: textColorSecondary,
                          }}
                        >
                          {formatObjectiveStatus(event.objectiveInfo.previousStatus)} →
                        </SuiviText>
                      </View>
                    )}
                    <View style={styles.statusBadge}>
                      <SuiviText
                        variant="body"
                        style={{
                          color: textColorPrimary,
                        }}
                      >
                        {event.taskInfo?.taskStatus ||
                          (event.objectiveInfo?.newStatus &&
                            formatObjectiveStatus(event.objectiveInfo.newStatus))}
                      </SuiviText>
                    </View>
                  </View>
                </View>
              )}

            {/* Date prévue / Date finale (si applicable) */}
            {event.eventType === 'TASK_REPLANNED' &&
              event.taskInfo &&
              (event.taskInfo.previousDueDate || event.taskInfo.newDueDate) && (
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
                    Dates
                  </SuiviText>
                  <View style={styles.dateRow}>
                    {event.taskInfo.previousDueDate && (
                      <View style={styles.dateBadge}>
                        <SuiviText
                          variant="body"
                          color="secondary"
                          style={{
                            color: textColorSecondary,
                          }}
                        >
                          Prévue : {formatShortDate(event.taskInfo.previousDueDate)}
                        </SuiviText>
                      </View>
                    )}
                    {event.taskInfo.newDueDate && (
                      <View style={styles.dateBadge}>
                        <SuiviText
                          variant="body"
                          style={{
                            color: textColorPrimary,
                          }}
                        >
                          Finale : {formatShortDate(event.taskInfo.newDueDate)}
                        </SuiviText>
                      </View>
                    )}
                  </View>
                </View>
              )}

            {/* Sévérité */}
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
                Sévérité
              </SuiviText>
              <View
                style={[
                  styles.severityBadge,
                  {
                    backgroundColor: getSeverityBadgeColor(event.severity, isDark),
                  },
                ]}
              >
                <SuiviText
                  variant="label"
                  style={{
                    color:
                      event.severity === 'INFO'
                        ? textColorPrimary
                        : '#FFFFFF',
                  }}
                >
                  {event.severity}
                </SuiviText>
              </View>
            </View>
          </ScrollView>

          {/* Footer avec bouton */}
          <View
            style={[
              styles.footer,
              {
                backgroundColor: headerBackground,
                borderTopColor: isDark
                  ? tokens.colors.border.darkMode.default
                  : tokens.colors.border.default,
              },
            ]}
          >
            <SuiviButton
              variant="primary"
              onPress={handleOpenInSuivi}
              title="Ouvrir dans Suivi (web)"
              style={styles.openButton}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Retourne la couleur de fond du bloc graphique selon source et eventType
 */
function getIconBackgroundColor(
  source: 'BOARD' | 'PORTAL',
  eventType: string,
  isDark: boolean,
): string {
  if (source === 'PORTAL') {
    return isDark
      ? tokens.colors.brand.primaryDark
      : tokens.colors.brand.primaryLight;
  }

  if (eventType.startsWith('TASK_')) {
    return isDark
      ? tokens.colors.brand.primaryDark
      : tokens.colors.brand.primaryLight;
  }
  if (eventType === 'OBJECTIVE_STATUS_CHANGED') {
    return isDark
      ? tokens.colors.accent.maize
      : tokens.colors.accent.maizeLight;
  }
  if (eventType.startsWith('BOARD_')) {
    return isDark
      ? tokens.colors.neutral.medium
      : tokens.colors.neutral.light;
  }

  return isDark
    ? tokens.colors.neutral.medium
    : tokens.colors.neutral.light;
}

/**
 * Retourne la couleur de l'icône selon source et eventType
 */
function getIconColor(
  source: 'BOARD' | 'PORTAL',
  eventType: string,
  isDark: boolean,
): string {
  if (source === 'PORTAL' || eventType.startsWith('TASK_') || eventType.startsWith('BOARD_')) {
    return '#FFFFFF';
  }
  if (eventType === 'OBJECTIVE_STATUS_CHANGED') {
    return tokens.colors.neutral.dark;
  }
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
    parts.push(`Portail ${event.portalName}`);
  } else if (event.boardName) {
    parts.push(`Board ${event.boardName}`);
  }

  return parts.join(' · ');
}

/**
 * Formate la date complète
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

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

/**
 * Formate le type d'événement pour l'affichage
 */
function formatEventType(eventType: string): string {
  const mapping: Record<string, string> = {
    TASK_CREATED: 'Tâche créée',
    TASK_COMPLETED: 'Tâche complétée',
    TASK_REPLANNED: 'Tâche replanifiée',
    OBJECTIVE_STATUS_CHANGED: 'Statut d\'objectif modifié',
    BOARD_CREATED: 'Board créé',
    BOARD_UPDATED: 'Board mis à jour',
    BOARD_ARCHIVED: 'Board archivé',
    PORTAL_CREATED: 'Portail créé',
    PORTAL_UPDATED: 'Portail mis à jour',
    PORTAL_SHARED: 'Portail partagé',
  };

  return mapping[eventType] || eventType;
}

/**
 * Retourne la couleur du badge de sévérité
 */
function getSeverityBadgeColor(
  severity: 'INFO' | 'IMPORTANT' | 'CRITICAL',
  isDark: boolean,
): string {
  switch (severity) {
    case 'CRITICAL':
      return tokens.colors.semantic.error;
    case 'IMPORTANT':
      return tokens.colors.accent.maize;
    case 'INFO':
    default:
      return isDark
        ? tokens.colors.neutral.medium
        : tokens.colors.neutral.light;
  }
}

/**
 * Formate une date courte (sans heure)
 */
function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formate le statut d'un objectif
 */
function formatObjectiveStatus(
  status: 'on_track' | 'at_risk' | 'behind' | 'achieved' | 'cancelled',
): string {
  const mapping: Record<string, string> = {
    on_track: 'En cours',
    at_risk: 'À risque',
    behind: 'En retard',
    achieved: 'Atteint',
    cancelled: 'Annulé',
  };
  return mapping[status] || status;
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  },
  closeButton: {
    padding: tokens.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
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
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  exactDate: {
    marginLeft: tokens.spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: tokens.spacing.lg,
  },
  section: {
    marginBottom: tokens.spacing.lg,
  },
  sectionLabel: {
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  actorName: {
    fontSize: 16,
  },
  eventTypeBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    alignSelf: 'flex-start',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
  },
  dateRow: {
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  },
  dateBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
  },
  severityBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    alignSelf: 'flex-start',
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderTopWidth: 1,
  },
  openButton: {
    width: '100%',
  },
});

