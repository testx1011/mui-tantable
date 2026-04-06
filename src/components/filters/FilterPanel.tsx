import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import type { Table, Column } from "@tanstack/react-table";
import { TextFilter } from "./TextFilter";
import { NumberFilter } from "./NumberFilter";
import { DateFilter } from "./DateFilter";
import { SelectFilter } from "./SelectFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import {
  FilterType,
  FilterConfig,
  TextFilterConfig,
  NumberFilterConfig,
  DateFilterConfig,
  SelectFilterConfig,
  MultiSelectFilterConfig,
  TanTableColumnDef,
} from "../../types";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface FilterPanelProps<TData> {
  table: Table<TData>;
}

// helper component to render filter input
function FilterInput<TData>({
  column,
  table,
}: {
  column: Column<TData, unknown>;
  table: Table<TData>;
}) {
  const colDef = column.columnDef as TanTableColumnDef<TData>;
  const filterType = colDef.filterType as FilterType | undefined;
  const filterConfig = colDef.filterConfig as FilterConfig | undefined;

  switch (filterType) {
    case "text":
      return (
        <TextFilter column={column} config={filterConfig as TextFilterConfig} />
      );
    case "number":
      return (
        <NumberFilter
          column={column}
          config={filterConfig as NumberFilterConfig}
        />
      );
    case "date":
      return (
        <DateFilter
          column={column}
          config={filterConfig as DateFilterConfig}
          table={table}
        />
      );
    case "select":
      return (
        <SelectFilter
          column={column}
          config={filterConfig as SelectFilterConfig}
        />
      );
    case "multiSelect":
      return (
        <MultiSelectFilter
          column={column}
          config={filterConfig as MultiSelectFilterConfig}
        />
      );
    default:
      return (
        <TextFilter column={column} config={filterConfig as TextFilterConfig} />
      );
  }
}

export function FilterPanel<TData>({
  table,
}: FilterPanelProps<TData>): React.ReactElement {
  // Initialize with currently active filters
  const [filterRows, setFilterRows] = useState<string[]>(() =>
    table.getState().columnFilters.map((f) => f.id),
  );

  const allColumns = table.getAllColumns().filter((col) => col.getCanFilter());

  // Sync with table state if it changes externally (optional, but good for consistency)
  // For now, we'll trust local state + user actions, but if we wanted to support
  // external clearing, we'd need a useEffect here.
  useEffect(() => {
    const currentFilters = table.getState().columnFilters.map((f) => f.id);
    // If the table has filters that we don't know about, add them.
    // If the table lacks filters we have... well, maybe we are just editing them and they are empty.
    // So we only add missing ones.
    setFilterRows((prev) => {
      const newRows = [...prev];
      currentFilters.forEach((id) => {
        if (!newRows.includes(id)) {
          newRows.push(id);
        }
      });
      return newRows;
    });
  }, [table.getState().columnFilters]);

  const handleAddFilter = () => {
    const usedIds = filterRows;
    const nextCol = allColumns.find((col) => !usedIds.includes(col.id));
    if (nextCol) {
      setFilterRows([...filterRows, nextCol.id]);
    }
  };

  const handleRemoveFilter = (columnId: string) => {
    setFilterRows(filterRows.filter((id) => id !== columnId));
    table.getColumn(columnId)?.setFilterValue(undefined);
  };

  const handleColumnChange = (oldId: string, newId: string) => {
    if (oldId === newId) return;
    // Clear old filter
    table.getColumn(oldId)?.setFilterValue(undefined);
    // Update row to new column
    setFilterRows(filterRows.map((id) => (id === oldId ? newId : id)));
  };

  return (
    <Box sx={{ p: 2, minWidth: 600, maxWidth: 800 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
      </Typography>
      <Stack spacing={2}>
        {filterRows.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No active filters.
          </Typography>
        )}
        {filterRows.map((colId) => {
          const column = table.getColumn(colId);
          if (!column) return null;

          return (
            <Box
              key={colId}
              sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
            >
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Column</InputLabel>
                <Select
                  value={colId}
                  label="Column"
                  onChange={(e) => handleColumnChange(colId, e.target.value)}
                >
                  {allColumns.map((col) => (
                    <MenuItem key={col.id} value={col.id}>
                      {flexRenderHeader(col)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ flexGrow: 1, minWidth: 250 }}>
                <FilterInput column={column} table={table} />
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveFilter(colId)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          );
        })}
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddFilter}
          disabled={filterRows.length >= allColumns.length}
        >
          Add filter
        </Button>
      </Stack>
    </Box>
  );
}

// Helper to get header string
function flexRenderHeader<TData>(column: Column<TData, unknown>) {
  // This is a simplification. In reality, header could be a function or component.
  // We try to get a string representation.
  const header = column.columnDef.header;
  if (typeof header === "string") return header;
  if (typeof header === "function") return column.id; // Fallback
  return column.id;
}
