import React from 'react';
import { StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  padding?: keyof typeof tokens.spacing;
  style?: ViewStyle;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
}

/**
 * ScreenContainer
 * 
 * Conteneur de base pour tous les écrans.
 * Gère SafeAreaView, padding cohérent, background, et optionnellement le scroll.
 * Utilise EXCLUSIVEMENT les tokens Suivi pour les couleurs.
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  padding = 'md',
  style,
  safeAreaEdges = ['top'], // Par défaut : seulement top (le bottom est géré par la TabBar dans les tabs)
  scrollable = false,
  contentContainerStyle,
}) => {
  const theme = useTheme();
  const isDark = theme.dark;

  // Background adapté selon le thème (background en dark mode)
  const backgroundColor = isDark 
    ? tokens.colors.background.dark // #0F0F0F en dark mode (matte black style)
    : tokens.colors.background.surface; // #F4F2EE en light mode (sand)

  const containerStyle = [
    styles.container,
    {
      backgroundColor,
    },
    !scrollable && {
      padding: tokens.spacing[padding],
    },
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        {
          padding: tokens.spacing[padding],
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView edges={safeAreaEdges} style={containerStyle}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

