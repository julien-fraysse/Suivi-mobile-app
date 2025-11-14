import React from 'react';
import { SuiviLogo, SuiviLogoProps } from '../ui/SuiviLogo';

export interface SuiviLogoIconProps extends Omit<SuiviLogoProps, 'variant'> {
  variant?: 'default' | 'white';
}

export const SuiviLogoIcon: React.FC<SuiviLogoIconProps> = ({
  variant = 'default',
  ...props
}) => {
  return (
    <SuiviLogo
      variant={variant === 'default' ? 'icon' : 'icon-white'}
      {...props}
    />
  );
};

