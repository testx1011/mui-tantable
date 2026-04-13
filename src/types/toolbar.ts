import type { ReactNode, CSSProperties } from 'react';
import type {
  Table as TanStackTable,
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

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

export interface ServerSideHandlers<TData> {
  /** Fetch data handler */
  onFetchData: (params: ServerSideParams) => Promise<ServerSideResponse<TData>>;
  /** Total row count */
  totalRowCount?: number;
}

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
