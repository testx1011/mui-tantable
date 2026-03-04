import {
  Box,
  Menu,
  MenuItem,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import type { Table } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../../types/columns';
import { JSX } from 'react';

interface Props<TData> {
  table: Table<TData>;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnSearch: string;
  setColumnSearch: (v: string) => void;
}

export function ColumnVisibilityMenu<TData>({
  table,
  anchorEl,
  open,
  onClose,
  columnSearch,
  setColumnSearch,
}: Props<TData>): JSX.Element {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { minWidth: 350, paddingY: 0 } } }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <TextField
          size="small"
          placeholder="Search columns..."
          fullWidth
          value={columnSearch}
          onChange={(e) => setColumnSearch(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          variant="outlined"
        />
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
        {table
          .getAllLeafColumns()
          .filter((column) => {
            const columnDef = column.columnDef as TanTableColumnDef<TData>;
            const header =
              typeof columnDef.header === 'string'
                ? columnDef.header
                : column.id;
            return header.toLowerCase().includes(columnSearch.toLowerCase());
          })
          .map((column) => {
            const columnDef = column.columnDef as TanTableColumnDef<TData>;
            if (columnDef.enableHiding === false) return null;

            const header =
              typeof columnDef.header === 'string'
                ? columnDef.header
                : column.id;

            return (
              <MenuItem
                key={column.id}
                dense
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName !== 'INPUT') {
                    column.toggleVisibility();
                  }
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      size="small"
                    />
                  }
                  label={header}
                  onClick={(e) => e.stopPropagation()}
                />
              </MenuItem>
            );
          })}
      </Box>
      <Divider />
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Checkbox
            checked={table.getIsAllColumnsVisible()}
            indeterminate={
              table.getIsSomeColumnsVisible() && !table.getIsAllColumnsVisible()
            }
            onChange={table.getToggleAllColumnsVisibilityHandler()}
          />
        </Box>
        <Box>
          <Box
            component="button"
            onClick={() => table.resetColumnVisibility()}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            Reset
          </Box>
        </Box>
      </Box>
    </Menu>
  );
}
