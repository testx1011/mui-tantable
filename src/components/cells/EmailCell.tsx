import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { CellRendererProps, LinkCellConfig } from '../../types';

import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';

export function EmailCell<TData>(
  props: CellRendererProps<TData> & { config?: LinkCellConfig },
): React.ReactNode {
  const { getValue, row, column } = props;
  const value = getValue();
  const config = (column.columnDef as { cellConfig?: LinkCellConfig })?.cellConfig;

  const href = config?.href
    ? typeof config.href === 'function'
      ? config.href(row.original)
      : config.href
    : value != null
      ? `mailto:${String(value)}`
      : undefined;

  if (!href) {
    return null;
  }

  const displayText = value != null ? String(value) : href;
  const { external = false, showExternalIcon = false } = config || {};

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <MuiLink
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={(e) => e.stopPropagation()}
        underline="hover"
      >
        {displayText}
      </MuiLink>
      {external && showExternalIcon && (
        <OpenInNewIcon fontSize="small" sx={{ opacity: 0.6 }} aria-hidden="true" />
      )}
    </Box>
  );
}
