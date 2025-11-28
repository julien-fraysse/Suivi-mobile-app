import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ImageSourcePropType, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@theme';

export interface UserAvatarProps {
  /**
   * Avatar size in pixels (default: 48)
   */
  size?: number;

  /**
   * Image source - can be a local require() or a URL string
   * Example: require('../assets/images/julien.jpg') or 'https://example.com/avatar.jpg'
   * Note: From components/ui/, use '../assets/images/...' to reach src/assets/images/
   */
  imageSource?: ImageSourcePropType | string;

  /**
   * Full name of the user (e.g., "Julien Fraysse")
   * Used to generate initials fallback if image is not available or fails to load
   */
  fullName?: string;

  /**
   * User ID (optional, used for stable color selection)
   * If provided, used for hash-based color selection. Falls back to fullName if not provided.
   */
  userId?: string;

  /**
   * Optional custom style
   */
  style?: ViewStyle;

  /**
   * Badge type to display on the avatar
   * - 'assigned': Badge for task assignment notifications
   * - 'mentioned': Badge for mention notifications
   * - null: No badge
   */
  badge?: 'assigned' | 'mentioned' | null;
}

/**
 * UserAvatar
 * 
 * Reusable avatar component with automatic fallback:
 * 1. If imageSource is provided → displays Image with rounded-full styling
 * 2. If image fails to load or no imageSource → displays initials from fullName
 * 3. If no fullName → displays empty avatar with background
 * 
 * Design:
 * - Circular shape (rounded-full)
 * - Image uses object-cover resize mode
 * - Background adapts to theme (light/dark)
 * - Initials are centered and styled appropriately
 * 
 * AUDIT SIZE PROP (2024-11-19):
 * ✅ size prop correctly controls ALL dimensions:
 *    - containerStyle.width: size (line 93)
 *    - containerStyle.height: size (line 94)
 *    - containerStyle.borderRadius: size / 2 (line 95)
 *    - imageStyle.width: size (line 104)
 *    - imageStyle.height: size (line 105)
 *    - fontSize: calculated from size (line 109: size >= 34 ? 14 : Math.max(12, size * 0.4))
 * 
 * ✅ NO hardcoded values (no width: 36, height: 36, borderRadius: 18 in styles)
 * ✅ Default size: 48 (line 53)
 * ✅ Component is fully responsive to size prop changes
 * 
 * Backend Integration:
 * - imageSource can be:
 *   - Local asset: require('../assets/images/julien.jpg') (from src/components/ui/)
 *   - Remote URL: 'https://api.suivi.app/users/123/avatar.jpg'
 * - fullName should be the user's display name (e.g., "Julien Fraysse")
 * - Component automatically falls back to initials if image fails
 */
export function UserAvatar({
  size = 48,
  imageSource,
  fullName,
  userId,
  style,
  badge,
}: UserAvatarProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const [imageError, setImageError] = useState(false);

  /**
   * Get avatar color based on userId or fullName hash
   * Returns a stable color from tokens.colors.avatar.*
   */
  const getAvatarColor = (): string => {
    const identifier = userId || fullName || '';
    if (!identifier) {
      // Fallback to theme-based color if no identifier
      return isDark 
        ? tokens.colors.surface.darkElevated
        : tokens.colors.neutral.light;
    }

    // Defensive check: ensure avatar colors exist
    if (!tokens.colors.avatar) {
      // Fallback to theme-based color if avatar colors are not available
      return isDark 
        ? tokens.colors.surface.darkElevated
        : tokens.colors.neutral.light;
    }

    // Simple hash function for stable color selection
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    // Array of avatar colors from tokens
    const avatarColors = [
      tokens.colors.avatar.blue,
      tokens.colors.avatar.mint,
      tokens.colors.avatar.green,
      tokens.colors.avatar.yellow,
      tokens.colors.avatar.brown,
      tokens.colors.avatar.pink,
      tokens.colors.avatar.teal,
      tokens.colors.avatar.lightBlue,
      tokens.colors.avatar.purple,
    ];

    // Use absolute value and modulo to select a color
    const colorIndex = Math.abs(hash) % avatarColors.length;
    return avatarColors[colorIndex];
  };

  // Background color: use avatar color if no image, otherwise theme-based
  const backgroundColor = getAvatarColor();

  // Text color for initials : blanc pour contraste sur fond coloré
  // Utilise tokens.colors.text.onPrimary qui est blanc (#FFFFFF)
  const textColor = tokens.colors.text.onPrimary;

  // Generate initials from fullName
  // Règle : TOUJOURS 2 initiales
  // - Si un seul mot : prendre les 2 premières lettres (ex: "Emma" → "EM")
  // - Si plusieurs mots : première lettre du premier + première lettre du dernier (ex: "Emma Laurent" → "EL")
  const getInitials = (): string => {
    if (!fullName || fullName.trim().length === 0) return '';

    const words = fullName.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return '';

    if (words.length === 1) {
      // Single word: take first 2 letters
      const word = words[0];
      if (word.length >= 2) {
        return (word.charAt(0) + word.charAt(1)).toUpperCase();
      }
      // Si le mot n'a qu'une lettre, répéter (ex: "A" → "AA")
      return (word.charAt(0) + word.charAt(0)).toUpperCase();
    }

    // Multiple words: take first letter of first and last word
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials();
  const hasImage = imageSource && !imageError;

  // Avatar container style
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...(isDark && {
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    }),
  };

  // Image style
  const imageStyle = {
    width: size,
    height: size,
  };

  // Font size for initials (proportional to avatar size)
  const fontSize = size >= 34 ? 14 : Math.max(12, size * 0.4);

  // Badge size : 20px (tokens.spacing.lg + tokens.spacing.xs = 16 + 4 = 20px)
  const badgeSize = tokens.spacing.lg + tokens.spacing.xs;
  
  // Badge icon size : 12px (tokens.spacing.md = 12px)
  const badgeIconSize = tokens.spacing.md;

  // Render badge if needed
  const renderBadge = () => {
    if (!badge) return null;

    const badgeIcon: keyof typeof MaterialIcons.glyphMap = 
      badge === 'assigned' ? 'person' : 'alternate-email';
    
    return (
      <View
        style={[
          styles.badgeContainer,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: tokens.radius.full,
            bottom: -tokens.spacing.xs / 2,
            right: -tokens.spacing.xs / 2,
            backgroundColor: tokens.colors.brand.primary,
            zIndex: 10,
            elevation: 5,
          },
        ]}
      >
        <MaterialIcons
          name={badgeIcon}
          size={badgeIconSize}
          color={tokens.colors.text.onPrimary}
        />
      </View>
    );
  };

  // Render content
  if (hasImage) {
    // Try to determine if imageSource is a require() object or URL string
    const source = typeof imageSource === 'string' 
      ? { uri: imageSource }
      : imageSource;

    return (
      <View style={styles.avatarWrapper}>
        <View style={[containerStyle, style]}>
          <Image
            source={source}
            style={imageStyle}
            resizeMode="cover"
            onError={() => {
              setImageError(true);
            }}
          />
        </View>
        {renderBadge()}
      </View>
    );
  }

  // Fallback: show initials or empty avatar
  return (
    <View style={styles.avatarWrapper}>
      <View style={[containerStyle, style]}>
        {initials ? (
          <Text
            style={[
              styles.initials,
              {
                fontSize,
                color: textColor,
              },
            ]}
          >
            {initials}
          </Text>
        ) : null}
      </View>
      {renderBadge()}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    position: 'relative',
  },
  initials: {
    fontWeight: tokens.typography.fontWeight.bold, // Bold weight pour meilleure visibilité
    textAlign: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
