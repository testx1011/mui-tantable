import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { CellRendererProps, TextCellConfig } from '../../types';
import { truncateText, transformText } from '../../utils/formatters';

import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

export function TextCell<TData>({
  getValue,
  column,
}: CellRendererProps<TData> & { config?: TextCellConfig }): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: TextCellConfig })?.cellConfig;

  const {
    maxLength,
    showTooltip = true,
    transform,
    enableCopy = false,
  } = config || {};

  if (value == null || value === '') {
    return <Typography variant="body2" color="text.secondary">—</Typography>;
  }

  let displayValue = String(value);
  if (transform) {
    displayValue = transformText(displayValue, transform);
  }

  const isTruncated = maxLength && displayValue.length > maxLength;
  const truncatedValue = isTruncated ? truncateText(displayValue, maxLength) : displayValue;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayValue);
  };

  const content = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body2" component="span">
        {truncatedValue}
      </Typography>
      {enableCopy && (
        <IconButton size="small" onClick={handleCopy} sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );

  if (showTooltip && isTruncated) {
    return <Tooltip title={displayValue}>{content}</Tooltip>;
  }

  return content;
}
