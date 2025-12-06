import type { SortingFn } from '@tanstack/react-table';


/**
 * Alphanumeric sorting function
 */
export const alphanumericSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);

  return compareAlphanumeric(a, b);
};

/**
 * Date sorting function
 */
export const dateSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);

  const dateA = a instanceof Date ? a : new Date(a as string | number);
  const dateB = b instanceof Date ? b : new Date(b as string | number);

  return dateA.getTime() - dateB.getTime();
};

/**
 * Number sorting function
 */
export const numberSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = Number(rowA.getValue(columnId));
  const b = Number(rowB.getValue(columnId));

  if (isNaN(a) && isNaN(b)) return 0;
  if (isNaN(a)) return 1;
  if (isNaN(b)) return -1;

  return a - b;
};

/**
 * Case-insensitive text sorting
 */
export const textSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = String(rowA.getValue(columnId) ?? '').toLowerCase();
  const b = String(rowB.getValue(columnId) ?? '').toLowerCase();

  return a.localeCompare(b);
};

/**
 * Boolean sorting (false first, then true)
 */
export const booleanSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = Boolean(rowA.getValue(columnId));
  const b = Boolean(rowB.getValue(columnId));

  if (a === b) return 0;
  return a ? 1 : -1;
};

/**
 * Compare alphanumeric strings (handles numbers within strings)
 */
function compareAlphanumeric(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  const aStr = String(a);
  const bStr = String(b);

  // Split into parts of numbers and non-numbers
  const aParts = aStr.match(/(\d+|\D+)/g) || [];
  const bParts = bStr.match(/(\d+|\D+)/g) || [];

  const maxLength = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLength; i++) {
    const aPart = aParts[i] || '';
    const bPart = bParts[i] || '';

    const aIsNum = /^\d+$/.test(aPart);
    const bIsNum = /^\d+$/.test(bPart);

    if (aIsNum && bIsNum) {
      const diff = parseInt(aPart, 10) - parseInt(bPart, 10);
      if (diff !== 0) return diff;
    } else {
      const diff = aPart.localeCompare(bPart);
      if (diff !== 0) return diff;
    }
  }

  return 0;
}
