import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { tokens } from '@theme';

export interface HomeSearchBarProps {
  /**
   * Callback appelé à chaque changement de texte (pour debounce côté parent)
   */
  onChangeQuery?: (query: string) => void;
  /**
   * Callback appelé lors de la soumission (Enter ou tap sur icône)
   */
  onSubmit?: (query: string) => void;
  /**
   * Valeur contrôlée (optionnel - si non fourni, utilise un state interne)
   */
  value?: string;
}

/**
 * HomeSearchBar
 * 
 * Barre de recherche pour l'écran Home.
 * Composant de présentation agnostique du domaine "search".
 * 
 * - Style pill-shaped (borderRadius full)
 * - Icône de recherche à gauche
 * - Couleurs adaptées au thème (light/dark mode)
 * - Mode contrôlé (value + onChangeQuery) ou non contrôlé (state interne)
 * 
 * Note: SearchBar n'applique aucune marge horizontale pour hériter
 * du padding global de HomeScreen (paddingHorizontal: tokens.spacing.lg).
 * Cela garantit un alignement parfait avec toutes les sections de la Home.
 * 
 * La logique de recherche (debounce, appel au store) est gérée par le parent (HomeScreen).
 */
export function HomeSearchBar({ onChangeQuery, onSubmit, value }: HomeSearchBarProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();
  
  // State interne pour le mode non contrôlé
  const [internalQuery, setInternalQuery] = useState('');
  
  // Utiliser la valeur contrôlée si fournie, sinon le state interne
  const searchQuery = value !== undefined ? value : internalQuery;

  const handleChangeText = (text: string) => {
    // Mode non contrôlé : mettre à jour le state interne
    if (value === undefined) {
      setInternalQuery(text);
    }
    // Notifier le parent du changement
    if (onChangeQuery) {
      onChangeQuery(text);
    }
  };

  const handleSearchSubmit = () => {
    if (onSubmit) {
      onSubmit(searchQuery);
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
        onChangeText={handleChangeText}
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

