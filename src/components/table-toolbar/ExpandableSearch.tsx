import { useState, useRef, JSX } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type OwnerState = {
  expanded: boolean;
};

const Container = styled('div')({
  display: 'grid',
  alignItems: 'center',
  marginLeft: 'auto',
});

const StyledIconButton = styled(IconButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 40, // 40px is approx IconButton size
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
  '& .MuiInputBase-root': {
    paddingRight: 8, // Adjust padding for the clear button
  },
}));

export function ExpandableSearch({
  value,
  onChange,
  placeholder = 'Search...',
}: ExpandableSearchProps): JSX.Element {
  const [expanded, setExpanded] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);

  // el estado `expanded` se actualiza dentro de los manejadores de evento; ya no necesitamos un efecto

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleBlur = () => {
    if (!value) {
      setExpanded(false);
    }
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <Container>
      <Tooltip title="Search" enterDelay={0}>
        <StyledIconButton
          ownerState={{ expanded }}
          onClick={handleExpand}
          aria-hidden={expanded}
          size="small"
        >
          <SearchIcon fontSize="small" />
        </StyledIconButton>
      </Tooltip>
      <StyledTextField
        ownerState={{ expanded }}
        inputRef={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value) setExpanded(true);
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        size="small"
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={handleClear}
                  edge="end"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
    </Container>
  );
}
