import React, { useState, useRef } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ClearIcon from '@mui/icons-material/Clear';
import type { Header, SortDirection } from '@tanstack/react-table';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TableSortLabel from '@mui/material/TableSortLabel';
import Divider from '@mui/material/Divider';

interface ColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  title: React.ReactNode;
  enableResizing?: boolean;
  enableReordering?: boolean;
}

export function ColumnHeader<TData, TValue>({
  header,
  title,
  enableResizing,
  enableReordering,
}: ColumnHeaderProps<TData, TValue>): React.ReactElement {
  const { column } = header;
  const table = header.getContext().table;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const isPinned = column.getIsPinned();
  const isSorted = column.getIsSorted();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handlePin = (position: 'left' | 'right' | false) => {
    column.pin(position);
    handleCloseMenu();
  };

  const handleSort = (direction: SortDirection | false) => {
    if (direction === false) {
      column.clearSorting();
    } else {
      column.toggleSorting(direction === 'desc');
    }
    handleCloseMenu();
  };

  const handleHide = () => {
    column.toggleVisibility(false);
    handleCloseMenu();
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!enableReordering) return;
    // if a resize is in progress, prevent column reorder drag
    if (isResizingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setIsDragging(true);
    e.dataTransfer.setData('colId', column.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!enableReordering) return;
    e.preventDefault();
    setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!enableReordering) return;
    e.preventDefault();
    // Check if we are moving to a child element
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDropTarget(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableReordering) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!enableReordering) return;
    e.preventDefault();
    setIsDropTarget(false);
    const draggedId = e.dataTransfer.getData('colId');
    const targetId = column.id;

    if (draggedId && draggedId !== targetId) {
      const currentOrder = table.getState().columnOrder;
      const allColumns = table.getAllLeafColumns().map((c) => c.id);
      const columnOrder = currentOrder.length > 0 ? currentOrder : allColumns;

      const oldIndex = columnOrder.indexOf(draggedId);
      const newIndex = columnOrder.indexOf(targetId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = [...columnOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, draggedId);
        table.setColumnOrder(newOrder);
      }
    }
    setIsDragging(false);
  };

  // Track whether the user is currently using the resize handle
  const isResizingRef = useRef(false);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        cursor: enableReordering ? 'grab' : 'default',
        borderLeft: isDropTarget ? '3px solid' : '3px solid transparent',
        borderColor: isDropTarget ? 'primary.main' : 'transparent',
        backgroundColor: isDropTarget ? 'action.hover' : 'transparent',
        transition: 'all 0.2s',
        '&:active': {
          cursor: enableReordering ? 'grabbing' : 'default',
        },
      }}
      draggable={enableReordering}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          cursor: column.getCanSort() ? 'pointer' : 'default',
        }}
        onClick={column.getToggleSortingHandler()}
      >
        {column.getCanSort() ? (
          <TableSortLabel active={!!isSorted} direction={isSorted || 'asc'}>
            {title}
          </TableSortLabel>
        ) : (
          title
        )}
        {isPinned && (
          <PushPinIcon
            fontSize="small"
            sx={{
              ml: 0.5,
              fontSize: '0.875rem',
              color: 'text.secondary',
              transform: isPinned === 'right' ? 'rotate(90deg)' : 'none',
            }}
          />
        )}
      </Box>
      <IconButton
        size="small"
        onClick={handleOpenMenu}
        sx={{
          opacity: anchorEl ? 1 : 0,
          transition: 'opacity 0.2s',
          '.MuiTableCell-root:hover &': { opacity: 1 },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      {enableResizing && (
        <Box
          draggable={false}
          onDragStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onPointerDown={(e) => {
            // mark resizing so dragstart doesn't trigger reordering
            isResizingRef.current = true;
            // Prevent parent column drag/reorder from starting when resizing
            e.stopPropagation();
            const handler = header.getResizeHandler();
            if (handler) handler(e as React.PointerEvent<HTMLDivElement>);

            // listen for pointer up to clear resizing flag
            const onUp = () => {
              isResizingRef.current = false;
              window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointerup', onUp);
          }}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: '14px', // Wider hit area for touch
            cursor: 'col-resize',
            userSelect: 'none',
            touchAction: 'none',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // show handle when hovering the hit area or when resizing
            '&:hover .resize-handle': {
              opacity: 1,
            },
            ...(header.column.getIsResizing() && {
              '& .resize-handle': {
                opacity: 1,
                width: '3px',
              },
            }),
          }}
        >
          <Box
            className="resize-handle"
            draggable={false}
            onDragStart={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            sx={{
              width: '14px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              pointerEvents: 'auto',
            }}
          >
            {/* Visual column separator similar to MUI DataGrid — always visible */}
            <Box
              sx={{
                minHeight: 39,

                display: 'flex',
                alignItems: 'center',
                color: 'divider',
                opacity: 1,
              }}
            >
              <svg
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                width={16}
                height={24}
                role="presentation"
              >
                <rect width="1" height="24" x="11.5" rx="0.5" fill="currentColor" />
              </svg>
            </Box>
          </Box>
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => handleSort('asc')} disabled={!column.getCanSort()}>
          <ListItemIcon>
            <ArrowUpwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sort Ascending</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSort('desc')} disabled={!column.getCanSort()}>
          <ListItemIcon>
            <ArrowDownwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sort Descending</ListItemText>
        </MenuItem>

        {isSorted && (
          <MenuItem onClick={() => handleSort(false)}>
            <ListItemIcon>
              <ClearIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Clear Sort</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => handlePin('left')} selected={isPinned === 'left'}>
          <ListItemIcon>
            <PushPinIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Pin to Left</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handlePin('right')} selected={isPinned === 'right'}>
          <ListItemIcon>
            <PushPinIcon fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
          </ListItemIcon>
          <ListItemText>Pin to Right</ListItemText>
        </MenuItem>
        {isPinned && (
          <MenuItem onClick={() => handlePin(false)}>
            <ListItemIcon>
              <PushPinOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Unpin</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleHide}>
          <ListItemIcon>
            <VisibilityOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hide Column</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
