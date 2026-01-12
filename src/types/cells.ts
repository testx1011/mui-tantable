import type { ReactNode } from 'react';

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

export type CellConfig<TData = unknown> =
  | TextCellConfig
  | NumberCellConfig
  | DateCellConfig
  | BooleanCellConfig<TData>
  | ActionCellConfig<TData>
  | LinkCellConfig<TData>
  | ChipCellConfig
  | AvatarCellConfig
  | ProgressCellConfig;

export interface TextCellConfig {
  /** Maximum characters before truncation */
  maxLength?: number;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Mark as primary display (e.g., title in compound cell) */
  primary?: boolean;
  /** Secondary key name to display under primary (e.g., 'position') */
  secondaryKey?: string;
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

export interface BooleanCellConfig<TData = unknown> {
  /** Display type */
  display?: 'checkbox' | 'switch' | 'icon' | 'text';
  /** Custom labels */
  labels?: { true: string; false: string };
  /** Custom icons */
  icons?: { true: ReactNode; false: ReactNode };
  /** Enable toggling */
  editable?: boolean;
  /** Change handler */
  onChange?: (value: boolean, row: TData) => void;
}

export interface ActionCellConfig<TData = unknown> {
  /** Action buttons */
  actions: ActionButton<TData>[];
  /** Show as menu */
  asMenu?: boolean;
  /** Menu icon */
  menuIcon?: ReactNode;
}

export interface ActionButton<TData = unknown> {
  /** Button label */
  label: string;
  /** Button icon */
  icon?: ReactNode;
  /** Click handler */
  onClick: (row: TData) => void;
  /** Disabled condition */
  disabled?: boolean | ((row: TData) => boolean);
  /** Show condition */
  show?: boolean | ((row: TData) => boolean);
  /** Button color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface LinkCellConfig<TData = unknown> {
  /** URL generator */
  href: string | ((row: TData) => string);
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

// Named types are exported above individually.
