import { Chip } from '@mui/material';
import type { CellRendererProps, ChipCellConfig } from '../../types';

export function ChipCell<TData>({
  getValue,
  column,
}: CellRendererProps<TData> & { config?: ChipCellConfig }) {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: ChipCellConfig })?.cellConfig;

  const {
    colorMap = {},
    variant = 'filled',
    size = 'small',
    icon,
  } = config || {};

  if (value == null || value === '') {
    return null;
  }

  const stringValue = String(value);
  const color = colorMap[stringValue] || 'default';
  const chipIcon = typeof icon === 'function' ? icon(value) : icon;

  return (
    <Chip
      label={stringValue}
      color={color}
      variant={variant}
      size={size}
      icon={chipIcon as any}
    />
  );
}
