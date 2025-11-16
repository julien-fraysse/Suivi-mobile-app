import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviLogo } from '../../components/ui/SuiviLogo';
import { tokens } from '../theme';

export interface AppHeaderProps {
  /**
   * Afficher le bouton retour à gauche du logo
   */
  showBackButton?: boolean;
  /**
   * Callback personnalisé pour le bouton retour (par défaut : navigation.goBack())
   */
  onBack?: () => void;
}

/**
 * AppHeader
 * 
 * En-tête global de l'application avec logo Suivi horizontal centré.
 * Utilisé sur tous les écrans (sauf Home qui a son propre header avec recherche).
 * 
 * - Logo horizontal : change automatiquement selon le thème
 *   - Light mode → logo-horizontal (dark version)
 *   - Dark mode → logo-horizontal-white (light version)
 * - Optionnel : bouton retour à gauche quand showBackButton={true}
 * - Hauteur compacte avec padding subtil en haut
 * 
 * Note: Le SafeAreaView est géré par ScreenContainer parent, donc pas besoin ici.
 */
export function AppHeader({ showBackButton = false, onBack }: AppHeaderProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const isDark = theme.dark;

  // Logo variant : horizontal-dark en light mode, horizontal-white en dark mode
  const logoVariant = isDark ? 'horizontal-white' : 'horizontal';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={
                isDark
                  ? tokens.colors.text.dark.primary // #FFFFFF en dark mode
                  : theme.colors.onSurface // Paper gère en light mode
              }
            />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <SuiviLogo
            variant={logoVariant}
            width={160}
            height={40}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: tokens.spacing.xs,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
});
