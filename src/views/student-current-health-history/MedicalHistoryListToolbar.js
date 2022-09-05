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
  InputAdornment,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

MedicalHistoryListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function MedicalHistoryListToolbar({
  getData,
  numSelected,
  levelOptions = [],
  kelasOptions = [],
  filter = {},
  filters,
  handleFilter,
  handleChangeFilter,
  // filterName,
  // onFilterName,
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
          <InputLabel id="jenjang-label">Jenjang</InputLabel>
          <Select
            labelId="jenjang-label"
            id="jenjang-select"
            value={filter.level}
            onChange={(e) => handleChangeFilter("level", e)}
            label="Jenjang"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {levelOptions.map((level) => (
              <MenuItem key={level.id} value={level.code}>
                {level.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <InputLabel id="kelas-label">Kelas</InputLabel>
          <Select
            labelId="kelas-label"
            id="kelas-select"
            value={filter.kelas}
            onChange={(e) => handleChangeFilter("kelas", e)}
            label="Kelas"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {kelasOptions.map((kelas) => (
              <MenuItem key={kelas.id} value={kelas.code}>
                {kelas.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <Button onClick={getData}>Apply</Button>
      </Grid>
    </Grid>
  );
}
