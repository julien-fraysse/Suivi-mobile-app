import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

// Hauteur fixe de l'input (5 lignes) - VERROUILLÉE pour fiabiliser onSelectionChange
const INPUT_FIXED_HEIGHT = tokens.typography.body.lineHeight * 5 + tokens.spacing.md * 2;

/**
 * Liste des utilisateurs mentionnables.
 * TODO: Remplacer par une source externe (API, store Zustand) quand disponible.
 */
const MENTIONABLE_USERS: readonly { id: string; name: string }[] = [
  { id: '1', name: 'Julien' },
  { id: '2', name: 'Alice' },
  { id: '3', name: 'Bob' },
  { id: '4', name: 'Marie' },
  { id: '5', name: 'Thomas' },
] as const;

export interface QuickActionCommentProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * Détecte la mention active dans le texte.
 * Retourne le query et l'index du @ si une mention est en cours, sinon null.
 * Utilise le DERNIER @ du texte (approche Slack simplifié).
 */
function detectActiveMention(text: string): { query: string; atIndex: number } | null {
  const atIndex = text.lastIndexOf('@');
  
  if (atIndex === -1) {
    return null;
  }
  
  const textAfterAt = text.slice(atIndex + 1);
  
  if (/\s/.test(textAfterAt)) {
    return null;
  }
  
  return {
    query: textAfterAt.toLowerCase(),
    atIndex,
  };
}

// ============================================================================
// PARSER POUR L'APERÇU LIVE
// Pipeline : URL → bold → italic → strikethrough → code → mentions
// ============================================================================

type ParsedFragment = 
  | { type: 'text'; content: string }
  | { type: 'url'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'strikethrough'; content: string }
  | { type: 'code'; content: string }
  | { type: 'mention'; content: string };

