import React from 'react';
import { Image, ImageProps, ImageStyle, StyleSheet } from 'react-native';
import { tokens } from '@theme';

export interface SuiviLogoProps {
  variant?: 'full-light' | 'full-dark' | 'icon' | 'icon-white' | 'horizontal' | 'horizontal-white';
  size?: number;
  width?: number;
  height?: number;
  style?: ImageStyle;
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
    'full-light': require('@assets/suivi/logo-full-light.png'),
    'full-dark': require('@assets/suivi/logo-full-dark.png'),
    'icon': require('@assets/suivi/logo-icon.png'),
    'icon-white': require('@assets/suivi/logo-icon-white.png'),
    'horizontal': require('@assets/suivi/logo-horizontal.png'),
    'horizontal-white': require('@assets/suivi/logo-horizontal-white.png'),
  };
  
  const source = assetMap[variant];
  const finalWidth = width || size || 160;
  const finalHeight = height || size || 40;

  return (
    <Image
      source={source}
      style={[
        {
          width: finalWidth,
          height: finalHeight,
          resizeMode: 'contain',
        },
        style,
      ]}
    />
  );
};

