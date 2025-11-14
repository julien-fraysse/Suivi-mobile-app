import React from 'react';
import { List, ListItemProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviListItemProps extends ListItemProps {
  variant?: 'default' | 'inset' | 'avatar';
}

export const SuiviListItem: React.FC<SuiviListItemProps> = ({
  variant = 'default',
  style,
  titleStyle,
  descriptionStyle,
  ...props
}) => {
  const theme = useTheme();
  
  return (
    <List.Item
      style={[
        {
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.sm,
        },
        style,
      ]}
      titleStyle={[
        {
          fontSize: tokens.typography.fontSize.md,
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.medium,
          color: theme.colors.onSurface,
        },
        titleStyle,
      ]}
      descriptionStyle={[
        {
          fontSize: tokens.typography.fontSize.sm,
          fontFamily: tokens.typography.fontFamily.primary,
          color: theme.colors.onSurfaceVariant,
        },
        descriptionStyle,
      ]}
      {...props}
    />
  );
};

