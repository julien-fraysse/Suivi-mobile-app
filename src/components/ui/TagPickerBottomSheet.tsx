import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheet } from './BottomSheet';
import { SuiviText } from './SuiviText';
import { SuiviTagIndicator } from './SuiviTagIndicator';
import { tokens } from '@theme';
import type { SuiviTag } from '../../types/task';

export interface TagPickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedTags: SuiviTag[];
  onSelectTags: (tags: SuiviTag[], shouldClose?: boolean) => void;
  availableTags: SuiviTag[];
  onOpenTagEditor: (options: { mode: 'create' | 'edit'; tag?: SuiviTag }) => void;
  onDeleteTag?: (tagId: string) => void;
}

/**
 * TagPickerBottomSheet
 * 
 * Bottom sheet complet pour sélectionner, créer, modifier ou supprimer des tags.
 * 
 * Fonctionnalités :
 * - Liste des tags disponibles (scrollable si nécessaire)
 * - Sélection multiple (sans limite)
 * - Ouvrir la modal d'édition/création via onOpenTagEditor
 * - Supprimer un tag (confirm destructive)
 * 
 * Basé sur le composant standard BottomSheet.
 * Utilise exclusivement les tokens Suivi.
 */
export function TagPickerBottomSheet({
  visible,
  onClose,
  selectedTags,
  onSelectTags,
  availableTags,
  onOpenTagEditor,
  onDeleteTag,
}: TagPickerBottomSheetProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();

  const [deletedTagIds, setDeletedTagIds] = useState<string[]>([]);
  const innerScrollViewRef = useRef<ScrollView>(null);


  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const textColorSecondary = isDark
    ? tokens.colors.text.dark.secondary
    : tokens.colors.text.secondary;
  const borderColor = isDark
    ? tokens.colors.border.darkMode.default
    : tokens.colors.border.default;

  const handleToggleTag = (tag: SuiviTag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      // Désélectionner
      const updatedTags = selectedTags.filter((t) => t.id !== tag.id);
      // Passer false pour ne pas fermer le bottom sheet (multi-sélection live)
      onSelectTags(updatedTags, false);
    } else {
      // Sélectionner (sans limite)
      const updatedTags = [...selectedTags, tag];
      // Passer false pour ne pas fermer le bottom sheet (multi-sélection live)
      onSelectTags(updatedTags, false);
    }
  };


  const handleDeleteTag = async (tagId: string) => {
    if (!onDeleteTag) return;
    
    Alert.alert(
      t('taskDetail.deleteTag'),
      t('taskDetail.confirmDeleteTag'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            // Retirer le tag de la liste affichée immédiatement (optimiste)
            setDeletedTagIds((prev) => [...prev, tagId]);
            
            // Retirer le tag de la sélection immédiatement (optimiste)
            const updatedSelectedTags = selectedTags.filter((t) => t.id !== tagId);
            // Passer false pour ne pas fermer le bottom sheet
            onSelectTags(updatedSelectedTags, false);
            
            // Appeler onDeleteTag (peut être async)
            const result = onDeleteTag(tagId);
            if (result instanceof Promise) {
              try {
                await result;
                // Le tag sera retiré de availableTags par le parent
                // deletedTagIds sera nettoyé automatiquement par le useEffect qui surveille availableTags
              } catch (err) {
                console.error('Error deleting tag:', err);
                // Rollback en cas d'erreur
                setDeletedTagIds((prev) => prev.filter((id) => id !== tagId));
                onSelectTags(selectedTags);
              }
            }
            // Si ce n'est pas une Promise, deletedTagIds sera nettoyé par le useEffect
          },
        },
      ]
    );
  };

  // Synchroniser deletedTagIds avec availableTags : retirer les IDs qui ne sont plus dans availableTags
  useEffect(() => {
    setDeletedTagIds((prev) => {
      // Si un tag n'est plus dans availableTags, c'est qu'il a été supprimé avec succès
      // On peut donc le retirer de deletedTagIds (car il n'apparaîtra plus dans la liste)
      return prev.filter((deletedId) => {
        // Garder uniquement les IDs qui sont encore dans availableTags (suppression en cours)
        // Retirer les IDs qui ne sont plus dans availableTags (suppression réussie)
        return availableTags.some((tag) => tag.id === deletedId);
      });
    });
  }, [availableTags]);

  const handleClose = () => {
    setDeletedTagIds([]);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={t('taskDetail.tags')}
      scrollable={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={innerScrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: tokens.spacing.xxl }}
          showsVerticalScrollIndicator={false}
        >
          {/* Liste des tags disponibles */}
          <View style={styles.tagsList}>
        {availableTags.filter((tag) => !deletedTagIds.includes(tag.id)).map((tag) => {
          const isSelected = selectedTags.some((t) => t.id === tag.id);

          return (
            <Pressable
              key={tag.id}
              style={({ pressed }) => [
                styles.tagItem,
                {
                  opacity: pressed ? 0.7 : 1,
                  borderBottomColor: borderColor,
                  backgroundColor: isSelected
                    ? (isDark
                        ? tokens.colors.surface.darkVariant
                        : tokens.colors.neutral.light)
                    : 'transparent',
                },
              ]}
              onPress={() => handleToggleTag(tag)}
            >
              <View style={styles.tagItemContent}>
                <SuiviTagIndicator tag={tag} />
              </View>
              <View style={styles.tagItemActions}>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={tokens.colors.brand.primary}
                  />
                )}
                <Pressable
                  onPress={() => onOpenTagEditor({ mode: 'edit', tag })}
                  style={styles.tagActionButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={18}
                    color={textColorSecondary}
                  />
                </Pressable>
                {onDeleteTag && (
                  <Pressable
                    onPress={() => handleDeleteTag(tag.id)}
                    style={styles.tagActionButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={18}
                      color={tokens.colors.semantic.error}
                    />
                  </Pressable>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Bouton créer un tag */}
      <Pressable
        onPress={() => onOpenTagEditor({ mode: 'create' })}
        style={({ pressed }) => [
          styles.createButton,
          {
            opacity: pressed ? 0.7 : 1,
            borderColor: borderColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="plus"
          size={20}
          color={tokens.colors.brand.primary}
        />
        <SuiviText variant="body" color="primary">
          {t('taskDetail.createTag')}
        </SuiviText>
      </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  tagsList: {
    paddingBottom: tokens.spacing.sm,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: 1,
    marginBottom: tokens.spacing.xs,
    borderRadius: tokens.radius.md,
  },
  tagItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tagItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  tagActionButton: {
    padding: tokens.spacing.xs,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  limitMessage: {
    marginTop: tokens.spacing.sm,
    alignItems: 'center',
  },
});

