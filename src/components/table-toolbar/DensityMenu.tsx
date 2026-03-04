import type { Density } from '../../types/core';
import { JSX } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  density?: Density;
  onDensityChange?: (d: Density) => void;
}

export function DensityMenu({
  anchorEl,
  open,
  onClose,
  density,
  onDensityChange,
}: Props): JSX.Element {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem
        onClick={() => {
          onDensityChange?.('compact');
          onClose();
        }}
        selected={density === 'compact'}
      >
        Compact
      </MenuItem>
      <MenuItem
        onClick={() => {
          onDensityChange?.('standard');
          onClose();
        }}
        selected={density === 'standard'}
      >
        Standard
      </MenuItem>
      <MenuItem
        onClick={() => {
          onDensityChange?.('comfortable');
          onClose();
        }}
        selected={density === 'comfortable'}
      >
        Comfortable
      </MenuItem>
    </Menu>
  );
}
