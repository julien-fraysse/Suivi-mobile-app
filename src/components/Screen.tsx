import React from 'react';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ViewStyle } from 'react-native';

export interface ScreenProps {
  children: React.ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  padding = 'md',
  style,
}) => {
  return (
    <ScreenContainer padding={padding} style={style}>
      {children}
    </ScreenContainer>
  );
};

