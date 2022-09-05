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
  Divider,
  List,
  ListItem,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import MedicalHistoryListHead from "./MedicalHistoryListHead";
import MedicalHistoryListToolbar from "./MedicalHistoryListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
import MedicalHistoryForm from "./MedicalHistoryForm";
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
  { id: "level", label: "Jenjang", alignRight: false },
  { id: "kelas", label: "Kelas", alignRight: false },
  { id: "blood_group", label: "Golongan Darah", alignRight: false },
  {
    id: "blood_group_rhesus",
    label: "Golongan Darah Rhesus",
    alignRight: false,
  },
  {
    id: "history_of_drug_allergy",
    label: "Riwayat Alergi Obat",
    alignRight: false,
  },
  {
    id: "covid19_illness_history",
    label: "Riwayat Covid19",
    alignRight: false,
  },
  {
    id: "covid19_sick_date",
    label: "Tanggal Sakit Covid19",
    alignRight: false,
  },
  {
    id: "history_of_comorbidities",
    label: "Riwayat Penyakit Penyerta",
    alignRight: false,
  },
  {
    id: "past_medical_history",
    label: "Riwayat Penyakit Dahulu",
    alignRight: false,
  },
  {
    id: "family_history_of_illness",
    label: "Riwayat Keluarga",
    alignRight: false,
  },
  // { id: "vaccine_history", label: "Vaksin Covid19", alignRight: false },
  // {
  //   id: "description",
  //   label: "Keterangan Belum Vaksin Covid19",
  //   alignRight: false,
  // },
  { id: "covid19_vaccine_history", label: "Vaksin Covid19", alignRight: false },
  {
    id: "covid19_vaccine_description",
    label: "Keterangan Belum Vaksin Covid19",
    alignRight: false,
  },
  { id: "vaccine_to", label: "Vaksin Covid19 Ke", alignRight: false },
  { id: "vaccine_date", label: "Tanggal Vaksin Covid19", alignRight: false },
  { id: "weight", label: "Berat Badan", alignRight: false },
  { id: "height", label: "Tinggi Badan", alignRight: false },
  {
    id: "head_circumference",
    label: "Lingkar Kepala",
    alignRight: false,
  },
  { id: "month", label: "Bulan Lahir", alignRight: false },
  { id: "birth_condition", label: "Kondisi Lahir", alignRight: false },
  { id: "indication", label: "Indikasi", alignRight: false },
  { id: "type_of_immunization", label: "Tipe Imunisasi", alignRight: false },
  { id: "immunization_date", label: "Tanggal Imunisasi", alignRight: false },
  { id: "value", label: "Jumlah Imunisasi", alignRight: false },
  { id: "hospital_name", label: "Riwayat Rawat Inap", alignRight: false },
  { id: "date_treated", label: "Tanggal Rawat Inap", alignRight: false },
  { id: "diagnosis", label: "Diagnosa Rawat Inap", alignRight: false },
  {
    id: "other_diagnosis",
    label: "Diagnosa Lain Rawat Inap",
    alignRight: false,
  },

  { id: "created_at", label: "Tanggal", alignRight: false },
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
  const stabilizedThis = array && array.map((el, index) => [el, index]);
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

