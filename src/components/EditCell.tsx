import React from 'react';
import type { CellRendererProps } from '../types/columns';
import type { CellType } from '../types/cells';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

interface EditCellProps<TData> extends CellRendererProps<TData> {
  value: unknown;
  onChange: (value: unknown) => void;
  onSave?: () => void;
  onCancel?: () => void;
  cellType?: CellType;
}

export function EditCell<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  cellType = 'text',
}: EditCellProps<TData>): React.ReactElement {
  // value is controlled directly by the parent; no local state needed
  const handleChange = (newValue: unknown) => {
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave?.();
    } else if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  // Render different inputs based on cellType
  switch (cellType) {
    case 'boolean':
      return (
        <Checkbox
          checked={!!value}
          onChange={(e) => handleChange(e.target.checked)}
          size="small"
        />
      );

    case 'date':
      // Simple date input fallback
      const dateValue =
        value instanceof Date
          ? value.toISOString().split('T')[0]
          : typeof value === 'string' && value
            ? new Date(value).toISOString().split('T')[0]
            : '';

      return (
        <TextField
          type="date"
          value={dateValue}
          onChange={(e) =>
            handleChange(e.target.value ? new Date(e.target.value) : null)
          }
          size="small"
          variant="standard"
          fullWidth
          onKeyDown={handleKeyDown}
          InputLabelProps={{ shrink: true }}
        />
      );

    case 'number':
      return (
        <TextField
          type="number"
          value={value ?? ''}
          onChange={(e) => handleChange(Number(e.target.value))}
          size="small"
          variant="standard"
          fullWidth
          onKeyDown={handleKeyDown}
        />
      );

    // case 'select': // Assuming we might add this type later or map it from 'text' with options
    // For now, fallback to text if no options provided in columnDef (we'd need to extend types for this)
    //   return (
    //     <TextField
    //       value={value ?? ''}
    //       onChange={(e) => handleChange(e.target.value)}
    //       size="small"
    //       variant="standard"
    //       fullWidth
    //       onKeyDown={handleKeyDown}
    //       autoFocus
    //     />
    //   );

    default:
      return (
        <TextField
          value={value ?? ''}
          onChange={(e) => handleChange(e.target.value)}
          size="small"
          variant="standard"
          fullWidth
          onKeyDown={handleKeyDown}
        />
      );
  }
}
