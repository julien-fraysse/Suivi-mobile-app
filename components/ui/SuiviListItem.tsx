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
  const isDark = theme.dark;
  
  // Background color adapté selon le thème (surface en dark mode)
  const backgroundColor = isDark
    ? tokens.colors.surface.dark // #1A1A1A en dark mode (surface)
    : undefined; // Laisser Paper gérer en light mode

  return (
    <List.Item
      style={[
        {
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.sm,
          backgroundColor,
        },
        style,
      ]}
      titleStyle={[
        {
          fontSize: tokens.typography.fontSize.md,
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.medium,
          color: isDark 
            ? tokens.colors.text.dark.primary // #FFFFFF en dark mode
            : theme.colors.onSurface, // Paper gère en light mode
        },
        titleStyle,
      ]}
      descriptionStyle={[
        {
          fontSize: tokens.typography.fontSize.sm,
          fontFamily: tokens.typography.fontFamily.primary,
          color: isDark
            ? tokens.colors.text.dark.secondary // #BFBFBF en dark mode
            : theme.colors.onSurfaceVariant, // Paper gère en light mode
        },
        descriptionStyle,
      ]}
      {...props}
    />
  );
};

