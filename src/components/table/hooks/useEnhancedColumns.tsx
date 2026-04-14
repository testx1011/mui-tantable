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
      let CellComponent:
        | React.ComponentType<Record<string, unknown>>
        | undefined = originalCell as unknown as React.ComponentType<
        Record<string, unknown>
      >;

      if (!CellComponent && column.cellType) {
        switch (column.cellType) {
          case 'text':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = TextCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'number':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = NumberCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'date':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = DateCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'boolean':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = BooleanCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'action':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = ActionCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'link':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = LinkCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'email':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = EmailCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'chip':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = ChipCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'avatar':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = AvatarCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'progress':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = ProgressCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'image':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = ImageCell as unknown as React.ComponentType<Record<string, any>>;
            break;
          case 'currency':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            CellComponent = CurrencyCell as unknown as React.ComponentType<Record<string, any>>;
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

          if (CellComponent) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Comp = CellComponent as React.ComponentType<Record<string, any>>;
            return <Comp {...actionProps} />;
          }
        }

        if (CellComponent) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Comp = CellComponent as React.ComponentType<Record<string, any>>;
          return <Comp {...props} />;
        }

        if (originalCell) {
          return flexRender(originalCell, props);
        }

        const rawValue = getValue();
        return rawValue == null ? null : String(rawValue);
      };

      return column;
    });
  }, [columns, editingRowId, editingCellId, editingData, editMode, setEditingData]);
}
