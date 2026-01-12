import React from 'react';
import { TableRow, TableCell, Checkbox, Button, Collapse, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { Table, Row, Cell } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../../types/columns';
import { getCommonPinningStyles } from './utils';
import { flexRender } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
  rows: Row<TData>[];
  enableExpanding: boolean;
  enableRowSelection: boolean;
  enableCellSelection: boolean;
  enableEditing: boolean;
  enableListView: boolean;
  renderListViewItem?: (row: Row<TData>) => React.ReactNode;
  editMode: 'cell' | 'row';
  currentDensity: 'compact' | 'standard' | 'comfortable';
  cellPadding: string;
  selectedCell: { rowId: string; colId: string } | null;
  setSelectedCell: (s: { rowId: string; colId: string } | null) => void;
  setEditingRowId: (id: string | null) => void;
  setEditingCellId: (id: string | null) => void;
  setEditingData: (d: any) => void;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
}

export function RowRenderer<TData>({
  table,
  rows,
  enableExpanding,
  enableRowSelection,
  enableCellSelection,
  enableEditing,
  enableListView,
  renderListViewItem,
  editMode,
  currentDensity,
  cellPadding,
  selectedCell,
  setSelectedCell,
  setEditingRowId,
  setEditingCellId,
  setEditingData,
  renderSubComponent,
  onRowClick,
  onRowDoubleClick,
}: Props<TData>) {
  return (
    <>
      {rows.map((row) => {
        if (enableListView && renderListViewItem) {
          return (
            <TableRow key={row.id}>
              <TableCell colSpan={table.getVisibleLeafColumns().length + (enableRowSelection ? 1 : 0) + (enableExpanding ? 1 : 0)}>
                {renderListViewItem(row)}
              </TableCell>
            </TableRow>
          );
        }

        return (
          <React.Fragment key={row.id}>
            <TableRow
              hover
              selected={row.getIsSelected()}
              onClick={() => onRowClick?.(row)}
              onDoubleClick={() => {
                if (enableEditing && editMode === 'row') {
                  setEditingRowId(row.id);
                  setEditingData({});
                }
                onRowDoubleClick?.(row);
              }}
              sx={{
                cursor: onRowClick || onRowDoubleClick || (enableEditing && editMode === 'row') ? 'pointer' : 'default',
              }}
            >
              {enableExpanding && (
                <TableCell sx={{ p: cellPadding }}>
                  {row.getCanExpand() && (
                    <Button size="small" aria-label="Expandir fila" onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }} style={{ minWidth: 0, padding: 4 }}>
                      {row.getIsExpanded() ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </Button>
                  )}
                </TableCell>
              )}

              {enableRowSelection && (
                <TableCell sx={{ p: cellPadding }}>
                  <Checkbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                    onClick={(e) => { e.stopPropagation(); if (enableCellSelection) setSelectedCell(null); }}
                    size={currentDensity === 'compact' ? 'small' : 'medium'}
                  />
                </TableCell>
              )}

              {row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
                const columnDef = cell.column.columnDef as TanTableColumnDef<TData>;
                const align = columnDef.align || 'left';

                return (
                  <TableCell
                    key={cell.id}
                    data-row-id={row.id}
                    data-col-id={cell.column.id}
                    align={align}
                    onClick={(e) => {
                      if (enableCellSelection) {
                        e.stopPropagation();
                        setSelectedCell({ rowId: row.id, colId: cell.column.id });
                      }
                    }}
                    sx={{
                      p: cellPadding,
                      width: cell.column.getSize(),
                      minWidth: (cell.column.columnDef as TanTableColumnDef<TData>).minSize,
                      maxWidth: (cell.column.columnDef as TanTableColumnDef<TData>).maxSize,
                      ...getCommonPinningStyles(cell.column),
                      ...(enableCellSelection && selectedCell?.rowId === row.id && selectedCell?.colId === cell.column.id && {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '-2px',
                        zIndex: 1,
                      }),
                    }}
                    onDoubleClick={(e) => {
                      if (enableEditing && editMode === 'cell') {
                        e.stopPropagation();
                        setEditingCellId(`${row.id}_${cell.column.id}`);
                        setEditingData({});
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>

            {enableExpanding && row.getIsExpanded() && renderSubComponent && (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length + (enableRowSelection ? 1 : 0) + (enableExpanding ? 1 : 0)} sx={{ p: 0 }}>
                  <Collapse in={row.getIsExpanded()} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2 }}>{renderSubComponent({ row })}</Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
