import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ImageSourcePropType, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

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
   * Optional custom style
   */
  style?: ViewStyle;
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
  style,
}: UserAvatarProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const [imageError, setImageError] = useState(false);

  // Background color adapts to theme
  const backgroundColor = isDark 
    ? tokens.colors.surface.darkElevated // #242424 in dark mode
    : tokens.colors.neutral.light; // #E8E8E8 in light mode

  // Text color for initials
  const textColor = isDark 
    ? tokens.colors.text.dark.primary // #FFFFFF in dark mode
    : tokens.colors.text.primary; // #4F4A45 in light mode

  // Generate initials from fullName
  const getInitials = (): string => {
    if (!fullName || fullName.trim().length === 0) return '';

    const words = fullName.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return '';

    if (words.length === 1) {
      // Single word: take first letter
      return words[0].charAt(0).toUpperCase();
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
  };

  // Image style
  const imageStyle = {
    width: size,
    height: size,
  };

  // Font size for initials (proportional to avatar size)
  const fontSize = Math.max(14, size * 0.4);

  // Render content
  if (hasImage) {
    // Try to determine if imageSource is a require() object or URL string
    const source = typeof imageSource === 'string' 
      ? { uri: imageSource }
      : imageSource;

    return (
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
    );
  }

  // Fallback: show initials or empty avatar
  return (
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
  );
}

const styles = StyleSheet.create({
  initials: {
    fontWeight: '500', // Medium weight
    textAlign: 'center',
  },
});
