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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { MButton } from "src/components/@material-extend";

// ----------------------------------------------------------------------

// const RootStyle = styled(Toolbar)(({ theme }) => ({
//   height: 96,
//   display: "flex",
//   justifyContent: "space-between",
//   padding: theme.spacing(0, 1, 0, 3),
// }));

//

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

ActionListToolbar.propTypes = {
  // valueApplication: PropTypes.number,
  // valueApplication: PropTypes.number,
  // onChangeFilterApp: PropTypes.string,
  // onChangeFolterMenu: PropTypes.string,
  // optionsApp: PropTypes.array,
  // optionsMenu: PropTypes.array,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function ActionListToolbar(props) {
  const {
    getData,
    filter = {},
    optionsApp = [],
    optionsMenu = [],
    numSelected,
    filterName,
    onFilterName,
    handleChangeFilter,
  } = props;

  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    // <RootStyle>
    <Grid container alignItems="center" style={{ padding: 16 }} spacing={1}>
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
                sx={{ color: "text.disabled" }}
              />
            </InputAdornment>
          }
        />
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ width: "200px" }}>
          <InputLabel>Application</InputLabel>
          <Select
            name="application_id"
            label="Application"
            value={filter.application_id}
            onChange={(e) => handleChangeFilter("application_id", e)}
          >
            <MenuItem value={undefined}>
              <em>All</em>
            </MenuItem>
            {optionsApp.map((item, index) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="outlined" style={{ width: "200px" }}>
          <InputLabel>Menu</InputLabel>
          <Select
            name="menu_id"
            label="Menu"
            value={filter.menu_id}
            onChange={(e) => handleChangeFilter("menu_id", e)}
          >
            <MenuItem value="">All</MenuItem>
            {optionsMenu.map((menu) => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* value={valueMenu}
      onChange={onChangeFilterMenu} */}

      <Grid item>
        <Button onClick={getData}>Apply</Button>
      </Grid>
      {/* <Button onClick={getData}>Apply</Button> */}
    </Grid>
    // </RootStyle>
  );
}
