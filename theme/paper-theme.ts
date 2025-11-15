import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors, radius, typography } from './tokens';

/**
 * Suivi Mobile Paper Theme
 * Extends Material Design 3 theme with Suivi brand colors and tokens
 */

// Light Theme
export const suiviLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: colors.primary,
    onPrimary: colors.text.inverse,
    primaryContainer: colors.primaryLight,
    onPrimaryContainer: colors.primaryDark,
    
    // Secondary colors
    secondary: colors.secondary,
    onSecondary: colors.text.inverse,
    secondaryContainer: colors.secondaryLight,
    onSecondaryContainer: colors.secondaryDark,
    
    // Tertiary/Accent colors
    tertiary: colors.accent,
    onTertiary: colors.text.inverse,
    tertiaryContainer: colors.accentLight,
    onTertiaryContainer: colors.accentDark,
    
    // Error colors
    error: colors.error,
    onError: colors.text.inverse,
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    
    // Success colors
    success: colors.success,
    onSuccess: colors.text.inverse,
    
    // Warning colors
    warning: colors.warning,
    onWarning: colors.text.inverse,
    
    // Info colors
    info: colors.info,
    onInfo: colors.text.inverse,
    
    // Background colors
    background: colors.background.default,
    onBackground: colors.text.primary,
    surface: colors.surface.default,
    onSurface: colors.text.primary,
    surfaceVariant: colors.surface.variant,
    onSurfaceVariant: colors.text.secondary,
    
    // Outline colors
    outline: colors.border.default,
    outlineVariant: colors.border.light,
    
    // Shadow
    shadow: '#000000',
    
    // Inverse colors
    inverseSurface: colors.surface.dark,
    inverseOnSurface: colors.text.inverse,
    inversePrimary: colors.primaryLight,
    
    // Surface tint
    surfaceTint: colors.primary,
  },
  roundness: radius.sm, // 12
};

// Dark Theme
export const suiviDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors
    primary: colors.primaryLight,
    onPrimary: colors.primaryDark,
    primaryContainer: colors.primaryDark,
    onPrimaryContainer: colors.primaryLight,
    
    // Secondary colors
    secondary: colors.secondaryLight,
    onSecondary: colors.secondaryDark,
    secondaryContainer: colors.secondaryDark,
    onSecondaryContainer: colors.secondaryLight,
    
    // Tertiary/Accent colors
    tertiary: colors.accentLight,
    onTertiary: colors.accentDark,
    tertiaryContainer: colors.accentDark,
    onTertiaryContainer: colors.accentLight,
    
    // Error colors
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    // Success colors
    success: colors.secondaryLight,
    onSuccess: colors.secondaryDark,
    
    // Warning colors
    warning: '#FFD54F',
    onWarning: '#FF6F00',
    
    // Info colors
    info: '#90CAF9',
    onInfo: '#003258',
    
    // Background colors
    background: colors.background.dark,
    onBackground: colors.text.inverse,
    surface: colors.surface.dark,
    onSurface: colors.text.inverse,
    surfaceVariant: colors.surface.darkVariant,
    onSurfaceVariant: colors.neutral[400],
    
    // Outline colors
    outline: colors.border.dark,
    outlineVariant: colors.neutral[700],
    
    // Shadow
    shadow: '#000000',
    
    // Inverse colors
    inverseSurface: colors.surface.default,
    inverseOnSurface: colors.text.primary,
    inversePrimary: colors.primary,
    
    // Surface tint
    surfaceTint: colors.primaryLight,
  },
  roundness: radius.sm, // 12
};

// Default theme (light)
export const suiviTheme = suiviLightTheme;

// Font configuration - Base font weights
const baseFonts = {
  regular: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.regular as any,
  },
  medium: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium as any,
  },
  light: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.light as any,
  },
  thin: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.thin as any,
  },
};

// Material Design 3 Typography Variants Mapping
// Maps MD3 font variants to our base font weights
export const suiviFonts = {
  // Base font weights
  ...baseFonts,
  
  // Material Design 3 Body variants -> regular weight
  bodySmall: baseFonts.regular,
  bodyMedium: baseFonts.regular,
  bodyLarge: baseFonts.regular,
  
  // Material Design 3 Label variants -> medium weight
  labelSmall: baseFonts.medium,
  labelMedium: baseFonts.medium,
  labelLarge: baseFonts.medium,
  
  // Material Design 3 Title variants -> medium weight
  titleSmall: baseFonts.medium,
  titleMedium: baseFonts.medium,
  titleLarge: baseFonts.medium,
  
  // Material Design 3 Headline variants -> medium weight
  headlineSmall: baseFonts.medium,
  headlineMedium: baseFonts.medium,
  headlineLarge: baseFonts.medium,
  
  // Material Design 3 Display variants -> regular weight
  displaySmall: baseFonts.regular,
  displayMedium: baseFonts.regular,
  displayLarge: baseFonts.regular,
};

// Apply custom fonts to theme
suiviLightTheme.fonts = suiviFonts as any;
suiviDarkTheme.fonts = suiviFonts as any;

