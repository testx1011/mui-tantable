import React, { useState, useCallback } from 'react';
import type { CellRendererProps, ColumnValidation } from '../types/columns';
import type { CellType } from '../types/cells';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface EditCellProps<TData> extends CellRendererProps<TData> {
  value: unknown;
  onChange: (value: unknown) => void;
  onSave?: () => void;
  onCancel?: () => void;
  cellType?: CellType;
  validation?: ColumnValidation;
}

function validateValue(value: unknown, validation?: ColumnValidation): string | null {
  if (!validation?.rules) return null;

  for (const rule of validation.rules) {
    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '') {
          return rule.message || 'This field is required';
        }
        break;
      case 'min':
        if (typeof value === 'number' && value < (rule.value as number)) {
          return rule.message || `Minimum value is ${rule.value}`;
        }
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          return rule.message || `Minimum length is ${rule.value}`;
        }
        break;
      case 'max':
        if (typeof value === 'number' && value > (rule.value as number)) {
          return rule.message || `Maximum value is ${rule.value}`;
        }
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          return rule.message || `Maximum length is ${rule.value}`;
        }
        break;
      case 'pattern':
        if (typeof value === 'string' && rule.pattern) {
          const regex = new RegExp(rule.pattern);
          if (!regex.test(value)) {
            return rule.message || 'Invalid format';
          }
        }
        break;
      case 'custom':
        if (rule.validator) {
          const result = rule.validator(value);
          if (result !== true) {
            return typeof result === 'string' ? result : rule.message || 'Invalid value';
          }
        }
        break;
    }
  }

  return null;
}

export function EditCell<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  cellType = 'text',
  validation,
}: EditCellProps<TData>): React.ReactElement {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (newValue: unknown) => {
      onChange(newValue);

      if (validation?.rules && validation.validateOnChange) {
        const validationError = validateValue(newValue, validation);
        setError(validationError);
      }
    },
    [onChange, validation],
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validation?.rules) {
      const validationError = validateValue(value, validation);
      setError(validationError);
    }
  }, [value, validation]);

  const handleSave = useCallback(() => {
    setTouched(true);
    if (validation?.rules) {
      const validationError = validateValue(value, validation);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    onSave?.();
  }, [value, validation, onSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  const showError = touched && error;

  const renderInput = () => {
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
            onChange={(e) => handleChange(e.target.value ? new Date(e.target.value) : null)}
            size="small"
            variant="standard"
            fullWidth
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            error={!!showError}
            slotProps={{
              inputLabel: { shrink: true },
            }}
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
            onBlur={handleBlur}
            error={!!showError}
          />
        );

      default:
        return (
          <TextField
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            size="small"
            variant="standard"
            fullWidth
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            error={!!showError}
          />
        );
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {renderInput()}
      {showError && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
