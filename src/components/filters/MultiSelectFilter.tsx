import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import type { Column } from '@tanstack/react-table';
import type { MultiSelectFilterConfig } from '../../types';

interface MultiSelectFilterProps<TData> {
  column: Column<TData, unknown>;
  config?: MultiSelectFilterConfig;
}

export function MultiSelectFilter<TData>({ column, config }: MultiSelectFilterProps<TData>) {
  if (!config || !config.options) {
    return null;
  }

  const { options, placeholder = 'Select...', maxSelections } = config;
  const columnFilterValue = (column.getFilterValue() as any[]) || [];

  const handleChange = (event: { target: { value: unknown } }) => {
    const value = event.target.value as any[];
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
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as any[]).map((value) => {
              const option = options.find((opt) => opt.value === value);
              return <Chip key={String(value)} label={option?.label || value} size="small" />;
            })}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value as string | number}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
