import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  Pressable,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviTagIndicator } from '@components/ui/SuiviTagIndicator';
import { tokens } from '@theme';
import { useTasksContext } from '../tasks/TasksContext';
import { useTagsStore } from '@store/tagsStore';
import type { AppStackParamList } from '../navigation/types';
import type { SuiviTag } from '../types/task';

type TagEditModalRoute = RouteProp<AppStackParamList, 'TagEditModal'>;

/**
 * TagEditModal
 * 
 * Écran fullscreen modal pour créer ou éditer un tag.
 * Style Apple-like avec header simple (Cancel / Title / Save).
 * 
 * Gère proprement le clavier avec KeyboardAvoidingView + ScrollView.
 * Utilise exclusivement les tokens Suivi pour le design.
 */
export function TagEditModal() {
  const route = useRoute<TagEditModalRoute>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.dark;
  const { updateTask, tasks: allTasks } = useTasksContext();
  const { createTag, updateTag } = useTagsStore();

  const { mode, tag } = route.params;

  // État local
  const [name, setName] = useState(tag?.name ?? '');
  const [color, setColor] = useState(tag?.color ?? tokens.colors.brand.primary);

  // Couleurs disponibles (reprendre exactement celles de TagPickerBottomSheet)
  const availableColors = [
    tokens.colors.brand.primary,
    tokens.colors.accent.maize,
    tokens.colors.semantic.error,
    tokens.colors.semantic.success,
    tokens.colors.avatar.blue,
    tokens.colors.avatar.mint,
    tokens.colors.avatar.green,
    tokens.colors.avatar.purple,
    tokens.colors.avatar.teal,
    tokens.colors.avatar.yellow,
    tokens.colors.avatar.pink,
    tokens.colors.avatar.lightBlue,
  ];

  // Couleurs pour le thème
  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const textColorSecondary = isDark
    ? tokens.colors.text.dark.secondary
    : tokens.colors.text.secondary;
  const borderColor = isDark
    ? tokens.colors.border.darkMode.default
    : tokens.colors.border.default;
  const backgroundColor = isDark
    ? tokens.colors.background.dark
    : tokens.colors.background.default;

  // Handlers
  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return; // Ne rien faire si le nom est vide
    }

    try {
      if (mode === 'edit' && tag?.id) {
        // Mode édition : mettre à jour le tag dans le store
        updateTag(tag.id, trimmedName, color);
        
        // Mettre à jour toutes les tâches qui utilisent ce tag
        const tasksWithTag = allTasks.filter(
          (t) => t.tags?.some((taskTag) => taskTag.id === tag.id)
        );
        
        // Batch toutes les mises à jour en parallèle
        const updatePromises = tasksWithTag.map((taskWithTag) => {
          const updatedTags = taskWithTag.tags?.map((taskTag) =>
            taskTag.id === tag.id ? { ...taskTag, name: trimmedName, color } : taskTag
          );
          if (updatedTags) {
            return updateTask(taskWithTag.id, { tags: updatedTags });
          }
          return Promise.resolve();
        });
        
        // Attendre que toutes les mises à jour soient terminées
        await Promise.all(updatePromises);
      } else if (mode === 'create') {
        // Mode création : créer le tag dans le store
        createTag(trimmedName, color);
        // Le tag est automatiquement ajouté à availableTags dans le store
      }

      // Fermer le modal après sauvegarde (seulement après que toutes les Promises soient résolues)
      navigation.goBack();
    } catch (err) {
      console.error('Error saving tag:', err);
      // Fermer le modal même en cas d'erreur pour éviter le freeze
      navigation.goBack();
      // TODO: Afficher une notification d'erreur à l'utilisateur
    }
  };

  const isSaveDisabled = name.trim().length === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      {/* Header Apple-like */}
      <View style={styles.header}>
        <Pressable onPress={handleCancel} style={styles.headerButton}>
          <SuiviText variant="body" color="secondary">
            {t('common.cancel')}
          </SuiviText>
        </Pressable>
        <View style={styles.headerTitle}>
          <SuiviText variant="h2" style={{ color: textColorPrimary }}>
            {mode === 'edit' ? t('taskDetail.editTag') : t('taskDetail.createTag')}
          </SuiviText>
        </View>
        <Pressable
          onPress={handleSave}
          style={styles.headerButton}
          disabled={isSaveDisabled}
        >
          <SuiviText
            variant="body"
            color={isSaveDisabled ? 'secondary' : 'primary'}
          >
            {t('common.save')}
          </SuiviText>
        </Pressable>
      </View>

      {/* Corps avec gestion du clavier */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        style={styles.keyboardView}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Champ nom du tag */}
          <View style={styles.section}>
            <SuiviText variant="body" color="secondary" style={styles.label}>
              {t('taskDetail.tagName')}
            </SuiviText>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: textColorPrimary,
                  borderColor: borderColor,
                  backgroundColor: isDark
                    ? tokens.colors.surface.darkVariant
                    : tokens.colors.surface.default,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder={t('taskDetail.tagName')}
              placeholderTextColor={tokens.colors.neutral.medium}
              autoFocus
            />
          </View>

          {/* Palette de couleurs */}
          <View style={styles.section}>
            <SuiviText variant="body" color="secondary" style={styles.label}>
              {t('taskDetail.tagColor')}
            </SuiviText>
            <View style={styles.colorPicker}>
              {availableColors.map((colorOption) => (
                <Pressable
                  key={colorOption}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: colorOption,
                      borderColor:
                        color === colorOption
                          ? tokens.colors.brand.primary
                          : borderColor,
                      borderWidth: color === colorOption ? 2 : 1,
                    },
                  ]}
                  onPress={() => setColor(colorOption)}
                />
              ))}
            </View>
          </View>

          {/* Aperçu du tag */}
          {name.trim().length > 0 && (
            <View style={styles.section}>
              <SuiviText variant="body" color="secondary" style={styles.label}>
                {t('taskDetail.preview', { defaultValue: 'Aperçu' })}
              </SuiviText>
              <View style={styles.previewContainer}>
                <SuiviTagIndicator
                  tag={{
                    id: tag?.id ?? 'preview',
                    name: name.trim(),
                    color,
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  },
  headerButton: {
    minWidth: 60,
    paddingVertical: tokens.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxl,
    paddingTop: tokens.spacing.lg,
  },
  section: {
    marginBottom: tokens.spacing.xl,
  },
  label: {
    marginBottom: tokens.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.typography.body.fontSize,
    fontFamily: tokens.typography.body.fontFamily,
    minHeight: 44,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
  },
  previewContainer: {
    marginTop: tokens.spacing.sm,
  },
});

