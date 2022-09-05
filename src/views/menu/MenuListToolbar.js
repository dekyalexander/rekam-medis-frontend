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
  Grid,
  Button,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

// ----------------------------------------------------------------------


const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

MenuListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function MenuListToolbar({
  getData,
  applicationOptions=[],
  filter={},
  handleChangeFilter,
  numSelected,
  filterName,
  onFilterName
}) {
  const theme = useTheme();
  

  return (
    <Grid container alignItems="center" style={{padding:16}} spacing={1}>
      <Grid item>
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
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
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: 200 }}
        >
          <InputLabel id="application-label">Application</InputLabel>
          <Select
            labelId="application-label"
            id="application-select"
            value = {filter.application_id}
            onChange={(e)=>handleChangeFilter('application_id',e)}
            label="Application"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {applicationOptions.map((application) => (
              <MenuItem key={application.id} value={application.id}>
                {application.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item>
        <Button onClick={getData}>
          Apply
        </Button>
      </Grid>
      
    </Grid>
  );
}
