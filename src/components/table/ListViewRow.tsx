import React from 'react';
import type { Table, Row } from '@tanstack/react-table';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface ListViewRowProps<TData> {
  row: Row<TData>;
  renderListViewItem: (row: Row<TData>) => React.ReactNode;
  enableExpanding: boolean;
  enableRowSelection: boolean;
  table: Table<TData>;
}

interface RenderListViewItemProps<TData> {
  row: Row<TData>;
  render: (row: Row<TData>) => React.ReactNode;
}

function RenderListViewItem<TData>({
  row,
  render,
}: RenderListViewItemProps<TData>) {
  return <>{render(row)}</>;
}

export function ListViewRow<TData>({
  row,
  renderListViewItem,
  enableExpanding,
  enableRowSelection,
  table,
}: ListViewRowProps<TData>): React.ReactElement {
  return (
    <TableRow key={row.id}>
      <TableCell
        colSpan={
          table.getVisibleLeafColumns().length +
          (enableRowSelection ? 1 : 0) +
          (enableExpanding ? 1 : 0)
        }
      >
        <RenderListViewItem row={row} render={renderListViewItem} />
      </TableCell>
    </TableRow>
  );
}
