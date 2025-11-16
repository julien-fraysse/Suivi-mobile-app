import React from 'react';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';
import { SuiviText } from './SuiviText';
import { tokens } from '../../theme';

export interface UserAvatarProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

/**
 * UserAvatar
 * 
 * Avatar utilisateur avec initiales fallback.
 * 
 * Design :
 * - Fond : brand.primary (#4F5DFF)
 * - Texte : blanc (inverse) avec typography selon la taille
 * - Radius : full (circulaire)
 * - Sizes : sm (32px), md (48px), lg (64px)
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 * Affiche les initiales si avatarUrl n'est pas fourni.
 */
export function UserAvatar({
  firstName,
  lastName,
  avatarUrl,
  size = 'md',
  style,
}: UserAvatarProps) {
  const getSize = (): number => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 48;
      case 'lg':
        return 64;
      default:
        return 48;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return tokens.typography.body.fontSize; // 15
      case 'md':
        return tokens.typography.h6.fontSize; // 16
      case 'lg':
        return tokens.typography.h2.fontSize; // 18
      default:
        return tokens.typography.h6.fontSize; // 16
    }
  };

  const avatarSize = getSize();
  const fontSize = getFontSize();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const avatarStyle = [
    styles.avatar,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: tokens.colors.brand.primary, // #4F5DFF
    },
    style,
  ];

  // Si avatarUrl est fourni, afficher l'image, sinon les initiales
  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={avatarStyle}
        defaultSource={undefined}
      />
    );
  }

  return (
    <View style={avatarStyle}>
      <SuiviText
        variant="h2"
        color="inverse"
        style={[
          styles.initials,
          {
            fontSize,
          },
        ]}
      >
        {initials}
      </SuiviText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '700',
  },
});

