import React from 'react';
import { Surface, SurfaceProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviSurfaceProps extends SurfaceProps {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  padding?: keyof typeof tokens.spacing;
  variant?: 'default' | 'variant';
}

export const SuiviSurface: React.FC<SuiviSurfaceProps> = ({
  elevation = 0,
  padding,
  variant = 'default',
  style,
  ...props
}) => {
  const theme = useTheme();
  
  // Map elevation to MD3 elevation values
  const elevationMap: Record<0 | 1 | 2 | 3 | 4 | 5, number> = {
    0: 0,
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    5: 12,
  };
  
  const backgroundColor = variant === 'variant' 
    ? theme.colors.surfaceVariant 
    : theme.colors.surface;
  
  return (
    <Surface
      style={[
        {
          backgroundColor,
          borderRadius: tokens.radius.sm,
          padding: padding ? tokens.spacing[padding] : undefined,
        },
        style,
      ]}
      elevation={elevationMap[elevation] as any}
      {...props}
    />
  );
};

