import type { Table } from "@tanstack/react-table";
import type { FooterConfig, FooterAggregation } from "../../types/core";
import type { TanTableColumnDef } from "../../types/columns";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";

interface TableFooterComponentProps<TData> {
  table: Table<TData>;
  enableRowNumbering: boolean;
  enableRowSelection: boolean;
  enableExpanding: boolean;
  cellPadding: string;
  footerConfig?: FooterConfig;
}

function calculateAggregation(
  values: number[],
  aggregation: FooterAggregation,
): number {
  switch (aggregation) {
    case "sum":
      return values.reduce((acc, v) => acc + v, 0);
    case "avg":
      return values.length > 0
        ? values.reduce((acc, v) => acc + v, 0) / values.length
        : 0;
    case "count":
      return values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    default:
      return 0;
  }
}

export function TableFooterComponent<TData>({
  table,
  enableRowNumbering,
  enableRowSelection,
  enableExpanding,
  cellPadding,
  footerConfig,
}: TableFooterComponentProps<TData>): React.ReactElement {
  const visibleColumns = table.getVisibleLeafColumns();
  const filteredRows = table.getFilteredRowModel().rows;

  const {
    title = "Totals",
    columns = {},
    showCount = true,
    numericOnly = true,
  } = footerConfig || {};

  return (
    <TableFooter>
      <TableRow>
        {enableRowNumbering && (
          <TableCell sx={{ p: cellPadding, fontWeight: "bold" }}>
            {title}
          </TableCell>
        )}

        {enableExpanding && <TableCell sx={{ p: cellPadding }} />}

        {enableRowSelection && <TableCell sx={{ p: cellPadding }} />}

        {visibleColumns.map((column) => {
          const columnDef = column.columnDef as TanTableColumnDef<TData>;
          const columnId = column.id;
          const colConfig = columns[columnId];

          if (colConfig?.aggregation === "none") {
            return (
              <TableCell key={columnId} sx={{ p: cellPadding }}>
                {colConfig.label || ""}
              </TableCell>
            );
          }

          const values: number[] = [];
          filteredRows.forEach((row) => {
            const value = row.getValue(columnId);
            const num = Number(value);
            if (!isNaN(num) && value != null) {
              values.push(num);
            }
          });

          if (values.length === 0 && numericOnly) {
            return <TableCell key={columnId} sx={{ p: cellPadding }} />;
          }

          const aggregationType: FooterAggregation =
            (colConfig?.aggregation as FooterAggregation) ||
            (showCount ? "count" : "sum");
          const aggregationLabel = colConfig?.label;

          if (aggregationLabel && (aggregationType as string) === "none") {
            return (
              <TableCell
                key={columnId}
                sx={{ p: cellPadding, fontWeight: "bold" }}
              >
                {aggregationLabel}
              </TableCell>
            );
          }

          const result = calculateAggregation(values, aggregationType);
          const formatted = colConfig?.format
            ? colConfig.format(result)
            : aggregationType === "count"
              ? String(result)
              : result.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                });

          const align = columnDef.align || "left";

          return (
            <TableCell
              key={columnId}
              sx={{
                p: cellPadding,
                fontWeight: "bold",
                textAlign:
                  align === "center"
                    ? "center"
                    : align === "right"
                      ? "right"
                      : "left",
              }}
            >
              {formatted}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}
