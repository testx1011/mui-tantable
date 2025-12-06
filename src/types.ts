import type { ReactNode, CSSProperties } from 'react';
import type {
  ColumnDef as TanStackColumnDef,
  Table as TanStackTable,
  Row,
  Cell,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  ColumnPinningState,
  ExpandedState,
  RowSelectionState,
  PaginationState,
  Column,
} from '@tanstack/react-table';
import type { SxProps, Theme } from '@mui/material';

// ============================================================================
// Core Table Types
// ============================================================================

export interface TanTableProps<TData> {
  /** Table data array */
  data: TData[];
  /** Column definitions */
  columns: ColumnDef<TData>[];
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
  /** Initial state */
  initialState?: Partial<TableState>;
  /** Controlled state */
  state?: Partial<TableState>;
  /** State change callbacks */
  onStateChange?: (state: TableState) => void;
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
  density?: 'compact' | 'standard' | 'comfortable';
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

export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  expanded: ExpandedState;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
  density: 'compact' | 'standard' | 'comfortable';
}

// ============================================================================
// Column Definition Types
// ============================================================================

export interface ColumnDef<TData> extends Omit<TanStackColumnDef<TData>, 'cell'> {
  /** Column unique identifier */
  id?: string;
  /** Column header label */
  header?: TanStackColumnDef<TData>['header'];
  /** Accessor key for data */
  accessorKey?: keyof TData & string;
  /** Accessor function */
  accessorFn?: (row: TData) => unknown;
  /** Cell renderer */
  cell?: CellRenderer<TData>;
  /** Cell type for automatic rendering */
  cellType?: CellType;
  /** Cell type configuration */
  cellConfig?: CellConfig;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Enable filtering for this column */
  enableColumnFilter?: boolean;
  /** Filter type */
  filterType?: FilterType;
  /** Filter configuration */
  filterConfig?: FilterConfig;
  /** Enable resizing */
  enableResizing?: boolean;
  /** Enable pinning */
  enablePinning?: boolean;
  /** Enable hiding */
  enableHiding?: boolean;
  /** Column width */
  size?: number;
  /** Min column width */
  minSize?: number;
  /** Max column width */
  maxSize?: number;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Column description (for tooltips) */
  description?: string;
  /** Is column editable */
  editable?: boolean | ((row: Row<TData>) => boolean);
  /** Custom styles */
  sx?: SxProps<Theme>;
}

export type CellRenderer<TData> = (props: CellRendererProps<TData>) => ReactNode;

export interface CellRendererProps<TData> {
  cell: Cell<TData, unknown>;
  row: Row<TData>;
  table: TanStackTable<TData>;
  getValue: () => any;
  column: Column<TData, unknown>;
}

// ============================================================================
// Cell Types
// ============================================================================

export type CellType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'action'
  | 'link'
  | 'chip'
  | 'avatar'
  | 'progress'
  | 'custom';

export type CellConfig =
  | TextCellConfig
  | NumberCellConfig
  | DateCellConfig
  | BooleanCellConfig
  | ActionCellConfig
  | LinkCellConfig
  | ChipCellConfig
  | AvatarCellConfig
  | ProgressCellConfig;

export interface TextCellConfig {
  /** Maximum characters before truncation */
  maxLength?: number;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Text transform */
  transform?: 'uppercase' | 'lowercase' | 'capitalize';
  /** Enable copy to clipboard */
  enableCopy?: boolean;
}

export interface NumberCellConfig {
  /** Number format */
  format?: 'decimal' | 'currency' | 'percent' | 'scientific';
  /** Currency code (for currency format) */
  currency?: string;
  /** Decimal places */
  decimals?: number;
  /** Locale for formatting */
  locale?: string;
  /** Show positive sign */
  showPositiveSign?: boolean;
  /** Color negative numbers */
  colorNegative?: boolean;
}

export interface DateCellConfig {
  /** Date format */
  format?: 'short' | 'medium' | 'long' | 'full' | string;
  /** Show relative time (e.g., "2 hours ago") */
  relative?: boolean;
  /** Locale for formatting */
  locale?: string;
  /** Include time */
  includeTime?: boolean;
}

export interface BooleanCellConfig {
  /** Display type */
  display?: 'checkbox' | 'switch' | 'icon' | 'text';
  /** Custom labels */
  labels?: { true: string; false: string };
  /** Custom icons */
  icons?: { true: ReactNode; false: ReactNode };
  /** Enable toggling */
  editable?: boolean;
  /** Change handler */
  onChange?: <TData = unknown>(value: boolean, row: TData) => void;
}

export interface ActionCellConfig {
  /** Action buttons */
  actions: ActionButton[];
  /** Show as menu */
  asMenu?: boolean;
  /** Menu icon */
  menuIcon?: ReactNode;
}

export interface ActionButton {
  /** Button label */
  label: string;
  /** Button icon */
  icon?: ReactNode;
  /** Click handler */
  onClick: <TData = unknown>(row: TData) => void;
  /** Disabled condition */
  disabled?: boolean | (<TData = unknown>(row: TData) => boolean);
  /** Show condition */
  show?: boolean | (<TData = unknown>(row: TData) => boolean);
  /** Button color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface LinkCellConfig {
  /** URL generator */
  href: string | (<TData = unknown>(row: TData) => string);
  /** Open in new tab */
  external?: boolean;
  /** Show external icon */
  showExternalIcon?: boolean;
}

