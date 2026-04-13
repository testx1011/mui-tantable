import { useState, useCallback } from "react";
import type { Row } from "@tanstack/react-table";

interface UseEditingStateProps<TData> {
  editMode: "cell" | "row";
  onEditingRowSave?: (row: TData) => Promise<void> | void;
  onEditingRowCancel?: () => void;
}

interface HistoryEntry<TData> {
  rowId: string;
  previousData: Partial<TData>;
  newData: Partial<TData>;
  timestamp: number;
}

/**
 * Manages editing-related state for the table: which row/cell is being edited
 * and the draft values. Consumers can call helpers to start/cancel/save edits
 * and `useEnhancedColumns` will consult `isCellEditing`/`isRowEditing`.
 * Includes undo/redo functionality for edit operations.
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
  isEditing: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
} {
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<TData>>({});

  const [history, setHistory] = useState<HistoryEntry<TData>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isRowEditing = useCallback(
    (row: Row<TData>) => editMode === "row" && editingRowId === row.id,
    [editMode, editingRowId],
  );

  const isCellEditing = useCallback(
    (row: Row<TData>, colId: string) =>
      editMode === "cell" && editingCellId === `${row.id}_${colId}`,
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

      if (Object.keys(editingData).length > 0) {
        const entry: HistoryEntry<TData> = {
          rowId: row.id,
          previousData: row.original,
          newData: merged,
          timestamp: Date.now(),
        };

        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(entry);
          if (newHistory.length > 50) newHistory.shift();
          return newHistory;
        });
        setHistoryIndex((prev) => Math.min(prev + 1, 49));
      }

      onEditingRowSave?.(merged);
      setEditingRowId(null);
      setEditingCellId(null);
      setEditingData({});
    },
    [editingData, historyIndex, onEditingRowSave],
  );

  const cancel = useCallback(() => {
    setEditingRowId(null);
    setEditingCellId(null);
    setEditingData({});
    onEditingRowCancel?.();
  }, [onEditingRowCancel]);

  const isEditing = useCallback(
    () => editingRowId !== null || editingCellId !== null,
    [editingRowId, editingCellId],
  );

  const canUndo = useCallback(() => historyIndex >= 0, [historyIndex]);

  const canRedo = useCallback(
    () => historyIndex < history.length - 1,
    [historyIndex, history.length],
  );

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const entry = history[historyIndex];
      onEditingRowSave?.(entry.previousData as TData);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex, onEditingRowSave]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const entry = history[historyIndex + 1];
      onEditingRowSave?.(entry.newData as TData);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [history, historyIndex, onEditingRowSave]);

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
    isEditing,
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
