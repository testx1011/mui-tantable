import type { Table } from "@tanstack/react-table";
import type { PaginationConfig } from "../types/toolbar";
import { JSX } from "react";

import Box from "@mui/material/Box";
import MuiPagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  config?: PaginationConfig;
}

export function TablePagination<TData>({
  table,
  config,
}: TablePaginationProps<TData>): JSX.Element {
  const { pageSizeOptions = [10, 25, 50, 100], showFirstLastButtons = true } =
    config || {};

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        p: 1,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          id="pagination-rows-label"
        >
          Rows per page:
        </Typography>
        <FormControl variant="standard">
          <Select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            disableUnderline
            aria-labelledby="pagination-rows-label"
            sx={{
              fontSize: "0.875rem",
              "& .MuiSelect-select": {
                paddingBottom: 0,
                paddingTop: 0,
              },
            }}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {totalRows === 0 ? "No rows" : `${startRow}-${endRow} of ${totalRows}`}
      </Typography>

      <MuiPagination
        count={pageCount}
        page={pageIndex + 1}
        onChange={(_, page) => table.setPageIndex(page - 1)}
        showFirstButton={showFirstLastButtons}
        showLastButton={showFirstLastButtons}
        color="primary"
        siblingCount={0}
        boundaryCount={1}
        aria-label="Pagination navigation"
      />
    </Box>
  );
}
