import type { Table } from '@tanstack/react-table';
import type { TanTableColumnDef } from '../../types/columns';
import { JSX } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

interface Props<TData> {
  table: Table<TData>;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnSearch: string;
  setColumnSearch: (v: string) => void;
  menuId?: string;
  labelledBy?: string;
}

export function ColumnVisibilityMenu<TData>({
  table,
  anchorEl,
  open,
  onClose,
  columnSearch,
  setColumnSearch,
  menuId,
  labelledBy,
}: Props<TData>): JSX.Element {
  return (
    <Menu
      id={menuId}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { minWidth: 350, paddingY: 0 } } }}
      MenuListProps={{ 'aria-labelledby': labelledBy }}
      role="menu"
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
          slotProps={{
            input: {
              'aria-label': 'Search columns',
            },
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
        {table
          .getAllLeafColumns()
          .filter((column) => {
            const columnDef = column.columnDef as TanTableColumnDef<TData>;
            const header = typeof columnDef.header === 'string' ? columnDef.header : column.id;
            return header.toLowerCase().includes(columnSearch.toLowerCase());
          })
          .map((column) => {
            const columnDef = column.columnDef as TanTableColumnDef<TData>;
            if (columnDef.enableHiding === false) return null;

            const header = typeof columnDef.header === 'string' ? columnDef.header : column.id;

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
                role="menuitemcheckbox"
                aria-checked={column.getIsVisible()}
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
            indeterminate={table.getIsSomeColumnsVisible() && !table.getIsAllColumnsVisible()}
            onChange={table.getToggleAllColumnsVisibilityHandler()}
            aria-label="Select all columns"
          />
          <Typography variant="body2">All</Typography>
        </Box>
        <Box>
          <Box
            component="button"
            onClick={() => table.resetColumnVisibility()}
            aria-label="Reset column visibility"
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
