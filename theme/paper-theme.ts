import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { colors, radius } from '../src/theme/tokens';

/**
 * Suivi Mobile Paper Theme
 * 
 * Thèmes personnalisés pour React Native Paper basés EXCLUSIVEMENT sur les tokens Suivi.
 * Toutes les couleurs proviennent de `src/theme/tokens.ts`, aucune couleur MD3 générique n'est utilisée.
 * 
 * Basé sur les guidelines Bazen :
 * - Couleurs : brand.primary (#4F5DFF), accent.maize (#FDD447), neutral.*
 * - Typographies : Inter (interface) + IBM Plex Mono (technique)
 * 
 * Light Theme: Fond sand (#F4F2EE), texte sombre (#4F4A45), couleurs Suivi vives
 * Dark Theme: Fond sombre, texte clair, couleurs Suivi adaptées
 */

// Light Theme - Basé uniquement sur les tokens Suivi (guidelines Bazen)
export const suiviLightTheme = {
  ...MD3LightTheme,
  colors: {
    // Primary colors - Brand Primary Suivi (#4F5DFF)
    primary: colors.brand.primary, // #4F5DFF
    onPrimary: '#FFFFFF', // Blanc sur primary
    primaryContainer: colors.brand.primaryLight, // #B8C0FF
    onPrimaryContainer: colors.brand.primaryDark, // #3F4ACC
    
    // Secondary colors - Accent Maize (#FDD447)
    secondary: colors.accent.maize, // #FDD447
    onSecondary: colors.neutral.dark, // #4F4A45 (texte sombre sur jaune)
    secondaryContainer: colors.accent.maizeLight, // #FFE89A
    onSecondaryContainer: colors.neutral.dark, // #4F4A45
    
    // Tertiary colors - Accent Maize (pour compatibilité MD3)
    tertiary: colors.accent.maize, // #FDD447
    onTertiary: colors.neutral.dark, // #4F4A45
    tertiaryContainer: colors.accent.maizeLight, // #FFE89A
    onTertiaryContainer: colors.neutral.dark, // #4F4A45
    
    // Error colors - Status Error Suivi
    error: colors.semantic.error, // #D32F2F
    onError: '#FFFFFF',
    errorContainer: colors.neutral.background, // #F4F2EE
    onErrorContainer: colors.semantic.error, // #D32F2F
    
    // Success colors - Status Success Suivi
    success: colors.semantic.success, // #00C853
    onSuccess: '#FFFFFF',
    
    // Background colors - Tokens Suivi (sand background)
    background: colors.neutral.background, // #F4F2EE (sand)
    onBackground: colors.neutral.dark, // #4F4A45
    surface: '#FFFFFF', // Blanc pour cards
    onSurface: colors.neutral.dark, // #4F4A45
    surfaceVariant: colors.neutral.light, // #E8E8E8
    onSurfaceVariant: colors.neutral.medium, // #98928C
    
    // Outline colors - Border tokens Suivi
    outline: colors.neutral.light, // #E8E8E8
    outlineVariant: colors.neutral.background, // #F4F2EE
    
    // Shadow
    shadow: '#000000',
    
    // Inverse colors - Pour les surfaces inversées
    inverseSurface: colors.neutral.dark, // #4F4A45
    inverseOnSurface: '#FFFFFF',
    inversePrimary: colors.brand.primaryLight, // #B8C0FF
    
    // Surface tint
    surfaceTint: colors.brand.primary, // #4F5DFF
    
    // Disabled colors - Neutral tokens
    surfaceDisabled: colors.neutral.light, // #E8E8E8
    onSurfaceDisabled: colors.neutral.medium, // #98928C
    
    // Additional MD3 required colors
    scrim: 'rgba(0, 0, 0, 0.32)', // Overlay semi-transparent
    backdrop: 'rgba(0, 0, 0, 0.5)', // Backdrop semi-transparent
    elevation: {
      level0: 'transparent',
      level1: 'rgba(244, 242, 238, 0.8)', // Sand avec transparence
      level2: 'rgba(244, 242, 238, 0.6)',
      level3: 'rgba(244, 242, 238, 0.4)',
      level4: 'rgba(244, 242, 238, 0.2)',
      level5: 'rgba(244, 242, 238, 0.1)',
    },
  },
  roundness: radius.lg, // 16px par défaut (selon guidelines)
};

