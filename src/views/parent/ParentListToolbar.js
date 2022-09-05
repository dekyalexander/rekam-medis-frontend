import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import {
  useTheme,
  experimentalStyled as styled
} from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,  
  InputLabel,
  Checkbox
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';  
import Conditional from 'src/components/Conditional';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 240, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

ParentListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function ParentListToolbar({
  getData,
  numSelected,
  filters,
  handleFilter
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Grid container alignItems="center" style={{padding:16}} spacing={1}>
      <Grid item>
        <SearchStyle
          value={filters.keyword}
          onChange={(e)=>handleFilter('keyword',e)}
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: 'text.disabled' }}
              />
            </InputAdornment>
          }
        />
      </Grid>  

      
      <Grid item>
        <Button onClick={getData}>
          Apply
        </Button>
      </Grid>
      
      
    </Grid>
  );
}
