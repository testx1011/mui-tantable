
import { TableRow, TableCell } from '@mui/material';
import { TextFilter, NumberFilter, DateFilter, SelectFilter, MultiSelectFilter } from '.';
import type {
  FilterType,
  FilterConfig,
  TextFilterConfig,
  NumberFilterConfig,
  DateFilterConfig,
  SelectFilterConfig,
  MultiSelectFilterConfig,
  TanTableColumnDef
} from '../../types';
import type { Table } from '@tanstack/react-table';


interface FilterRowProps<TData> {
  table: Table<TData>;
}

export function FilterRow<TData>({ table }: FilterRowProps<TData>) {
  return (
    <TableRow>
      {table.getHeaderGroups()[0].headers.map((header) => {
        const column = header.column;
        // Usar as para acceder a las props extendidas
        const colDef = column.columnDef as TanTableColumnDef<TData>;
        const filterType = colDef.filterType as FilterType | undefined;
        const filterConfig = colDef.filterConfig as FilterConfig | undefined;
        if (!column.getCanFilter()) {
          return <TableCell key={column.id} />;
        }
        switch (filterType) {
          case 'text':
            return (
              <TableCell key={column.id}>
                <TextFilter column={column} config={filterConfig as TextFilterConfig | undefined} />
              </TableCell>
            );
          case 'number':
            return (
              <TableCell key={column.id}>
                <NumberFilter column={column} config={filterConfig as NumberFilterConfig | undefined} />
              </TableCell>
            );
          case 'date':
            return (
              <TableCell key={column.id}>
                <DateFilter column={column} config={filterConfig as DateFilterConfig | undefined} table={table} />
              </TableCell>
            );
          case 'select':
            return (
              <TableCell key={column.id}>
                <SelectFilter column={column} config={filterConfig as SelectFilterConfig | undefined} />
              </TableCell>
            );
          case 'multiSelect':
            return (
              <TableCell key={column.id}>
                <MultiSelectFilter column={column} config={filterConfig as MultiSelectFilterConfig | undefined} />
              </TableCell>
            );
          default:
            return <TableCell key={column.id} />;
        }
      })}
    </TableRow>
  );
}
