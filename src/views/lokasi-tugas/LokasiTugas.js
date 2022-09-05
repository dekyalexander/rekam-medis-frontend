import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import saveOutline from "@iconify/icons-eva/save-outline";
import closeFill from "@iconify/icons-eva/close-fill";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import { useDebounce } from "react-use";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import moment from "moment";

// material
import { useTheme } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Button,
  Grid,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardContent,
  Stack,
} from "@material-ui/core";
import { MButton, MIconButton } from "../../components/@material-extend";
// redux
import { getUserList } from "../../redux/slices/user";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import Page from "../../components/Page";
import Label from "../../components/Label";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import LokasiTugasListHead from "./LokasiTugasListHead";
import LokasiTugasListToolbar from "./LokasiTugasListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
import LokasiTugasForm from "./LokasiTugasForm";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Protected from "src/components/Protected";
import useAuth from "src/hooks/useAuth";
import { LoadingButton } from "@material-ui/lab";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Nama Petugas", alignRight: false },
  { id: "job_location_id", label: "Lokasi UKS", alignRight: false },
  { id: "created_at", label: "Tanggal & Waktu", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function LokasiTugas() {
  const { user } = useAuth();
  const theme = useTheme();
  //const dispatch = useDispatch();
  //const { userList } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(1);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("officer_name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [filters, setfilters] = useState({
    keyword: "",
  });
  {
    /* 
  const [ukslocationOptions, setukslocationOptions] = useState([]);
  const [userOptions, setuserOptions] = useState([]);
  */
  }
  {
    /* 
  const [isSubmitting, setisSubmitting] = useState(false);
  const [actionCode, setactionCode] = useState("CREATE");
  */
  }
  {
    /*
  const [stateLocation, setstate] = useState({
    location_id: "",
    uks_name: "",
    job_location_id: "",
    officer_name: "",
    job_location: "",
  });
*/
  }

  //Fungsi GetData Officer Registration
  const getData = async (newPage, newRowsPerPage) => {
    const params = {
      ...filter,
      keyword: filters.keyword !== "" ? filters.keyword : undefined,
      page: Number.isInteger(newPage) ? newPage : page,
      rowsPerPage: newRowsPerPage ? newRowsPerPage : rowsPerPage,
    };

    const response = await axios.get(endpoint.officer_registration.root, {
      params: params,
    });
    if (response && response.data) {
      setdataTable(response.data.data);
      setPage(response.data.current_page);
      setTotalRows(response.data.total);
    }
  };
  {
    /*
  //Fungsi GetData Location
  const getukslocationOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.uks_location.root, {
      params: params,
    });
    if (response && response.data) {
      setukslocationOptions(response.data);
    }
  };
  */
  }
  {
    /*
  //Fungsi GetData User
  const getuserOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.user.option, { params: params });
    if (response && response.data) {
      setuserOptions(response.data);
    }
  };
  */
  }
  useEffect(() => {
    //getukslocationOptions();
    getData();
    //getuserOptions();
  }, []);

  const submitSuccess = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
  };

  const submitError = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
  };

  const handleClose = () => {
    setopenDialog(false);
  };

  const showDialog = (actionCode, rowParam) => {
    let row = undefined;
    if (rowParam) {
      row = rowParam;
    } else {
      row = selectedRow;
    }
    setMaxWidth("md");
    setdialogContent(
      <LokasiTugasForm
        row={row}
        getData={getData}
        actionCode={actionCode}
        submitSuccess={submitSuccess}
        submitError={submitError}
        closeMainDialog={handleClose}
      />
    );

    setopenDialog(true);
  };

  const showDeleteConfirmation = () => {
    setMaxWidth("sm");
    setdialogContent(
      <DeleteConfirmation
        handleClose={handleClose}
        handleDelete={handleDelete}
        selectedIds={selectedIds}
        title="Lokasi Tugas"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds,
    };
    const response = await axios.delete(endpoint.officer_registration.delete, {
      data: params,
    });
    if (response) {
      submitSuccess("delete data success");
      getData();
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((data) => data.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (event, id, row) => {
    if (selectedIds.includes(row.id)) {
      const ids = selectedIds.filter((item) => item !== row.id);
      setSelectedIds(ids);

      if (ids.length === 1) {
        const existingRow = dataTable.filter((data) => data.id === ids[0]);
        setSelectedRow(existingRow[0]);
      } else {
        setSelectedRow(null);
      }
    } else {
      setSelectedIds([...selectedIds, row.id]);
      setSelectedRow(row);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
    getData(newPage + 1, null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
    getData(1, +event.target.value);
  };

  const filteredData = applySortFilter(
    dataTable,
    getComparator(order, orderBy),
    filterName
  );

  // const handleFilterByName = (event) => {
  //   setFilterName(event.target.value);
  // };

  const handleFilter = (fieldName, eventValue) => {
    let newFilter = { ...filters };
    let value = undefined;

    value = eventValue.target.value;

    newFilter[fieldName] = value;
    setfilters(newFilter);
  };

  const isUserNotFound = filteredData.length === 0;

  {
    /*
  //Fungsi Submit Location
  const submit = async () => {
    const params = {
      officer_name: stateLocation.officer_name,
      job_location: stateLocation.job_location,
    };

    if (actionCode === "CREATE") {
      const response = await axios.post(
        endpoint.officer_registration.create,
        params
      );
      console.log(response);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };
  */
  }
  {
    /*
  //Fungsi GetData Select
  const handleChange = (fieldName, eventValue) => {
    let newState = { ...stateLocation };
    let value = eventValue.target.value;
    if (fieldName === "id") {
      getukslocationOptions(value);
      getuserOptions(value);
    }
    newState[fieldName] = value;
    setstate(newState);
  };
  */
  }

  return (
    <Page title="Register Petugas UKS">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            Register Petugas UKS
          </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          {selectedIds.length > 0 && (
            <Protected allowedCodes={["DELETE"]}>
              <MButton
                variant="contained"
                color="error"
                style={{ margin: "0 8px" }}
                onClick={showDeleteConfirmation}
              >
                Delete
              </MButton>
            </Protected>
          )}
          {selectedIds.length === 1 && (
            <Protected allowedCodes={["EDIT"]}>
              <MButton
                variant="contained"
                color="info"
                style={{ margin: "0 8px" }}
                onClick={() => showDialog("EDIT")}
              >
                Edit
              </MButton>
            </Protected>
          )}
          <Protected allowedCodes={["CREATE"]}>
            <MButton
              variant="contained"
              color="primary"
              style={{ margin: "0 8px" }}
              onClick={() => showDialog("CREATE")}
            >
              Add
            </MButton>
          </Protected>
        </Grid>
      </Grid>
      <Stack spacing={2}>
        {/* 
        <Card>
          <CardContent>
            <FormControl fullWidth>
              <Stack direction="row" spacing={3}>
                <FormControl style={{ minWidth: 120, width: "50%" }}>
                  <InputLabel id="uks-lokasi-tugas">
                    Pilih Lokasi Tugas
                  </InputLabel>
                  <Select
                    sx={{ width: 450 }}
                    labelId="lokasi-tugas"
                    id="uks-lokasi-tugas"
                    value={stateLocation.job_location}
                    onChange={(e) => handleChange("job_location", e)}
                    label="Pilih Lokasi Tugas"
                  >
                    {ukslocationOptions.map((uks_location) => (
                      <MenuItem
                        key={uks_location.id}
                        value={uks_location.uks_name}
                      >
                        {uks_location.uks_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ minWidth: 120, width: "50%" }}>
                  <InputLabel id="uks-nama-petugas">
                    Pilih Nama Petugas
                  </InputLabel>
                  <Select
                    sx={{ width: 450 }}
                    labelId="nama-petugas"
                    id="uks-nama-petugas"
                    value={stateLocation.officer_name}
                    onChange={(e) => handleChange("officer_name", e)}
                    label="Pilih Nama Petugas"
                  >
                    {userOptions.map((user) => (
                      <MenuItem key={user.id} value={user.name}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Protected allowedCodes={["CREATE"]}>
                  <LoadingButton
                    sx={{
                      width: 50,
                      alignContent: "flex-end",
                      bgcolor: "secondary.main",
                    }}
                    type="submit"
                    variant="contained"
                    pending={isSubmitting}
                    onClick={submit}
                  >
                    <Icon icon={saveOutline} width={20} height={20} /> Save
                  </LoadingButton>
                </Protected>
              </Stack>
            </FormControl>
          </CardContent>
        </Card>

                  */}

        <Card>
          <LokasiTugasListToolbar
            getData={getData}
            numSelected={selectedIds.length}
            filters={filters}
            handleFilter={handleFilter}
            // filterName={filterName}
            // onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <LokasiTugasListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selectedIds.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredData.map((row) => {
                    const {
                      id,
                      name,
                      // job_location,
                      listofukslocations = {},
                      created_at,
                    } = row;
                    const isItemSelected = selectedIds.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        onClick={(event) => handleClick(event, id, row)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Box
                            sx={{
                              py: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <ClickableText
                              variant="subtitle2"
                              onClick={() => showDialog("READ", row)}
                              text={name}
                            />
                          </Box>
                        </TableCell>
                        {/* <TableCell align="left">{job_location}</TableCell> */}
                        <TableCell align="left">
                          {listofukslocations && listofukslocations.uks_name}
                        </TableCell>
                        <TableCell align="left">
                          {format(new Date(created_at), "dd-MM-yyyy HH:mm:ss")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Stack>
      <Dialog
        open={openDialog}
        maxWidth={maxWidth}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        {dialogContent}
      </Dialog>
    </Page>
  );
}
