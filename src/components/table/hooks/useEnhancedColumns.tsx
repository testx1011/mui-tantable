import { useMemo } from 'react';
import type { TanTableColumnDef, CellRendererProps } from '../../../types/columns';
import { smartFilter } from '../../../utils/filters';
import { EditCell } from '../../EditCell';
import { flexRender } from '@tanstack/react-table';
import {
  TextCell,
  NumberCell,
  DateCell,
  BooleanCell,
  ActionCell,
  LinkCell,
  EmailCell,
  ChipCell,
  AvatarCell,
  ProgressCell,
  ImageCell,
  CurrencyCell,
} from '../../cells';

interface UseEnhancedColumnsParams<TData> {
  columns: TanTableColumnDef<TData>[];
  editMode: 'cell' | 'row';
  editing: ReturnType<typeof import('./useEditingState').useEditingState<TData>>;
}

/**
 * Returns a new column array where each column has its `filterFn` and `cell`
 * renderer augmented based on `cellType` and editing state.
 */
export function useEnhancedColumns<TData>({
  columns,
  editMode,
  editing,
}: UseEnhancedColumnsParams<TData>): TanTableColumnDef<TData>[] {
  const {
    editingRowId,
    editingCellId,
    editingData,
    setEditingData,
    isRowEditing,
    isCellEditing,
    save,
    cancel,
  } = editing;

  return useMemo<TanTableColumnDef<TData>[]>(() => {
    return columns.map((col) => {
      const column: TanTableColumnDef<TData> = { ...col };

      if (!column.filterFn) {
        column.filterFn = smartFilter;
      }

      const originalCell = column.cell;
      // renderer may be a React component or function; define a proper union type
      type CellComp =
        | React.ComponentType<CellRendererProps<TData>>
        | ((props: CellRendererProps<TData>) => React.ReactNode);
      let CellComponent: CellComp | undefined = originalCell as CellComp;

      if (!CellComponent && column.cellType) {
        switch (column.cellType) {
          case 'text':
            CellComponent = TextCell;
            break;
          case 'number':
            CellComponent = NumberCell;
            break;
          case 'date':
            CellComponent = DateCell;
            break;
          case 'boolean':
            CellComponent = BooleanCell;
            break;
          case 'action':
            CellComponent = ActionCell;
            break;
          case 'link':
            CellComponent = LinkCell;
            break;
          case 'email':
            CellComponent = EmailCell;
            break;
          case 'chip':
            CellComponent = ChipCell;
            break;
          case 'avatar':
            CellComponent = AvatarCell;
            break;
          case 'progress':
            CellComponent = ProgressCell;
            break;
          case 'image':
            CellComponent = ImageCell;
            break;
          case 'currency':
            CellComponent = CurrencyCell;
            break;
          default:
            break;
        }
      }

      column.cell = (props: CellRendererProps<TData>) => {
        const { row, column: colInstance, getValue } = props;
        const rowEditing = isRowEditing(row);
        const cellEditing = isCellEditing(row, colInstance.id);

        const isEditable =
          typeof column.editable === 'function' ? column.editable(row) : column.editable;

        if ((rowEditing || cellEditing) && isEditable !== false && column.cellType !== 'action') {
          return (
            <EditCell
              {...props}
              value={editingData[column.accessorKey as keyof TData] ?? getValue()}
              onChange={(value: unknown) => {
                setEditingData((prev) => ({
                  ...prev,
                  [column.accessorKey as keyof TData]: value,
                }));
              }}
              onSave={() => {
                save(row);
              }}
              onCancel={() => {
                cancel();
              }}
              cellType={column.cellType}
            />
          );
        }

        if (column.cellType === 'action') {
          const actionProps = {
            ...props,
            isEditing: rowEditing,
            onSave: () => {
              save(row);
            },
            onCancel: () => {
              cancel();
            },
          };

          if (typeof CellComponent === 'function') {
            const Comp = CellComponent as React.ComponentType<CellRendererProps<TData>>;
            return <Comp {...actionProps} />;
          }
          return (CellComponent as (props: CellRendererProps<TData>) => React.ReactNode)(
            actionProps,
          );
        }

        if (CellComponent) {
          if (typeof CellComponent === 'function') {
            const Comp = CellComponent as React.ComponentType<CellRendererProps<TData>>;
            return <Comp {...props} />;
          }
          return (CellComponent as (props: CellRendererProps<TData>) => React.ReactNode)(props);
        }

        return flexRender(column.cell, props);
      };

      return column;
    });
  }, [columns, editingRowId, editingCellId, editingData, editMode, setEditingData]);
}
