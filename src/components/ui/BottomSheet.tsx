import React from 'react';
import { View, StyleSheet, Pressable, Modal, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SuiviText } from './SuiviText';
import { tokens, getShadowStyle } from '@theme';

export interface BottomSheetProps {
  /** Contrôle la visibilité du bottom sheet */
  visible: boolean;
  /** Callback appelé lors de la fermeture (backdrop ou onRequestClose) */
  onClose: () => void;
  /** Titre optionnel affiché en header (si non fourni, pas de header) */
  title?: string;
  /** Contenu du bottom sheet */
  children: React.ReactNode;
  /** Hauteur maximale (par défaut '60%') */
  maxHeight?: string | number;
  /** Afficher le handle indicator (par défaut true) */
  showHandle?: boolean;
  /** Activer le scroll interne si nécessaire (par défaut false) */
  scrollable?: boolean;
}

/**
 * BottomSheet
 * 
 * Composant standardisé pour tous les menus "montants" (bottom sheets) dans l'app Suivi.
 * 
 * Pattern standard :
 * - Modal transparent avec animation slide
 * - Backdrop semi-transparent
 * - Fond arrondi top-xl
 * - Drag handle centré (optionnel)
 * - Header avec titre (optionnel)
 * - Scroll intérieur si nécessaire
 * - Cohérence light/dark via tokens + MD3
 * 
 * Utilise exclusivement les tokens Suivi pour les couleurs, spacing, radius, shadows.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  maxHeight = '60%',
  showHandle = true,
  scrollable = false,
}: BottomSheetProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  const backgroundColor = isDark
    ? tokens.colors.surface.darkElevated
    : tokens.colors.background.default;
  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const handleColor = isDark
    ? tokens.colors.neutral.medium
    : tokens.colors.neutral.light;

  const content = (
    <>
      {/* Handle indicator */}
      {showHandle && (
        <View style={styles.handleContainer}>
          <View
            style={[
              styles.handleIndicator,
              { backgroundColor: handleColor },
            ]}
          />
        </View>
      )}

      {/* Header */}
      {title && (
        <View style={styles.header}>
          <SuiviText variant="h1" style={{ color: textColorPrimary }}>
            {title}
          </SuiviText>
        </View>
      )}

      {/* Content */}
      {scrollable ? (
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </>
  );

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
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor, maxHeight },
            { ...getShadowStyle('lg', isDark), shadowOffset: { width: 0, height: -2 } },
          ]}
        >
          <SafeAreaView edges={['bottom']}>
            {content}
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
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: tokens.radius.xs,
  },
  header: {
    marginBottom: tokens.spacing.lg,
  },
  content: {
    paddingBottom: tokens.spacing.sm,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.sm,
  },
});

