import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import type { Column } from '@tanstack/react-table';
import type { TextFilterConfig } from '../../types';
import { FilterValue, FilterOperator } from '../../utils/filters';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface TextFilterProps<TData> {
  column: Column<TData, unknown>;
  config?: TextFilterConfig;
}

export function TextFilter<TData>({ column, config }: TextFilterProps<TData>): React.ReactElement {
  const { placeholder = 'Search...', debounce = 300 } = config || {};

  const columnFilterValue = column.getFilterValue() as FilterValue | string | undefined;

  const [operator, setOperator] = useState<FilterOperator>(
    typeof columnFilterValue === 'object' && columnFilterValue?.operator
      ? (columnFilterValue as FilterValue).operator
      : 'contains',
  );

  const initialValue: string =
    typeof columnFilterValue === 'object' && columnFilterValue?.value
      ? String((columnFilterValue as FilterValue).value)
      : typeof columnFilterValue === 'string'
        ? columnFilterValue
        : '';

  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value === '' && operator !== 'isEmpty' && operator !== 'isNotEmpty') {
        column.setFilterValue(undefined);
      } else {
        column.setFilterValue({ operator, value });
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, operator, debounce, column]);

  return (
    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={operator}
          onChange={(e) => setOperator(e.target.value as FilterOperator)}
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="contains">Contains</MenuItem>
          <MenuItem value="equals">Equals</MenuItem>
          <MenuItem value="startsWith">Starts with</MenuItem>
          <MenuItem value="endsWith">Ends with</MenuItem>
          <MenuItem value="isEmpty">Empty</MenuItem>
          <MenuItem value="isNotEmpty">Not empty</MenuItem>
        </Select>
      </FormControl>
      {operator !== 'isEmpty' && operator !== 'isNotEmpty' && (
        <TextField
          size="small"
          fullWidth
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    </Box>
  );
}
