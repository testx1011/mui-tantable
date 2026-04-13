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
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => estimate(),
    overscan: 5,
  });

  // Ensure virtualizer recalculates sizes when container size or rows change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // measure initially
    rowVirtualizer.measure();

    // ResizeObserver to trigger re-measure when container changes
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => {
        rowVirtualizer.measure();
      });
      ro.observe(el);
    } catch (e) {
      // ResizeObserver may not be available in some environments; ignore
    }

    return () => {
      if (ro && el) ro.unobserve(el);
      ro = null;
    };
  }, [containerRef, rowVirtualizer]);

  // If rows length changes, re-measure
  useEffect(() => {
    rowVirtualizer.setOptions({
      ...rowVirtualizer.options,
      count: rows.length,
    });
    rowVirtualizer.measure();
  }, [rows.length, rowVirtualizer]);

  const virtualItems = enableVirtualization ? rowVirtualizer.getVirtualItems() : [];

  const visibleRows = enableVirtualization ? virtualItems.map((v) => rows[v.index]) : rows;

  return { rowVirtualizer, virtualItems, visibleRows };
}
