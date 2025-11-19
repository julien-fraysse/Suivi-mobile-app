import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { tokens } from '../theme';

export interface HomeSearchBarProps {
  /**
   * Callback when search is submitted
   */
  onSearch?: (query: string) => void;
}

/**
 * HomeSearchBar
 * 
 * Barre de recherche pour l'écran Home uniquement.
 * Prête pour intégration future avec les APIs Suivi.
 * 
 * - Style pill-shaped (borderRadius full)
 * - Icône de recherche à gauche
 * - Couleurs adaptées au thème (light/dark mode)
 */
export function HomeSearchBar({ onSearch }: HomeSearchBarProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Fallback : log pour debug (sera remplacé par l'intégration API)
      // TODO: wire this search to real Suivi APIs (tasks, notifications, boards) later.
      console.log('Search query:', searchQuery);
    }
  };

  const handleSearchIconPress = () => {
    handleSearchSubmit();
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder={t('home.searchPlaceholder')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        style={[
          styles.searchInput,
          {
            backgroundColor: isDark
              ? tokens.colors.surface.darkElevated // #242424 en dark mode
              : tokens.colors.background.default, // #FFFFFF en light mode
          },
        ]}
        contentStyle={[
          styles.searchInputContent,
          {
            color: isDark
              ? tokens.colors.text.dark.primary // #FFFFFF en dark mode
              : tokens.colors.text.primary, // #4F4A45 en light mode
          },
        ]}
        outlineStyle={[
          styles.searchOutline,
          {
            borderColor: isDark
              ? tokens.colors.border.darkMode.default // rgba(255,255,255,0.08) en dark mode
              : tokens.colors.border.default, // #E8E8E8 en light mode
          },
        ]}
        placeholderTextColor={
          isDark
            ? tokens.colors.text.dark.hint // #CACACA en dark mode
            : tokens.colors.text.hint // #98928C en light mode
        }
        left={
          <TextInput.Icon
            icon="magnify"
            onPress={handleSearchIconPress}
            iconColor={
              isDark
                ? tokens.colors.text.dark.secondary // #CACACA en dark mode
                : tokens.colors.text.secondary // #98928C en light mode
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: tokens.spacing.lg,
  },
  searchInput: {
    borderRadius: tokens.radius.full, // Pill shape
  },
  searchInputContent: {
    paddingHorizontal: tokens.spacing.md,
  },
  searchOutline: {
    borderRadius: tokens.radius.full, // Pill shape
  },
});

