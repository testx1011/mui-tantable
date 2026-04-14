import { useReducer } from 'react';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import type { Table } from '@tanstack/react-table';
import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  exportToPDF,
  printTable,
} from '../utils/exporters';
import { FilterPanel } from './filters/FilterPanel';
import { ExpandableSearch } from './table-toolbar/ExpandableSearch';
import type { ToolbarConfig } from '../types/toolbar';
import type { Density } from '../types/core';
import { ColumnVisibilityMenu } from './table-toolbar/ColumnVisibilityMenu';
import { DensityMenu } from './table-toolbar/DensityMenu';
import { ExportMenu } from './table-toolbar/ExportMenu';
import { ViewSwitcher } from './table-toolbar/ViewSwitcher';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';

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
}: TableToolbarProps<TData>): React.ReactElement {
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

  // grouping toolbar UI state into a single reducer helps avoid
  // multiple related useState calls and satisfies react-doctor’s
  // prefer-useReducer rule.
  type State = {
    columnMenuAnchor: HTMLElement | null;
    exportMenuAnchor: HTMLElement | null;
    densityMenuAnchor: HTMLElement | null;
    filterAnchorEl: HTMLElement | null;
    columnSearch: string;
  };

  type Action =
    | { type: 'openColumn'; anchor: HTMLElement }
    | { type: 'closeColumn' }
    | { type: 'openExport'; anchor: HTMLElement }
    | { type: 'closeExport' }
    | { type: 'openDensity'; anchor: HTMLElement }
    | { type: 'closeDensity' }
    | { type: 'openFilter'; anchor: HTMLElement }
    | { type: 'closeFilter' }
    | { type: 'setColumnSearch'; value: string };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'openColumn':
        return { ...state, columnMenuAnchor: action.anchor };
      case 'closeColumn':
        return { ...state, columnMenuAnchor: null, columnSearch: '' };
      case 'openExport':
        return { ...state, exportMenuAnchor: action.anchor };
      case 'closeExport':
        return { ...state, exportMenuAnchor: null };
      case 'openDensity':
        return { ...state, densityMenuAnchor: action.anchor };
      case 'closeDensity':
        return { ...state, densityMenuAnchor: null };
      case 'openFilter':
        return { ...state, filterAnchorEl: action.anchor };
      case 'closeFilter':
        return { ...state, filterAnchorEl: null };
      case 'setColumnSearch':
        return { ...state, columnSearch: action.value };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    columnMenuAnchor: null,
    exportMenuAnchor: null,
    densityMenuAnchor: null,
    filterAnchorEl: null,
    columnSearch: '',
  });

  const { columnMenuAnchor, exportMenuAnchor, densityMenuAnchor, filterAnchorEl, columnSearch } =
    state;

  const globalFilter = (table.getState().globalFilter as string) || '';
  const activeFiltersCount = table.getState().columnFilters.length;
  const hasActiveFilters = activeFiltersCount > 0;

  const filterPopoverId = filterAnchorEl ? 'table-filters-popover' : undefined;
  const columnMenuId = columnMenuAnchor ? 'table-column-visibility-menu' : undefined;
  const densityMenuId = densityMenuAnchor ? 'table-density-menu' : undefined;
  const exportMenuId = exportMenuAnchor ? 'table-export-menu' : undefined;

  const handleExport = (format: string) => {
    dispatch({ type: 'closeExport' });
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
      case 'pdf':
        exportToPDF(table);
        break;
      case 'print':
        printTable(table);
        break;
    }
  };

  const handleColumnMenuClose = () => {
    dispatch({ type: 'closeColumn' });
  };

  return (
    <Toolbar role="toolbar" aria-label="Table controls" sx={{ gap: 0.5, flexWrap: 'wrap' }}>
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
        id="table-filters-button"
        onClick={(e) => dispatch({ type: 'openFilter', anchor: e.currentTarget })}
        aria-label={hasActiveFilters ? `Filters (${activeFiltersCount} active)` : 'Filters'}
        aria-pressed={hasActiveFilters}
        aria-haspopup="dialog"
        aria-expanded={Boolean(filterAnchorEl)}
        aria-controls={filterPopoverId}
        color={hasActiveFilters ? 'primary' : 'default'}
      >
        <FilterListIcon />
      </IconButton>
      <Popover
        id={filterPopoverId}
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => dispatch({ type: 'closeFilter' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        aria-labelledby="table-filters-button"
        slotProps={{
          paper: { sx: { minWidth: 350 }, role: 'dialog', 'aria-label': 'Table Filters' },
        }}
      >
        <FilterPanel table={table} />
      </Popover>
      {/* Column Visibility */}
      {showColumnVisibility && (
        <>
          <IconButton
            id="table-column-visibility-button"
            onClick={(e) => dispatch({ type: 'openColumn', anchor: e.currentTarget })}
            aria-label="Column Visibility"
            aria-haspopup="menu"
            aria-expanded={Boolean(columnMenuAnchor)}
            aria-controls={columnMenuId}
          >
            <ViewColumnIcon />
          </IconButton>
          <ColumnVisibilityMenu
            table={table}
            anchorEl={columnMenuAnchor}
            open={Boolean(columnMenuAnchor)}
            onClose={handleColumnMenuClose}
            columnSearch={columnSearch}
            setColumnSearch={(value) => dispatch({ type: 'setColumnSearch', value })}
            menuId={columnMenuId}
            labelledBy="table-column-visibility-button"
          />
        </>
      )}
      {/* View Switcher */}
      {enableListView && showViewSwitcher && (
        <ViewSwitcher view={view ?? 'grid'} onViewChange={onViewChange} />
      )}
      {/* Density */}
      {showDensity && onDensityChange && (
        <>
          <IconButton
            id="table-density-button"
            onClick={(e) => dispatch({ type: 'openDensity', anchor: e.currentTarget })}
            aria-label="Table Density"
            aria-haspopup="menu"
            aria-expanded={Boolean(densityMenuAnchor)}
            aria-controls={densityMenuId}
          >
            <ViewHeadlineIcon />
          </IconButton>
          <DensityMenu
            anchorEl={densityMenuAnchor}
            open={Boolean(densityMenuAnchor)}
            onClose={() => dispatch({ type: 'closeDensity' })}
            density={density}
            onDensityChange={onDensityChange}
            menuId={densityMenuId}
            labelledBy="table-density-button"
          />
        </>
      )}
      {/* Export */}
      {showExport && exportFormats.length > 0 && (
        <>
          <IconButton
            id="table-export-button"
            onClick={(e) => dispatch({ type: 'openExport', anchor: e.currentTarget })}
            aria-label="Export table"
            aria-haspopup="menu"
            aria-expanded={Boolean(exportMenuAnchor)}
            aria-controls={exportMenuId}
          >
            <FileDownloadIcon />
          </IconButton>
          <ExportMenu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => dispatch({ type: 'closeExport' })}
            exportFormats={exportFormats}
            handleExport={handleExport}
            table={table}
            menuId={exportMenuId}
            labelledBy="table-export-button"
          />
        </>
      )}
      {/* Custom Actions */}
      {customActions.map((action) => {
        if (action.show === false) return null;

        // use label as key; assume actions have unique labels
        return (
          <Button
            key={action.label}
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
