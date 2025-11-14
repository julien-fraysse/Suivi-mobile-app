import React from 'react';
import { Divider, DividerProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviDividerProps extends DividerProps {
  variant?: 'fullWidth' | 'inset' | 'middle';
  spacing?: keyof typeof tokens.spacing;
}

export const SuiviDivider: React.FC<SuiviDividerProps> = ({
  variant = 'fullWidth',
  spacing = 'md',
  style,
  ...props
}) => {
  const theme = useTheme();
  
  return (
    <Divider
      style={[
        {
          backgroundColor: theme.colors.outlineVariant,
          marginVertical: tokens.spacing[spacing],
        },
        style,
      ]}
      {...props}
    />
  );
};

