import React, { useState, useEffect } from 'react';
import {
  TextField,
  Checkbox,
} from '@mui/material';
import type { CellRendererProps } from '../types/columns';
import type { CellType } from '../types/cells';

interface EditCellProps<TData> extends CellRendererProps<TData> {
  value: any;
  onChange: (value: any) => void;
  onSave?: () => void;
  onCancel?: () => void;
  cellType?: CellType;
}

export function EditCell<TData>({
  value: initialValue,
  onChange,
  onSave,
  onCancel,
  cellType = 'text',
}: EditCellProps<TData>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (newValue: any) => {
    setValue(newValue);
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
      const dateValue = value instanceof Date 
        ? value.toISOString().split('T')[0] 
        : typeof value === 'string' && value 
            ? new Date(value).toISOString().split('T')[0] 
            : '';
            
      return (
        <TextField
          type="date"
          value={dateValue}
          onChange={(e) => handleChange(e.target.value ? new Date(e.target.value) : null)}
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
          autoFocus
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
          autoFocus
        />
      );
  }
}