export interface ChipCellConfig {
  /** Color mapping based on value */
  colorMap?: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'>;
  /** Variant */
  variant?: 'filled' | 'outlined';
  /** Size */
  size?: 'small' | 'medium';
  /** Show icon */
  icon?: ReactNode | ((value: unknown) => ReactNode);
}

export interface AvatarCellConfig {
  /** Image URL accessor */
  imageKey?: string;
  /** Name accessor for fallback */
  nameKey?: string;
  /** Size */
  size?: 'small' | 'medium' | 'large';
  /** Variant */
  variant?: 'circular' | 'rounded' | 'square';
}

export interface ProgressCellConfig {
  /** Progress type */
  type?: 'linear' | 'circular';
  /** Show percentage label */
  showLabel?: boolean;
  /** Color (primary, secondary, etc.) or function to determine color based on value */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | string | ((value: number) => string);
  /** Min value */
  min?: number;
  /** Max value */
  max?: number;
}


// ============================================================================
// Filter Types
// ============================================================================

export type FilterType = 'text' | 'number' | 'date' | 'select' | 'multiSelect' | 'boolean';

export type FilterConfig =
  | TextFilterConfig
  | NumberFilterConfig
  | DateFilterConfig
  | SelectFilterConfig
  | MultiSelectFilterConfig
  | BooleanFilterConfig;

export interface TextFilterConfig {
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms */
  debounce?: number;
  /** Case sensitive */
  caseSensitive?: boolean;
}

export interface NumberFilterConfig {
  /** Placeholder for min */
  minPlaceholder?: string;
  /** Placeholder for max */
  maxPlaceholder?: string;
  /** Step value */
  step?: number;
}

export interface DateFilterConfig {
  /** Placeholder for start date */
  startPlaceholder?: string;
  /** Placeholder for end date */
  endPlaceholder?: string;
  /** Disable future dates */
  disableFuture?: boolean;
  /** Disable past dates */
  disablePast?: boolean;
}

export interface SelectFilterConfig {
  /** Options */
  options: FilterOption[];
  /** Placeholder */
  placeholder?: string;
}

export interface MultiSelectFilterConfig {
  /** Options */
  options: FilterOption[];
  /** Placeholder */
  placeholder?: string;
  /** Max selections */
  maxSelections?: number;
}

export interface BooleanFilterConfig {
  /** Labels */
  labels?: { true: string; false: string };
}

export interface FilterOption {
  label: string;
  value: unknown;
}

// ============================================================================
// Toolbar Types
// ============================================================================

export interface ToolbarConfig<TData> {
  /** Show global search */
  showSearch?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Show filter chips */
  showFilterChips?: boolean;
  /** Show column visibility toggle */
  showColumnVisibility?: boolean;
  /** Show density toggle */
  showDensity?: boolean;
  /** Show export buttons */
  showExport?: boolean;
  /** Export formats */
  exportFormats?: ExportFormat[];
  /** Custom actions */
  customActions?: ToolbarAction<TData>[];
  /** Toolbar title */
  title?: string;
  /** Toolbar subtitle */
  subtitle?: string;
  /** Show view switcher */
  showViewSwitcher?: boolean;
}

export interface ToolbarAction<TData> {
  /** Action label */
  label: string;
  /** Action icon */
  icon?: ReactNode;
  /** Click handler */
  onClick: (table: TanStackTable<TData>) => void;
  /** Disabled condition */
  disabled?: boolean;
  /** Show condition */
  show?: boolean;
  /** Button color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationConfig {
  /** Page size options */
  pageSizeOptions?: number[];
  /** Default page size */
  defaultPageSize?: number;
  /** Show first/last buttons */
  showFirstLastButtons?: boolean;
  /** Position */
  position?: 'top' | 'bottom' | 'both';
}

// ============================================================================
// Server-Side Types
// ============================================================================

export interface ServerSideHandlers<TData> {
  /** Fetch data handler */
  onFetchData: (params: ServerSideParams) => Promise<ServerSideResponse<TData>>;
  /** Total row count */
  totalRowCount?: number;
}

export interface ServerSideParams {
  /** Pagination */
  pagination: PaginationState;
  /** Sorting */
  sorting: SortingState;
  /** Filters */
  columnFilters: ColumnFiltersState;
  /** Global filter */
  globalFilter: string;
}

export interface ServerSideResponse<TData> {
  /** Data rows */
  data: TData[];
  /** Total row count */
  totalRowCount: number;
  /** Page count */
  pageCount?: number;
}

// ============================================================================
// Export Types
// ============================================================================

export interface ExportOptions {
  /** Export format */
  format: ExportFormat;
  /** File name */
  filename?: string;
  /** Include headers */
  includeHeaders?: boolean;
  /** Columns to export (if not specified, all visible columns) */
  columns?: string[];
  /** Export selected rows only */
  selectedOnly?: boolean;
}

// ============================================================================
// Theme Types
// ============================================================================

export interface TanTableTheme {
  /** Table container styles */
  container?: CSSProperties;
  /** Header styles */
  header?: CSSProperties;
  /** Cell styles */
  cell?: CSSProperties;
  /** Row styles */
  row?: CSSProperties;
  /** Hover row styles */
  rowHover?: CSSProperties;
  /** Selected row styles */
  rowSelected?: CSSProperties;
  /** Toolbar styles */
  toolbar?: CSSProperties;
  /** Pagination styles */
  pagination?: CSSProperties;
}
