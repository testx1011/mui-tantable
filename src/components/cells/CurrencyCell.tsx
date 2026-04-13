import type { CellRendererProps, CurrencyCellConfig } from '../../types';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function CurrencyCell<TData>({
  getValue,
  column,
}: CellRendererProps<TData> & {
  config?: CurrencyCellConfig;
}): React.ReactElement {
  const config = (column.columnDef as { cellConfig?: CurrencyCellConfig })?.cellConfig;
  const value = getValue();

  const {
    currency = 'USD',
    decimals = 2,
    locale = 'en-US',
    showCode = false,
    showPositiveSign = false,
    colorNegative = true,
    compact = false,
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

  let formatted: string;

  if (compact && Math.abs(numValue) >= 1000) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: decimals,
    });
    formatted = formatter.format(numValue);
  } else {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: showCode ? 'code' : 'symbol',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      signDisplay: showPositiveSign ? 'exceptZero' : 'auto',
    });
    formatted = formatter.format(numValue);
  }

  const textColor =
    colorNegative && numValue < 0
      ? 'error.main'
      : colorNegative && numValue > 0 && showPositiveSign
        ? 'success.main'
        : 'text.primary';

  return (
    <Box sx={{ textAlign: 'right', width: '100%' }}>
      <Typography variant="body2" color={textColor} sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatted}
      </Typography>
    </Box>
  );
}