function parseFragment(text: string): ParsedFragment[] {
  if (!text) return [];

  // Étape 1: Découper par URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlParts = text.split(urlRegex);
  const afterUrl: ParsedFragment[] = [];

  for (const part of urlParts) {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0;
      afterUrl.push({ type: 'url', content: part });
    } else if (part) {
      afterUrl.push({ type: 'text', content: part });
    }
  }

  // Étape 2: Parser *bold*
  const afterBold: ParsedFragment[] = [];
  const boldRegex = /\*([^*]+)\*/g;

  for (const fragment of afterUrl) {
    if (fragment.type !== 'text') {
      afterBold.push(fragment);
      continue;
    }

    let lastIndex = 0;
    let match;
    const content = fragment.content;
    boldRegex.lastIndex = 0;

    while ((match = boldRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        afterBold.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      afterBold.push({ type: 'bold', content: match[1] });
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      afterBold.push({ type: 'text', content: content.slice(lastIndex) });
    }
  }

  // Étape 3: Parser _italic_
  const afterItalic: ParsedFragment[] = [];
  const italicRegex = /_([^_]+)_/g;

  for (const fragment of afterBold) {
    if (fragment.type !== 'text') {
      afterItalic.push(fragment);
      continue;
    }

    let lastIndex = 0;
    let match;
    const content = fragment.content;
    italicRegex.lastIndex = 0;

    while ((match = italicRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        afterItalic.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      afterItalic.push({ type: 'italic', content: match[1] });
      lastIndex = italicRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      afterItalic.push({ type: 'text', content: content.slice(lastIndex) });
    }
  }

  // Étape 4: Parser ~~strikethrough~~
  const afterStrikethrough: ParsedFragment[] = [];
  const strikethroughRegex = /~~([^~]+)~~/g;

  for (const fragment of afterItalic) {
    if (fragment.type !== 'text') {
      afterStrikethrough.push(fragment);
      continue;
    }

    let lastIndex = 0;
    let match;
    const content = fragment.content;
    strikethroughRegex.lastIndex = 0;

    while ((match = strikethroughRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        afterStrikethrough.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      afterStrikethrough.push({ type: 'strikethrough', content: match[1] });
      lastIndex = strikethroughRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      afterStrikethrough.push({ type: 'text', content: content.slice(lastIndex) });
    }
  }

  // Étape 5: Parser `code`
  const afterCode: ParsedFragment[] = [];
  const codeRegex = /`([^`]+)`/g;

  for (const fragment of afterStrikethrough) {
    if (fragment.type !== 'text') {
      afterCode.push(fragment);
      continue;
    }

    let lastIndex = 0;
    let match;
    const content = fragment.content;
    codeRegex.lastIndex = 0;

    while ((match = codeRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        afterCode.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      afterCode.push({ type: 'code', content: match[1] });
      lastIndex = codeRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      afterCode.push({ type: 'text', content: content.slice(lastIndex) });
    }
  }

  // Étape 6: Parser @mentions
  const afterMention: ParsedFragment[] = [];
  const mentionRegex = /@(\w+)/g;

  for (const fragment of afterCode) {
    if (fragment.type !== 'text') {
      afterMention.push(fragment);
      continue;
    }

    let lastIndex = 0;
    let match;
    const content = fragment.content;
    mentionRegex.lastIndex = 0;

    while ((match = mentionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        afterMention.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      afterMention.push({ type: 'mention', content: match[0] });
      lastIndex = mentionRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      afterMention.push({ type: 'text', content: content.slice(lastIndex) });
    }
  }

  return afterMention;
}

function detectListItem(line: string): { type: 'bullet' | 'numbered' | 'none'; marker: string; content: string } {
  const bulletMatch = line.match(/^[-*]\s+(.*)$/);
  if (bulletMatch) {
    return { type: 'bullet', marker: '•', content: bulletMatch[1] };
  }
  
  const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
  if (numberedMatch) {
    return { type: 'numbered', marker: `${numberedMatch[1]}.`, content: numberedMatch[2] };
  }
  
  return { type: 'none', marker: '', content: line };
}

/**
 * QuickActionComment
 * 
 * Composant Quick Action permettant à l'utilisateur de commenter une tâche.
 * Input à hauteur FIXE (5 lignes) avec scroll interne pour fiabiliser les mentions.
 * Aperçu live du formatage au-dessus de l'input.
 * 
 * Comportement des mentions :
 * - Détection du DERNIER @ dans le texte (approche Slack mobile)
 * - Menu de suggestions positionné au-dessus de l'input entier
 * - Fermeture automatique après un espace
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 */
export function QuickActionComment({ task, onActionComplete }: QuickActionCommentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.dark;
  const [comment, setComment] = useState('');

  // Calcul de la mention active directement à partir du texte
  const activeMention = useMemo(() => detectActiveMention(comment), [comment]);
  
  // Filtrage des suggestions basé sur la mention active
  const filteredUsers = useMemo(() => {
    if (!activeMention) return [];
    
    if (activeMention.query === '') {
      return [...MENTIONABLE_USERS].slice(0, 5);
    }
    
    return MENTIONABLE_USERS.filter(u =>
      u.name.toLowerCase().startsWith(activeMention.query)
    ).slice(0, 5);
  }, [activeMention]);

  // Détecter si le commentaire contient du formatage (pour afficher l'aperçu)
  const hasFormatting = useMemo(() => {
    if (!comment.trim()) return false;
    // Vérifier si le texte contient des marqueurs de formatage
    return /[*_~`@]|https?:\/\/|^[-*]\s|^\d+\.\s/m.test(comment);
  }, [comment]);

  const handleTextChange = (text: string) => {
    setComment(text);
  };

  const handleSelectMention = (user: { id: string; name: string }) => {
    if (!activeMention) return;

    const { atIndex } = activeMention;
    const beforeMention = comment.slice(0, atIndex);
    const newComment = `${beforeMention}@${user.name} `;
    
    setComment(newComment);
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      onActionComplete({
        actionType: 'COMMENT',
        details: { comment: comment.trim() },
      });
      setComment('');
    }
  };

  /**
   * Rend l'aperçu formaté du commentaire
   */
  const renderPreview = () => {
    const lines = comment.split('\n');

    return (
      <View style={styles.previewContent}>
        {lines.map((line, lineIndex) => {
          const listInfo = detectListItem(line);
          const contentToRender = listInfo.type !== 'none' ? listInfo.content : line;
          const fragments = parseFragment(contentToRender);

          const lineStyle = listInfo.type !== 'none' 
            ? [styles.previewLine, styles.listItemLine]
            : styles.previewLine;

          return (
            <View key={lineIndex} style={lineStyle}>
              {listInfo.type !== 'none' && (
                <SuiviText variant="body" color="primary" style={styles.listMarker}>
                  {listInfo.marker}
                </SuiviText>
              )}
              {fragments.map((fragment, fragmentIndex) => {
                const key = `${lineIndex}-${fragmentIndex}`;

                switch (fragment.type) {
                  case 'url':
                    return (
                      <Pressable
                        key={key}
                        onPress={() => Linking.openURL(fragment.content)}
                      >
                        <SuiviText variant="body" style={styles.urlText}>
                          {fragment.content}
                        </SuiviText>
                      </Pressable>
                    );

                  case 'bold':
                    return (
                      <SuiviText key={key} variant="body" color="primary" style={styles.boldText}>
                        {fragment.content}
                      </SuiviText>
                    );

                  case 'italic':
                    return (
                      <SuiviText key={key} variant="body" color="primary" style={styles.italicText}>
                        {fragment.content}
                      </SuiviText>
                    );

                  case 'strikethrough':
                    return (
                      <SuiviText key={key} variant="body" color="primary" style={styles.strikethroughText}>
                        {fragment.content}
                      </SuiviText>
                    );

                  case 'code':
                    return (
                      <SuiviText key={key} variant="mono" style={styles.codeText}>
                        {fragment.content}
                      </SuiviText>
                    );

                  case 'mention':
                    return (
                      <SuiviText key={key} variant="body" style={styles.mentionText}>
                        {fragment.content}
                      </SuiviText>
                    );

                  case 'text':
                  default:
                    return (
                      <SuiviText key={key} variant="body" color="primary">
                        {fragment.content}
                      </SuiviText>
                    );
                }
              })}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="outlined" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.comment.label')}
      </SuiviText>

      {/* Aperçu live du formatage */}
      {hasFormatting && (
        <View style={[
          styles.previewContainer,
          {
            backgroundColor: isDark
              ? tokens.colors.surface.darkVariant
              : tokens.colors.neutral.light,
          },
        ]}>
          <SuiviText variant="label" color="hint" style={styles.previewLabel}>
            Aperçu
          </SuiviText>
          {renderPreview()}
        </View>
      )}
      
      {/* Wrapper relatif pour le positionnement stable du menu suggestions */}
      <View style={styles.inputWrapper}>
        {/* Menu suggestions - positionné au-dessus de l'input (comportement mobile standard) */}
        {filteredUsers.length > 0 && (
          <SuiviCard
            padding="xs"
            elevation="sm"
            variant="default"
            style={[
              styles.mentionSuggestions,
              {
                backgroundColor: isDark
                  ? tokens.colors.surface.darkElevated
                  : tokens.colors.surface.default,
              },
            ]}
          >
            {filteredUsers.map((user) => (
              <Pressable
                key={user.id}
                style={({ pressed }) => [
                  styles.mentionItem,
                  pressed && {
                    backgroundColor: isDark
                      ? tokens.colors.surface.darkVariant
                      : tokens.colors.neutral.light,
                  },
                ]}
                onPress={() => handleSelectMention(user)}
              >
                <SuiviText variant="body" color="primary">
                  @{user.name}
                </SuiviText>
              </Pressable>
            ))}
          </SuiviCard>
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              height: INPUT_FIXED_HEIGHT,
              minHeight: INPUT_FIXED_HEIGHT,
              maxHeight: INPUT_FIXED_HEIGHT,
              color: theme.colors.onSurface,
              backgroundColor: theme.colors.surface,
              borderColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
            },
          ]}
          value={comment}
          onChangeText={handleTextChange}
          placeholder={t('quickActions.comment.placeholder')}
          multiline
          scrollEnabled
          blurOnSubmit={false}
          textAlignVertical="top"
          placeholderTextColor={isDark ? theme.colors.onSurfaceVariant : tokens.colors.neutral.medium}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <SuiviButton
          title={t('quickActions.comment.send')}
          variant="primary"
          onPress={handleSubmit}
          disabled={!comment.trim()}
        />
      </View>
    </SuiviCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    marginBottom: tokens.spacing.sm,
  },
  // Aperçu live
  previewContainer: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.sm,
  },
  previewLabel: {
    marginBottom: tokens.spacing.xs,
  },
  previewContent: {
    // Container pour les lignes de l'aperçu
  },
  previewLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  // Input
  inputWrapper: {
    position: 'relative',
    marginBottom: tokens.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.md,
    fontSize: tokens.typography.body.fontSize,
    lineHeight: tokens.typography.body.lineHeight,
    fontFamily: tokens.typography.fontFamily.primary,
    flexShrink: 0,
    flexGrow: 0,
  },
  // Suggestions de mentions
  mentionSuggestions: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: tokens.spacing.xs,
    zIndex: 10,
    overflow: 'hidden',
  },
  mentionItem: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.sm,
  },
  // Bouton
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  // Styles de formatage (pour l'aperçu)
  urlText: {
    color: tokens.colors.brand.primary,
    textDecorationLine: 'underline',
  },
  boldText: {
    fontFamily: tokens.typography.display.fontFamily,
  },
  italicText: {
    fontStyle: 'italic',
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
    color: tokens.colors.neutral.medium,
  },
  codeText: {
    backgroundColor: tokens.colors.neutral.light,
    paddingHorizontal: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
    color: tokens.colors.brand.primary,
  },
  mentionText: {
    color: tokens.colors.brand.primary,
    fontWeight: '500',
  },
  // Listes
  listItemLine: {
    marginTop: tokens.spacing.xs,
  },
  listMarker: {
    marginRight: tokens.spacing.sm,
    minWidth: 16,
  },
});
