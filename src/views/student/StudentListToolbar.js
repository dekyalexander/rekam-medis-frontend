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

StudentListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function StudentListToolbar({
  getData,
  filters,
  handleFilter,
  schoolOptions=[],
  kelasOptions=[],
  parallelOptions=[],
  tahunOptions=[]
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [expandFilter, setexpandFilter] = useState(false);

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
      <FormControl variant="outlined" style={{ width: "200px" }}>
        <InputLabel>School</InputLabel>
        <Select
          labelId="school-label"
          id="school-select"
          name="school_id"
          value={filters.school_id}
          label="School"
          onChange={(e) => handleFilter("school_id", e)}
        >
          <MenuItem value={null}>
            <em>None</em>
          </MenuItem>
          {schoolOptions.map((school) => (
            <MenuItem key={school.id} value={school.id}>
              {school.name}
            </MenuItem>
          ))}
        </Select>  
        </FormControl>
      </Grid>

      <Grid item>
      <FormControl variant="outlined" style={{ width: "200px" }}>
        <InputLabel>Kelas</InputLabel>
        <Select
          labelId="kelas-label"
          id="kelas-select"
          name="kelas_id"
          value={filters.kelas_id}
          label="Kelas"
          onChange={(e) => handleFilter("kelas_id", e)}
        >
          <MenuItem value={null}>
            <em>None</em>
          </MenuItem>
          {kelasOptions.map((kelas) => (
            <MenuItem key={kelas.id} value={kelas.id}>
              {kelas.name}
            </MenuItem>
          ))}
        </Select>  
        </FormControl>
      </Grid> 

      <Grid item >
        <FormControl variant="outlined" style={{ width: "200px" }}>
            <InputLabel>Parallel</InputLabel>
            <Select
            labelId="parallel-label"
            id="parallel-select"
            name="parallel_id"
            value={filters.parallel_id}
            label="Parallel"
            onChange={(e) => handleFilter("parallel_id", e)}
          >
            <MenuItem value={null}>
              <em>None</em>
            </MenuItem>
            {parallelOptions.map((parallel) => (
              <MenuItem key={parallel.id} value={parallel.id}>
                {parallel.name}
              </MenuItem>
            ))}
          </Select> 
        </FormControl>         
      </Grid> 

      <Grid item>
        <Tooltip title="More Filters">
          <IconButton onClick={()=>setexpandFilter(!expandFilter)}>
            {
              expandFilter? <ExpandLess/> : <ExpandMore/>
            }
          </IconButton>
        </Tooltip>
      </Grid>
      
      
      <Grid item>
        <Button onClick={getData}>
          Apply
        </Button>
      </Grid>

      <Conditional condition={expandFilter===true}>
        <Grid container style={{padding:8}}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.is_sibling===1}
                  onChange={(e) => handleFilter("is_sibling", e)}
                />
              }
              label="Sibling"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.is_history===1}
                  onChange={(e) => handleFilter("is_history", e)}
                />
              }
              label="History"
            />
          </Grid>
          <Conditional condition={filters.is_history===1}>
            <Grid item style={{ marginBottom: 16 }}>
              <FormControl variant="outlined" style={{ minWidth: 200 }}>
                <InputLabel id="tahun_pelajaran-label">Tahun Pelajaran</InputLabel>
                <Select
                  labelId="lulus_pelajaran-label"
                  id="tahun_pelajaran-select"
                  name="tahun_pelajaran"
                  value={filters.tahun_pelajaran_id}
                  label="Tahun Lulus"
                  onChange={(e) => handleFilter("tahun_pelajaran_id", e)}
                >
                  {tahunOptions.map((tahun_pelajaran) => (
                    <MenuItem key={tahun_pelajaran.id} value={tahun_pelajaran.id}>
                      {tahun_pelajaran.name}
                    </MenuItem>
                  ))}
                </Select>                
              </FormControl>
            </Grid>
          </Conditional>
        </Grid>      
      </Conditional>
      
    </Grid>
  );
}
