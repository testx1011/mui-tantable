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
  /** Debounce delay in ms */
  debounce?: number;
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
  /** Debounce delay in ms */
  debounce?: number;
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
