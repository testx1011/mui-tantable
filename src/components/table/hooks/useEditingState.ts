import { useState, useCallback } from 'react';
import type { Row } from '@tanstack/react-table';

interface UseEditingStateProps<TData> {
  editMode: 'cell' | 'row';
  onEditingRowSave?: (row: TData) => Promise<void> | void;
  onEditingRowCancel?: () => void;
}

/**
 * Manages editing-related state for the table: which row/cell is being edited
 * and the draft values. Consumers can call helpers to start/cancel/save edits
 * and `useEnhancedColumns` will consult `isCellEditing`/`isRowEditing`.
 */
export function useEditingState<TData>({
  editMode,
  onEditingRowSave,
  onEditingRowCancel,
}: UseEditingStateProps<TData>): {
  editingRowId: string | null;
  editingCellId: string | null;
  editingData: Partial<TData>;
  setEditingData: React.Dispatch<React.SetStateAction<Partial<TData>>>;
  isRowEditing: (row: Row<TData>) => boolean;
  isCellEditing: (row: Row<TData>, colId: string) => boolean;
  startRowEdit: (row: Row<TData>) => void;
  startCellEdit: (row: Row<TData>, colId: string) => void;
  save: (row: Row<TData>) => void;
  cancel: () => void;
} {
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<TData>>({});

  const isRowEditing = useCallback(
    (row: Row<TData>) => editMode === 'row' && editingRowId === row.id,
    [editMode, editingRowId],
  );

  const isCellEditing = useCallback(
    (row: Row<TData>, colId: string) =>
      editMode === 'cell' && editingCellId === `${row.id}_${colId}`,
    [editMode, editingCellId],
  );

  const startRowEdit = useCallback((row: Row<TData>) => {
    setEditingRowId(row.id);
    setEditingCellId(null);
    setEditingData({});
  }, []);

  const startCellEdit = useCallback((row: Row<TData>, colId: string) => {
    setEditingCellId(`${row.id}_${colId}`);
    setEditingRowId(null);
    setEditingData({});
  }, []);

  const save = useCallback(
    (row: Row<TData>) => {
      const merged = { ...row.original, ...editingData } as TData;
      onEditingRowSave?.(merged);
      setEditingRowId(null);
      setEditingCellId(null);
      setEditingData({});
    },
    [editingData, onEditingRowSave],
  );

  const cancel = useCallback(() => {
    setEditingRowId(null);
    setEditingCellId(null);
    setEditingData({});
    onEditingRowCancel?.();
  }, [onEditingRowCancel]);

  return {
    editingRowId,
    editingCellId,
    editingData,
    setEditingData,
    isRowEditing,
    isCellEditing,
    startRowEdit,
    startCellEdit,
    save,
    cancel,
  };
}
