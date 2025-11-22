/**
 * Suivi Mobile Theme Exports
 * Central export point for all theme-related modules
 */

// Re-export from src/theme for consistency
export { tokens, colors, radius, spacing, typography, elevation, shadows, animation, zIndex } from '../src/theme/tokens';
export { suiviLightTheme, suiviDarkTheme, suiviTheme, suiviFonts } from '../src/theme/paper-theme';
export type { MD3Theme } from 'react-native-paper';

// ThemeProvider exports (from src/theme/ThemeProvider.tsx)
export { ThemeProvider, useThemeMode } from '../src/theme/ThemeProvider';
export type { ThemeMode, ThemeContextValue, ThemeProviderProps } from '../src/theme/ThemeProvider';

