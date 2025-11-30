import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SuiviButton } from './SuiviButton';
import { SuiviText } from './SuiviText';
import { tokens } from '@theme';

/**
 * Profile interface for EditProfileModal
 */
export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSave: (changes: Partial<Profile>) => void;
}

/**
 * EditProfileModal
 * 
 * Modal pour éditer les informations de profil de base.
 * 
 * Fields:
 * - First name (editable)
 * - Last name (editable)
 * - Email (read-only for now)
 * 
 * Actions:
 * - Cancel -> closes modal without saving
 * - Save (primary) -> calls onSave with updated values, then closes modal
 */
export function EditProfileModal({
  visible,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Initialize form when modal opens or profile changes
  useEffect(() => {
    if (visible && profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
    }
  }, [visible, profile]);

  const handleSave = () => {
    if (!profile) return;

    const changes: Partial<UserProfile> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    onSave(changes);
    onClose();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  // Background colors
  const modalBackground = isDark ? '#1C1C1E' : '#FFFFFF';
  const inputBackground = isDark ? '#2A2A2C' : '#F3F3F4';
  const placeholderColor = isDark ? '#7A7A7A' : '#9A9A9A';
  const textColor = isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary;
  const borderColor = isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default;

  if (!profile) return null;

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
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
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
                {t('editProfile.title')}
              </SuiviText>

              {/* First Name */}
              <View style={styles.inputContainer}>
                <SuiviText
                  variant="label"
                  color="secondary"
                  style={styles.label}
                >
                  {t('editProfile.firstName')}
                </SuiviText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBackground,
                      color: textColor,
                      borderColor,
                    },
                  ]}
                  placeholder="Enter first name"
                  placeholderTextColor={placeholderColor}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Last Name */}
              <View style={styles.inputContainer}>
                <SuiviText
                  variant="label"
                  color="secondary"
                  style={styles.label}
                >
                  {t('editProfile.lastName')}
                </SuiviText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBackground,
                      color: textColor,
                      borderColor,
                    },
                  ]}
                  placeholder="Enter last name"
                  placeholderTextColor={placeholderColor}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Email (read-only) */}
              <View style={styles.inputContainer}>
                <SuiviText
                  variant="label"
                  color="secondary"
                  style={styles.label}
                >
                  {t('editProfile.email')}
                </SuiviText>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputReadOnly,
                    {
                      backgroundColor: inputBackground,
                      color: isDark ? tokens.colors.text.dark.secondary : tokens.colors.text.secondary,
                      borderColor,
                    },
                  ]}
                  value={profile.email}
                  editable={false}
                  placeholderTextColor={placeholderColor}
                />
                <SuiviText
                  variant="caption"
                  color="hint"
                  style={styles.hint}
                >
                  {t('editProfile.emailLocked')}
                </SuiviText>
              </View>

              {/* Buttons */}
              <View style={styles.actions}>
                <SuiviButton
                  title={t('editProfile.save')}
                  onPress={handleSave}
                  variant="primary"
                  fullWidth
                  style={styles.saveButton}
                />
                <SuiviButton
                  title={t('editProfile.cancel')}
                  onPress={handleClose}
                  variant="ghost"
                  fullWidth
                  style={styles.cancelButton}
                />
              </View>
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
  modal: {
    width: '100%',
    maxWidth: '90%',
    borderRadius: tokens.radius.xl,
    padding: 24,
  },
  title: {
    marginBottom: tokens.spacing.xl,
  },
  inputContainer: {
    marginBottom: tokens.spacing.lg,
  },
  label: {
    marginBottom: tokens.spacing.sm,
  },
  input: {
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    fontSize: 16,
    fontFamily: tokens.typography.body.fontFamily,
    borderWidth: 1,
    minHeight: 48,
  },
  inputReadOnly: {
    opacity: 0.7,
  },
  hint: {
    marginTop: tokens.spacing.xs,
  },
  actions: {
    marginTop: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  saveButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});

