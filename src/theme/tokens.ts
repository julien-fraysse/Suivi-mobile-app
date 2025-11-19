/**
 * Suivi Mobile Design Tokens
 * UI Kit complet avec palette Suivi officielle
 * 
 * Basé sur les guidelines Bazen :
 * - Couleurs brand : violet/bleu (#4F5DFF) + jaune (#FDD447) + gris/marron + sand
 * - Typographies : Inter (interface) + IBM Plex Mono (technique)
 */

import { fonts } from './fonts';

// Palette Suivi - Brand Colors (selon guidelines Bazen)
export const colors = {
  // Brand Primary - Violet/Bleu Suivi
  brand: {
    primary: '#4F5DFF',
    primaryLight: '#B8C0FF',
    primaryDark: '#3F4ACC',
  },
  
  // Accent Maize - Jaune Suivi
  accent: {
    maize: '#FDD447',
    maizeLight: '#FFE89A',
  },
  
  // Neutral - Gris/Marron + Sand
  neutral: {
    dark: '#4F4A45',
    medium: '#98928C',
    light: '#E8E8E8',
    background: '#F2F4F7',
  },
  
  // Semantic Colors
  semantic: {
    error: '#D32F2F',
    success: '#00C853',
  },
  
  // Background colors - Backward compatible aliases
  // Maps old structure (colors.background.default, colors.background.surface) to new structure
  background: {
    default: '#FFFFFF', // Blanc pour fond d'écran par défaut (cards et surfaces blanches) - Light mode
    surface: '#F2F4F7', // Fond principal - équivalent à neutral.background, pour fond d'écran principal - Light mode
    // Dark mode tokens (utilisés via ThemeProvider)
    dark: '#0F0F0F', // Fond sombre pour dark mode (matte black style)
    darkSurface: '#1A1A1A', // Surface sombre pour dark mode (surface principale)
    darkSurfaceElevated: '#242424', // Surface élevée pour dark mode (cards, modals)
  },
  
  // Text colors - Backward compatible aliases
  // Maps old structure (colors.text.primary, colors.text.secondary, etc.) to new structure
  text: {
    primary: '#4F4A45', // Équivalent à neutral.dark - texte principal - Light mode
    secondary: '#98928C', // Équivalent à neutral.medium - texte secondaire - Light mode
    disabled: '#98928C', // Équivalent à neutral.medium - texte désactivé - Light mode
    hint: '#98928C', // Équivalent à neutral.medium - texte d'aide - Light mode
    onPrimary: '#FFFFFF', // Blanc sur fond primary (boutons, etc.)
    // Dark mode variants (utilisés via ThemeProvider)
    dark: {
      primary: '#FFFFFF', // Texte principal pour dark mode (white) - utilisé pour les titres
      secondary: '#CACACA', // Texte secondaire pour dark mode (soft gray) - utilisé pour body/metadata
      disabled: '#98928C', // Texte désactivé pour dark mode
      hint: '#CACACA', // Texte d'aide pour dark mode (placeholders) - même gris clair que secondary
    },
  },
  
  // Border colors - Backward compatible aliases
  border: {
    default: '#E8E8E8', // Équivalent à neutral.light - bordure par défaut - Light mode
    light: '#F4F2EE', // Équivalent à neutral.background - bordure légère - Light mode
    dark: '#98928C', // Équivalent à neutral.medium - bordure sombre - Dark mode
    // Dark mode variants (utilisés via ThemeProvider)
    darkMode: {
      default: 'rgba(255,255,255,0.08)', // Bordure par défaut pour dark mode (subtle white overlay)
      light: 'rgba(255,255,255,0.04)', // Bordure légère pour dark mode
      dark: 'rgba(255,255,255,0.12)', // Bordure sombre pour dark mode (more visible)
    },
  },
  
  // Surface colors - Backward compatible aliases (for cards, sheets, etc.)
  surface: {
    default: '#FFFFFF', // Blanc pour surfaces/cards
    variant: '#F2F4F7', // Variante de surface pour fond d'écran principal
    // Dark mode tokens (utilisés via ThemeProvider)
    dark: '#1A1A1A', // Surface sombre pour dark mode (surface principale)
    darkElevated: '#242424', // Surface élevée pour dark mode (cards, modals)
    darkVariant: '#2C2C2C', // Variante de surface sombre
  },
} as const;

// Spacing Scale (base unit: 4px)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Border Radius
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

// Shadows - Élévation légère (0, 2, 8 max)
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// Elevation (for reference)
export const elevation = {
  none: 0,
  sm: 2,
  card: 4,
  lg: 8,
} as const;

// Typography - Basé sur Inter (interface) et IBM Plex Mono (technique)
export const typography = {
  // Display - Titres principaux
  display: {
    fontFamily: fonts.interBold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  // Headings
  h1: {
    fontFamily: fonts.interSemibold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  h2: {
    fontFamily: fonts.interMedium,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  h4: {
    fontFamily: fonts.interSemibold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  h6: {
    fontFamily: fonts.interMedium,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  // Body text
  body: {
    fontFamily: fonts.interRegular,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  body1: {
    fontFamily: fonts.interRegular,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  body2: {
    fontFamily: fonts.interRegular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  // Labels and small text
  label: {
    fontFamily: fonts.interMedium,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  caption: {
    fontFamily: fonts.interRegular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  // Monospace
  mono: {
    fontFamily: fonts.plexMonoRegular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  // Font weight mappings for backward compatibility
  fontWeight: {
    thin: '100' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

/**
 * Helper function to safely get typography style
 * Falls back to body style if the variant doesn't exist
 * 
 * @param variant - Typography variant key
 * @returns Typography style object with fontFamily, fontSize, lineHeight, fontWeight
 */
export function getTypographyStyle(variant: keyof typeof typography): typeof typography.body {
  const style = typography[variant];
  if (style && typeof style === 'object' && 'fontSize' in style) {
    return style as typeof typography.body;
  }
  // Fallback to body style if variant doesn't exist or is invalid
  return typography.body;
}

// Animation Durations - Transitions douces (opacity / scale)
export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Z-Index Scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Export all tokens
export const tokens = {
  colors,
  spacing,
  radius,
  shadows,
  elevation,
  typography,
  animation,
  zIndex,
} as const;

export default tokens;

