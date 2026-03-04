import type { SelectChangeEvent } from '@mui/material/Select';
import type { Column } from '@tanstack/react-table';
import type { MultiSelectFilterConfig } from '../../types/filters';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

interface MultiSelectFilterProps<TData> {
  column: Column<TData, unknown>;
  config?: MultiSelectFilterConfig;
}

export function MultiSelectFilter<TData>({
  column,
  config,
}: MultiSelectFilterProps<TData>): React.ReactNode {
  if (!config || !config.options) {
    return null;
  }

  const { options, placeholder = 'Select...', maxSelections } = config;
  const columnFilterValue = (column.getFilterValue() as unknown[]) || [];

  const handleChange = (event: SelectChangeEvent<unknown[]>) => {
    const value = event.target.value as unknown[];
    if (maxSelections && value.length > maxSelections) {
      return;
    }
    column.setFilterValue(value.length > 0 ? value : undefined);
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel>{placeholder}</InputLabel>
      <Select
        multiple
        value={columnFilterValue}
        onChange={handleChange}
        label={placeholder}
        renderValue={(selected: unknown[]) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as unknown[]).map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <Chip
                  key={String(value)}
                  label={(option?.label as React.ReactNode) ?? String(value)}
                  size="small"
                />
              );
            })}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem
            key={String(option.value)}
            value={option.value as string | number}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
