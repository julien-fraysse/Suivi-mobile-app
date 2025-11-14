import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviButtonProps extends Omit<ButtonProps, 'theme'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export const SuiviButton: React.FC<SuiviButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  mode,
  style,
  contentStyle,
  labelStyle,
  ...props
}) => {
  const theme = useTheme();
  
  // Determine mode based on variant
  const buttonMode = mode || (variant === 'outlined' ? 'outlined' : variant === 'text' ? 'text' : 'contained');
  
  // Size-based styles
  const sizeStyles = {
    small: {
      height: 36,
      paddingHorizontal: tokens.spacing.md,
    },
    medium: {
      height: 48,
      paddingHorizontal: tokens.spacing.lg,
    },
    large: {
      height: 56,
      paddingHorizontal: tokens.spacing.xl,
    },
  };
  
  return (
    <Button
      mode={buttonMode}
      style={[
        {
          borderRadius: tokens.radius.sm,
          minWidth: size === 'small' ? 80 : size === 'medium' ? 120 : 160,
        },
        style,
      ]}
      contentStyle={[
        sizeStyles[size],
        contentStyle,
      ]}
      labelStyle={[
        {
          fontSize: size === 'small' ? tokens.typography.fontSize.sm : 
                    size === 'medium' ? tokens.typography.fontSize.md : 
                    tokens.typography.fontSize.lg,
          fontWeight: tokens.typography.fontWeight.medium,
          letterSpacing: 0.5,
        },
        labelStyle,
      ]}
      {...props}
    />
  );
};

