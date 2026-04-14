import type { Table } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../../types/columns';
import type { ColumnGroupingState } from '../../types/columnGrouping';
import { ColumnHeader } from '../ColumnHeader';
import { getCommonPinningStyles } from './utils';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

interface Props<TData> {
  table: Table<TData>;
  cellPadding: string;
  enableExpanding: boolean;
  enableRowSelection: boolean;
  enableMultiRowSelection: boolean;
  enableColumnResizing: boolean;
  enableColumnOrdering: boolean;
  enableRowNumbering: boolean;
  enableRowReordering?: boolean;
  currentDensity: 'compact' | 'standard' | 'comfortable';
  columnGroupingState?: ColumnGroupingState;
  columnGroupHeaderHeight?: number;
}

export function TableHeaderComponent<TData>({
  table,
  cellPadding,
  enableExpanding,
  enableRowSelection,
  enableMultiRowSelection,
  enableColumnResizing,
  enableColumnOrdering,
  enableRowNumbering,
  enableRowReordering,
  currentDensity,
  columnGroupingState,
  columnGroupHeaderHeight,
}: Props<TData>): React.ReactElement {
  const hasColumnGrouping = columnGroupingState && columnGroupingState.headerStructure.length > 0;
  const hasFeatureColumns =
    enableRowNumbering || enableExpanding || enableRowSelection || enableRowReordering;

  return (
    <TableHead>
      {hasColumnGrouping
        ? columnGroupingState.headerStructure.map((headerRow, rowIndex) => (
            <TableRow key={`group-row-${rowIndex}`}>
              {hasFeatureColumns && rowIndex === 0 && (
                <TableCell
                  colSpan={
                    (enableRowNumbering ? 1 : 0) +
                    (enableExpanding ? 1 : 0) +
                    (enableRowSelection ? 1 : 0) +
                    (enableRowReordering ? 1 : 0)
                  }
                  rowSpan={columnGroupingState.maxDepth}
                  sx={{ p: cellPadding, verticalAlign: 'middle' }}
                />
              )}
              {headerRow.groups.map((group, colIndex) => {
                if (group.isLeaf && group.columnId) {
                  const header = table
                    .getHeaderGroups()
                    .flatMap((g) => g.headers)
                    .find((h) => h.column.id === group.columnId);
                  if (!header) return null;

                  const columnDef = header.column.columnDef as TanTableColumnDef<TData>;
                  return (
                    <TableCell
                      key={header.id}
                      align={columnDef.align || 'left'}
                      sx={{
                        p: cellPadding,
                        width: header.column.getSize(),
                        minWidth: columnDef.minSize,
                        maxWidth: columnDef.maxSize,
                        ...getCommonPinningStyles(header.column),
                      }}
                    >
                      <ColumnHeader
                        header={header}
                        title={header.column.columnDef.header as React.ReactNode}
                        enableResizing={enableColumnResizing}
                        enableReordering={enableColumnOrdering}
                      />
                    </TableCell>
                  );
                }

                return (
                  <TableCell
                    key={group.groupId || `group-${rowIndex}-${colIndex}`}
                    colSpan={group.colSpan}
                    rowSpan={group.rowSpan}
                    align={group.headerName ? group.headerAlign || 'left' : 'left'}
                    sx={{
                      p: cellPadding,
                      backgroundColor: 'grey[100]',
                      fontWeight: 600,
                      textAlign: group.headerAlign || 'left',
                      verticalAlign: 'middle',
                      height: columnGroupHeaderHeight,
                    }}
                  >
                    {group.headerName}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        : table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {enableRowNumbering && (
                <TableCell
                  sx={{ width: 50, p: cellPadding, textAlign: 'center' }}
                  aria-label="Row number"
                >
                  <Typography variant="caption" color="text.secondary">
                    #
                  </Typography>
                </TableCell>
              )}
              {enableExpanding && <TableCell sx={{ width: 48, p: cellPadding }} />}
              {enableRowSelection && (
                <TableCell sx={{ width: 48, p: cellPadding }}>
                  {enableMultiRowSelection && (
                    <Checkbox
                      checked={table.getIsAllRowsSelected()}
                      indeterminate={table.getIsSomeRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                      size={currentDensity === 'compact' ? 'small' : 'medium'}
                      aria-label="Select all rows"
                    />
                  )}
                </TableCell>
              )}
              {enableRowReordering && <TableCell sx={{ width: 40, p: cellPadding }} />}

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
                        title={header.column.columnDef.header as React.ReactNode}
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
