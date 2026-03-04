import { Link as MuiLink, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { CellRendererProps, LinkCellConfig } from '../../types';

export function LinkCell<TData>({
  getValue,
  row,
  column,
}: CellRendererProps<TData> & { config?: LinkCellConfig }): React.ReactNode {
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: LinkCellConfig })?.cellConfig;

  if (!config || !config.href) {
    return null;
  }

  const { href, external = false, showExternalIcon = true } = config;

  const url = typeof href === 'function' ? href(row.original) : href;
  const displayText = value != null ? String(value) : url;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <MuiLink
        href={url}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={(e) => e.stopPropagation()}
        underline="hover"
      >
        {displayText}
      </MuiLink>
      {external && showExternalIcon && (
        <OpenInNewIcon fontSize="small" sx={{ opacity: 0.6 }} />
      )}
    </Box>
  );
}
