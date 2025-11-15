/**
 * Suivi Mobile Design Tokens
 * Centralized design system tokens for colors, spacing, typography, and more
 */

// Brand Colors
export const colors = {
  // Primary brand colors
  primary: '#0066FF',
  primaryLight: '#3385FF',
  primaryDark: '#0052CC',
  
  // Secondary colors
  secondary: '#00C853',
  secondaryLight: '#33D573',
  secondaryDark: '#00A043',
  
  // Accent colors
  accent: '#FF6B35',
  accentLight: '#FF8C66',
  accentDark: '#E55A2B',
  
  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic colors
  success: '#00C853',
  warning: '#FFB300',
  error: '#D32F2F',
  info: '#1976D2',
  
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    dark: '#121212',
    darkPaper: '#1E1E1E',
  },
  
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
    inverse: '#FFFFFF',
  },
  
  // Surface colors
  surface: {
    default: '#FFFFFF',
    variant: '#F5F5F5',
    dark: '#1E1E1E',
    darkVariant: '#2C2C2C',
  },
  
  // Border colors
  border: {
    default: '#E0E0E0',
    light: '#F5F5F5',
    dark: '#424242',
  },
} as const;

// Border Radius
export const radius = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 24,
  xl: 32,
  round: 9999,
} as const;

// Spacing Scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Typography
export const typography = {
  fontFamily: {
    primary: 'Inter',
    mono: 'IBM Plex Mono',
  },
  fontWeight: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  // Material Design 3 Typography Scale
  h1: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400' as const,
  },
  h2: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400' as const,
  },
  h3: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400' as const,
  },
  h4: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400' as const,
  },
  h5: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400' as const,
  },
  h6: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400' as const,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  subtitle2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
} as const;

// Material Design 3 Elevation Levels
export const elevation = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 4,
  level4: 8,
  level5: 12,
} as const;

// Shadows (for platforms that don't support elevation)
export const shadows = {
  level0: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 3.84,
    elevation: 2,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6.27,
    elevation: 4,
  },
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 10.32,
    elevation: 8,
  },
  level5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.27,
    shadowRadius: 14.46,
    elevation: 12,
  },
} as const;

// Animation Durations
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
  radius,
  spacing,
  typography,
  elevation,
  shadows,
  animation,
  zIndex,
} as const;

export default tokens;

