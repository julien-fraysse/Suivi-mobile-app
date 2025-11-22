import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TextInput,
  Keyboard,
  Text,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SuiviButton } from './SuiviButton';
import { SuiviText } from './SuiviText';
import { quickCapture } from '../../api/tasksApi.mock';
import { tokens } from '@theme';
import { useTasksContext } from '../../tasks/TasksContext';

export interface QuickCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * QuickCaptureModal
 * 
 * Modal professionnel pour capturer rapidement une tâche minimaliste (Inbox mobile).
 * 
 * Design :
 * - Modal avec animation fade + scale
 * - Input multiline autosizing (max 3-4 lignes visibles)
 * - Container moderne avec coins arrondis 24px, shadow medium
 * - Titre "Quick Capture" et sous-titre
 * - Zone d'actions en bas : Cancel (outlined) et Send to Suivi (primary)
 * - Tap outside to close
 * - Form reset après submit
 * - Support light/dark mode complet
 */
export function QuickCaptureModal({ visible, onClose, onSuccess }: QuickCaptureModalProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { refreshTasks } = useTasksContext();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (visible) {
      setText('');
      setIsLoading(false);
      
      // Start animations - ensure they always complete
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start((finished) => {
        if (finished) {
          console.log('[QuickCaptureModal] Animations completed');
        } else {
          // Fallback: force values if animation was interrupted
          fadeAnim.setValue(1);
          scaleAnim.setValue(1);
        }
      });

      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleSave = async () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // TODO: Remplacer par un vrai appel API Suivi quand prêt
      // Pour l'instant, utilise la fonction mock quickCapture depuis tasksApi.mock.ts
      await quickCapture(text.trim());
      
      // Rafraîchir les tâches pour que le TasksProvider reflète la nouvelle tâche
      await refreshTasks();
      
      setIsLoading(false);
      
      // Reset form et fermer modal
      setText('');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating quick capture:', error);
      setIsLoading(false);
      // TODO: Afficher un message d'erreur à l'utilisateur
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setText('');
      onClose();
    }
  };

  const handleBackdropPress = () => {
    if (!isLoading) {
      Keyboard.dismiss();
      handleClose();
    }
  };

  // Background colors selon le thème
  const modalBackground = isDark ? '#1C1C1E' : '#FFFFFF';
  const inputBackground = isDark ? '#2A2A2C' : '#F3F3F4';
  const placeholderColor = isDark ? '#7A7A7A' : '#9A9A9A';
  const textColor = isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary;
  
  // Button colors
  const cancelTextColor = isDark ? '#B0B0B0' : '#6A6A6A';
  const cancelBorderColor = isDark ? '#3A3A3A' : '#CACACA';

  // Debug: Log when modal visibility changes
  useEffect(() => {
    if (visible) {
      console.log('[QuickCaptureModal] Modal should be visible');
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleBackdropPress}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                style={[
                  styles.modal,
                  {
                    backgroundColor: modalBackground,
                    ...tokens.shadows.card,
                  },
                ]}
              >
                {/* Title */}
                <SuiviText
                  variant="h2"
                  style={[
                    styles.title,
                    {
                      color: textColor,
                      fontSize: 20,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  Quick Capture
                </SuiviText>

                {/* Subtitle */}
                <SuiviText
                  variant="body"
                  color="secondary"
                  style={[
                    styles.subtitle,
                    {
                      fontSize: 14,
                      color: isDark ? tokens.colors.text.dark.secondary : tokens.colors.text.secondary,
                    },
                  ]}
                >
                  Capture quickly what you want to remember
                </SuiviText>

                {/* Text Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={inputRef}
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBackground,
                        color: textColor,
                      },
                    ]}
                    placeholder="Enter a quick note..."
                    placeholderTextColor={placeholderColor}
                    value={text}
                    onChangeText={setText}
                    multiline
                    textAlignVertical="top"
                    maxLength={500}
                    editable={!isLoading}
                    autoFocus={false}
                  />
                </View>

                {/* Buttons Row - Stacked */}
                <View style={styles.actions}>
                  {/* Send to Suivi Button */}
                  <SuiviButton
                    title={isLoading ? 'Sending...' : 'Send to Suivi'}
                    onPress={handleSave}
                    variant="primary"
                    disabled={!text.trim() || isLoading}
                    fullWidth
                    style={styles.sendButton}
                  />

                  {/* Cancel Button */}
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      {
                        height: 48,
                        borderRadius: 16,
                        borderColor: cancelBorderColor,
                        borderWidth: 1,
                        opacity: isLoading ? 0.6 : 1,
                      },
                    ]}
                    onPress={handleClose}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.cancelButtonText,
                        {
                          color: cancelTextColor,
                        },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
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
  backdropTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    maxWidth: 500,
  },
  title: {
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    marginBottom: tokens.spacing.xl,
  },
  inputContainer: {
    marginBottom: tokens.spacing.xl,
  },
  input: {
    borderRadius: 16,
    padding: 14,
    minHeight: 80,
    maxHeight: 120,
    fontSize: 16,
    fontFamily: tokens.typography.body.fontFamily,
    lineHeight: 22,
  },
  actions: {
    gap: tokens.spacing.md,
  },
  sendButton: {
    width: '100%',
    height: 48,
    borderRadius: 16,
  },
  cancelButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontFamily: tokens.typography.label.fontFamily,
    fontSize: tokens.typography.label.fontSize,
    fontWeight: '500',
  },
});
