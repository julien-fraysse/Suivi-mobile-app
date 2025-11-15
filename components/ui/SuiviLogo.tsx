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
  // Temporary: using assets/icon.png until broken assets are replaced
  const assetMap: Record<string, any> = {
    'full-light': require('../../assets/icon.png'),
    'full-dark': require('../../assets/icon.png'),
    'icon': require('../../assets/icon.png'),
    'icon-white': require('../../assets/icon.png'),
    'horizontal': require('../../assets/icon.png'),
    'horizontal-white': require('../../assets/icon.png'),
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

