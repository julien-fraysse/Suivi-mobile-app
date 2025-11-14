import React from 'react';
import { Card, CardProps } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviCardProps extends CardProps {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  padding?: keyof typeof tokens.spacing;
}

export const SuiviCard: React.FC<SuiviCardProps> = ({
  elevation = 1,
  padding = 'md',
  style,
  contentStyle,
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
  
  return (
    <Card
      style={[
        {
          borderRadius: tokens.radius.sm,
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
      elevation={elevationMap[elevation] as any}
      mode="elevated"
      {...props}
    >
      <Card.Content
        style={[
          {
            padding: tokens.spacing[padding],
          },
          contentStyle,
        ]}
      >
        {props.children}
      </Card.Content>
    </Card>
  );
};

