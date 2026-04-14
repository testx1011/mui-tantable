import { memo } from 'react';
import type { CellRendererProps, NumberCellConfig } from '../../types';
import { formatNumber } from '../../utils/formatters';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const NumberCell = memo(function NumberCell<TData>({
  getValue,
  column,
}: CellRendererProps<TData> & { config?: NumberCellConfig }): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: NumberCellConfig })?.cellConfig;

  const {
    format = 'decimal',
    currency = 'USD',
    decimals = 2,
    locale = 'en-US',
    showPositiveSign = false,
    colorNegative = true,
  } = config || {};

  if (value == null || value === '') {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return (
      <Typography variant="body2" color="error">
        Invalid
      </Typography>
    );
  }

  const formatted = formatNumber(numValue, {
    format,
    currency,
    decimals,
    locale,
    showPositiveSign,
  });

  const color = colorNegative && numValue < 0 ? 'error.main' : 'text.primary';

  return (
    <Box sx={{ textAlign: 'right', width: '100%' }}>
      <Typography variant="body2" color={color} sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatted}
      </Typography>
    </Box>
  );
});
