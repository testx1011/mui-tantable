import { useState, useEffect } from 'react';
import type { Column } from '@tanstack/react-table';
import type { FilterValue, FilterOperator } from '../../utils/filters';

interface UseFilterStateOptions<TData = unknown> {
  column: Column<TData, unknown>;
  debounce?: number;
  parseValue?: (value: string) => string | number | Date | null;
  serializeValue?: (value: unknown) => string;
}

interface UseFilterStateResult {
  operator: FilterOperator;
  setOperator: (op: FilterOperator) => void;
  value: string;
  setValue: (v: string) => void;
  value2: string;
  setValue2: (v: string) => void;
}

/**
 * Shared hook for filter state management with debounced column.setFilterValue.
 * Eliminates duplicated logic across TextFilter, NumberFilter, and DateFilter.
 */
export function useFilterState<TData = unknown>({
  column,
  debounce = 300,
  parseValue = (v) => v,
  serializeValue = (v) => String(v ?? ''),
}: UseFilterStateOptions<TData>): UseFilterStateResult {
  const columnFilterValue = column.getFilterValue() as FilterValue | undefined;

  const [operator, setOperator] = useState<FilterOperator>(
    columnFilterValue?.operator || ('contains' as FilterOperator),
  );

  const [value, setValue] = useState<string>(
    columnFilterValue?.value !== undefined ? serializeValue(columnFilterValue.value) : '',
  );

  const [value2, setValue2] = useState<string>(
    columnFilterValue?.value2 !== undefined ? serializeValue(columnFilterValue.value2) : '',
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
        else {
          const parsed = parseValue(value);
          const parsed2 = parseValue(value2);
          column.setFilterValue({
            operator,
            value: parsed,
            value2: parsed2,
          });
        }
      } else {
        column.setFilterValue({
          operator,
          value: parseValue(value),
          value2: operator === 'between' ? parseValue(value2) : undefined,
        });
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, value2, operator, column, debounce, parseValue]);

  return { operator, setOperator, value, setValue, value2, setValue2 };
}
