import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Modal, SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SuiviText } from './SuiviText';
import { tokens } from '@theme';
import type { TaskStatus } from '../../tasks/tasks.types';

export interface SuiviStatusPickerProps {
  visible: boolean;
  onClose: () => void;
  currentStatus: TaskStatus;
  onSelectStatus: (status: TaskStatus) => void;
}

/**
 * SuiviStatusPicker
 * 
 * Modal bottom sheet picker pour sélectionner le statut d'une tâche.
 * Affiche les 4 statuts disponibles : Todo, In Progress, Blocked, Done.
 * 
 * Utilise Modal de react-native en mode transparent pour afficher un panneau
 * qui remonte du bas avec un backdrop assombri.
 * Utilise les tokens Suivi pour les couleurs et le dark mode.
 */
export function SuiviStatusPicker({
  visible,
  onClose,
  currentStatus,
  onSelectStatus,
}: SuiviStatusPickerProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();

  // Handle status selection
  const handleSelectStatus = useCallback(
    (status: TaskStatus) => {
      onSelectStatus(status);
      onClose();
    },
    [onSelectStatus, onClose]
  );

  // Get status color
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'todo':
        return tokens.colors.brand.primary; // #4F5DFF - violet
      case 'in_progress':
        return '#FF6B35'; // Orange, même couleur que TaskItem
      case 'blocked':
        return tokens.colors.semantic.error; // #D32F2F - red
      case 'done':
        return tokens.colors.semantic.success; // #00C853 - green
      default:
        return tokens.colors.neutral.medium;
    }
  };

  // Format status for display using i18n
  const formatStatus = (status: TaskStatus): string => {
    switch (status) {
      case 'todo':
        return t('tasks.status.todo');
      case 'in_progress':
        return t('tasks.status.inProgress');
      case 'blocked':
        return t('tasks.status.blocked');
      case 'done':
        return t('tasks.status.done');
      default:
        return status;
    }
  };

  // All available statuses
  const statuses: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done'];

  const backgroundColor = isDark
    ? tokens.colors.surface.darkElevated
    : tokens.colors.background.default;
  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const textColorSecondary = isDark
    ? tokens.colors.text.dark.secondary
    : tokens.colors.text.secondary;
  const borderColor = isDark
    ? tokens.colors.border.darkMode.default
    : tokens.colors.border.default;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        {/* Backdrop semi-transparent */}
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Bottom Sheet Panel */}
        <View style={[styles.sheetContainer, { backgroundColor }]}>
          <SafeAreaView edges={['bottom']}>
            {/* Handle indicator */}
            <View style={styles.handleContainer}>
              <View
                style={[
                  styles.handleIndicator,
                  {
                    backgroundColor: isDark
                      ? tokens.colors.neutral.medium
                      : tokens.colors.neutral.light,
                  },
                ]}
              />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <SuiviText variant="h1" style={{ color: textColorPrimary }}>
                {t('tasks.selectStatus')}
              </SuiviText>
            </View>

            {/* Status List */}
            <View style={styles.statusList}>
              {statuses.map((status) => {
                const isSelected = status === currentStatus;
                const statusColor = getStatusColor(status);
                const itemBackgroundColor = isSelected
                  ? (isDark
                      ? tokens.colors.surface.darkVariant
                      : tokens.colors.neutral.light)
                  : 'transparent';

                return (
                  <Pressable
                    key={status}
                    style={({ pressed }) => [
                      styles.statusItem,
                      {
                        backgroundColor: itemBackgroundColor,
                        borderBottomColor: borderColor,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                    onPress={() => handleSelectStatus(status)}
                  >
                    <View style={styles.statusItemContent}>
                      <View
                        style={[
                          styles.statusIndicator,
                          { backgroundColor: statusColor },
                        ]}
                      />
                      <SuiviText
                        variant="body"
                        style={[
                          styles.statusText,
                          {
                            color: isSelected
                              ? textColorPrimary
                              : textColorSecondary,
                            fontWeight: isSelected ? '600' : '400',
                          },
                        ]}
                      >
                        {formatStatus(status)}
                      </SuiviText>
                    </View>
                    {isSelected && (
                      <SuiviText
                        variant="body"
                        style={{ color: tokens.colors.brand.primary }}
                      >
                        ✓
                      </SuiviText>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    marginBottom: tokens.spacing.lg,
  },
  statusList: {
    paddingBottom: tokens.spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: 1,
    marginBottom: tokens.spacing.xs,
    borderRadius: tokens.radius.md,
  },
  statusItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: tokens.spacing.md,
  },
  statusText: {
    flex: 1,
  },
});

