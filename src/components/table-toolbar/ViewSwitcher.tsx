import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { JSX } from 'react';

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

interface Props {
  view: 'grid' | 'list';
  onViewChange?: (v: 'grid' | 'list') => void;
}

export function ViewSwitcher({ view, onViewChange }: Props): JSX.Element {
  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(_, newView) => {
        if (newView) onViewChange?.(newView);
      }}
      size="small"
      sx={{ mr: 1, height: 40 }}
    >
      <ToggleButton value="grid" aria-label="grid view">
        <ViewModuleIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="list" aria-label="list view">
        <ViewListIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
