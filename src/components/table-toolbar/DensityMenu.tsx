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
  menuId?: string;
  labelledBy?: string;
}

export function DensityMenu({
  anchorEl,
  open,
  onClose,
  density,
  onDensityChange,
  menuId,
  labelledBy,
}: Props): JSX.Element {
  return (
    <Menu
      id={menuId}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ 'aria-labelledby': labelledBy }}
    >
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
