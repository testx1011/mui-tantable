import type { CellRendererProps, ImageCellConfig } from '../../types';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';

interface ImageCellProps<TData> extends CellRendererProps<TData> {
  config?: ImageCellConfig;
}

export function ImageCell<TData>({ getValue, column }: ImageCellProps<TData>): React.ReactElement {
  const config = (column.columnDef as { cellConfig?: ImageCellConfig })?.cellConfig;
  const value = getValue();

  const {
    width = 40,
    height = 40,
    objectFit = 'cover',
    borderRadius = 4,
    alt = 'Image',
  } = config || {};

  const src =
    typeof value === 'string' ? value : typeof config?.src === 'function' ? config.src(value) : '';
  const altText = typeof alt === 'function' ? alt(value) : alt;

  if (!src) {
    return (
      <Box
        sx={{
          width,
          height,
          borderRadius,
          backgroundColor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          —
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ImageListItem
        sx={{
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          '& img': {
            objectFit,
            width: '100%',
            height: '100%',
          },
        }}
      >
        <img src={src} alt={altText} loading="lazy" />
      </ImageListItem>
    </Box>
  );
}
