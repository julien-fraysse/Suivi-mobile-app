import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { SuiviButton } from './SuiviButton';
import { SuiviText } from './SuiviText';
import { SuiviCard } from './SuiviCard';
import { quickCapture } from '../../api/tasksApi.mock';
import { tokens } from '../../theme';

export interface QuickCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * QuickCaptureModal
 * 
 * Modal pour capturer rapidement une tâche minimaliste (Inbox mobile).
 * 
 * Design :
 * - Utilise SuiviCard pour le contenu
 * - Input texte obligatoire : "What do you want to remember?"
 * - Boutons Cancel et "Save to Inbox"
 * - Feedback visuel léger après sauvegarde
 * - Utilise EXCLUSIVEMENT les tokens Suivi
 */
export function QuickCaptureModal({ visible, onClose, onSuccess }: QuickCaptureModalProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (visible) {
      setTitle('');
      setSaved(false);
      setIsLoading(false);
    }
  }, [visible]);

  const handleSave = async () => {
    if (!title.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // TODO: Remplacer par un vrai appel API Suivi quand prêt
      // Pour l'instant, utilise la fonction mock quickCapture depuis tasksApi.mock.ts
      await quickCapture(title.trim());
      
      setSaved(true);
      setIsLoading(false);
      
      // Afficher le feedback "Saved ✓" pendant 1.5s puis fermer
      setTimeout(() => {
        setSaved(false);
        setTitle('');
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error('Error creating quick capture:', error);
      setIsLoading(false);
      // TODO: Afficher un message d'erreur à l'utilisateur
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setSaved(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <SuiviCard padding="lg" elevation="lg" variant="default" style={styles.modalCard}>
                <SuiviText variant="h2" style={styles.title}>
                  Quick Capture
                </SuiviText>
                <SuiviText variant="body" color="secondary" style={styles.subtitle}>
                  Capture quickly what you want to remember
                </SuiviText>

                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="What do you want to remember?"
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter a quick note..."
                    multiline
                    numberOfLines={4}
                    disabled={isLoading || saved}
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark 
                          ? tokens.colors.surface.darkElevated // #242424 en dark mode
                          : tokens.colors.background.default, // #FFFFFF en light mode
                      },
                    ]}
                    contentStyle={[
                      styles.inputContent,
                      {
                        color: isDark 
                          ? tokens.colors.text.dark.primary // #FFFFFF en dark mode
                          : tokens.colors.text.primary, // #4F4A45 en light mode
                      },
                    ]}
                    outlineStyle={[
                      styles.inputOutline,
                      {
                        borderColor: isDark
                          ? tokens.colors.border.darkMode.default // rgba(255,255,255,0.08) en dark mode
                          : tokens.colors.border.default, // #E8E8E8 en light mode
                      },
                    ]}
                    activeOutlineColor={tokens.colors.brand.primary}
                    textColor={isDark 
                      ? tokens.colors.text.dark.primary 
                      : tokens.colors.text.primary}
                    placeholderTextColor={isDark
                      ? tokens.colors.text.dark.hint // #CACACA en dark mode
                      : tokens.colors.text.hint}
                  />
                </View>

                {saved ? (
                  <View style={styles.successContainer}>
                    <SuiviText variant="body" color="primary" style={styles.successText}>
                      Saved ✓
                    </SuiviText>
                  </View>
                ) : (
                  <View style={styles.actions}>
                    <SuiviButton
                      title="Cancel"
                      onPress={handleClose}
                      variant="ghost"
                      disabled={isLoading}
                      style={styles.cancelButton}
                    />
                    <SuiviButton
                      title={isLoading ? "Saving..." : "Save to Inbox"}
                      onPress={handleSave}
                      variant="primary"
                      disabled={!title.trim() || isLoading}
                      style={styles.saveButton}
                    />
                  </View>
                )}
              </SuiviCard>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: tokens.radius.xl,
  },
  title: {
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    marginBottom: tokens.spacing.lg,
  },
  inputContainer: {
    marginBottom: tokens.spacing.lg,
  },
  input: {
    // backgroundColor is set dynamically in the component
  },
  inputContent: {
    fontFamily: tokens.typography.body.fontFamily, // Inter_400Regular
    fontSize: tokens.typography.body.fontSize, // 15
    lineHeight: tokens.typography.body.lineHeight, // 22
    // color is set dynamically in the component
  },
  inputOutline: {
    borderRadius: tokens.radius.md,
    // borderColor is set dynamically in the component
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  successContainer: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  successText: {
    fontWeight: '600',
  },
  loader: {
    marginLeft: tokens.spacing.xs,
  },
});

