import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviLogo } from '../../components/ui/SuiviLogo';
import { UserAvatar } from './ui/UserAvatar';
import { useUserProfile } from '../hooks/useUserProfile';
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
  /**
   * Afficher l'avatar utilisateur à droite du logo (désactivé si showBackButton=true)
   */
  showAvatar?: boolean;
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
type AppHeaderNavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function AppHeader({ showBackButton = false, onBack, showAvatar = true }: AppHeaderProps) {
  const theme = useTheme();
  const navigation = useNavigation<AppHeaderNavigationProp>();
  const isDark = theme.dark;
  const { fullName, avatar } = useUserProfile();

  // Logo variant : horizontal-dark en light mode, horizontal-white en dark mode
  const logoVariant = isDark ? 'horizontal-white' : 'horizontal';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleAvatarPress = () => {
    // Navigate to More / Account screen
    navigation.navigate('Main', { screen: 'More' });
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
            width={136}
            height={34}
          />
        </View>

        {/* Avatar on the right (only if not showing back button) */}
        {showAvatar && !showBackButton && (
          <View style={styles.avatarContainer}>
            <UserAvatar
              size={32}
              imageSource={avatar}
              fullName={fullName}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 14, // Slightly increased for better vertical centering
    paddingBottom: tokens.spacing.lg, // 16px spacing below logo (12-16px range)
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 44, // Adjusted to accommodate reduced logo size while maintaining good spacing
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
  avatarContainer: {
    position: 'absolute',
    right: 0,
    padding: tokens.spacing.xs,
    zIndex: 1,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
