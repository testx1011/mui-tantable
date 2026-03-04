import type { ReactNode } from 'react';
import type { Row, SortingState, ColumnFiltersState, VisibilityState, ColumnOrderState, ColumnPinningState, ExpandedState, RowSelectionState, PaginationState } from '@tanstack/react-table';
import type { SxProps, Theme } from '@mui/material';
import type { ToolbarConfig, PaginationConfig, ServerSideHandlers } from './toolbar';
import type { TanTableColumnDef } from './columns';

export type Density = 'compact' | 'standard' | 'comfortable';

export interface TanTableProps<TData> {
  /** Table data array */
  data: TData[];
  /** Column definitions */
  columns: TanTableColumnDef<TData>[];
  /** Enable row selection */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  /** Enable multi-row selection */
  enableMultiRowSelection?: boolean;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Enable multi-column sorting */
  enableMultiSort?: boolean;
  /** Enable column filters */
  enableColumnFilters?: boolean;
  /** Enable global filter */
  enableGlobalFilter?: boolean;
  /** Enable pagination */
  enablePagination?: boolean;
  /** Enable column resizing */
  enableColumnResizing?: boolean;
  /** Enable column reordering */
  enableColumnOrdering?: boolean;
  /** Enable column pinning */
  enableColumnPinning?: boolean;
  /** Enable row expansion */
  enableExpanding?: boolean;
  /** Enable virtualization */
  enableVirtualization?: boolean;
  /** Auto-enable virtualization when data length >= this threshold (used when enableVirtualization is undefined) */
  virtualizationThreshold?: number;
  /** Initial state */
  initialState?: Partial<TanTableState>;
  /** Controlled state */
  state?: Partial<TanTableState>;
  /** State change callbacks */
  onStateChange?: (state: TanTableState) => void;
  /** Row click handler */
  onRowClick?: (row: Row<TData>) => void;
  /** Row double click handler */
  onRowDoubleClick?: (row: Row<TData>) => void;
  /** Selection change handler */
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: ReactNode;
  /** Error state */
  error?: Error | string;
  /** Table density */
  density?: Density;
  /** Callback for when density changes via toolbar */
  onDensityChange?: (density: Density) => void;
  /** Show toolbar */
  showToolbar?: boolean;
  /** Toolbar configuration */
  toolbarConfig?: ToolbarConfig<TData>;
  /** Show pagination */
  showPagination?: boolean;
  /** Pagination configuration */
  paginationConfig?: PaginationConfig;
  /** Server-side mode */
  serverSide?: boolean;
  /** Server-side handlers */
  serverSideHandlers?: ServerSideHandlers<TData>;
  /** Custom styles */
  sx?: SxProps<Theme>;
  /** Styles applied to the internal TableContainer (useful when wrapping the table in a fixed-height Box) */
  tableContainerSx?: SxProps<Theme>;
  /** Custom class name */
  className?: string;
  /** Render sub-component for expanded rows */
  renderSubComponent?: (props: { row: Row<TData> }) => ReactNode;
  /** Get row ID */
  getRowId?: (originalRow: TData, index: number) => string;
  /** Auto-reset page index */
  autoResetPageIndex?: boolean;
  /** Debug mode */
  debug?: boolean;
  /** Enable editing */
  enableEditing?: boolean;
  /** Enable cell selection */
  enableCellSelection?: boolean;
  /** Enable list view */
  enableListView?: boolean;
  /** Render list view item */
  renderListViewItem?: (row: Row<TData>) => ReactNode;
  /** Edit mode */
  editMode?: 'cell' | 'row';
  /** Callback when row edit is saved */
  onEditingRowSave?: (row: TData) => Promise<void> | void;
  /** Callback when row edit is cancelled */
  onEditingRowCancel?: () => void;
}

export interface TanTableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  expanded: ExpandedState;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
  density: Density;
}

// Types exported by declaration.
