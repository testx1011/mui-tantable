import { JSX } from 'react';
import type { Column } from '@tanstack/react-table';
import { NumberFilterConfig } from '../../types/filters';
import { useFilterState } from './useFilterState';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface NumberFilterProps<TData> {
  column: Column<TData, unknown>;
  config?: NumberFilterConfig;
}

export function NumberFilter<TData>({ column, config }: NumberFilterProps<TData>): JSX.Element {
  const { minPlaceholder = 'Min', maxPlaceholder = 'Max', step, debounce } = config || {};

  const { operator, setOperator, value, setValue, value2, setValue2 } = useFilterState({
    column,
    debounce,
    parseValue: (v) => (v === '' ? null : Number(v)),
  });

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={operator}
          onChange={(e) => setOperator(e.target.value as typeof operator)}
          displayEmpty
        >
          <MenuItem value="equals">Equals</MenuItem>
          <MenuItem value="notEquals">Not equal</MenuItem>
          <MenuItem value="greaterThan">Greater than</MenuItem>
          <MenuItem value="greaterThanOrEqual">Greater or equal</MenuItem>
          <MenuItem value="lessThan">Less than</MenuItem>
          <MenuItem value="lessThanOrEqual">Less or equal</MenuItem>
          <MenuItem value="between">Between</MenuItem>
          <MenuItem value="isEmpty">Empty</MenuItem>
          <MenuItem value="isNotEmpty">Not empty</MenuItem>
        </Select>
      </FormControl>
      {operator !== 'isEmpty' && operator !== 'isNotEmpty' && (
        <TextField
          size="small"
          type="number"
          placeholder={operator === 'between' ? minPlaceholder : 'Value'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          slotProps={{
            htmlInput: { step },
          }}
        />
      )}
      {operator === 'between' && (
        <TextField
          size="small"
          type="number"
          placeholder={maxPlaceholder}
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          fullWidth
          slotProps={{
            htmlInput: { step },
          }}
        />
      )}
    </Box>
  );
}
