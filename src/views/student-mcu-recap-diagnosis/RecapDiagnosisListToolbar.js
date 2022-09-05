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
  MenuItem,
  TextField,
} from "@material-ui/core";

import DatePicker from "@material-ui/lab/DatePicker";

// ----------------------------------------------------------------------

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

RecapDiagnosisListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function RecapDiagnosisListToolbar({
  getData,
  generaldiagnosisOptions = [],
  visusdiagnosisOptions = [],
  mcudiagnosisOptions = [],
  levelOptions = [],
  kelasOptions = [],
  filter = {},
  handleChangeFilter,
  handleChangeFilterStartDate,
  handleChangeFilterEndDate,
  numSelected,
  filterName,
  onFilterName,
}) {
  const theme = useTheme();

  return (
    <Grid container alignItems="center" style={{ padding: 16 }} spacing={1}>
      <Grid item>
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
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
            value={filter.jenjang_id}
            onChange={(e) => handleChangeFilter("jenjang_id", e)}
            label="Jenjang"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {levelOptions.map((level) => (
              <MenuItem key={level.id} value={level.id}>
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
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <InputLabel id="diagnosis-umum-label">Diagnosis Umum</InputLabel>
          <Select
            labelId="diagnosis-umum-label"
            id="diagnosis-umum-select"
            value={filter.diagnosis_name}
            onChange={(e) => handleChangeFilter("diagnosis_name", e)}
            label="Diagnosis Umum"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {generaldiagnosisOptions.map((generaldiagnosis) => (
              <MenuItem key={generaldiagnosis.id} value={generaldiagnosis.id}>
                {generaldiagnosis.diagnosis_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <InputLabel id="diagnosis-mata-label">Diagnosis Mata</InputLabel>
          <Select
            labelId="diagnosis-mata-label"
            id="diagnosis-mata-select"
            value={filter.diagnosis_name}
            onChange={(e) => handleChangeFilter("diagnosis_name", e)}
            label="Diagnosis Mata"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {visusdiagnosisOptions.map((visusdiagnosis) => (
              <MenuItem key={visusdiagnosis.id} value={visusdiagnosis.id}>
                {visusdiagnosis.diagnosis_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ minWidth: 120, width: 200 }}>
          <InputLabel id="diagnosis-mcu-label">Diagnosis MCU</InputLabel>
          <Select
            labelId="diagnosis-mcu-label"
            id="diagnosis-mcu-select"
            value={filter.diagnosis_name}
            onChange={(e) => handleChangeFilter("diagnosis_name", e)}
            label="Diagnosis MCU"
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {mcudiagnosisOptions.map((mcudiagnosis) => (
              <MenuItem key={mcudiagnosis.id} value={mcudiagnosis.id}>
                {mcudiagnosis.diagnosis_name}
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
