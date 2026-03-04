import { useState, useEffect, JSX } from 'react';
import { TextField, Select, MenuItem, FormControl, Box } from '@mui/material';
import type { Column } from '@tanstack/react-table';
import { FilterValue, FilterOperator } from '../../utils/filters';
import { NumberFilterConfig } from '../../types/filters';

interface NumberFilterProps<TData> {
  column: Column<TData, unknown>;
  config?: NumberFilterConfig;
}

export function NumberFilter<TData>({
  column,
  config,
}: NumberFilterProps<TData>): JSX.Element {
  const { minPlaceholder = 'Min', maxPlaceholder = 'Max', step } = config || {};

  const columnFilterValue = column.getFilterValue() as FilterValue | undefined;

  const [operator, setOperator] = useState<FilterOperator>(
    columnFilterValue?.operator || 'equals',
  );

  const [value, setValue] = useState<string>(
    columnFilterValue?.value !== undefined
      ? String(columnFilterValue.value)
      : '',
  );

  const [value2, setValue2] = useState<string>(
    columnFilterValue?.value2 !== undefined
      ? String(columnFilterValue.value2)
      : '',
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
        // Wait for both values? Or allow partial? Let's wait for both or clear if empty
        if (value === '' && value2 === '') column.setFilterValue(undefined);
        else
          column.setFilterValue({
            operator,
            value: value ? Number(value) : undefined,
            value2: value2 ? Number(value2) : undefined,
          });
      } else {
        column.setFilterValue({
          operator,
          value: value !== '' ? Number(value) : undefined,
          value2: value2 !== '' ? Number(value2) : undefined,
        });
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
          <MenuItem value="equals">Igual a</MenuItem>
          <MenuItem value="notEquals">Diferente de</MenuItem>
          <MenuItem value="greaterThan">Mayor que</MenuItem>
          <MenuItem value="greaterThanOrEqual">Mayor o igual</MenuItem>
          <MenuItem value="lessThan">Menor que</MenuItem>
          <MenuItem value="lessThanOrEqual">Menor o igual</MenuItem>
          <MenuItem value="between">Entre</MenuItem>
          <MenuItem value="isEmpty">Vacío</MenuItem>
          <MenuItem value="isNotEmpty">No vacío</MenuItem>
        </Select>
      </FormControl>

      {operator !== 'isEmpty' && operator !== 'isNotEmpty' && (
        <TextField
          size="small"
          type="number"
          placeholder={operator === 'between' ? minPlaceholder : 'Valor'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ step }}
          fullWidth
        />
      )}

      {operator === 'between' && (
        <TextField
          size="small"
          type="number"
          placeholder={maxPlaceholder}
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          inputProps={{ step }}
          fullWidth
        />
      )}
    </Box>
  );
}
