import { useState, useEffect } from 'react';
import type { Column, Table } from '@tanstack/react-table';
import { FilterValue, FilterOperator } from '../../utils/filters';
import { DateFilterConfig } from '../../types/filters';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface DateFilterProps<TData> {
  column: Column<TData, unknown>;
  table: Table<TData>;
  config?: DateFilterConfig;
}

export function DateFilter<TData>({ column, config }: DateFilterProps<TData>): React.ReactElement {
  const { startPlaceholder = 'Start', endPlaceholder = 'End' } = config || {};

  const columnFilterValue = column.getFilterValue() as FilterValue | undefined;

  const [operator, setOperator] = useState<FilterOperator>(columnFilterValue?.operator || 'equals');

  const [value, setValue] = useState<string>(
    columnFilterValue?.value ? String(columnFilterValue.value) : '',
  );

  const [value2, setValue2] = useState<string>(
    columnFilterValue?.value2 ? String(columnFilterValue.value2) : '',
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        value === '' &&
        operator !== 'isEmpty' &&
        operator !== 'isNotEmpty' &&
        operator !== 'between'
      ) {
        column.setFilterValue(undefined);
      } else if (operator === 'between' && (value === '' || value2 === '')) {
        if (value === '' && value2 === '') column.setFilterValue(undefined);
        else column.setFilterValue({ operator, value, value2 });
      } else {
        column.setFilterValue({ operator, value, value2 });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, value2, operator, column]);

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={operator}
          onChange={(e) => setOperator(e.target.value as FilterOperator)}
          displayEmpty
        >
          <MenuItem value="equals">Equals</MenuItem>
          <MenuItem value="notEquals">Not equal</MenuItem>
          <MenuItem value="greaterThan">After</MenuItem>
          <MenuItem value="greaterThanOrEqual">After or equal</MenuItem>
          <MenuItem value="lessThan">Before</MenuItem>
          <MenuItem value="lessThanOrEqual">Before or equal</MenuItem>
          <MenuItem value="between">Between</MenuItem>
          <MenuItem value="isEmpty">Empty</MenuItem>
          <MenuItem value="isNotEmpty">Not empty</MenuItem>
        </Select>
      </FormControl>
      {operator !== 'isEmpty' && operator !== 'isNotEmpty' && (
        <TextField
          size="small"
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          label={operator === 'between' ? startPlaceholder : undefined}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      )}
      {operator === 'between' && (
        <TextField
          size="small"
          type="date"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          fullWidth
          label={endPlaceholder}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      )}
    </Box>
  );
}
