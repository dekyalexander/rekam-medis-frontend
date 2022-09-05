import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import parseISO from "date-fns/parseISO";
import moment from "moment";
import format from "date-fns/format";

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
import RecapDiagnosisListHead from "./RecapDiagnosisListHead";
import RecapDiagnosisListToolbar from "./RecapDiagnosisListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
// import RecapDiagnosisForm from "./RecapDiagnosisForm";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
// import DeleteConfirmation from "../../components/DeleteConfirmation";
import Protected from "src/components/Protected";
import { LoadingButton } from "@material-ui/lab";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "niy", label: "NIY", alignRight: false },
  { id: "name", label: "Nama", alignRight: false },
  // { id: "level", label: "Jenjang", alignRight: false },
  { id: "jenjang", label: "Jenjang", alignRight: false },
  { id: "kelas", label: "Kelas", alignRight: false },
  // { id: "generaldiagnosis", label: "Diagnosis Umum", alignRight: false },
  // { id: "visusdiagnosis", label: "Diagnosis Mata", alignRight: false },
  // { id: "mcudiagnosis", label: "Diagnosis MCU", alignRight: false },
  {
    id: "studentmcugeneraldiagnosis",
    label: "Diagnosis Umum",
    alignRight: false,
  },
  { id: "studentmcueyediagnosis", label: "Diagnosis Mata", alignRight: false },
  {
    id: "studentmcudentalandoraldiagnosis",
    label: "Diagnosis Gigi Dan Mulut",
    alignRight: false,
  },
  { id: "inspection_date", label: "Tanggal Mulai Periksa", alignRight: false },
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

