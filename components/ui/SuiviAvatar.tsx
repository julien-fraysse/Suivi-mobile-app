import React from 'react';
import { Avatar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ViewStyle, TextStyle } from 'react-native';
import { tokens } from '../../theme';

export interface SuiviAvatarProps {
  size?: 'small' | 'medium' | 'large' | number;
  label: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  backgroundColor?: string;
}

export const SuiviAvatar: React.FC<SuiviAvatarProps> = ({
  size = 'medium',
  label,
  style,
  labelStyle,
  backgroundColor,
  ...props
}) => {
  const theme = useTheme();
  
  // Size mapping
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };
  
  const avatarSize = typeof size === 'number' ? size : sizeMap[size];
  
  return (
    <Avatar.Text
      size={avatarSize}
      label={label}
      style={[
        {
          backgroundColor: backgroundColor || theme.colors.primaryContainer,
        },
        style,
      ]}
      labelStyle={[
        {
          fontSize: avatarSize * 0.4,
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.medium,
          color: theme.colors.onPrimaryContainer,
        },
        labelStyle,
      ]}
      {...props}
    />
  );
};

