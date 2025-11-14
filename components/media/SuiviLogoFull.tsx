import React from 'react';
import { SuiviLogo, SuiviLogoProps } from '../ui/SuiviLogo';

export interface SuiviLogoFullProps extends Omit<SuiviLogoProps, 'variant'> {
  variant?: 'light' | 'dark';
}

export const SuiviLogoFull: React.FC<SuiviLogoFullProps> = ({
  variant = 'light',
  ...props
}) => {
  return (
    <SuiviLogo
      variant={variant === 'light' ? 'full-light' : 'full-dark'}
      {...props}
    />
  );
};

