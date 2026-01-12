import { useState } from 'react';
import { Toolbar, Typography, IconButton, Button, Box, Popover } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import type { Table } from '@tanstack/react-table';
import { exportToCSV, exportToJSON, exportToExcel, printTable } from '../utils/exporters';
import { FilterPanel } from './filters/FilterPanel';
import { ExpandableSearch } from './table-toolbar/ExpandableSearch';
import type { ToolbarConfig } from '../types/toolbar';
import type { Density } from '../types/core';
import { ColumnVisibilityMenu } from './table-toolbar/ColumnVisibilityMenu';
import { DensityMenu } from './table-toolbar/DensityMenu';
import { ExportMenu } from './table-toolbar/ExportMenu';
import { ViewSwitcher } from './table-toolbar/ViewSwitcher';

interface TableToolbarProps<TData> {
  table: Table<TData>;
  config?: ToolbarConfig<TData>;
  density?: Density;
  onDensityChange?: (density: Density) => void;
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
  enableListView,
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

  const globalFilter = (table.getState().globalFilter as string) || '';

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
        <ExpandableSearch value={globalFilter} onChange={(value) => table.setGlobalFilter(value)} placeholder={searchPlaceholder} />
      )}

      {/* Filters */}
      <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)} title="Filters" color={table.getState().columnFilters.length > 0 ? 'primary' : 'default'}>
        <FilterListIcon />
      </IconButton>
      <Popover open={Boolean(filterAnchorEl)} anchorEl={filterAnchorEl} onClose={() => setFilterAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} PaperProps={{ sx: { minWidth: 350 } }}>
        <FilterPanel table={table} />
      </Popover>

      {/* Column Visibility */}
      {showColumnVisibility && (
        <>
          <IconButton onClick={(e) => setColumnMenuAnchor(e.currentTarget)} title="Column Visibility">
            <ViewColumnIcon />
          </IconButton>
          <ColumnVisibilityMenu table={table} anchorEl={columnMenuAnchor} open={Boolean(columnMenuAnchor)} onClose={handleColumnMenuClose} columnSearch={columnSearch} setColumnSearch={setColumnSearch} />
        </>
      )}

      {/* View Switcher */}
      {enableListView && showViewSwitcher && <ViewSwitcher view={view ?? 'grid'} onViewChange={onViewChange} />}

      {/* Density */}
      {showDensity && onDensityChange && (
        <>
          <IconButton onClick={(e) => setDensityMenuAnchor(e.currentTarget)} title="Density">
            <ViewHeadlineIcon />
          </IconButton>
          <DensityMenu anchorEl={densityMenuAnchor} open={Boolean(densityMenuAnchor)} onClose={() => setDensityMenuAnchor(null)} density={density} onDensityChange={onDensityChange} />
        </>
      )}

      {/* Export */}
      {showExport && exportFormats.length > 0 && (
        <>
          <IconButton onClick={(e) => setExportMenuAnchor(e.currentTarget)} title="Export">
            <FileDownloadIcon />
          </IconButton>
          <ExportMenu anchorEl={exportMenuAnchor} open={Boolean(exportMenuAnchor)} onClose={() => setExportMenuAnchor(null)} exportFormats={exportFormats} handleExport={handleExport} table={table} />
        </>
      )}

      {/* Custom Actions */}
      {customActions.map((action, index) => {
        if (action.show === false) return null;

        return (
          <Button key={index} onClick={() => action.onClick(table)} disabled={action.disabled} color={action.color} startIcon={action.icon} size="small">
            {action.label}
          </Button>
        );
      })}
    </Toolbar>
  );
}
