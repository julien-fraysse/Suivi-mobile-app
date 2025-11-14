import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  padding?: keyof typeof tokens.spacing;
  style?: ViewStyle;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  padding = 'md',
  style,
  safeAreaEdges = ['top', 'bottom'],
}) => {
  const theme = useTheme();
  
  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          padding: tokens.spacing[padding],
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

