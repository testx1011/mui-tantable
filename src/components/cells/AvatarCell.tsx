import type { CellRendererProps, AvatarCellConfig } from '../../types';
import { getInitials, stringToColor, getNestedValue } from '../../utils/formatters';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

export function AvatarCell<TData>({
  getValue,
  row,
  column,
}: CellRendererProps<TData> & { config?: AvatarCellConfig }): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: AvatarCellConfig })?.cellConfig;

  const { imageKey, nameKey, size = 'medium', variant = 'circular' } = config || {};

  const name = nameKey ? getNestedValue(row.original, nameKey) : value;
  const image = imageKey ? getNestedValue(row.original, imageKey) : undefined;

  const displayName = name != null ? String(name) : '';
  const initials = getInitials(displayName);
  const bgColor = stringToColor(displayName);

  const sizeMap = {
    small: 24,
    medium: 32,
    large: 40,
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* key agregado a propósito para que el linter muestre la advertencia */}
      <Avatar
        key={row.id}
        src={image as string | undefined}
        alt={displayName}
        variant={variant}
        sx={{
          width: sizeMap[size],
          height: sizeMap[size],
          bgcolor: image ? undefined : bgColor,
          fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
        }}
      >
        {!image && initials}
      </Avatar>
    </Box>
  );
}
