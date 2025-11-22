import React from 'react';
import { ScreenContainer } from './layout/ScreenContainer';
import { ViewStyle } from 'react-native';

export interface ScreenProps {
  children: React.ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  noTopBackground?: boolean;
}

/**
 * Screen
 * 
 * Wrapper standardisé pour tous les écrans.
 * Utilise ScreenContainer avec SafeAreaView, padding, et optionnellement le scroll.
 */
export const Screen: React.FC<ScreenProps> = ({
  children,
  padding = 'md',
  style,
  scrollable = false,
  contentContainerStyle,
  noTopBackground = false,
}) => {
  return (
    <ScreenContainer
      padding={padding}
      style={style}
      scrollable={scrollable}
      contentContainerStyle={contentContainerStyle}
      noTopBackground={noTopBackground}
    >
      {children}
    </ScreenContainer>
  );
};

