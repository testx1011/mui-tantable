import { useVirtualizer, type VirtualItem, type Virtualizer } from '@tanstack/react-virtual';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { Row } from '@tanstack/react-table';

export function useTableVirtualizer<TData>(
  enableVirtualization: boolean,
  rows: Row<TData>[],
  containerRef: RefObject<HTMLElement | null>,
  currentDensity: 'compact' | 'standard' | 'comfortable',
): {
  rowVirtualizer: Virtualizer<HTMLElement, Element>;
  virtualItems: VirtualItem[];
  visibleRows: Row<TData>[];
} {
  const estimate = () =>
    currentDensity === 'compact' ? 37 : currentDensity === 'comfortable' ? 77 : 53;

  const rowVirtualizer = useVirtualizer<HTMLElement, Element>({
    enabled: enableVirtualization,
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => estimate(),
    overscan: 5,
  });

  // Trigger a re-measure only when relevant virtualized inputs change.
  useEffect(() => {
    if (!enableVirtualization) return;
    rowVirtualizer.measure();
    // rowVirtualizer is intentionally excluded to avoid unstable dependency loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableVirtualization, rows.length, currentDensity]);

  const virtualItems = enableVirtualization ? rowVirtualizer.getVirtualItems() : [];

  const visibleRows = enableVirtualization ? virtualItems.map((v) => rows[v.index]) : rows;

  return { rowVirtualizer, virtualItems, visibleRows };
}
