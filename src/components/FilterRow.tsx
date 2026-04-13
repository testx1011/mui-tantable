import type { Table } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../types/columns';
import { TextFilter } from './filters/TextFilter';
import { NumberFilter } from './filters/NumberFilter';
import { DateFilter } from './filters/DateFilter';
import { SelectFilter } from './filters/SelectFilter';
import { MultiSelectFilter } from './filters/MultiSelectFilter';
import type {
  FilterConfig,
  TextFilterConfig,
  NumberFilterConfig,
  DateFilterConfig,
  SelectFilterConfig,
  MultiSelectFilterConfig,
} from '../types/filters';

// componente para renderizar una celda de filtro
import type { Column } from '@tanstack/react-table';
import { JSX } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface FilterCellProps<TData> {
  column: Column<TData, unknown>;
  table: Table<TData>;
  filterType?: string;
  filterConfig?: FilterConfig;
}

function FilterCell<TData>({ column, table, filterType, filterConfig }: FilterCellProps<TData>) {
  const commonProps = { column, table } as const;
  switch (filterType) {
    case 'text':
      return <TextFilter {...commonProps} config={filterConfig as TextFilterConfig | undefined} />;
    case 'number':
      return (
        <NumberFilter {...commonProps} config={filterConfig as NumberFilterConfig | undefined} />
      );
    case 'date':
      return <DateFilter {...commonProps} config={filterConfig as DateFilterConfig | undefined} />;
    case 'select':
      return (
        <SelectFilter {...commonProps} config={filterConfig as SelectFilterConfig | undefined} />
      );
    case 'multiSelect':
      return (
        <MultiSelectFilter
          {...commonProps}
          config={filterConfig as MultiSelectFilterConfig | undefined}
        />
      );
    default:
      return <TextFilter {...commonProps} config={filterConfig as TextFilterConfig | undefined} />;
  }
}

interface FilterRowProps<TData> {
  table: Table<TData>;
}

export function FilterRow<TData>({ table }: FilterRowProps<TData>): JSX.Element {
  return (
    <TableRow>
      {/* Spacer for expanding column */}
      {table.options.enableExpanding && <TableCell />}

      {/* Spacer for row selection column */}
      {table.options.enableRowSelection && <TableCell />}

      {table.getVisibleLeafColumns().map((column) => {
        const filterType = (column.columnDef as TanTableColumnDef<TData>).filterType;
        const filterConfig = (column.columnDef as TanTableColumnDef<TData>).filterConfig as
          | FilterConfig
          | undefined;

        if (!column.getCanFilter()) {
          return <TableCell key={column.id} />;
        }

        return (
          <FilterCell
            key={column.id}
            column={column}
            table={table}
            filterType={filterType}
            filterConfig={filterConfig}
          />
        );
      })}
    </TableRow>
  );
}
