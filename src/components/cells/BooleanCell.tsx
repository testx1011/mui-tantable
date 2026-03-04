import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { CellRendererProps, BooleanCellConfig } from '../../types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';

export function BooleanCell<TData>({
  getValue,
  row,
  column,
}: CellRendererProps<TData> & { config?: BooleanCellConfig }): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: BooleanCellConfig })?.cellConfig;

  const {
    display = 'icon',
    labels = { true: 'Yes', false: 'No' },
    icons,
    editable = false,
    onChange,
  } = config || {};

  const boolValue = Boolean(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked, row.original);
    }
  };

  switch (display) {
    case 'checkbox':
      return (
        <Checkbox
          checked={boolValue}
          onChange={handleChange}
          disabled={!editable}
          size="small"
        />
      );

    case 'switch':
      return (
        <Switch
          checked={boolValue}
          onChange={handleChange}
          disabled={!editable}
          size="small"
        />
      );

    case 'icon':
      const Icon = boolValue ? CheckIcon : CloseIcon;
      const customIcon = icons && (boolValue ? icons.true : icons.false);
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', color: boolValue ? 'success.main' : 'error.main' }}>
          {customIcon || <Icon fontSize="small" />}
        </Box>
      );

    case 'text':
      return (
        <Typography variant="body2">
          {boolValue ? labels.true : labels.false}
        </Typography>
      );

    default:
      return null;
  }
}
