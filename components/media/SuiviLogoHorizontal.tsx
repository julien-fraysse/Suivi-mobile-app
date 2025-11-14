import React from 'react';
import { SuiviLogo, SuiviLogoProps } from '../ui/SuiviLogo';

export interface SuiviLogoHorizontalProps extends Omit<SuiviLogoProps, 'variant'> {
  variant?: 'default' | 'white';
}

export const SuiviLogoHorizontal: React.FC<SuiviLogoHorizontalProps> = ({
  variant = 'default',
  ...props
}) => {
  return (
    <SuiviLogo
      variant={variant === 'default' ? 'horizontal' : 'horizontal-white'}
      {...props}
    />
  );
};

