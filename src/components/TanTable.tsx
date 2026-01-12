import React, { useMemo, useEffect, useCallback } from 'react';
import type { Cell } from '@tanstack/react-table';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef as TanStackColumnDef,
} from '@tanstack/react-table';
// virtualizer is used via hook
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Skeleton,
  Button,
  Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// ColumnHeader is used inside TableHeaderComponent
import type { TanTableProps, Density, TanTableState } from '../types/core';
import type { TableState } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../types/columns';
import { TablePagination } from './TablePagination';
import { TableToolbar } from './TableToolbar';
import {
  TextCell,
  NumberCell,
  DateCell,
  BooleanCell,
  ActionCell,
  LinkCell,
  ChipCell,
  AvatarCell,
  ProgressCell,
} from './cells';
import { smartFilter } from '../utils/filters';
import { EditCell } from './EditCell';
import { useTableVirtualizer } from './table/useTableVirtualizer';
import { TableHeaderComponent } from './table/TableHeader';
import { getCommonPinningStyles } from './table/utils';

// using getCommonPinningStyles from './table/utils'

export function TanTable<TData>({
  data,
  columns,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  enableSorting = true,
  enableMultiSort = true,
  enableColumnFilters = true,
  enableGlobalFilter = true,
  enablePagination = true,
  enableExpanding = false,
  enableVirtualization = false,
  virtualizationThreshold = 100,
  enableColumnResizing = false,
  enableColumnOrdering = false,
  initialState,
  state,
  onStateChange,
  onRowClick,
  onRowDoubleClick,
  onRowSelectionChange,
  loading = false,
  emptyMessage = 'No data available',
  error,
  density = 'standard',
  showToolbar = true,
  toolbarConfig,
  showPagination = true,
  paginationConfig,
  serverSide = false,
  serverSideHandlers,
  sx,
  tableContainerSx,
  className,
  renderSubComponent,
  getRowId,
  autoResetPageIndex = true,
  debug = false,
  enableEditing = false,
  enableCellSelection = false,
  enableListView = false,
  renderListViewItem,
  editMode = 'cell',
  onEditingRowSave,
  onEditingRowCancel,
}: TanTableProps<TData>) {
  const [currentDensity, setCurrentDensity] = React.useState(density);
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [editingCellId, setEditingCellId] = React.useState<string | null>(null);
  const [selectedCell, setSelectedCell] = React.useState<{
    rowId: string;
    colId: string;
  } | null>(null);
  const [editingData, setEditingData] = React.useState<Partial<TData>>({});

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentDensity(density);
  }, [density]);

  // Enhance columns with cell renderers based on cellType
  const enhancedColumns = useMemo<TanTableColumnDef<TData>[]>(() => {
    return columns.map((col) => {
      const column = { ...col };

      // Assign smartFilter if no filterFn is provided
      if (!column.filterFn) {
        column.filterFn = smartFilter;
      }

      // Wrap cell renderer for editing
      const originalCell = column.cell;

      // Auto-assign cell renderer based on cellType if not provided
      let CellComponent: any = originalCell;

      if (!CellComponent && column.cellType) {
        switch (column.cellType) {
          case 'text':
            CellComponent = TextCell;
            break;
          case 'number':
            CellComponent = NumberCell;
            break;
          case 'date':
            CellComponent = DateCell;
            break;
          case 'boolean':
            CellComponent = BooleanCell;
            break;
          case 'action':
            CellComponent = ActionCell;
            break;
          case 'link':
            CellComponent = LinkCell;
            break;
          case 'chip':
            CellComponent = ChipCell;
            break;
          case 'avatar':
            CellComponent = AvatarCell;
            break;
          case 'progress':
            CellComponent = ProgressCell;
            break;
        }
      }

      // Create the wrapped cell renderer
      column.cell = (props: any) => {
        const { row, column: colInstance, getValue } = props;
        const isRowEditing = editMode === 'row' && editingRowId === row.id;
        const isCellEditing =
          editMode === 'cell' &&
          editingCellId === `${row.id}_${colInstance.id}`;

        const isEditable =
          typeof column.editable === 'function'
            ? column.editable(row)
            : column.editable;

        // If in edit mode and column is editable
        if (
          (isRowEditing || isCellEditing) &&
          isEditable !== false &&
          column.cellType !== 'action'
        ) {
          return (
            <EditCell
              {...props}
              value={
                editingData[column.accessorKey as keyof TData] ?? getValue()
              }
              onChange={(value: any) => {
                setEditingData((prev) => ({
                  ...prev,
                  [column.accessorKey as keyof TData]: value,
                }));
              }}
              onSave={() => {
                if (editMode === 'cell') {
                  onEditingRowSave?.({
                    ...row.original,
                    ...editingData,
                  } as TData);
                  setEditingCellId(null);
                  setEditingData({});
                } else if (editMode === 'row') {
                  onEditingRowSave?.({
                    ...row.original,
                    ...editingData,
                  } as TData);
                  setEditingRowId(null);
                  setEditingData({});
                }
              }}
              onCancel={() => {
                if (editMode === 'cell') {
                  setEditingCellId(null);
                  setEditingData({});
                } else if (editMode === 'row') {
                  setEditingRowId(null);
                  setEditingData({});
                  onEditingRowCancel?.();
                }
              }}
              cellType={column.cellType}
            />
          );
        }

        // Inject props for ActionCell to handle row editing state
        if (column.cellType === 'action') {
          const actionProps = {
            ...props,
            isEditing: isRowEditing,
            onSave: () => {
              onEditingRowSave?.({ ...row.original, ...editingData } as TData);
              setEditingRowId(null);
              setEditingData({});
            },
            onCancel: () => {
              setEditingRowId(null);
              setEditingData({});
              onEditingRowCancel?.();
            },
          };

          if (typeof CellComponent === 'function') {
            return <CellComponent {...actionProps} />;
          }
          return CellComponent(actionProps);
        }

        // Render original cell
        if (CellComponent) {
          // If it's a functional component (like our custom cells), render it
          if (typeof CellComponent === 'function') {
            return <CellComponent {...props} />;
          }
          // If it's a render function
          return CellComponent(props);
        }

        // Fallback default rendering
        return flexRender(column.cell, props);
      };

      return column;
    });
  }, [columns, editingRowId, editingCellId, editingData, editMode]);

  // Create table instance
  const table = useReactTable({
    data,
    columns: enhancedColumns as TanStackColumnDef<TData, any>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      enableColumnFilters || enableGlobalFilter
        ? getFilteredRowModel()
        : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    enableRowSelection,
    enableMultiRowSelection,
    enableSorting,
    enableMultiSort,
    enableColumnFilters,
    enableGlobalFilter,
    enablePinning: true,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    getRowId,
    autoResetPageIndex,
    debugTable: debug,
    debugHeaders: debug,
    debugColumns: debug,
    state: {
      ...initialState,
      ...state,
    },
    onStateChange:
      onStateChange &&
      ((updater: TableState | ((prev: TableState) => TableState)) => {
        if (typeof updater === 'function') {
          try {
            const newState = (updater as (prev: TableState) => TableState)(
              table.getState()
            );
            const tanState: TanTableState = {
              ...(newState as unknown as object),
              // preserve density from previous state or default
              density:
                (newState as unknown as { density?: Density }).density ??
                (table.getState() as unknown as { density?: Density })
                  .density ??
                'standard',
            } as TanTableState;
            onStateChange(tanState);
          } catch (e) {
            // fallback: ignore
          }
        } else {
          const tanState: TanTableState = {
            ...(updater as unknown as object),
            density:
              (updater as unknown as { density?: Density }).density ??
              (table.getState() as unknown as { density?: Density }).density ??
              'standard',
          } as TanTableState;
          onStateChange(tanState);
        }
      }),
    manualPagination: serverSide,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    pageCount:
      serverSide && serverSideHandlers?.totalRowCount
        ? Math.ceil(
            serverSideHandlers.totalRowCount /
              (state?.pagination?.pageSize || 10)
          )
        : undefined,
  });

  // Handle row selection changes
  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [table.getState().rowSelection, onRowSelectionChange]);

  // Handle click outside to deselect cell
  useEffect(() => {
    const handleClickOutside = () => {
      if (enableCellSelection) {
        setSelectedCell(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [enableCellSelection]);

  // Density styles
  const densityPadding: Record<Density, string> = {
    compact: '4px 8px',
    standard: '8px 16px',
    comfortable: '12px 16px',
  };

  const cellPadding = densityPadding[currentDensity ?? 'standard'];

  // Decide whether to virtualize: explicit prop > auto threshold
  const effectiveVirtualization =
    enableVirtualization === true
      ? true
      : enableVirtualization === false
        ? false
        : (data?.length ?? 0) >= (virtualizationThreshold ?? 100);

  // Virtualization (hook)
  const { rowVirtualizer, virtualItems, visibleRows } = useTableVirtualizer(
    effectiveVirtualization,
    table.getRowModel().rows,
    tableContainerRef,
    currentDensity
  );

  // Scroll into view when selection changes
  useEffect(() => {
    if (!selectedCell) return;

    // Handle Virtualization Vertical Scroll
    if (effectiveVirtualization) {
      const rowIndex = table
        .getRowModel()
        .rows.findIndex((r) => r.id === selectedCell.rowId);
      if (rowIndex !== -1) {
        rowVirtualizer.scrollToIndex(rowIndex);
      }
    }

    // Handle DOM Scroll (Horizontal & Non-Virtualized Vertical)
    // We use a timeout to allow virtualization to render the row if needed
    setTimeout(() => {
      const cellElement = tableContainerRef.current?.querySelector(
        `td[data-row-id="${selectedCell.rowId}"][data-col-id="${selectedCell.colId}"]`
      );

      if (cellElement) {
        cellElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }, 0);
  }, [selectedCell, effectiveVirtualization, rowVirtualizer, table]);

  // Handle Keyboard Shortcuts (Copy & Navigation)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Copy Logic
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        const selectedRows = table.getSelectedRowModel().rows;

        // 1. Cell Copy Priority
        if (selectedCell) {
          const row = table
            .getRowModel()
            .rows.find((r) => r.id === selectedCell.rowId);
          if (row) {
            const cell = row
              .getVisibleCells()
              .find((c) => c.column.id === selectedCell.colId);
            if (cell) {
              const value = cell.getValue();
              let textValue = String(value ?? '');
              if (value instanceof Date) {
                textValue = value.toLocaleDateString();
              } else if (typeof value === 'object' && value !== null) {
                textValue = JSON.stringify(value);
              }
              navigator.clipboard.writeText(textValue);
              event.preventDefault();
              return;
            }
          }
        }

        // 2. Row Copy Priority
        if (selectedRows.length > 0) {
          const visibleColumns = table.getVisibleLeafColumns();

          const tsv = selectedRows
            .map((row) => {
              return visibleColumns
                .map((col) => {
                  const cell = row
                    .getVisibleCells()
                    .find((c) => c.column.id === col.id);
                  let val = cell?.getValue();
                  if (val instanceof Date) return val.toLocaleDateString();
                  if (typeof val === 'object' && val !== null)
                    return JSON.stringify(val);
                  return String(val ?? '');
                })
                .join('\t');
            })
            .join('\n');

          if (tsv) {
            navigator.clipboard.writeText(tsv);
            event.preventDefault();
          }
        }
      }

      // Navigation Logic
      if (enableCellSelection) {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          event.preventDefault();

          const visibleRows = table.getRowModel().rows;
          const visibleColumns = table.getVisibleLeafColumns();

          if (!selectedCell) {
            if (visibleRows.length > 0 && visibleColumns.length > 0) {
              setSelectedCell({
                rowId: visibleRows[0].id,
                colId: visibleColumns[0].id,
              });
            }
            return;
          }

          const currentRowIndex = visibleRows.findIndex(
            (r) => r.id === selectedCell.rowId
          );
          const currentColIndex = visibleColumns.findIndex(
            (c) => c.id === selectedCell.colId
          );

          if (currentRowIndex === -1 || currentColIndex === -1) return;

          let nextRowIndex = currentRowIndex;
          let nextColIndex = currentColIndex;

          switch (key) {
            case 'ArrowUp':
              nextRowIndex = Math.max(0, currentRowIndex - 1);
              break;
            case 'ArrowDown':
              nextRowIndex = Math.min(
                visibleRows.length - 1,
                currentRowIndex + 1
              );
              break;
            case 'ArrowLeft':
              nextColIndex = Math.max(0, currentColIndex - 1);
              break;
            case 'ArrowRight':
              nextColIndex = Math.min(
                visibleColumns.length - 1,
                currentColIndex + 1
              );
              break;
          }

          if (
            nextRowIndex !== currentRowIndex ||
            nextColIndex !== currentColIndex
          ) {
            setSelectedCell({
              rowId: visibleRows[nextRowIndex].id,
              colId: visibleColumns[nextColIndex].id,
            });
          }
        }

        // Enter to Edit
        if (
          key === 'Enter' &&
          enableEditing &&
          editMode === 'cell' &&
          selectedCell
        ) {
          event.preventDefault();
          setEditingCellId(`${selectedCell.rowId}_${selectedCell.colId}`);
          setEditingData({});
        }
      }
    },
    [table, selectedCell, enableCellSelection, enableEditing, editMode]
  );

  // Error state
  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', ...sx }} className={className}>
        <Typography color="error" variant="h6">
          {typeof error === 'string' ? error : 'An error occurred'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{ outline: 'none', ...sx }}
      className={className}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {showToolbar && (
        <TableToolbar
          table={table}
          config={toolbarConfig}
          density={currentDensity}
          onDensityChange={setCurrentDensity}
          view={view}
          onViewChange={setView}
          enableListView={enableListView}
        />
      )}

      <TableContainer
        component={Paper}
        ref={tableContainerRef}
        sx={{
          maxHeight: effectiveVirtualization ? 600 : undefined,
          overflow: 'auto',
          ...((tableContainerSx as any) || {}),
        }}
      >
        <Table
          size={currentDensity === 'compact' ? 'small' : 'medium'}
          stickyHeader
          sx={{ tableLayout: 'fixed' }}
        >
          <TableHeaderComponent
            table={table}
            cellPadding={cellPadding}
            enableExpanding={enableExpanding}
            enableRowSelection={Boolean(enableRowSelection)}
            enableMultiRowSelection={enableMultiRowSelection}
            enableColumnResizing={enableColumnResizing}
            enableColumnOrdering={enableColumnOrdering}
            currentDensity={currentDensity}
          />

          <TableBody>
            {loading ? (
              Array.from({
                length: table.getState().pagination.pageSize || 10,
              }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {enableExpanding && (
                    <TableCell sx={{ p: cellPadding }}>
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  )}
                  {enableRowSelection && (
                    <TableCell sx={{ p: cellPadding }}>
                      <Skeleton variant="rounded" width="100%" height={24} />
                    </TableCell>
                  )}
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell
                      key={`skeleton-${rowIndex}-${column.id}`}
                      sx={{
                        p: cellPadding,
                        ...getCommonPinningStyles(column),
                      }}
                    >
                      <Skeleton
                        variant="text"
                        width={
                          ['60%', '75%', '40%', '90%', '55%', '85%', '70%'][
                            (rowIndex + column.id.length) % 7
                          ]
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    table.getAllColumns().length +
                    (enableRowSelection ? 1 : 0) +
                    (enableExpanding ? 1 : 0)
                  }
                  sx={{ textAlign: 'center', p: 4 }}
                >
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {effectiveVirtualization && virtualItems.length > 0 && (
                  <TableRow style={{ height: virtualItems[0].start }}>
                    <TableCell
                      colSpan={
                        table.getVisibleLeafColumns().length +
                        (enableRowSelection ? 1 : 0) +
                        (enableExpanding ? 1 : 0)
                      }
                      style={{ padding: 0, border: 0 }}
                    />
                  </TableRow>
                )}

                {visibleRows.map((row) => {
                  if (view === 'list' && enableListView && renderListViewItem) {
                    return (
                      <TableRow key={row.id}>
                        <TableCell
                          colSpan={
                            table.getVisibleLeafColumns().length +
                            (enableRowSelection ? 1 : 0) +
                            (enableExpanding ? 1 : 0)
                          }
                        >
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
                            setEditingData({}); // Reset or load initial data if needed
                          }
                          onRowDoubleClick?.(row);
                        }}
                        sx={{
                          cursor:
                            onRowClick ||
                            onRowDoubleClick ||
                            (enableEditing && editMode === 'row')
                              ? 'pointer'
                              : 'default',
                        }}
                      >
                        {enableExpanding && (
                          <TableCell sx={{ p: cellPadding }}>
                            {row.getCanExpand() && (
                              <Button
                                size="small"
                                aria-label="Expandir fila"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  row.toggleExpanded();
                                }}
                                style={{ minWidth: 0, padding: 4 }}
                              >
                                {row.getIsExpanded() ? (
                                  <KeyboardArrowDownIcon />
                                ) : (
                                  <KeyboardArrowRightIcon />
                                )}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                if (enableCellSelection) {
                                  setSelectedCell(null);
                                }
                              }}
                              size={
                                currentDensity === 'compact'
                                  ? 'small'
                                  : 'medium'
                              }
                            />
                          </TableCell>
                        )}
                        {row
                          .getVisibleCells()
                          .map((cell: Cell<TData, unknown>) => {
                            const columnDef = cell.column
                              .columnDef as TanTableColumnDef<TData>;
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
                                    setSelectedCell({
                                      rowId: row.id,
                                      colId: cell.column.id,
                                    });
                                  }
                                }}
                                sx={{
                                  p: cellPadding,
                                  ...getCommonPinningStyles(cell.column),
                                  ...(enableCellSelection &&
                                    selectedCell?.rowId === row.id &&
                                    selectedCell?.colId === cell.column.id && {
                                      outline: '2px solid',
                                      outlineColor: 'primary.main',
                                      outlineOffset: '-2px',
                                      zIndex: 1,
                                    }),
                                }}
                                onDoubleClick={(e) => {
                                  if (enableEditing && editMode === 'cell') {
                                    e.stopPropagation();
                                    setEditingCellId(
                                      `${row.id}_${cell.column.id}`
                                    );
                                    setEditingData({});
                                  }
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            );
                          })}
                      </TableRow>
                      {enableExpanding &&
                        row.getIsExpanded() &&
                        renderSubComponent && (
                          <TableRow>
                            <TableCell
                              colSpan={
                                table.getAllColumns().length +
                                (enableRowSelection ? 1 : 0) +
                                (enableExpanding ? 1 : 0)
                              }
                              sx={{ p: 0 }}
                            >
                              <Collapse
                                in={row.getIsExpanded()}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box sx={{ p: 2 }}>
                                  {renderSubComponent({ row })}
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  );
                })}
                {effectiveVirtualization &&
                  rowVirtualizer.getVirtualItems().length > 0 && (
                    <TableRow
                      style={{
                        height:
                          rowVirtualizer.getTotalSize() -
                          rowVirtualizer.getVirtualItems()[
                            rowVirtualizer.getVirtualItems().length - 1
                          ].end,
                      }}
                    >
                      <TableCell
                        colSpan={
                          table.getVisibleLeafColumns().length +
                          (enableRowSelection ? 1 : 0) +
                          (enableExpanding ? 1 : 0)
                        }
                        style={{ padding: 0, border: 0 }}
                      />
                    </TableRow>
                  )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && enablePagination && !loading && (
        <TablePagination table={table} config={paginationConfig} />
      )}
    </Box>
  );
}
