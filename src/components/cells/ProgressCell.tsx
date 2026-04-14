import { memo } from 'react';
import type { CellRendererProps, ProgressCellConfig } from '../../types';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

export const ProgressCell = memo(function ProgressCell<TData>({
  getValue,
  column,
}: CellRendererProps<TData> & {
  config?: ProgressCellConfig;
}): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: ProgressCellConfig })?.cellConfig;

  const {
    type = 'linear',
    showLabel = true,
    color: colorConfig = 'primary',
    min = 0,
    max = 100,
  } = config || {};

  if (value == null) {
    return null;
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return (
      <Typography variant="body2" color="error">
        Invalid
      </Typography>
    );
  }

  type MuiColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';

  const color = (
    typeof colorConfig === 'function' ? colorConfig(numValue) : colorConfig
  ) as MuiColor;

  // Normalize value to 0-100 range
  const normalizedValue = ((numValue - min) / (max - min)) * 100;
  const clampedValue = Math.max(0, Math.min(100, normalizedValue));

  // Accessible label shared by both circular and linear variants
  const progressLabel = `Progress: ${Math.round(clampedValue)}%`;

  if (type === 'circular') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress
          variant="determinate"
          value={clampedValue}
          size={24}
          color={color}
          aria-label={progressLabel}
        />
        {showLabel && <Typography variant="body2">{Math.round(clampedValue)}%</Typography>}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={clampedValue}
          color={color}
          aria-label={progressLabel}
        />
      </Box>
      {showLabel && (
        <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
          {Math.round(clampedValue)}%
        </Typography>
      )}
    </Box>
  );
});
