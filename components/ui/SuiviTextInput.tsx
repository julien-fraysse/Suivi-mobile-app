import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviTextInputProps extends Omit<TextInputProps, 'theme'> {
  variant?: 'outlined' | 'flat';
  size?: 'small' | 'medium' | 'large';
}

export const SuiviTextInput: React.FC<SuiviTextInputProps> = ({
  variant = 'outlined',
  size = 'medium',
  mode,
  style,
  contentStyle,
  ...props
}) => {
  const theme = useTheme();
  
  const inputMode = mode || variant;
  
  // Size-based styles
  const sizeStyles = {
    small: {
      height: 40,
    },
    medium: {
      height: 56,
    },
    large: {
      height: 64,
    },
  };
  
  return (
    <TextInput
      mode={inputMode}
      style={[
        {
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
      contentStyle={[
        sizeStyles[size],
        {
          fontSize: tokens.typography.fontSize.md,
          fontFamily: tokens.typography.fontFamily.primary,
        },
        contentStyle,
      ]}
      outlineStyle={{
        borderRadius: tokens.radius.sm,
      }}
      {...props}
    />
  );
};

