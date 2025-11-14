import React from 'react';
import { Image, ImageProps, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '../../theme';

export interface SuiviLogoProps {
  variant?: 'full-light' | 'full-dark' | 'icon' | 'icon-white' | 'horizontal' | 'horizontal-white';
  size?: number;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const SuiviLogo: React.FC<SuiviLogoProps> = ({
  variant = 'full-light',
  size,
  width,
  height,
  style,
}) => {
  // Map variants to asset paths
  const assetMap: Record<string, any> = {
    'full-light': require('../../assets/suivi/logo-full-light.png'),
    'full-dark': require('../../assets/suivi/logo-full-dark.png'),
    'icon': require('../../assets/suivi/logo-icon.png'),
    'icon-white': require('../../assets/suivi/logo-icon-white.png'),
    'horizontal': require('../../assets/suivi/logo-horizontal.png'),
    'horizontal-white': require('../../assets/suivi/logo-horizontal-white.png'),
  };
  
  const source = assetMap[variant];
  
  // Calculate dimensions
  const imageWidth = width || size || 200;
  const imageHeight = height || size || (variant.includes('icon') ? 200 : 60);
  
  return (
    <Image
      source={source}
      style={[
        {
          width: imageWidth,
          height: imageHeight,
          resizeMode: 'contain',
        },
        style,
      ]}
    />
  );
};

