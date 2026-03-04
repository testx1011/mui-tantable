import React, { useState } from 'react';

import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type { CellRendererProps, ActionCellConfig } from '../../types';

export function ActionCell<TData>(
  props: CellRendererProps<TData> & {
    config?: ActionCellConfig;
    isEditing?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
  },
): React.ReactNode {
  const { row, column, isEditing, onSave, onCancel } = props;
  const config = (column.columnDef as { cellConfig?: ActionCellConfig })
    ?.cellConfig;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Save">
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
          >
            <SaveIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  if (!config || !config.actions) {
    return null;
  }

  const { actions, asMenu = false, menuIcon } = config;

  // Filter visible actions
  const visibleActions = actions.filter((action) => {
    if (typeof action.show === 'function') {
      return action.show(row.original);
    }
    return action.show !== false;
  });

  if (visibleActions.length === 0) {
    return null;
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick =
    (action: (typeof actions)[0]) => (e: React.MouseEvent) => {
      e.stopPropagation();
      handleMenuClose();
      action.onClick(row.original);
    };

  const isDisabled = (action: (typeof actions)[0]) => {
    if (typeof action.disabled === 'function') {
      return action.disabled(row.original);
    }
    return action.disabled === true;
  };

  if (asMenu) {
    return (
      <>
        <IconButton size="small" onClick={handleMenuOpen}>
          {menuIcon || <MoreVertIcon />}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          {visibleActions.map((action) => (
            <MenuItem
              key={action.label}
              onClick={handleActionClick(action)}
              disabled={isDisabled(action)}
            >
              {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {visibleActions.map((action) => (
        <IconButton
          key={action.label}
          size="small"
          onClick={handleActionClick(action)}
          disabled={isDisabled(action)}
          color={action.color}
          title={action.label}
        >
          {action.icon}
        </IconButton>
      ))}
    </Box>
  );
}
