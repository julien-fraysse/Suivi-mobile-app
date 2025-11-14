import React from 'react';
import { Appbar, AppbarProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviAppBarProps extends AppbarProps {
  variant?: 'small' | 'medium' | 'large' | 'center-aligned';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export const SuiviAppBar: React.FC<SuiviAppBarProps> = ({
  variant = 'medium',
  elevation = 2,
  style,
  ...props
}) => {
  const theme = useTheme();
  
  const elevationValue = tokens.elevation[`level${elevation}` as keyof typeof tokens.elevation];
  
  return (
    <Appbar.Header
      style={[
        {
          backgroundColor: theme.colors.surface,
          elevation: elevationValue,
        },
        style,
      ]}
      mode={variant}
      {...props}
    >
      {props.children}
    </Appbar.Header>
  );
};

