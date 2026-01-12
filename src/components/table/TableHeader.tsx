import { TableHead, TableRow, TableCell, Checkbox } from '@mui/material';
import type { Table } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../../types/columns';
import { ColumnHeader } from '../ColumnHeader';
import { getCommonPinningStyles } from './utils';

interface Props<TData> {
  table: Table<TData>;
  cellPadding: string;
  enableExpanding: boolean;
  enableRowSelection: boolean;
  enableMultiRowSelection: boolean;
  enableColumnResizing: boolean;
  enableColumnOrdering: boolean;
  currentDensity: 'compact' | 'standard' | 'comfortable';
}

export function TableHeaderComponent<TData>({
  table,
  cellPadding,
  enableExpanding,
  enableRowSelection,
  enableMultiRowSelection,
  enableColumnResizing,
  enableColumnOrdering,
  currentDensity,
}: Props<TData>) {
  return (
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {enableExpanding && <TableCell sx={{ width: 48, p: cellPadding }} />}
          {enableRowSelection && (
            <TableCell sx={{ width: 48, p: cellPadding }}>
              {enableMultiRowSelection && (
                <Checkbox
                  checked={table.getIsAllRowsSelected()}
                  indeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                  size={currentDensity === 'compact' ? 'small' : 'medium'}
                />
              )}
            </TableCell>
          )}

          {headerGroup.headers.map((header) => {
            const columnDef = header.column.columnDef as TanTableColumnDef<TData>;
            const align = columnDef.align || 'left';

            return (
              <TableCell
                key={header.id}
                align={align}
                sx={{
                  p: cellPadding,
                  width: header.getSize(),
                  minWidth: columnDef.minSize,
                  maxWidth: columnDef.maxSize,
                  ...getCommonPinningStyles(header.column),
                }}
              >
                {header.isPlaceholder ? null : (
                  <ColumnHeader
                    header={header}
                    title={header.column.columnDef.header as any}
                    enableResizing={enableColumnResizing}
                    enableReordering={enableColumnOrdering}
                  />
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableHead>
  );
}
