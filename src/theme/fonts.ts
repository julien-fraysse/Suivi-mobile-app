/**
 * Suivi Mobile Fonts Configuration
 * 
 * Définit les familles de polices Inter et IBM Plex Mono pour l'application Suivi.
 * Les polices sont chargées via expo-font depuis Google Fonts.
 * 
 * Familles de polices :
 * - Inter : Police principale pour l'interface (Regular, Medium, Semibold, Bold)
 * - IBM Plex Mono : Police monospace pour les labels techniques et badges
 * 
 * Utilisation :
 * - Les polices doivent être chargées via `useFonts` dans App.tsx avant le rendu
 * - Les noms de polices sont utilisés dans tokens.ts pour la typographie
 */

/**
 * Noms des familles de polices Inter
 * Compatibles avec @expo-google-fonts/inter ou chargement direct depuis Google Fonts
 */
export const interFontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

/**
 * Noms des familles de polices IBM Plex Mono
 * Compatibles avec @expo-google-fonts/ibm-plex-mono ou chargement direct depuis Google Fonts
 */
export const plexMonoFontFamily = {
  regular: 'IBMPlexMono_400Regular',
  medium: 'IBMPlexMono_500Medium',
} as const;

/**
 * Objet d'exportation simplifié pour utilisation dans les tokens
 */
export const fonts = {
  // Inter font families
  interRegular: interFontFamily.regular,
  interMedium: interFontFamily.medium,
  interSemibold: interFontFamily.semibold,
  interBold: interFontFamily.bold,
  
  // IBM Plex Mono font families
  plexMonoRegular: plexMonoFontFamily.regular,
  plexMonoMedium: plexMonoFontFamily.medium,
} as const;

