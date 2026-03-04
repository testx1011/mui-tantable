import type { Column } from '@tanstack/react-table';
import { SelectFilterConfig } from '../../types/filters';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface SelectFilterProps<TData> {
  column: Column<TData, unknown>;
  config?: SelectFilterConfig;
}

export function SelectFilter<TData>({
  column,
  config,
}: SelectFilterProps<TData>): React.ReactNode {
  if (!config || !config.options) {
    return null;
  }

  const { options, placeholder = 'Select...' } = config;
  const columnFilterValue = column.getFilterValue();

  return (
    <FormControl size="small" fullWidth>
      <InputLabel>{placeholder}</InputLabel>
      <Select
        value={columnFilterValue ?? ''}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        label={placeholder}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
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