export default function RecapDiagnosis() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filter, setFilter] = useState({});
  const [generaldiagnosisOptions, setgeneraldiagnosisOptions] = useState([]);
  const [mcudiagnosisOptions, setmcudiagnosisOptions] = useState([]);
  const [visusdiagnosisOptions, setvisusdiagnosisOptions] = useState([]);
  const [levelOptions, setlevelOptions] = useState([]);
  const [kelasOptions, setkelasOptions] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loadExcel, setLoadExcel] = useState(false);
  const [filters, setfilters] = useState({
    keyword: "",
    kelas_id: "",
    jenjang_id: "",
  });

  const getData = async () => {
    const params = { ...filter };
    const response = await axios.get(
      endpoint.student_recap_diagnosis.root_recap_mcu,
      {
        params: params,
      }
    );
    if (response && response.data) {
      setdataTable(response.data);
    }
    console.log(response);
  };

  const getExport = async (exportType) => {
    startLoading(exportType);
    const params = {
      ...filter,
      level: filter.level,
      kelas: filter.kelas,
      general_diagnosis: filter.general_diagnosis,
      eye_diagnosis: filter.eye_diagnosis,
      dental_diagnosis: filter.dental_diagnosis,
      inspection_date: filter.inspection_date,
      created_at: filter.created_at,
    };
    const response = await axios.get(
      endpoint.student_recap_diagnosis.export_mcu,
      {
        params: params,
      }
    );
    if (exportType) {
      downloadFile(
        endpoint.student_recap_diagnosis.export_mcu,
        exportType,
        params
      );
    }
    if (response) {
      submitSuccess("Export excel success");
    } else {
      submitError("Export excel failed");
    }
    stopLoading(exportType);
  };

  const getgeneraldiagnosisOptions = async () => {
    const response = await axios.get(endpoint.diagnosis_general.root);
    if (response && response.data) {
      setgeneraldiagnosisOptions(response.data);
    }
  };

  const getmcudiagnosisOptions = async () => {
    const response = await axios.get(endpoint.diagnosis_mcu.root);
    if (response && response.data) {
      setmcudiagnosisOptions(response.data);
    }
  };

  const getvisusdiagnosisOptions = async () => {
    const response = await axios.get(endpoint.diagnosis_eyes.root);
    if (response && response.data) {
      setvisusdiagnosisOptions(response.data);
    }
  };

  const getlevelOptions = async () => {
    const response = await axios.get(endpoint.jenjang.option);
    if (response && response.data) {
      setlevelOptions(response.data);
    }
  };

  const getkelasOptions = async (jenjang_id) => {
    const params = {
      jenjang_id: jenjang_id,
    };
    const response = await axios.get(endpoint.kelas.option, { params: params });
    if (response && response.data) {
      setkelasOptions(response.data);
    }
  };

  // const handleChangeFilter = (fieldName, eventValue) => {
  //   let newFilter = { ...filter };
  //   let value = null;

  //   value = eventValue.target.value;

  //   if (fieldName === "level") {
  //     getlevelOptions();
  //     newFilter["level"] = null;
  //   } else if (fieldName === "kelas") {
  //     getkelasOptions();
  //     newFilter["kelas"] = null;
  //   } else if (fieldName === "general_diagnosis") {
  //     getgeneraldiagnosisOptions();
  //     newFilter["general_diagnosis"] = null;
  //   } else if (fieldName === "eye_diagnosis") {
  //     getvisusdiagnosisOptions();
  //     newFilter["eye_diagnosis"] = null;
  //   } else if (fieldName === "dental_diagnosis") {
  //     getmcudiagnosisOptions();
  //     newFilter["dental_diagnosis"] = null;
  //   }

  //   newFilter[fieldName] = value;
  //   setFilter(newFilter);
  // };

  const handleChangeFilter = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = null;

    value = eventValue.target.value;

    if (fieldName === "level") {
      getlevelOptions();
      newFilter["level"] = null;
    } else if (fieldName === "kelas") {
      getkelasOptions();
      newFilter["kelas"] = null;
    } else if (fieldName === "diagnosis_name") {
      getgeneraldiagnosisOptions();
      newFilter["diagnosis_name"] = null;
    } else if (fieldName === "diagnosis_name") {
      getvisusdiagnosisOptions();
      newFilter["diagnosis_name"] = null;
    } else if (fieldName === "diagnosis_name") {
      getmcudiagnosisOptions();
      newFilter["diagnosis_name"] = null;
    } else if (fieldName === "jenjang_id") {
      value = eventValue.target.value;
      if (value !== null) {
        getkelasOptions(value);
      } else {
        setkelasOptions([]);
      }
    }

    newFilter[fieldName] = value;
    setFilter(newFilter);
  };

  const handleChangeFilterStartDate = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = undefined;

    if (fieldName == "inspection_date") {
      value = moment(eventValue).format("YYYY-MM-DD");
      newFilter["inspection_date"] = null;
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
      newFilter["created_at"] = null;
    } else {
      value = eventValue.target.value;
    }

    newFilter[fieldName] = value;
    setFilter(newFilter);
  };

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

  // const handleClose = () => {
  //   setopenDialog(false);
  // };

  // const showDialog = (actionCode, rowParam) => {
  //   let row = undefined;
  //   if (rowParam) {
  //     row = rowParam;
  //   } else {
  //     row = selectedRow;
  //   }
  //   setMaxWidth("md");
  //   setdialogContent(
  //     <RecapDiagnosisForm
  //       row={row}
  //       getData={getData}
  //       actionCode={actionCode}
  //       submitSuccess={submitSuccess}
  //       submitError={submitError}
  //       closeMainDialog={handleClose}
  //     />
  //   );

  //   setopenDialog(true);
  // };

  // const showDeleteConfirmation = () => {
  //   setMaxWidth("sm");
  //   setdialogContent(
  //     <DeleteConfirmation
  //       handleClose={handleClose}
  //       handleDelete={handleDelete}
  //       selectedIds={selectedIds}
  //       title="RecapDiagnosis"
  //     />
  //   );

  //   setopenDialog(true);
  // };

  // const handleDelete = async () => {
  //   const params = {
  //     ids: selectedIds,
  //   };
  //   const response = await axios.delete(endpoint.menu.root, { data: params });
  //   if (response) {
  //     submitSuccess("delete data success");
  //     getData();
  //   }
  // };

  const downloadFile = async (url, student_mcu_recap_diagnosis, params) => {
    await axios
      .get(url, {
        params: params,
        responseType: "blob",
      })
      .then((rsp) => {
        const url = window.URL.createObjectURL(new Blob([rsp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "student_mcu_recap_diagnosis.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(url);
        console.log(error);
        return { error: error };
      });
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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    console.log(setFilterName);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

  const filteredData = applySortFilter(
    dataTable,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredData.length === 0;

  useEffect(() => {
    getgeneraldiagnosisOptions();
    getvisusdiagnosisOptions();
    getmcudiagnosisOptions();
    getlevelOptions();
    getkelasOptions();
    getData();
  }, []);

  const startLoading = (exportType) => {
    if (exportType) {
      setLoadExcel(true);
    }
  };

  const stopLoading = (exportType) => {
    if (exportType) {
      setLoadExcel(false);
    }
  };

  return (
    <Page title="Student MCU Report">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h6" component="h6">
            Student MCU Report
          </Typography>
        </Grid>
        <Grid item xs={8} container justifyContent="flex-end">
          {/* {selectedIds.length > 0 && (
            <Protected allowedCodes={["EDIT"]}>
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
              New Menu
            </MButton>
          </Protected> */}
          {/* <LoadingButton
            size="medium"
            type="button"
            variant="contained"
            style={{ margin: "0 8px" }}
            onClick={getExport}
            pending={loadExcel}
          >
            EXCEL
          </LoadingButton> */}

          <LoadingButton
            size="medium"
            color="info"
            variant="outlined"
            style={{ margin: "0 8px" }}
            onClick={getExport}
            pending={loadExcel}
          >
            EXCEL
          </LoadingButton>
        </Grid>
      </Grid>
      <Card>
        <RecapDiagnosisListToolbar
          getData={getData}
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          generaldiagnosisOptions={generaldiagnosisOptions}
          visusdiagnosisOptions={visusdiagnosisOptions}
          mcudiagnosisOptions={mcudiagnosisOptions}
          handleChangeFilterStartDate={handleChangeFilterStartDate}
          handleChangeFilterEndDate={handleChangeFilterEndDate}
          levelOptions={levelOptions}
          kelasOptions={kelasOptions}
          numSelected={selectedIds.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <RecapDiagnosisListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataTable.length}
                numSelected={selectedIds.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      niy,
                      name,
                      // level,
                      jenjang = {},
                      kelas = {},
                      // generaldiagnosis = {},
                      // visusdiagnosis = {},
                      // mcudiagnosis = {},
                      studentmcugeneraldiagnosis = {},
                      studentmcueyediagnosis = {},
                      studentmcudentalandoraldiagnosis = {},
                      inspection_date,
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
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell> */}
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
                              // onClick={() => showDialog("READ", row)}
                              text={niy}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="left">{name}</TableCell>
                        {/* <TableCell align="left">{level}</TableCell> */}
                        <TableCell align="left">
                          {jenjang && jenjang.code}
                        </TableCell>
                        <TableCell align="left">
                          {kelas && kelas.code}
                        </TableCell>
                        {/* <TableCell align="left">
                          {generaldiagnosis && generaldiagnosis.diagnosis_name}
                        </TableCell>
                        <TableCell align="left">
                          {visusdiagnosis && visusdiagnosis.diagnosis_name}
                        </TableCell>
                        <TableCell align="left">
                          {mcudiagnosis && mcudiagnosis.diagnosis_name}
                        </TableCell> */}
                        <TableCell align="left">
                          {studentmcugeneraldiagnosis.map((obj1, index) => {
                            return (
                              <List key={index}>
                                <ListItem>
                                  {obj1.generaldiagnosis
                                    ? obj1.generaldiagnosis.diagnosis_name
                                    : ""}
                                </ListItem>
                                <Divider color="secondary" />
                              </List>
                            );
                          })}
                        </TableCell>
                        <TableCell align="left">
                          {studentmcueyediagnosis.map((obj2, index) => {
                            return (
                              <List key={index}>
                                <ListItem>
                                  {obj2.visusdiagnosis
                                    ? obj2.visusdiagnosis.diagnosis_name
                                    : ""}
                                </ListItem>
                                <Divider color="secondary" />
                              </List>
                            );
                          })}
                        </TableCell>
                        <TableCell align="left">
                          {studentmcudentalandoraldiagnosis.map(
                            (obj3, index) => {
                              return (
                                <List key={index}>
                                  <ListItem>
                                    {obj3.mcudiagnosis
                                      ? obj3.mcudiagnosis.diagnosis_name
                                      : ""}
                                  </ListItem>
                                  <Divider color="secondary" />
                                </List>
                              );
                            }
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {format(new Date(inspection_date), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell align="left">
                          {format(new Date(created_at), "dd-MM-yyyy")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
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
          count={dataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      {/* <Dialog
        open={openDialog}
        maxWidth={maxWidth}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        {dialogContent}
      </Dialog> */}
    </Page>
  );
}
