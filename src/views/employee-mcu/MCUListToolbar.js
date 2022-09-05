import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import DatePicker from "@material-ui/lab/DatePicker";
// material
import {
  useTheme,
  experimentalStyled as styled,
} from "@material-ui/core/styles";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 240, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

MCUListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function MCUListToolbar({
  getData,
  numSelected,
  // filterName,
  employeeunitOptions = [],
  // onFilterName,
  filter = {},
  filters,
  handleChangeFilter,
  handleFilter,
  handleChangeFilterStartDate,
  handleChangeFilterEndDate,
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Grid container alignItems="center" style={{ padding: 16 }} spacing={1}>
      <Grid item>
        <SearchStyle
          // value={filterName}
          // onChange={onFilterName}
          value={filters.keyword}
          onChange={(e) => handleFilter("keyword", e)}
          placeholder="Search By Name..."
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: "text.disabled" }}
              />
            </InputAdornment>
          }
        />
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <InputLabel id="employee-unit-label">Unit</InputLabel>
          <Select
            labelId="employee-unit-label"
            id="employee-unit-select"
            value={filter.unit}
            onChange={(e) => handleChangeFilter("unit", e)}
            label="Unit"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {employeeunitOptions.map((employee_unit) => (
              <MenuItem key={employee_unit.id} value={employee_unit.name}>
                {employee_unit.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <DatePicker
            label="Start Date"
            value={filter.inspection_date}
            hintText="DD/MM/YYYY"
            inputFormat="dd/MM/yyyy"
            onChange={(e) => handleChangeFilterStartDate("inspection_date", e)}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <DatePicker
            label="End Date"
            value={filter.created_at}
            hintText="DD/MM/YYYY"
            inputFormat="dd/MM/yyyy"
            onChange={(e) => handleChangeFilterEndDate("created_at", e)}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </FormControl>
      </Grid>

      <Grid item>
        <Button onClick={getData}>Apply</Button>
      </Grid>
    </Grid>
  );
}