// Dark Theme - Basé uniquement sur les tokens Suivi (guidelines Bazen)
export const suiviDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    // Primary colors - Brand Primary Suivi (version claire pour dark mode)
    primary: colors.brand.primaryLight, // #B8C0FF
    onPrimary: colors.brand.primaryDark, // #3F4ACC
    primaryContainer: colors.brand.primaryDark, // #3F4ACC
    onPrimaryContainer: colors.brand.primaryLight, // #B8C0FF
    
    // Secondary colors - Accent Maize (version claire pour dark mode)
    secondary: colors.accent.maizeLight, // #FFE89A
    onSecondary: colors.neutral.dark, // #4F4A45
    secondaryContainer: colors.accent.maize, // #FDD447
    onSecondaryContainer: colors.neutral.dark, // #4F4A45
    
    // Tertiary colors - Accent Maize (pour compatibilité MD3)
    tertiary: colors.accent.maizeLight, // #FFE89A
    onTertiary: colors.neutral.dark, // #4F4A45
    tertiaryContainer: colors.accent.maize, // #FDD447
    onTertiaryContainer: colors.neutral.dark, // #4F4A45
    
    // Error colors - Status Error Suivi (adapté pour dark mode)
    error: colors.semantic.error, // #D32F2F
    onError: '#FFFFFF',
    errorContainer: '#2C1F1F', // Fond sombre pour erreur
    onErrorContainer: colors.semantic.error, // #D32F2F
    
    // Success colors - Status Success Suivi
    success: colors.semantic.success, // #00C853
    onSuccess: '#FFFFFF',
    
    // Background colors - Tokens Suivi (dark)
    background: '#1A1A1A', // Fond sombre
    onBackground: '#FFFFFF',
    surface: '#252525', // Surface sombre
    onSurface: '#FFFFFF',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: colors.neutral.medium, // #98928C
    
    // Outline colors - Border tokens Suivi (dark)
    outline: colors.neutral.medium, // #98928C
    outlineVariant: '#2C2C2C',
    
    // Shadow
    shadow: '#000000',
    
    // Inverse colors - Pour les surfaces inversées
    inverseSurface: '#FFFFFF',
    inverseOnSurface: colors.neutral.dark, // #4F4A45
    inversePrimary: colors.brand.primary, // #4F5DFF
    
    // Surface tint
    surfaceTint: colors.brand.primaryLight, // #B8C0FF
    
    // Disabled colors - Neutral tokens (dark)
    surfaceDisabled: '#2C2C2C',
    onSurfaceDisabled: colors.neutral.medium, // #98928C
    
    // Additional MD3 required colors
    scrim: 'rgba(0, 0, 0, 0.6)', // Overlay semi-transparent (dark)
    backdrop: 'rgba(0, 0, 0, 0.8)', // Backdrop semi-transparent (dark)
    elevation: {
      level0: 'transparent',
      level1: 'rgba(37, 37, 38, 0.8)',
      level2: 'rgba(44, 44, 46, 0.6)',
      level3: 'rgba(50, 50, 54, 0.4)',
      level4: 'rgba(56, 56, 62, 0.2)',
      level5: 'rgba(62, 62, 70, 0.1)',
    },
  },
  roundness: radius.lg, // 16px par défaut (selon guidelines)
};

// Default theme (light)
export const suiviTheme = suiviLightTheme;

// Font configuration - Utilise des fonts système pour être sûr que ça fonctionne
// React Navigation attend: regular, medium, bold, heavy
// Pour l'instant, on utilise 'System' pour éviter les erreurs de runtime
// Plus tard, on pourra remplacer par Inter quand les fonts sont chargées
const fontConfig = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as const,
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as const,
  },
  heavy: {
    fontFamily: 'System',
    fontWeight: '800' as const,
  },
};

// Configure fonts using react-native-paper's configureFonts
// Cela crée un objet avec regular, medium, bold, heavy ET toutes les variantes MD3
export const suiviFonts = configureFonts({ config: fontConfig });

// Apply custom fonts to themes - IMPORTANT: doit être fait APRÈS la création du thème
suiviLightTheme.fonts = suiviFonts;
suiviDarkTheme.fonts = suiviFonts;
