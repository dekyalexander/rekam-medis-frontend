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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Nama", alignRight: false },
  { id: "niy", label: "NIY", alignRight: false },
  // { id: "level", label: "Jenjang", alignRight: false },
  // { id: "kelas", label: "Kelas", alignRight: false },
  { id: "jenjang", label: "Jenjang", alignRight: false },
  { id: "kelas", label: "Kelas", alignRight: false },
  { id: "school_year", label: "Tahun Ajaran", alignRight: false },
  { id: "gender", label: "Jenis Kelamin", alignRight: false },
  { id: "age", label: "Umur", alignRight: false },
  {
    id: "inspection_date",
    label: "Tanggal Mulai Periksa",
    alignRight: false,
  },
  // { id: "od_eyes", label: "Ocular Dextra", alignRight: false },
  // { id: "os_eyes", label: "Ocular Sinistra", alignRight: false },
  // { id: "color_blind", label: "Buta Warna", alignRight: false },
  // { id: "eye_diagnosis", label: "Diagnosis Mata", alignRight: false },
  // { id: "visusdiagnosis", label: "Diagnosis Mata", alignRight: false },

  { id: "blood_pressure", label: "Tekanan Darah", alignRight: false },
  { id: "pulse", label: "Nadi", alignRight: false },
  { id: "respiration", label: "Pernapasan", alignRight: false },
  { id: "temperature", label: "Suhu", alignRight: false },
  // { id: "general_diagnosis", label: "Diagnosis Umum", alignRight: false },
  // { id: "generaldiagnosis", label: "Diagnosis Umum", alignRight: false },

  // { id: "dental_occlusion", label: "Oklusi Gigi", alignRight: false },
  // { id: "tooth_gap", label: "Celah Gigi", alignRight: false },
  // { id: "crowding_teeth", label: "Berjejal Gigi", alignRight: false },
  // { id: "dental_debris", label: "Debris Gigi", alignRight: false },
  // { id: "tartar", label: "Karang Gigi", alignRight: false },
  // { id: "tooth_abscess", label: "Abses Gigi", alignRight: false },
  // { id: "tongue", label: "Lidah", alignRight: false },
  // { id: "other", label: "Lainnya Gigi", alignRight: false },
  // { id: "dental_diagnosis", label: "Diagnosis Gigi", alignRight: false },
  // { id: "mcudiagnosis", label: "Diagnosis Gigi", alignRight: false },
  { id: "weight", label: "Berat Badan", alignRight: false },
  { id: "height", label: "Tinggi Badan", alignRight: false },
  {
    id: "bmi_calculation_results",
    label: "Hasil Perhitungan BMI",
    alignRight: false,
  },
  { id: "bmi_diagnosis", label: "Diagnosis BMI", alignRight: false },

  { id: "lk", label: "Lingkar Kepala", alignRight: false },
  { id: "lila", label: "Lingkar Lengan Atas", alignRight: false },
  {
    id: "conclusion_lk",
    label: "Kesimpulan Lingkar Kepala",
    alignRight: false,
  },
  {
    id: "conclusion_lila",
    label: "Kesimpulan Lingkar Lengan Atas",
    alignRight: false,
  },
  {
    id: "studentmcueyediagnosis",
    label: "Diagnosis Mata",
    alignRight: false,
  },
  {
    id: "studentmcugeneraldiagnosis",
    label: "Diagnosis Umum",
    alignRight: false,
  },
  {
    id: "studentmcudentalandoraldiagnosis",
    label: "Diagnosis Gigi Dan Mulut",
    alignRight: false,
  },
  { id: "suggestion", label: "Saran", alignRight: false },
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
  const { user, roles } = useSelector((state) => state.auth);
  //const {user} = useAuth()
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(1);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [levelOptions, setlevelOptions] = useState([]);
  const [kelasOptions, setkelasOptions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filter, setFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [filters, setfilters] = useState({
    keyword: "",
  });

  //Fungsi GetData Student MCU
  const getData = async (newPage, newRowsPerPage) => {
    // const rolesData = roles.filter((role) => role.code == "UKS");

    // let role = "";
    // if (rolesData.length > 0) {
    //   role = rolesData[0].code;
    // } else {
    //   role = roles[0].code;
    // }

    // Cek Id Role
    const rolesData = roles.filter((role) => role.id == "21");

    let role = "";
    if (rolesData.length > 0) {
      role = rolesData[0].id;
    } else {
      role = roles[0].id;
    }

    const params = {
      roles_id: roles && roles.length > 0 ? role : null,
      user_id: user.id,
      keyword: filters.keyword !== "" ? filters.keyword : undefined,
      ...filter,
      page: Number.isInteger(newPage) ? newPage : page,
      rowsPerPage: newRowsPerPage ? newRowsPerPage : rowsPerPage,
    };

    const response = await axios.get(endpoint.student_mcu.root, {
      params: params,
    });
    if (response && response.data) {
      setdataTable(response.data.data);
      setPage(response.data.current_page);
      setTotalRows(response.data.total);
    }
    // console.log(response);
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
  //   let value = undefined;

  //   value = eventValue.target.value;

  //   newFilter[fieldName] = value;
  //   setFilter(newFilter);
  // };

  const handleChangeFilter = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = null;

    value = eventValue.target.value;

    if (fieldName === "jenjang_id") {
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

  useEffect(() => {
    getData();
    getlevelOptions();
    // getkelasOptions();
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
        title="Student MCU"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds,
    };
    const response = await axios.delete(endpoint.student_mcu.delete, {
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
    <Page title="Student MCU">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            Student MCU
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
          levelOptions={levelOptions}
          kelasOptions={kelasOptions}
          handleChangeFilter={handleChangeFilter}
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
                    // student = {},
                    name,
                    niy,
                    // level,
                    // kelas,
                    jenjang = {},
                    kelas = {},
                    school_year,
                    inspection_date,
                    // od_eyes,
                    // os_eyes,
                    // color_blind,
                    // eye_diagnosis,
                    blood_pressure,
                    pulse,
                    respiration,
                    temperature,
                    // general_diagnosis,
                    // dental_occlusion,
                    // tooth_gap,
                    // crowding_teeth,
                    // dental_debris,
                    // tartar,
                    // tooth_abscess,
                    // tongue,
                    // other,
                    // dental_diagnosis,
                    studentexamination = {},
                    // bmidiagnosis = {},
                    // visusdiagnosis = {},
                    // mcudiagnosis = {},
                    // generaldiagnosis = {},
                    studentmcugeneraldiagnosis = {},
                    studentmcueyediagnosis = {},
                    studentmcudentalandoraldiagnosis = {},
                    suggestion,
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
                      {/* <TableCell align="left">
                          {student && student.name}
                        </TableCell> */}
                      <TableCell align="left">{niy}</TableCell>
                      {/* <TableCell align="left">{level}</TableCell>
                        <TableCell align="left">{kelas}</TableCell> */}
                      <TableCell align="left">
                        {jenjang && jenjang.code}
                      </TableCell>
                      <TableCell align="left">{kelas && kelas.code}</TableCell>
                      <TableCell align="left">{school_year}</TableCell>
                      <TableCell align="left">
                        {studentexamination && studentexamination.gender}
                      </TableCell>
                      <TableCell align="left">
                        {studentexamination && studentexamination.age}
                      </TableCell>
                      <TableCell align="left">
                        {format(new Date(inspection_date), "dd-MM-yyyy")}
                      </TableCell>
                      {/* <TableCell align="left">{od_eyes}</TableCell>
                        <TableCell align="left">{os_eyes}</TableCell>
                        <TableCell align="left">{color_blind}</TableCell> */}
                      {/* <TableCell align="left">{eye_diagnosis}</TableCell> */}
                      {/* <TableCell align="left">
                          {visusdiagnosis && visusdiagnosis.diagnosis_name}
                        </TableCell> */}

                      <TableCell align="left">{blood_pressure}</TableCell>
                      <TableCell align="left">{pulse}</TableCell>
                      <TableCell align="left">{respiration}</TableCell>
                      <TableCell align="left">{temperature}</TableCell>
                      {/* <TableCell align="left">{general_diagnosis}</TableCell> */}
                      {/* <TableCell align="left">
                          {generaldiagnosis && generaldiagnosis.diagnosis_name}
                        </TableCell> */}

                      {/* <TableCell align="left">{dental_occlusion}</TableCell>
                        <TableCell align="left">{tooth_gap}</TableCell>
                        <TableCell align="left">{crowding_teeth}</TableCell>
                        <TableCell align="left">{dental_debris}</TableCell>
                        <TableCell align="left">{tartar}</TableCell>
                        <TableCell align="left">{tooth_abscess}</TableCell>
                        <TableCell align="left">{tongue}</TableCell>
                        <TableCell align="left">{other}</TableCell> */}
                      {/* <TableCell align="left">{dental_diagnosis}</TableCell> */}
                      {/* <TableCell align="left">
                          {mcudiagnosis && mcudiagnosis.diagnosis_name}
                        </TableCell> */}

                      <TableCell align="left">
                        {studentexamination && studentexamination.weight}
                      </TableCell>
                      <TableCell align="left">
                        {studentexamination && studentexamination.height}
                      </TableCell>
                      <TableCell align="left">
                        {studentexamination &&
                          studentexamination.bmi_calculation_results}
                      </TableCell>
                      {/* <TableCell align="left">
                          {studentexamination &&
                            studentexamination.bmi_diagnosis}
                        </TableCell> */}
                      {/* <TableCell align="left">
                          {studentexamination.bmidiagnosis.diagnosis_name}
                        </TableCell> */}
                      <TableCell align="left">
                        {studentexamination && studentexamination.bmi_diagnosis}
                      </TableCell>

                      <TableCell align="left">
                        {studentexamination && studentexamination.lk}
                      </TableCell>
                      <TableCell align="left">
                        {studentexamination && studentexamination.lila}
                      </TableCell>
                      <TableCell align="left">
                        {studentexamination && studentexamination.conclusion_lk}
                      </TableCell>
                      <TableCell align="left">
                        {studentexamination &&
                          studentexamination.conclusion_lila}
                      </TableCell>
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
                        {studentmcudentalandoraldiagnosis.map((obj3, index) => {
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
                        })}
                      </TableCell>
                      <TableCell align="left">{suggestion}</TableCell>
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
