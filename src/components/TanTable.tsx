import React, { JSX, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  ColumnDef as TanStackColumnDef,
  type Column,
} from '@tanstack/react-table';
// ColumnHeader is used inside TableHeaderComponent
import type { TanTableProps, Density, TanTableState } from '../types/core';
import type { TableState } from '@tanstack/react-table';

import { TablePagination } from './TablePagination';
import { TableToolbar } from './TableToolbar';
import { RowRenderer } from './table/RowRenderer';

import { useTableVirtualizer } from './table/hooks/useTableVirtualizer';
import { useEditingState } from './table/hooks/useEditingState';
import { useEnhancedColumns } from './table/hooks/useEnhancedColumns';
import { useCellNavigation } from './table/hooks/useCellNavigation';
import { TableHeaderComponent } from './table/TableHeader';
import { TableFooterComponent } from './table/TableFooter';
import { getCommonPinningStyles } from './table/utils';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

// using getCommonPinningStyles from './table/utils'

// SkeletonRows was previously defined inside the component which violated
// react-doctor/no-nested-component-definition.  Move it to module scope and
// parameterize the pieces it needs.

interface SkeletonRowsProps<TData> {
  count: number;
  enableExpanding: boolean;
  enableRowSelection: boolean;
  enableRowNumbering: boolean;
  cellPadding: string;
  columns: Column<TData, unknown>[];
}

