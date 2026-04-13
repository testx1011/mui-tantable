import React from "react";
import type { CellRendererProps, ChipCellConfig } from "../../types";

import Chip from "@mui/material/Chip";

export function ChipCell<TData>({
  getValue,
  column,
}: CellRendererProps<TData> & { config?: ChipCellConfig }): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: ChipCellConfig })
    ?.cellConfig;

  const {
    colorMap = {},
    variant = "filled",
    size = "small",
    icon,
  } = config || {};

  if (value == null || value === "") {
    return null;
  }

  const stringValue = String(value);
  const color = colorMap[stringValue] || "default";
  const chipIcon = typeof icon === "function" ? icon(value) : icon;

  const chipElement =
    typeof chipIcon === "object" && chipIcon !== null
      ? (chipIcon as React.ReactElement)
      : undefined;

  return (
    <Chip
      label={stringValue}
      color={color === "info" ? "primary" : color}
      variant={variant}
      size={size}
      icon={chipElement}
      sx={
        color === "info"
          ? {
              "& .MuiChip-label": {
                color: "#fff",
              },
            }
          : undefined
      }
    />
  );
}
