import React from 'react';
import { Chip, ChipProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviChipProps extends ChipProps {
  variant?: 'flat' | 'outlined';
  size?: 'small' | 'medium';
}

export const SuiviChip: React.FC<SuiviChipProps> = ({
  variant = 'flat',
  size = 'medium',
  mode,
  style,
  textStyle,
  ...props
}) => {
  const theme = useTheme();
  
  const chipMode = mode || variant;
  
  return (
    <Chip
      mode={chipMode}
      style={[
        {
          borderRadius: tokens.radius.xs,
          height: size === 'small' ? 28 : 32,
        },
        style,
      ]}
      textStyle={[
        {
          fontSize: size === 'small' ? tokens.typography.fontSize.xs : tokens.typography.fontSize.sm,
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.medium,
        },
        textStyle,
      ]}
      {...props}
    />
  );
};

