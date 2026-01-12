import { TableRow, TableCell } from '@mui/material';
import type { Table } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../types/columns';
import {
  TextFilter,
  NumberFilter,
  DateFilter,
  SelectFilter,
  MultiSelectFilter,
} from './index';
import type {
  FilterConfig,
  TextFilterConfig,
  NumberFilterConfig,
  DateFilterConfig,
  SelectFilterConfig,
  MultiSelectFilterConfig,
} from '../types/filters';

interface FilterRowProps<TData> {
  table: Table<TData>;
}

export function FilterRow<TData>({ table }: FilterRowProps<TData>) {
  return (
    <TableRow>
      {/* Spacer for expanding column */}
      {table.options.enableExpanding && <TableCell />}

      {/* Spacer for row selection column */}
      {table.options.enableRowSelection && <TableCell />}

      {table.getVisibleLeafColumns().map((column) => {
        const filterType = (column.columnDef as TanTableColumnDef<TData>).filterType;
        const filterConfig = (column.columnDef as TanTableColumnDef<TData>)
          .filterConfig as FilterConfig | undefined;

        // Skip filter if not enabled or no accessor
        if (!column.getCanFilter()) {
          return <TableCell key={column.id} />;
        }

        const commonProps = {
          column,
          table,
        };

        const renderFilter = () => {
          switch (filterType) {
            case 'text':
              return (
                <TextFilter {...commonProps} config={filterConfig as TextFilterConfig | undefined} />
              );
            case 'number':
              return (
                <NumberFilter {...commonProps} config={filterConfig as NumberFilterConfig | undefined} />
              );
            case 'date':
              return (
                <DateFilter {...commonProps} config={filterConfig as DateFilterConfig | undefined} />
              );
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
              return (
                <TextFilter {...commonProps} config={filterConfig as TextFilterConfig | undefined} />
              );
          }
        };

        return (
          <TableCell key={column.id} sx={{ p: 1 }}>
            {renderFilter()}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
