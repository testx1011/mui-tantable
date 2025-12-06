import { useState } from 'react';
import {
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Divider,
  Popover,
  TextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import type { Table } from '@tanstack/react-table';
import type { ToolbarConfig } from '../types';
import { exportToCSV, exportToJSON, exportToExcel, printTable } from '../utils/exporters';
import { FilterPanel } from './filters/FilterPanel';
import { ExpandableSearch } from './ExpandableSearch';

interface TableToolbarProps<TData> {
  table: Table<TData>;
  config?: ToolbarConfig<TData>;
  density?: 'compact' | 'standard' | 'comfortable';
  onDensityChange?: (density: 'compact' | 'standard' | 'comfortable') => void;
  view?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
  enableListView?: boolean;
}

export function TableToolbar<TData>({ 
  table, 
  config, 
  density, 
  onDensityChange,
  view,
  onViewChange,
  enableListView
}: TableToolbarProps<TData>) {
  const {
    showSearch = true,
    searchPlaceholder = 'Search...',
    showColumnVisibility = true,
    showExport = true,
    showDensity = true,
    showViewSwitcher = true,
    exportFormats = ['csv', 'excel', 'json'],
    customActions = [],
    title,
    subtitle,
  } = config || {};

  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [densityMenuAnchor, setDensityMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [columnSearch, setColumnSearch] = useState('');

  const globalFilter = table.getState().globalFilter as string || '';

  const handleExport = (format: string) => {
    setExportMenuAnchor(null);
    switch (format) {
      case 'csv':
        exportToCSV(table);
        break;
      case 'excel':
        exportToExcel(table);
        break;
      case 'json':
        exportToJSON(table);
        break;
      case 'print':
        printTable(table);
        break;
    }
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
    setColumnSearch('');
  };

  return (
    <Toolbar sx={{ gap: 0.5, flexWrap: 'wrap' }}>
      {/* Title Section */}
      {(title || subtitle) && (
        <Box sx={{ flexGrow: 1 }}>
          {title && <Typography variant="h6">{title}</Typography>}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Search */}
      {showSearch && (
        <ExpandableSearch
          value={globalFilter}
          onChange={(value) => table.setGlobalFilter(value)}
          placeholder={searchPlaceholder}
        />
      )}

      {/* Filters */}
      <IconButton
        onClick={(e) => setFilterAnchorEl(e.currentTarget)}
        title="Filters"
        color={table.getState().columnFilters.length > 0 ? 'primary' : 'default'}
      >
        <FilterListIcon />
      </IconButton>
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{ sx: { minWidth: 350 } }}
      >
        <FilterPanel table={table} />
      </Popover>

      {/* Column Visibility */}
      {showColumnVisibility && (
        <>
          <IconButton
            onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
            title="Column Visibility"
          >
            <ViewColumnIcon />
          </IconButton>
          <Menu
            anchorEl={columnMenuAnchor}
            open={Boolean(columnMenuAnchor)}
            onClose={handleColumnMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 350,
                  paddingY: 0
                },
              },
            }}
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
              {table.getAllLeafColumns()
                .filter(column => {
                  const columnDef = column.columnDef as any;
                  const header = typeof columnDef.header === 'string' ? columnDef.header : column.id;
                  return header.toLowerCase().includes(columnSearch.toLowerCase());
                })
                .map((column) => {
                  const columnDef = column.columnDef as any;
                  if (columnDef.enableHiding === false) return null;

                  const header = typeof columnDef.header === 'string' ? columnDef.header : column.id;

                  return (
                    <MenuItem key={column.id} dense onClick={(e) => {
                      // Prevent menu from closing when clicking the item wrapper (optional, 
                      // but usually better to let checkbox handle toggle and keep menu open 
                      // or close it. Standard behavior for multi-select is keeping it open)
                      const target = e.target as HTMLElement;
                      // If we clicked the checkbox input directly, let it bubble.
                      // If we clicked the list item, toggle visibility manually.
                      if (target.tagName !== 'INPUT') {
                        column.toggleVisibility();
                      }
                    }}>
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
            <Stack p={1} direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox
                  checked={table.getIsAllColumnsVisible()}
                  indeterminate={table.getIsSomeColumnsVisible() && !table.getIsAllColumnsVisible()}
                  onChange={table.getToggleAllColumnsVisibilityHandler()}
                />
                <Typography variant="body2">Show/Hide All</Typography>
              </Stack>
              <Box>
                <Button onClick={() => table.resetColumnVisibility()}>Reset</Button>
              </Box>
            </Stack>
          </Menu>
        </>
      )}

      {/* View Switcher */}
      {enableListView && showViewSwitcher && (
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => {
            if (newView) onViewChange?.(newView);
          }}
          size="small"
          sx={{ mr: 1, height: 40 }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      )}

      {/* Density */}
      {showDensity && onDensityChange && (
        <>
          <IconButton
            onClick={(e) => setDensityMenuAnchor(e.currentTarget)}
            title="Density"
          >
            <ViewHeadlineIcon />
          </IconButton>
          <Menu
            anchorEl={densityMenuAnchor}
            open={Boolean(densityMenuAnchor)}
            onClose={() => setDensityMenuAnchor(null)}
          >
            <MenuItem onClick={() => { onDensityChange('compact'); setDensityMenuAnchor(null); }} selected={density === 'compact'}>Compact</MenuItem>
            <MenuItem onClick={() => { onDensityChange('standard'); setDensityMenuAnchor(null); }} selected={density === 'standard'}>Standard</MenuItem>
            <MenuItem onClick={() => { onDensityChange('comfortable'); setDensityMenuAnchor(null); }} selected={density === 'comfortable'}>Comfortable</MenuItem>
          </Menu>
        </>
      )}

      {/* Export */}
      {showExport && exportFormats.length > 0 && (
        <>
          <IconButton
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
            title="Export"
          >
            <FileDownloadIcon />
          </IconButton>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
          >
            {exportFormats.includes('csv') && (
              <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
            )}
            {exportFormats.includes('excel') && (
              <MenuItem onClick={() => handleExport('excel')}>Export as Excel</MenuItem>
            )}
            {exportFormats.includes('json') && (
              <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>
            )}
            <Divider />
            <MenuItem onClick={() => handleExport('print')}>Print</MenuItem>
          </Menu>
        </>
      )}

      {/* Custom Actions */}
      {customActions.map((action, index) => {
        if (action.show === false) return null;

        return (
          <Button
            key={index}
            onClick={() => action.onClick(table)}
            disabled={action.disabled}
            color={action.color}
            startIcon={action.icon}
            size="small"
          >
            {action.label}
          </Button>
        );
      })}
    </Toolbar>
  );
}
