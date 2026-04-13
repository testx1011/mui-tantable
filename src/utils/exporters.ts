import type { Table } from "@tanstack/react-table";
import type { ExportOptions } from "../types/toolbar";

/**
 * Export table data to CSV
 */
export function exportToCSV<TData>(
  table: Table<TData>,
  options: Partial<ExportOptions> = {},
): void {
  const {
    filename = "table-export.csv",
    includeHeaders = true,
    columns,
    selectedOnly = false,
  } = options;

  const rows = selectedOnly
    ? table.getSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const visibleColumns = columns
    ? table.getAllColumns().filter((col) => columns.includes(col.id))
    : table.getVisibleLeafColumns();

  let csv = "";

  // Add headers
  if (includeHeaders) {
    const headers = visibleColumns
      .map((col) => {
        const header =
          typeof col.columnDef.header === "string"
            ? col.columnDef.header
            : col.id;
        return escapeCsvValue(header);
      })
      .join(",");
    csv += headers + "\n";
  }

  // Add rows
  rows.forEach((row) => {
    const values = visibleColumns
      .map((col) => {
        const cell = row.getAllCells().find((c) => c.column.id === col.id);
        const value = cell?.getValue() ?? "";
        return escapeCsvValue(String(value));
      })
      .join(",");
    csv += values + "\n";
  });

  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Export table data to JSON
 */
export function exportToJSON<TData>(
  table: Table<TData>,
  options: Partial<ExportOptions> = {},
): void {
  const {
    filename = "table-export.json",
    columns,
    selectedOnly = false,
  } = options;

  const rows = selectedOnly
    ? table.getSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const visibleColumns = columns
    ? table.getAllColumns().filter((col) => columns.includes(col.id))
    : table.getVisibleLeafColumns();

  const data = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    visibleColumns.forEach((col) => {
      const cell = row.getAllCells().find((c) => c.column.id === col.id);
      const header =
        typeof col.columnDef.header === "string"
          ? col.columnDef.header
          : col.id;
      obj[header] = cell?.getValue() ?? null;
    });
    return obj;
  });

  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, "application/json;charset=utf-8;");
}

/**
 * Export table data to Excel (simple HTML table format)
 */
export function exportToExcel<TData>(
  table: Table<TData>,
  options: Partial<ExportOptions> = {},
): void {
  const {
    filename = "table-export.xls",
    includeHeaders = true,
    columns,
    selectedOnly = false,
  } = options;

  const rows = selectedOnly
    ? table.getSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const visibleColumns = columns
    ? table.getAllColumns().filter((col) => columns.includes(col.id))
    : table.getVisibleLeafColumns();

  let html = '<html><head><meta charset="utf-8"></head><body><table>';

  // Add headers
  if (includeHeaders) {
    html += "<thead><tr>";
    visibleColumns.forEach((col) => {
      const header =
        typeof col.columnDef.header === "string"
          ? col.columnDef.header
          : col.id;
      html += `<th>${escapeHtml(header)}</th>`;
    });
    html += "</tr></thead>";
  }

  // Add rows
  html += "<tbody>";
  rows.forEach((row) => {
    html += "<tr>";
    visibleColumns.forEach((col) => {
      const cell = row.getAllCells().find((c) => c.column.id === col.id);
      const value = cell?.getValue() ?? "";
      html += `<td>${escapeHtml(String(value))}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table></body></html>";

  downloadFile(html, filename, "application/vnd.ms-excel");
}

/**
 * Print table
 */
export function printTable<TData>(table: Table<TData>): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Failed to open print window");
    return;
  }

  const visibleColumns = table.getVisibleLeafColumns();
  const rows = table.getFilteredRowModel().rows;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Print Table</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
  `;

  visibleColumns.forEach((col) => {
    const header =
      typeof col.columnDef.header === "string" ? col.columnDef.header : col.id;
    html += `<th>${escapeHtml(header)}</th>`;
  });

  html += "</tr></thead><tbody>";

  rows.forEach((row) => {
    html += "<tr>";
    visibleColumns.forEach((col) => {
      const cell = row.getAllCells().find((c) => c.column.id === col.id);
      const value = cell?.getValue() ?? "";
      html += `<td>${escapeHtml(String(value))}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table></body></html>";

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

/**
 * Export table data to PDF (using browser print dialog)
 */
export function exportToPDF<TData>(
  table: Table<TData>,
  options: Partial<ExportOptions> = {},
): void {
  void options;

  printTable(table);
}

/**
 * Helper: Escape CSV value
 */
function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Helper: Escape HTML
 */
function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

/**
 * Helper: Download file
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
