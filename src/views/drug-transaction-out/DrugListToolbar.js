import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
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
  FormControl,
  InputAdornment,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@material-ui/core";

import DatePicker from "@material-ui/lab/DatePicker";

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

DrugListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function DrugListToolbar({
  getData,
  // drugnameOptions = [],
  locationdrugOptions = [],
  filter = {},
  handleChangeFilter,
  handleChangeFilterStartDate,
  handleChangeFilterEndDate,
  numSelected,
  filterName,
  onFilterName,
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Grid container alignItems="center" style={{ padding: 16 }} spacing={1}>
      <Grid item>
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Name Medicine..."
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

      {/* <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <InputLabel id="nama-obat-label">Nama Obat</InputLabel>
          <Select
            labelId="nama-obat-label"
            id="nama-obat-select"
            value={filter.drug_id}
            onChange={(e) => handleChangeFilter("drug_id", e)}
            label="Nama Obat"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {drugnameOptions.map((drugname) => (
              <MenuItem key={drugname.id} value={drugname.id}>
                {drugname.drug_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid> */}

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <InputLabel id="lokasi-obat-label">Lokasi Obat</InputLabel>
          <Select
            labelId="lokasi-obat-label"
            id="lokasi-obat-select"
            value={filter.location_id}
            onChange={(e) => handleChangeFilter("location_id", e)}
            label="Lokasi Obat"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {locationdrugOptions.map((locationdrug) => (
              <MenuItem key={locationdrug.id} value={locationdrug.id}>
                {locationdrug.uks_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <DatePicker
            label="Start Date"
            value={filter.created_at}
            hintText="DD/MM/YYYY"
            inputFormat="dd/MM/yyyy"
            onChange={(e) => handleChangeFilterStartDate("created_at", e)}
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
            value={filter.updated_at}
            hintText="DD/MM/YYYY"
            inputFormat="dd/MM/yyyy"
            onChange={(e) => handleChangeFilterEndDate("updated_at", e)}
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
