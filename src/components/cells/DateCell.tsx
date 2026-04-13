import type { CellRendererProps, DateCellConfig } from '../../types';
import { formatDate } from '../../utils/formatters';

import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export function DateCell<TData>({
  getValue,
  column,
}: CellRendererProps<TData> & { config?: DateCellConfig }): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: DateCellConfig })?.cellConfig;

  const {
    format = 'medium',
    locale = 'en-US',
    includeTime = false,
    relative = false,
  } = config || {};

  if (value == null || value === '') {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  const date = value instanceof Date ? value : new Date(value as string | number);

  if (isNaN(date.getTime())) {
    return (
      <Typography variant="body2" color="error">
        Invalid Date
      </Typography>
    );
  }

  const formatted = formatDate(date, { format, locale, includeTime, relative });

  // If showing relative time, show full date in tooltip
  if (relative) {
    const fullDate = formatDate(date, {
      format: 'long',
      locale,
      includeTime: true,
    });
    return (
      <Tooltip title={fullDate}>
        <Typography variant="body2">{formatted}</Typography>
      </Tooltip>
    );
  }

  return <Typography variant="body2">{formatted}</Typography>;
}
