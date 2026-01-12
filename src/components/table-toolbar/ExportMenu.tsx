import { Menu, MenuItem, Divider } from '@mui/material';
import type { Table } from '@tanstack/react-table';
import type { ExportFormat } from '../../types/toolbar';

interface Props<TData> {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  exportFormats: ExportFormat[];
  handleExport: (format: string) => void;
  table: Table<TData>;
}

export function ExportMenu<TData>({ anchorEl, open, onClose, exportFormats, handleExport }: Props<TData>) {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {exportFormats.includes('csv' as ExportFormat) && <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>}
      {exportFormats.includes('excel' as ExportFormat) && <MenuItem onClick={() => handleExport('excel')}>Export as Excel</MenuItem>}
      {exportFormats.includes('json' as ExportFormat) && <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>}
      <Divider />
      <MenuItem onClick={() => handleExport('print')}>Print</MenuItem>
    </Menu>
  );
}
