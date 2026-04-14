import { useState, useCallback } from 'react';
import type { Row } from '@tanstack/react-table';

export interface UseRowReorderOptions<TData> {
  enabled: boolean;
  onReorder: (newRowOrder: TData[]) => void;
}

export interface UseRowReorderReturn<TData> {
  dragState: {
    draggedRowId: string | null;
    dropTargetRowId: string | null;
    isDragging: boolean;
  };
  handlers: {
    handleDragStart: (rowId: string) => void;
    handleDragOver: (e: React.DragEvent<HTMLTableRowElement>, targetRowId: string) => void;
    handleDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    handleDrop: (
      e: React.DragEvent<HTMLTableRowElement>,
      targetRowId: string,
      rows: Row<TData>[],
    ) => void;
    handleDragEnd: () => void;
  };
  getRowStyle: (rowId: string) => React.CSSProperties;
}

export function useRowReorder<TData>({
  enabled,
  onReorder,
}: UseRowReorderOptions<TData>): UseRowReorderReturn<TData> {
  const [dragState, setDragState] = useState<{
    draggedRowId: string | null;
    dropTargetRowId: string | null;
    isDragging: boolean;
    dropPosition: 'above' | 'below' | null;
  }>({
    draggedRowId: null,
    dropTargetRowId: null,
    isDragging: false,
    dropPosition: null,
  });

  const handleDragStart = useCallback(
    (rowId: string) => {
      if (!enabled) return;
      setDragState({
        draggedRowId: rowId,
        dropTargetRowId: null,
        isDragging: true,
        dropPosition: null,
      });
    },
    [enabled],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLTableRowElement>, targetRowId: string) => {
      if (!enabled || !dragState.isDragging) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const mouseY = e.clientY;

      if (dragState.draggedRowId === targetRowId) return;

      setDragState((prev) => ({
        ...prev,
        dropTargetRowId: targetRowId,
        dropPosition: mouseY < midpoint ? 'above' : 'below',
      }));
    },
    [enabled, dragState.isDragging, dragState.draggedRowId],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLTableRowElement>) => {
      if (!enabled) return;
      e.preventDefault();
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && e.currentTarget.contains(relatedTarget)) return;
      setDragState((prev) => ({
        ...prev,
        dropTargetRowId: null,
      }));
    },
    [enabled],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTableRowElement>, targetRowId: string, rows: Row<TData>[]) => {
      if (!enabled || !dragState.draggedRowId) return;
      e.preventDefault();
      e.stopPropagation();

      const draggedRowId = dragState.draggedRowId;
      if (draggedRowId === targetRowId) return;

      const draggedIndex = rows.findIndex((r) => r.id === draggedRowId);
      const targetIndex = rows.findIndex((r) => r.id === targetRowId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const mouseY = e.clientY;

      const newRows = [...rows];
      const [draggedRow] = newRows.splice(draggedIndex, 1);

      let insertIndex = targetIndex;
      if (mouseY > midpoint) {
        insertIndex = targetIndex >= draggedIndex ? targetIndex : targetIndex + 1;
      } else {
        insertIndex = targetIndex <= draggedIndex ? targetIndex : targetIndex - 1;
      }

      newRows.splice(insertIndex, 0, draggedRow);

      const newRowOrder = newRows.map((row) => row.original);
      onReorder(newRowOrder);

      setDragState({
        draggedRowId: null,
        dropTargetRowId: null,
        isDragging: false,
        dropPosition: null,
      });
    },
    [enabled, dragState.draggedRowId, onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedRowId: null,
      dropTargetRowId: null,
      isDragging: false,
      dropPosition: null,
    });
  }, []);

  const getRowStyle = useCallback(
    (rowId: string): React.CSSProperties => {
      if (!enabled) return {};

      if (rowId === dragState.draggedRowId && dragState.isDragging) {
        return {
          opacity: 0.5,
          backgroundColor: 'action.hover',
        };
      }

      if (
        rowId === dragState.dropTargetRowId &&
        dragState.isDragging &&
        dragState.draggedRowId !== rowId
      ) {
        return {
          borderTop: '2px solid',
          borderTopColor: 'primary.main',
        };
      }

      return {};
    },
    [enabled, dragState],
  );

  return {
    dragState: {
      draggedRowId: dragState.draggedRowId,
      dropTargetRowId: dragState.dropTargetRowId,
      isDragging: dragState.isDragging,
    },
    handlers: {
      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleDragEnd,
    },
    getRowStyle,
  };
}
