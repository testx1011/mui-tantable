import { useState, useCallback } from 'react';

export interface HistoryEntry<TData> {
  rowId: string;
  previousData: Partial<TData>;
  newData: Partial<TData>;
  timestamp: number;
}

export function useEditHistory<TData>(
  onRestoreSave?: (row: TData) => Promise<void> | void,
): {
  history: HistoryEntry<TData>[];
  historyIndex: number;
  addHistoryEntry: (entry: HistoryEntry<TData>) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
} {
  const [history, setHistory] = useState<HistoryEntry<TData>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addHistoryEntry = useCallback((entry: HistoryEntry<TData>) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const canUndo = useCallback(() => historyIndex >= 0, [historyIndex]);

  const canRedo = useCallback(
    () => historyIndex < history.length - 1,
    [historyIndex, history.length],
  );

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const entry = history[historyIndex];
      onRestoreSave?.(entry.previousData as TData);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex, onRestoreSave]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const entry = history[historyIndex + 1];
      onRestoreSave?.(entry.newData as TData);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [history, historyIndex, onRestoreSave]);

  return {
    history,
    historyIndex,
    addHistoryEntry,
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
