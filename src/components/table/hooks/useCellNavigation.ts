import { useState, useEffect, useCallback } from 'react';
import type { Table } from '@tanstack/react-table';

export interface SelectedCell {
  rowId: string;
  colId: string;
}

interface UseCellNavigationParams<TData> {
  table: Table<TData>;
  enableCellSelection?: boolean;
  enableEditing?: boolean;
  editMode?: 'cell' | 'row';
  /** invoked when Enter is pressed while a cell is selected */
  onStartCellEdit?: (rowId: string, colId: string) => void;
}

/**
 * Manages the currently-selected cell, click-outside logic and keydown
 * navigation/copy behavior. Returns state and a `handleKeyDown` callback that
 * should be applied to the table container.
 */
export function useCellNavigation<TData>({
  table,
  enableCellSelection = false,
  enableEditing = false,
  editMode = 'cell',
  onStartCellEdit,
}: UseCellNavigationParams<TData>): {
  selectedCell: SelectedCell | null;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell | null>>;
  handleKeyDown: (event: React.KeyboardEvent) => void;
} {
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  // click outside = deselect
  useEffect(() => {
    if (!enableCellSelection) return;

    const handleClickOutside = () => {
      setSelectedCell(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [enableCellSelection]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        const selectedRows = table.getSelectedRowModel().rows;

        if (selectedCell) {
          const row = table
            .getRowModel()
            .rows.find((r) => r.id === selectedCell.rowId);
          if (row) {
            const cell = row
              .getVisibleCells()
              .find((c) => c.column.id === selectedCell.colId);
            if (cell) {
              const value = cell.getValue();
              let textValue = String(value ?? '');
              if (value instanceof Date) {
                textValue = value.toLocaleDateString();
              } else if (typeof value === 'object' && value !== null) {
                textValue = JSON.stringify(value);
              }
              navigator.clipboard.writeText(textValue);
              event.preventDefault();
              return;
            }
          }
        }

        if (selectedRows.length > 0) {
          const visibleColumns = table.getVisibleLeafColumns();

          const tsv = selectedRows
            .map((row) => {
              return visibleColumns
                .map((col) => {
                  const cell = row
                    .getVisibleCells()
                    .find((c) => c.column.id === col.id);
                  let val = cell?.getValue();
                  if (val instanceof Date) return val.toLocaleDateString();
                  if (typeof val === 'object' && val !== null)
                    return JSON.stringify(val);
                  return String(val ?? '');
                })
                .join('\t');
            })
            .join('\n');

          if (tsv) {
            navigator.clipboard.writeText(tsv);
            event.preventDefault();
          }
        }
      }

      if (enableCellSelection) {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          event.preventDefault();

          const visibleRows = table.getRowModel().rows;
          const visibleColumns = table.getVisibleLeafColumns();

          if (!selectedCell) {
            if (visibleRows.length > 0 && visibleColumns.length > 0) {
              setSelectedCell({
                rowId: visibleRows[0].id,
                colId: visibleColumns[0].id,
              });
            }
            return;
          }

          const currentRowIndex = visibleRows.findIndex(
            (r) => r.id === selectedCell.rowId,
          );
          const currentColIndex = visibleColumns.findIndex(
            (c) => c.id === selectedCell.colId,
          );

          if (currentRowIndex === -1 || currentColIndex === -1) return;

          let nextRowIndex = currentRowIndex;
          let nextColIndex = currentColIndex;

          switch (key) {
            case 'ArrowUp':
              nextRowIndex = Math.max(0, currentRowIndex - 1);
              break;
            case 'ArrowDown':
              nextRowIndex = Math.min(
                visibleRows.length - 1,
                currentRowIndex + 1,
              );
              break;
            case 'ArrowLeft':
              nextColIndex = Math.max(0, currentColIndex - 1);
              break;
            case 'ArrowRight':
              nextColIndex = Math.min(
                visibleColumns.length - 1,
                currentColIndex + 1,
              );
              break;
          }

          if (
            nextRowIndex !== currentRowIndex ||
            nextColIndex !== currentColIndex
          ) {
            setSelectedCell({
              rowId: visibleRows[nextRowIndex].id,
              colId: visibleColumns[nextColIndex].id,
            });
          }
        }

        if (
          event.key === 'Enter' &&
          enableEditing &&
          editMode === 'cell' &&
          selectedCell
        ) {
          event.preventDefault();
          const { rowId, colId } = selectedCell;
          onStartCellEdit?.(rowId, colId);
        }
      }
    },
    [table, selectedCell, enableCellSelection, enableEditing, editMode],
  );

  return { selectedCell, setSelectedCell, handleKeyDown };
}
