import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SuiviText } from './SuiviText';
import { tokens, getShadowStyle } from '@theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
  /** Callback appelé lorsque le bouton "Done" est pressé (si fourni, affiche le bouton) */
  onDone?: () => void;
}

/**
 * BottomSheet
 * 
 * Composant standardisé pour tous les menus "montants" (bottom sheets) dans l'app Suivi.
 * 
 * Pattern standard :
 * - Modal transparent avec animations personnalisées
 * - Backdrop semi-transparent avec FADE (opacity)
 * - Sheet avec SLIDE UP (translateY)
 * - Les deux animations sont INDÉPENDANTES (comportement professionnel)
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
  onDone,
}: BottomSheetProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();

  // Animation values - séparées pour backdrop et sheet
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Track si le modal est en train de fermer (pour éviter double fermeture)
  const isClosing = useRef(false);

  // Couleurs selon le thème (tokens uniquement)
  const backgroundColor = isDark
    ? tokens.colors.surface.darkElevated
    : tokens.colors.background.default;
  const textColorPrimary = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;
  const handleColor = isDark
    ? tokens.colors.neutral.medium
    : tokens.colors.neutral.light;

  // Animation d'ouverture
  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      // Reset les valeurs au cas où
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(SCREEN_HEIGHT);

      // Animations parallèles : fade backdrop + slide sheet
      Animated.parallel([
        // Backdrop : fade-in opacity
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: tokens.animation.normal, // 250ms
          useNativeDriver: true,
        }),
        // Sheet : slide-up avec spring pour effet naturel
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  // Animation de fermeture contrôlée
  const handleAnimatedClose = useCallback(() => {
    // Éviter double fermeture
    if (isClosing.current) return;
    isClosing.current = true;

    // Animations parallèles de sortie
    Animated.parallel([
      // Backdrop : fade-out opacity
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: tokens.animation.fast, // 150ms
        useNativeDriver: true,
      }),
      // Sheet : slide-down
      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: tokens.animation.fast, // 150ms
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Appeler onClose APRÈS la fin de l'animation
      onClose();
    });
  }, [backdropOpacity, sheetTranslateY, onClose]);

  // Handler pour hardware back button (Android) et onRequestClose
  const handleRequestClose = useCallback(() => {
    handleAnimatedClose();
  }, [handleAnimatedClose]);

  // Contenu de la sheet
  const content = (
    <>
      {/* Handle indicator - toujours centré en haut */}
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

      {/* Header iOS-style : titre centré + bouton Done optionnel à droite */}
      {title && (
        <View style={styles.header}>
          {/* Spacer gauche pour équilibrer le bouton Done à droite */}
          <View style={styles.headerSpacer}>
            {/* Vide - sert uniquement à centrer le titre */}
          </View>
          
          {/* Titre centré */}
          <View style={styles.headerTitleContainer}>
            <SuiviText variant="h2" style={[styles.headerTitle, { color: textColorPrimary }]}>
              {title}
            </SuiviText>
          </View>
          
          {/* Bouton Done à droite (ou spacer vide si pas de onDone) */}
          <View style={styles.headerSpacer}>
            {onDone && (
              <Pressable
                onPress={onDone}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => [
                  styles.doneButton,
                  pressed && styles.doneButtonPressed,
                ]}
              >
                <SuiviText
                  variant="label"
                  style={{ color: tokens.colors.brand.primary }}
                >
                  {t('common.done')}
                </SuiviText>
              </Pressable>
            )}
          </View>
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
      animationType="none"
      onRequestClose={handleRequestClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        {/* Backdrop semi-transparent avec FADE animation */}
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleAnimatedClose}
          />
        </Animated.View>

        {/* Bottom Sheet Panel avec SLIDE animation */}
        <Animated.View
          style={[
            styles.sheetContainer,
            { backgroundColor, maxHeight: maxHeight as ViewStyle['maxHeight'] },
            { ...getShadowStyle('lg', isDark), shadowOffset: { width: 0, height: -2 } },
            { transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <SafeAreaView edges={['bottom']}>
            {content}
          </SafeAreaView>
        </Animated.View>
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
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.xs,
  },
  handleIndicator: {
    width: 36,
    height: 5,
    borderRadius: tokens.radius.xs,
  },
  // Header iOS-style avec titre centré
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  headerSpacer: {
    width: 60, // Largeur fixe pour équilibrer le titre
    alignItems: 'flex-end',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  doneButton: {
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.sm,
  },
  doneButtonPressed: {
    opacity: 0.6,
  },
  content: {
    paddingBottom: tokens.spacing.sm,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.sm,
  },
});

/**
 * Styles réutilisables pour les options de sélection dans BottomSheet
 * À utiliser avec Pressable dans les pickers (Priority, Assignee, etc.)
 * 
 * Pattern d'utilisation :
 * ```tsx
 * <Pressable
 *   style={({ pressed }) => [
 *     bottomSheetOptionStyles.optionRow,
 *     isSelected && bottomSheetOptionStyles.optionRowSelected,
 *     pressed && bottomSheetOptionStyles.optionRowPressed,
 *     { borderColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default },
 *     isSelected && { borderColor: tokens.colors.brand.primary },
 *   ]}
 * >
 *   ...
 * </Pressable>
 * ```
 */
export const bottomSheetOptionStyles = StyleSheet.create({
  // Container de l'option (rectangle arrondi avec outline)
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    marginBottom: tokens.spacing.sm,
    minHeight: 56,
  },
  // État sélectionné (background + border accentuée)
  optionRowSelected: {
    backgroundColor: tokens.colors.brand.primaryLight + '1A', // 10% opacity
  },
  // État pressed (feedback visuel)
  optionRowPressed: {
    opacity: 0.7,
  },
  // Container gauche (avatar + label)
  optionLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // Avatar (pour Assignee picker)
  optionAvatar: {
    marginRight: tokens.spacing.md,
  },
  // Label de l'option
  optionLabel: {
    flex: 1,
  },
  // Container du checkmark (droite)
  optionCheckmark: {
    marginLeft: tokens.spacing.sm,
  },
});