export default function MedicalHistory() {
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

  //Fungsi GetData Medical History Student
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

    const response = await axios.get(endpoint.medical_history_student.root, {
      params: params,
    });
    if (response && response.data) {
      setdataTable(response.data.data);
      setPage(response.data.current_page);
      setTotalRows(response.data.total);
    }
    // console.log(response.data);
  };

  const getlevelOptions = async () => {
    const response = await axios.get(endpoint.jenjang.option);
    if (response && response.data) {
      setlevelOptions(response.data);
    }
  };

  const getkelasOptions = async () => {
    const response = await axios.get(endpoint.kelas.option);
    if (response && response.data) {
      setkelasOptions(response.data);
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

  useEffect(() => {
    getData();
    getlevelOptions();
    getkelasOptions();
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
      <MedicalHistoryForm
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
        title="Medical History Student"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds,
    };
    const response = await axios.delete(
      endpoint.medical_history_student.delete,
      {
        data: params,
      }
    );
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
    <Page title="Medical History Student">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            Medical History Student
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
        <MedicalHistoryListToolbar
          getData={getData}
          filter={filter}
          filters={filters}
          handleFilter={handleFilter}
          handleChangeFilter={handleChangeFilter}
          levelOptions={levelOptions}
          kelasOptions={kelasOptions}
          numSelected={selectedIds.length}
          // filterName={filterName}
          // onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <MedicalHistoryListHead
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
                    level,
                    kelas,
                    history_of_drug_allergy,
                    blood_group,
                    blood_group_rhesus,
                    covid19_illness_history,
                    covid19_sick_date,
                    covid19_vaccine_history,
                    covid19_vaccine_description,
                    studenthistoryofcomorbidities = {},
                    studentfamilyhistoryofillness = {},
                    studentpastmedicalhistory = {},
                    studentcovid19vaccinehistory = {},
                    studentbirthtimedata = {},
                    basicimmunizationhistory = {},
                    studenthospitalizationhistory = {},
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
                      <TableCell align="left">{level}</TableCell>
                      <TableCell align="left">{kelas}</TableCell>
                      <TableCell align="left">{blood_group}</TableCell>
                      <TableCell align="left">{blood_group_rhesus}</TableCell>
                      <TableCell align="left">
                        {history_of_drug_allergy}
                      </TableCell>
                      <TableCell align="left">
                        {covid19_illness_history}
                      </TableCell>
                      <TableCell align="left">{covid19_sick_date}</TableCell>
                      <TableCell align="left">
                        {studenthistoryofcomorbidities.map((obj1, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj1.history_of_comorbidities}
                              </ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studentfamilyhistoryofillness.map((obj2, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj2.family_history_of_illness}
                              </ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studentpastmedicalhistory.map((obj3, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj3.past_medical_history}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      {/* <TableCell align="left">
                          {studentcovid19vaccinehistory &&
                            studentcovid19vaccinehistory.vaccine_history}
                        </TableCell>
                        <TableCell align="left">
                          {studentcovid19vaccinehistory &&
                            studentcovid19vaccinehistory.description}
                        </TableCell>
                        <TableCell align="left">
                          {studentcovid19vaccinehistory &&
                            studentcovid19vaccinehistory.vaccine_date}
                        </TableCell> */}
                      <TableCell align="left">
                        {covid19_vaccine_history}
                      </TableCell>
                      <TableCell align="left">
                        {covid19_vaccine_description}
                      </TableCell>
                      <TableCell align="left">
                        {studentcovid19vaccinehistory.map((obj4, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj4.vaccine_to}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studentcovid19vaccinehistory.map((obj5, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj5.vaccine_date}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studentbirthtimedata && studentbirthtimedata.weight}
                      </TableCell>
                      <TableCell align="left">
                        {studentbirthtimedata && studentbirthtimedata.height}
                      </TableCell>
                      <TableCell align="left">
                        {studentbirthtimedata &&
                          studentbirthtimedata.head_circumference}
                      </TableCell>
                      <TableCell align="left">
                        {studentbirthtimedata && studentbirthtimedata.month}
                      </TableCell>
                      <TableCell align="left">
                        {studentbirthtimedata &&
                          studentbirthtimedata.birth_condition}
                      </TableCell>
                      <TableCell align="left">
                        {studentbirthtimedata &&
                          studentbirthtimedata.indication}
                      </TableCell>
                      <TableCell align="left">
                        {basicimmunizationhistory.map((obj4, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj4.type_of_immunization}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {basicimmunizationhistory.map((obj6, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj6.immunization_date}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {basicimmunizationhistory.map((obj7, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj7.value}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studenthospitalizationhistory.map((obj8, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj8.hospital_name}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studenthospitalizationhistory.map((obj9, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj9.date_treated}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studenthospitalizationhistory.map((obj10, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj10.diagnosis}</ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {studenthospitalizationhistory.map((obj11, index) => {
                          return (
                            <List key={index}>
                              <ListItem>{obj11.other_diagnosis}</ListItem>
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
