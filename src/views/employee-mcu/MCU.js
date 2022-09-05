import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import { useDebounce } from "react-use";
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
  Divider,
  List,
  ListItem,
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
import MCUListHead from "./MCUListHead";
import MCUListToolbar from "./MCUListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
import MCUForm from "./MCUForm";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import ActionConfirmation from "../../components/ActionConfirmation";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Protected from "src/components/Protected";
import useAuth from "src/hooks/useAuth";
import { LoadingButton } from "@material-ui/lab";
import format from "date-fns/format";
import downloadIcon from "@iconify/icons-eva/arrow-circle-down-outline";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Nama", alignRight: false },
  { id: "nik", label: "NIK", alignRight: false },
  { id: "unit", label: "Unit", alignRight: false },
  {
    id: "inspection_date",
    label: "Tanggal Mulai Periksa",
    alignRight: false,
  },
  { id: "blood_pressure", label: "Tekanan Darah", alignRight: false },
  { id: "heart_rate", label: "Detak Jantung", alignRight: false },
  { id: "breathing_ratio", label: "Rasio Pernapasan", alignRight: false },
  { id: "body_temperature", label: "Suhu Tubuh", alignRight: false },
  { id: "sp02", label: "SP02", alignRight: false },
  { id: "weight", label: "Berat Badan", alignRight: false },
  { id: "height", label: "Tinggi Badan", alignRight: false },
  {
    id: "bmi_calculation_results",
    label: "Hasil Perhitungan BMI",
    alignRight: false,
  },
  { id: "bmi_diagnosis", label: "Diagnosis BMI", alignRight: false },
  { id: "file", label: "Dokumen", alignRight: false },
  { id: "diagnosis_name", label: "Diagnosis Umum", alignRight: false },
  { id: "created_at", label: "Tanggal Selesai Periksa", alignRight: false },
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

export default function MCU() {
  const { user, units, roles } = useSelector((state) => state.auth);
  //const {user} = useAuth()
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(1);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filter, setFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openDialog, setopenDialog] = useState(false);
  const [employeeunitOptions, setemployeeunitOptions] = useState([]);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [filters, setfilters] = useState({
    keyword: "",
  });

  //Fungsi GetData Employee MCU
  const getData = async (newPage, newRowsPerPage) => {
    // Cek Id Role
    const rolesData = roles.filter((role) => role.id == "21");

    let role = "";
    if (rolesData.length > 0) {
      role = rolesData[0].id;
    } else {
      role = roles[0].id;
    }

    const params = {
      // unit_id: units && units.length > 0 ? units[0].unit_id : null,
      roles_id: roles && roles.length > 0 ? role : null,
      user_id: user.id,
      keyword: filters.keyword !== "" ? filters.keyword : undefined,
      ...filter,
      page: Number.isInteger(newPage) ? newPage : page,
      rowsPerPage: newRowsPerPage ? newRowsPerPage : rowsPerPage,
    };

    const response = await axios.get(endpoint.employee_mcu.root, {
      params: params,
    });
    if (response && response.data) {
      setdataTable(response.data.data);
      setPage(response.data.current_page);
      setTotalRows(response.data.total);
    }
  };

  //Fungsi GetData Employee Unit

  const getemployeeunitOptions = async () => {
    const response = await axios.get(endpoint.employee_unit.root);
    if (response && response.data) {
      setemployeeunitOptions(response.data);
    }
  };

  const handleChangeFilter = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = undefined;

    value = eventValue.target.value;

    newFilter[fieldName] = value;
    setFilter(newFilter);
  };

  const handleFilter = (fieldName, eventValue) => {
    let newFilter = { ...filters };
    let value = undefined;

    value = eventValue.target.value;

    newFilter[fieldName] = value;
    setfilters(newFilter);
  };

  const handleChangeFilterStartDate = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = undefined;

    if (fieldName == "inspection_date") {
      value = moment(eventValue).format("YYYY-MM-DD");
    } else {
      value = eventValue.target.value;
    }

    newFilter[fieldName] = value;
    setFilter(newFilter);
  };

  const handleChangeFilterEndDate = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = undefined;

    if (fieldName == "created_at") {
      value = moment(eventValue).format("YYYY-MM-DD");
    } else {
      value = eventValue.target.value;
    }

    newFilter[fieldName] = value;
    setFilter(newFilter);
  };

  const downloadFile = (namaFile) => {
    let fileName = namaFile.split("/");
    axios({
      url: endpoint.employee_mcu.download_file,
      method: "GET",
      responseType: "blob", // important
      params: { namaFile: namaFile },
    }).then((response) => {
      console.log("response data", response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", [fileName[1]]);
      document.body.appendChild(link);
      link.click();
    });
  };

  useEffect(() => {
    getData();
    getemployeeunitOptions();
  }, []);

  useDebounce(
    () => {
      if (filters.keyword.trim() != "") {
        // console.log(filters.keyword);
      }
    },
    500,
    [filters.keyword]
  );

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
      <MCUForm
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
        title="Employee MCU"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds,
    };
    const response = await axios.delete(endpoint.employee_mcu.delete, {
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

  const isUserNotFound = filteredData.length === 0;

  // const handleFilterByName = (event) => {
  //   setFilterName(event.target.value);
  // };

  return (
    <Page title="MCU Employee">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            MCU Employee
          </Typography>
        </Grid>
        <Grid item xs={8} container justifyContent="flex-end">
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
      <Card>
        <MCUListToolbar
          getData={getData}
          numSelected={selectedIds.length}
          // filterName={filterName}
          filter={filter}
          filters={filters}
          // onFilterName={handleFilterByName}
          handleFilter={handleFilter}
          handleChangeFilter={handleChangeFilter}
          employeeunitOptions={employeeunitOptions}
          handleChangeFilterStartDate={handleChangeFilterStartDate}
          handleChangeFilterEndDate={handleChangeFilterEndDate}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <MCUListHead
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
                    nik,
                    unit,
                    inspection_date,
                    blood_pressure,
                    heart_rate,
                    breathing_ratio,
                    body_temperature,
                    sp02,
                    weight,
                    height,
                    bmi_calculation_results,
                    bmi_diagnosis,
                    employeemcugeneraldiagnosis = {},
                    file,
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
                            text={nik}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="left">{unit}</TableCell>
                      <TableCell align="left">
                        {format(new Date(inspection_date), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell align="left">{blood_pressure}</TableCell>
                      <TableCell align="left">{heart_rate}</TableCell>
                      <TableCell align="left">{breathing_ratio}</TableCell>
                      <TableCell align="left">{body_temperature}</TableCell>
                      <TableCell align="left">{sp02}</TableCell>
                      <TableCell align="left">{weight}</TableCell>
                      <TableCell align="left">{height}</TableCell>
                      <TableCell align="left">
                        {bmi_calculation_results}
                      </TableCell>
                      <TableCell align="left">{bmi_diagnosis}</TableCell>
                      <TableCell>
                        {file == null || file == "NULL" || file == "" ? (
                          "-"
                        ) : (
                          <IconButton onClick={() => downloadFile(file)}>
                            <Icon icon={downloadIcon} width={50} height={50} />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {employeemcugeneraldiagnosis.map((obj, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj.generaldiagnosis
                                  ? obj.generaldiagnosis.diagnosis_name
                                  : ""}
                              </ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {format(new Date(created_at), "dd-MM-yyyy")}
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
