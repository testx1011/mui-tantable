import type { ReactNode } from "react";
import type {
  ColumnDef as TanStackColumnDef,
  Table as TanStackTable,
  Row,
  Cell,
  Column,
} from "@tanstack/react-table";
import type {
  CellType,
  CellConfig,
  TextCellConfig,
  NumberCellConfig,
  DateCellConfig,
  BooleanCellConfig,
  ActionCellConfig,
  LinkCellConfig,
  ChipCellConfig,
  AvatarCellConfig,
  ProgressCellConfig,
  ImageCellConfig,
  CurrencyCellConfig,
} from "./cells";
import { FilterConfig, FilterType } from "./filters";
import { SxProps, Theme } from "@mui/material/styles";

// ============================================================================
// Validation Types
// ============================================================================

export type ValidationRule = {
  /** Validation type */
  type: "required" | "min" | "max" | "pattern" | "custom";
  /** Error message to display */
  message?: string;
  /** Value for min/max validation */
  value?: number | string;
  /** Regex pattern for pattern validation */
  pattern?: string;
  /** Custom validation function */
  validator?: (value: unknown) => boolean | string;
};

export interface ColumnValidation {
  /** Array of validation rules */
  rules: ValidationRule[];
  /** Show error immediately on blur (default: true) */
  validateOnBlur?: boolean;
  /** Show error while typing (default: false) */
  validateOnChange?: boolean;
}

// ============================================================================
// Column Definition Types
// ============================================================================

export interface BaseColumnDef<TData> extends Omit<
  TanStackColumnDef<TData>,
  "cell"
> {
  /** Column unique identifier */
  id?: string;
  /** Column header label */
  header?: TanStackColumnDef<TData>["header"];
  /** Accessor key for data */
  accessorKey?: keyof TData & string;
  /** Accessor function */
  accessorFn?: (row: TData) => unknown;
  /** Cell renderer */
  cell?: CellRenderer<TData>;
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
  align?: "left" | "center" | "right";
  /** Column description (for tooltips) */
  description?: string;
  /** Is column editable */
  editable?: boolean | ((row: Row<TData>) => boolean);
  /** Validation configuration for editable cells */
  validation?: ColumnValidation;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

export interface TextColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "text";
  cellConfig?: TextCellConfig;
}

export interface NumberColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "number";
  cellConfig?: NumberCellConfig;
}

export interface DateColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "date";
  cellConfig?: DateCellConfig;
}

export interface BooleanColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "boolean";
  cellConfig?: BooleanCellConfig<TData>;
}

export interface ActionColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "action";
  cellConfig: ActionCellConfig<TData>;
}

export interface LinkColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "link";
  cellConfig: LinkCellConfig<TData>;
}

export interface EmailColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "email";
  cellConfig?: LinkCellConfig<TData>;
}

export interface ChipColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "chip";
  cellConfig?: ChipCellConfig;
}

export interface AvatarColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "avatar";
  cellConfig?: AvatarCellConfig;
}

export interface ProgressColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "progress";
  cellConfig?: ProgressCellConfig;
}

export interface ImageColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "image";
  cellConfig?: ImageCellConfig;
}

export interface CurrencyColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "currency";
  cellConfig?: CurrencyCellConfig;
}

export interface CustomColumnDef<TData> extends BaseColumnDef<TData> {
  cellType: "custom";
  cellConfig?: unknown;
}

/**
 * Generic column definition when `cellType` is not specified or for backward compatibility.
 * This allows consumers to omit `cellType` and keep using the previous shape.
 */
export interface GenericColumnDef<TData> extends BaseColumnDef<TData> {
  cellType?: CellType;
  cellConfig?: CellConfig<TData>;
}

export type TanTableColumnDef<TData> =
  | TextColumnDef<TData>
  | NumberColumnDef<TData>
  | DateColumnDef<TData>
  | BooleanColumnDef<TData>
  | ActionColumnDef<TData>
  | LinkColumnDef<TData>
  | EmailColumnDef<TData>
  | ChipColumnDef<TData>
  | AvatarColumnDef<TData>
  | ProgressColumnDef<TData>
  | ImageColumnDef<TData>
  | CurrencyColumnDef<TData>
  | CustomColumnDef<TData>
  | GenericColumnDef<TData>;

export type CellRenderer<TData> = (
  props: CellRendererProps<TData>,
) => ReactNode;

export interface CellRendererProps<TData> {
  cell: Cell<TData, unknown>;
  row: Row<TData>;
  table: TanStackTable<TData>;
  getValue: () => unknown;
  column: Column<TData, unknown>;
}

// Types are exported above via their declarations.
