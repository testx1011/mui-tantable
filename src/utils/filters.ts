import type { Row } from '@tanstack/react-table';

export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'notEquals';

export interface FilterValue {
  operator: FilterOperator;
  value: unknown;
  value2?: unknown; // For 'between'
}

/**
 * Smart filter function that handles various operators
 */
export function smartFilter<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: FilterValue | string | number | unknown,
): boolean {
  const cellValue = row.getValue(columnId);

  // Handle legacy simple values or direct values
  if (
    typeof filterValue !== 'object' ||
    filterValue === null ||
    !('operator' in (filterValue as object))
  ) {
    // Fallback logic for simple values
    if (filterValue === undefined || filterValue === '') return true;

    if (typeof filterValue === 'string') {
      return String(cellValue ?? '')
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    }
    // Array for multi-select
    if (Array.isArray(filterValue)) {
      return filterValue.includes(cellValue);
    }
    return cellValue == filterValue;
  }

  const { operator, value, value2 } = filterValue as FilterValue;

  // Handle empty checks first as they don't require a comparison value
  if (operator === 'isEmpty') {
    return cellValue === null || cellValue === undefined || cellValue === '';
  }
  if (operator === 'isNotEmpty') {
    return cellValue !== null && cellValue !== undefined && cellValue !== '';
  }

  // If cell value is null/undefined and we are not checking for empty, usually return false
  // unless operator is notEquals
  if (cellValue == null) {
    return operator === 'notEquals';
  }

  // Date handling
  if (
    value instanceof Date ||
    (typeof value === 'string' &&
      !isNaN(Date.parse(value)) &&
      (operator.includes('Than') ||
        operator === 'between' ||
        operator === 'equals' ||
        operator === 'notEquals'))
  ) {
    const cellDate = cellValue instanceof Date ? cellValue : new Date(cellValue as string | number);
    const filterDate = value instanceof Date ? value : new Date(value);

    if (isNaN(cellDate.getTime())) return false;

    // Normalize dates to ignore time for equality checks if needed, but for now keep as is
    // Or maybe just compare timestamps
    const cellTime = cellDate.getTime();
    const filterTime = filterDate.getTime();

    switch (operator) {
      case 'equals':
        // Simple day comparison could be better, but let's stick to exact or timestamp
        return cellTime === filterTime;
      case 'notEquals':
        return cellTime !== filterTime;
      case 'greaterThan':
        return cellTime > filterTime;
      case 'greaterThanOrEqual':
        return cellTime >= filterTime;
      case 'lessThan':
        return cellTime < filterTime;
      case 'lessThanOrEqual':
        return cellTime <= filterTime;
      case 'between':
        let filterDate2: Date;
        if (value2 instanceof Date) {
          filterDate2 = value2;
        } else if (typeof value2 === 'string' || typeof value2 === 'number') {
          filterDate2 = new Date(value2);
        } else {
          filterDate2 = new Date(''); // invalid date fallback
        }
        return cellTime >= filterTime && cellTime <= filterDate2.getTime();
    }
  }

  // Number handling
  if (
    typeof cellValue === 'number' ||
    (typeof cellValue === 'string' && !isNaN(Number(cellValue)))
  ) {
    const numCell = Number(cellValue);
    const numValue = Number(value);
    const numValue2 = Number(value2);

    switch (operator) {
      case 'equals':
        return numCell === numValue;
      case 'notEquals':
        return numCell !== numValue;
      case 'greaterThan':
        return numCell > numValue;
      case 'greaterThanOrEqual':
        return numCell >= numValue;
      case 'lessThan':
        return numCell < numValue;
      case 'lessThanOrEqual':
        return numCell <= numValue;
      case 'between':
        return numCell >= numValue && numCell <= numValue2;
    }
  }

  // String handling (default)
  const strCell = String(cellValue).toLowerCase();
  const strValue = String(value).toLowerCase();

  switch (operator) {
    case 'contains':
      return strCell.includes(strValue);
    case 'equals':
      return strCell === strValue;
    case 'notEquals':
      return strCell !== strValue;
    case 'startsWith':
      return strCell.startsWith(strValue);
    case 'endsWith':
      return strCell.endsWith(strValue);
    default:
      return true;
  }
}

/**
 * Fuzzy filter function (for global search)
 */
export function fuzzyFilter<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: string,
): boolean {
  const value = row.getValue(columnId);
  if (value == null) return false;

  const stringValue = String(value).toLowerCase();
  const searchValue = filterValue.toLowerCase();

  // Simple fuzzy matching - checks if all characters appear in order
  let searchIndex = 0;
  for (let i = 0; i < stringValue.length && searchIndex < searchValue.length; i++) {
    if (stringValue[i] === searchValue[searchIndex]) {
      searchIndex++;
    }
  }

  return searchIndex === searchValue.length;
}

/**
 * Global filter function - searches across all columns
 */
export function globalFilterFn<TData>(
  row: Row<TData>,
  _columnId: string,
  filterValue: string,
): boolean {
  const search = filterValue.toLowerCase();

  // Search across all cell values in the row
  return row.getAllCells().some((cell) => {
    const value = cell.getValue();
    if (value == null) return false;
    return String(value).toLowerCase().includes(search);
  });
}