const SkeletonRows = <TData,>({
  count,
  enableExpanding,
  enableRowSelection,
  enableRowNumbering,
  cellPadding,
  columns,
}: SkeletonRowsProps<TData>) => {
  return (
    <>
      {Array.from({ length: count }).map((_, rowIndex) => (
        <TableRow key={`skeleton-${rowIndex}`}>
          {enableRowNumbering && (
            <TableCell sx={{ p: cellPadding, textAlign: 'center', width: 50 }}>
              <Skeleton variant="text" width={20} />
            </TableCell>
          )}
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
          {columns.map((column: Column<TData, unknown>) => (
            <TableCell
              key={`skeleton-${rowIndex}-${column.id}`}
              sx={{
                p: cellPadding,
                ...getCommonPinningStyles(column),
              }}
            >
              <Skeleton
                variant="text"
                width={['60%', '75%', '40%', '90%', '55%', '85%', '70%'][rowIndex % 7]}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

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
  autoHeight = false,
  height,
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
  onDensityChange,
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
  enableRowNumbering = false,
  stickyPagination = false,
  enableFooter = false,
  footerConfig,
  enableInfiniteScroll = false,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  enableGrouping = false,
  groupedColumns = [],
  onGroupChange,
}: TanTableProps<TData>): JSX.Element {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  // density can be controlled by caller or managed internally; similar to an
  // uncontrolled component pattern. react-doctor flags the previous
  // useEffect that synced prop -> state, so we compute derived value inline
  // and update internal state only when uncontrolled.
  const isControlledDensity = density !== undefined;
  const [internalDensity, setInternalDensity] = React.useState<Density>(density ?? 'standard');
  const currentDensity: Density = isControlledDensity ? (density as Density) : internalDensity;

  const handleDensityChange = (newDensity: Density) => {
    if (!isControlledDensity) {
      setInternalDensity(newDensity);
    }
    onDensityChange?.(newDensity);
  };

  // editing state managed by custom hook
  const editing = useEditingState<TData>({
    editMode,
    onEditingRowSave,
    onEditingRowCancel,
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Enhance columns with cell renderers based on cellType (delegated to hook)
  const enhancedColumns = useEnhancedColumns<TData>({
    columns,
    editMode,
    editing,
  });

  // Create table instance
  const table = useReactTable({
    data,
    columns: enhancedColumns as TanStackColumnDef<TData, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      enableColumnFilters || enableGlobalFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
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
      ...(enableGrouping ? { grouping: groupedColumns } : {}),
    },
    onStateChange: (updater: TableState | ((prev: TableState) => TableState)) => {
      // always call row-selection callback if provided
      if (onRowSelectionChange) {
        const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
        onRowSelectionChange(selectedRows);
      }

      // Handle grouping changes
      if (enableGrouping && onGroupChange) {
        const currentGrouping = table.getState().grouping;
        onGroupChange(currentGrouping);
      }

      if (onStateChange) {
        if (typeof updater === 'function') {
          try {
            const newState = (updater as (prev: TableState) => TableState)(table.getState());
            const tanState: TanTableState = {
              ...(newState as unknown as object),
              density:
                (newState as unknown as { density?: Density }).density ??
                (table.getState() as unknown as { density?: Density }).density ??
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
      }
    },
    manualPagination: serverSide,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    pageCount:
      serverSide && serverSideHandlers?.totalRowCount
        ? Math.ceil(serverSideHandlers.totalRowCount / (state?.pagination?.pageSize || 10))
        : undefined,
  });

  // Density styles - defined at module scope for consistency
  const cellPadding =
    currentDensity === 'compact'
      ? '4px 8px'
      : currentDensity === 'comfortable'
        ? '12px 16px'
        : '8px 16px';

  // Decide whether to virtualize: explicit prop > auto threshold
  // Virtualization: always ON by default (like MUI Data Grid), unless explicitly disabled
  // autoHeight overrides virtualization - when true, table grows to content height
  const effectiveVirtualization = autoHeight ? false : enableVirtualization !== false;

  // Container height: use height prop when virtualization is active, autoHeight removes maxHeight
  const containerMaxHeight = autoHeight ? undefined : (height ?? 600);

  // Virtualization (hook)
  const { rowVirtualizer, virtualItems, visibleRows } = useTableVirtualizer(
    effectiveVirtualization,
    table.getRowModel().rows,
    tableContainerRef,
    currentDensity,
  );

  // Infinite scroll handler
  React.useEffect(() => {
    if (!enableInfiniteScroll || !onLoadMore || !hasMore || loadingMore) return;

    const container = tableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [enableInfiniteScroll, onLoadMore, hasMore, loadingMore]);

  // navigation & selection hook (depends on table instance, so created here)
  const navigation = useCellNavigation<TData>({
    table,
    enableCellSelection,
    enableEditing,
    editMode,
    isEditing: editing.isEditing,
    canUndo: editing.canUndo,
    canRedo: editing.canRedo,
    onUndo: editing.undo,
    onRedo: editing.redo,
    onStartCellEdit: (rowId, colId) => {
      const row = table.getRowModel().rows.find((r) => r.id === rowId);
      if (row) {
        editing.startCellEdit(row, colId);
      }
    },
    onCancelEdit: () => {
      editing.cancel();
    },
  });

  // Scroll into view when selection changes
  const tableRows = table.getRowModel().rows;
  const tableColumns = table.getVisibleLeafColumns();
  useEffect(() => {
    const sel = navigation.selectedCell;
    if (!sel) return;

    if (effectiveVirtualization) {
      const rowIndex = tableRows.findIndex((r) => r.id === sel.rowId);
      if (rowIndex !== -1) {
        rowVirtualizer.scrollToIndex(rowIndex);
      }
    }

    const frameId = requestAnimationFrame(() => {
      const cellElement = tableContainerRef.current?.querySelector(
        `td[data-row-id="${sel.rowId}"][data-col-id="${sel.colId}"]`,
      );

      if (cellElement) {
        cellElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [navigation.selectedCell, effectiveVirtualization, rowVirtualizer, tableRows, tableColumns]);

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
      onKeyDown={navigation.handleKeyDown}
      role="region"
      aria-label="Data table"
    >
      {showToolbar && (
        <TableToolbar
          table={table}
          config={toolbarConfig}
          density={currentDensity}
          onDensityChange={handleDensityChange}
          view={view}
          onViewChange={setView}
          enableListView={enableListView}
        />
      )}

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: effectiveVirtualization ? containerMaxHeight : undefined,
        }}
      >
        <TableContainer
          component={Paper}
          ref={tableContainerRef}
          sx={{
            flex: stickyPagination ? 1 : 'none',
            overflow: 'auto',
            ...(tableContainerSx || {}),
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
              enableRowNumbering={enableRowNumbering}
              currentDensity={currentDensity}
            />

            <TableBody>
              {loading ? (
                <SkeletonRows<TData>
                  count={table.getState().pagination.pageSize || 10}
                  enableExpanding={enableExpanding}
                  enableRowSelection={Boolean(enableRowSelection)}
                  enableRowNumbering={enableRowNumbering}
                  cellPadding={cellPadding}
                  columns={table.getVisibleLeafColumns()}
                />
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      table.getAllColumns().length +
                      (enableRowNumbering ? 1 : 0) +
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
                          (enableRowNumbering ? 1 : 0) +
                          (enableRowSelection ? 1 : 0) +
                          (enableExpanding ? 1 : 0)
                        }
                        style={{ padding: 0, border: 0 }}
                      />
                    </TableRow>
                  )}

                  <RowRenderer<TData>
                    table={table}
                    rows={visibleRows}
                    enableExpanding={enableExpanding}
                    enableRowSelection={Boolean(enableRowSelection)}
                    enableCellSelection={enableCellSelection}
                    enableEditing={enableEditing}
                    enableListView={enableListView}
                    enableRowNumbering={enableRowNumbering}
                    renderListViewItem={renderListViewItem}
                    editMode={editMode}
                    currentDensity={currentDensity}
                    cellPadding={cellPadding}
                    selectedCell={navigation.selectedCell}
                    setSelectedCell={navigation.setSelectedCell}
                    startRowEdit={editing.startRowEdit}
                    startCellEdit={editing.startCellEdit}
                    renderSubComponent={renderSubComponent}
                    onRowClick={onRowClick}
                    onRowDoubleClick={onRowDoubleClick}
                    virtualRowStartIndex={
                      effectiveVirtualization && virtualItems.length > 0 ? virtualItems[0].index : 0
                    }
                  />

                  {effectiveVirtualization && rowVirtualizer.getVirtualItems().length > 0 && (
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
                          (enableRowNumbering ? 1 : 0) +
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
            {enableFooter && (
              <TableFooterComponent
                table={table}
                enableRowNumbering={enableRowNumbering}
                enableRowSelection={Boolean(enableRowSelection)}
                enableExpanding={enableExpanding}
                cellPadding={cellPadding}
                footerConfig={footerConfig}
              />
            )}
          </Table>
          {enableInfiniteScroll && loadingMore && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Loading more...
              </Typography>
            </Box>
          )}
        </TableContainer>

        {showPagination && enablePagination && !loading && (
          <Box
            sx={{
              position: stickyPagination ? 'sticky' : 'relative',
              bottom: stickyPagination ? 0 : 'auto',
              backgroundColor: 'background.paper',
              zIndex: stickyPagination ? 1 : 'auto',
              borderTop: stickyPagination ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <TablePagination table={table} config={paginationConfig} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
