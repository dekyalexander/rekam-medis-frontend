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
import downloadIcon from "@iconify/icons-eva/arrow-circle-down-outline";

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
  Link,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { MButton, MIconButton } from "../../components/@material-extend";
import SaveAlt from "@material-ui/icons/SaveAlt";
// redux
import { getUserList } from "../../redux/slices/user";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import Page from "../../components/Page";
import Label from "../../components/Label";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import TreatmentListHead from "./TreatmentListHead";
import TreatmentListToolbar from "./TreatmentListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
import TreatmentForm from "./TreatmentForm";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import ActionConfirmation from "../../components/ActionConfirmation";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Protected from "src/components/Protected";
import useAuth from "src/hooks/useAuth";
import { LoadingButton } from "@material-ui/lab";

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
  { id: "anamnesa", label: "Anamnesa", alignRight: false },
  { id: "head", label: "Kepala", alignRight: false },
  { id: "neck", label: "Leher", alignRight: false },
  { id: "eye", label: "Mata", alignRight: false },
  { id: "nose", label: "Hidung", alignRight: false },
  { id: "tongue", label: "Lidah", alignRight: false },
  { id: "tooth", label: "Gigi", alignRight: false },
  { id: "gum", label: "Gusi", alignRight: false },
  { id: "throat", label: "Tenggorokan", alignRight: false },
  { id: "tonsils", label: "Amandel", alignRight: false },
  { id: "ear", label: "Telingga", alignRight: false },
  { id: "heart", label: "Jantung", alignRight: false },
  { id: "lungs", label: "Paru - Paru", alignRight: false },
  { id: "epigastrium", label: "Ulu Hati", alignRight: false },
  { id: "hearts", label: "Hati", alignRight: false },
  { id: "spleen", label: "Limpa", alignRight: false },
  { id: "intestines", label: "Usus", alignRight: false },
  { id: "hand", label: "Tangan", alignRight: false },
  { id: "foot", label: "Kaki", alignRight: false },
  { id: "skin", label: "Kulit", alignRight: false },
  // { id: "diagnosis", label: "Diagnosis", alignRight: false },
  {
    id: "employeetreatmentgeneraldiagnosis",
    label: "Diagnosis Umum",
    alignRight: false,
  },
  { id: "description", label: "Keterangan", alignRight: false },
  { id: "awareness", label: "Kesadaran", alignRight: false },
  { id: "distress_sign", label: "Tanda Distress", alignRight: false },
  { id: "anxiety_sign", label: "Tanda Kecemasan", alignRight: false },
  { id: "sign_of_pain", label: "Tanda Kesakitan", alignRight: false },
  { id: "voice", label: "Suara", alignRight: false },
  { id: "blood_pressure", label: "Tekanan Darah", alignRight: false },
  { id: "heart_rate", label: "Detak Jantung", alignRight: false },
  { id: "breathing_ratio", label: "Rasio Pernapasan", alignRight: false },
  { id: "body_temperature", label: "Suhu Tubuh", alignRight: false },
  { id: "sp02", label: "SP02", alignRight: false },
  { id: "file", label: "Dokumen", alignRight: false },
  { id: "location_id", label: "Lokasi Obat", alignRight: false },
  { id: "drug_id", label: "Nama Obat", alignRight: false },
  { id: "amount_medicine", label: "Jumlah Obat", alignRight: false },
  { id: "unit_drug", label: "Satuan Obat", alignRight: false },
  {
    id: "how_to_use_medicine",
    label: "Cara Penggunaan Obat",
    alignRight: false,
  },
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

export default function Treatment() {
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
  const [employeeunitOptions, setemployeeunitOptions] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [filters, setfilters] = useState({
    keyword: "",
  });

  //Fungsi GetData Employee Treatment
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

    const response = await axios.get(endpoint.employee_treatment.root, {
      params: params,
    });
    if (response && response.data) {
      setdataTable(response.data.data);
      setPage(response.data.current_page);
      setTotalRows(response.data.total);
    }
  };

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

  const download = async () => {
    return await axios
      .get(endpoint.employee_treatment.root, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        // link.setAttribute("download", "document.pdf");
        link.href = url;
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  // const download = async () => {
  //   const params = { ...filter };
  //   return await axios
  //     .get(endpoint.medical_history_employee.option_file, {
  //       params: params,
  //       responseType: "blob",
  //     })
  //     .then((response) => {
  //       const blob = new Blob([response.data], { type: response.data.type });
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       const contentDisposition = response.headers["content-disposition"];
  //       let fileName = "unknown";
  //       if (contentDisposition) {
  //         const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
  //         if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
  //       }
  //       link.setAttribute("download", fileName);
  //       document.body.appendChild(link);
  //       link.click();
  //     })
  //     .catch((error) => {
  //       return { error: error };
  //     });
  // };

  const downloadFile = (namaFile) => {
    let fileName = namaFile.split("/");
    axios({
      url: endpoint.employee_treatment.download_file,
      method: "GET",
      responseType: "blob", // important
      params: { namaFile: namaFile },
    }).then((response) => {
      console.log("response data", response.data);
      // const fileName = namaFile.split("/");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", [fileName[1]]);
      document.body.appendChild(link);
      link.click();
    });
  };

  useEffect(() => {
    getemployeeunitOptions();
    getData();
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
      <TreatmentForm
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
        title="Employee Treatment"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds,
    };
    const response = await axios.delete(endpoint.employee_treatment.delete, {
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
    <Page title="Treatment Employee">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            Treatment Employee
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
        <TreatmentListToolbar
          getData={getData}
          filter={filter}
          filters={filters}
          handleFilter={handleFilter}
          handleChangeFilter={handleChangeFilter}
          handleChangeFilterStartDate={handleChangeFilterStartDate}
          handleChangeFilterEndDate={handleChangeFilterEndDate}
          employeeunitOptions={employeeunitOptions}
          numSelected={selectedIds.length}
          // filterName={filterName}
          // onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TreatmentListHead
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
                    // employee = {},
                    name,
                    nik,
                    unit,
                    inspection_date,
                    anamnesa,
                    head,
                    neck,
                    eye,
                    nose,
                    tongue,
                    tooth,
                    tonsils,
                    gum,
                    throat,
                    ear,
                    heart,
                    lungs,
                    epigastrium,
                    hearts,
                    spleen,
                    intestines,
                    hand,
                    foot,
                    skin,
                    // diagnosis,
                    // generaldiagnosis = {},
                    employeetreatmentgeneraldiagnosis = {},
                    generalphysicalexamination = {},
                    employeevitalsigns = {},
                    employeemedicalprescription = {},
                    description,
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
                            text={name}
                          />
                        </Box>
                      </TableCell>
                      {/* <TableCell align="left">
                          {employee && employee.name}
                        </TableCell> */}
                      <TableCell align="left">{nik}</TableCell>
                      <TableCell align="left">{unit}</TableCell>
                      <TableCell align="left">
                        {format(new Date(inspection_date), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell align="left">{anamnesa}</TableCell>
                      <TableCell align="left">{head}</TableCell>
                      <TableCell align="left">{neck}</TableCell>
                      <TableCell align="left">{eye}</TableCell>
                      <TableCell align="left">{nose}</TableCell>
                      <TableCell align="left">{tongue}</TableCell>
                      <TableCell align="left">{tooth}</TableCell>
                      <TableCell align="left">{gum}</TableCell>
                      <TableCell align="left">{throat}</TableCell>
                      <TableCell align="left">{tonsils}</TableCell>
                      <TableCell align="left">{ear}</TableCell>
                      <TableCell align="left">{heart}</TableCell>
                      <TableCell align="left">{lungs}</TableCell>
                      <TableCell align="left">{epigastrium}</TableCell>
                      <TableCell align="left">{hearts}</TableCell>
                      <TableCell align="left">{spleen}</TableCell>
                      <TableCell align="left">{intestines}</TableCell>
                      <TableCell align="left">{hand}</TableCell>
                      <TableCell align="left">{foot}</TableCell>
                      <TableCell align="left">{skin}</TableCell>
                      {/* <TableCell align="left">{diagnosis}</TableCell> */}
                      {/* <TableCell align="left">
                          {generaldiagnosis && generaldiagnosis.diagnosis_name}
                        </TableCell> */}
                      <TableCell align="left">
                        {employeetreatmentgeneraldiagnosis.map(
                          (obj6, index) => {
                            return (
                              <List key={index}>
                                <ListItem>
                                  {obj6.generaldiagnosis
                                    ? obj6.generaldiagnosis.diagnosis_name
                                    : ""}
                                </ListItem>
                                <Divider color="secondary" />
                              </List>
                            );
                          }
                        )}
                      </TableCell>
                      <TableCell align="left">{description}</TableCell>
                      <TableCell align="left">
                        {generalphysicalexamination &&
                          generalphysicalexamination.awareness}
                      </TableCell>
                      <TableCell align="left">
                        {generalphysicalexamination &&
                          generalphysicalexamination.distress_sign}
                      </TableCell>
                      <TableCell align="left">
                        {generalphysicalexamination &&
                          generalphysicalexamination.anxiety_sign}
                      </TableCell>
                      <TableCell align="left">
                        {generalphysicalexamination &&
                          generalphysicalexamination.sign_of_pain}
                      </TableCell>
                      <TableCell align="left">
                        {generalphysicalexamination &&
                          generalphysicalexamination.voice}
                      </TableCell>
                      <TableCell align="left">
                        {employeevitalsigns &&
                          employeevitalsigns.blood_pressure}
                      </TableCell>
                      <TableCell align="left">
                        {employeevitalsigns && employeevitalsigns.heart_rate}
                      </TableCell>
                      <TableCell align="left">
                        {employeevitalsigns &&
                          employeevitalsigns.breathing_ratio}
                      </TableCell>
                      <TableCell align="left">
                        {employeevitalsigns &&
                          employeevitalsigns.body_temperature}
                      </TableCell>
                      <TableCell align="left">
                        {employeevitalsigns && employeevitalsigns.sp02}
                      </TableCell>
                      <TableCell>
                        {file == null || file == "NULL" || file == "" ? (
                          "-"
                        ) : (
                          <IconButton onClick={() => downloadFile(file)}>
                            <Icon icon={downloadIcon} width={50} height={50} />
                          </IconButton>
                        )}
                      </TableCell>
                      {/* <TableCell align="left">
                          <Link href={file} target="_blank">
                            <MButton color="info">
                              <IconButton edge="end" aria-label="download">
                                <SaveAlt />
                              </IconButton>
                            </MButton>
                          </Link>
                        </TableCell> */}
                      {/* <TableCell align="left">
                          <MButton onClick={download} color="info">
                            download
                            <IconButton edge="end" aria-label="download">
                              <SaveAlt />
                            </IconButton>
                          </MButton>
                        </TableCell> */}
                      <TableCell align="left">
                        {employeemedicalprescription.map((obj1, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj1.listofukslocations
                                  ? obj1.listofukslocations.uks_name
                                  : ""}
                              </ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {employeemedicalprescription.map((obj2, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj2.drugname ? obj2.drugname.drug_name : ""}
                              </ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {employeemedicalprescription.map((obj3, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj3.amount_medicine
                                  ? obj3.amount_medicine
                                  : ""}
                              </ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {employeemedicalprescription.map((obj4, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj4.unit_drug ? obj4.unit_drug : ""}
                              </ListItem>
                              <Divider color="secondary" />
                            </List>
                          );
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {employeemedicalprescription.map((obj5, index) => {
                          return (
                            <List key={index}>
                              <ListItem>
                                {obj5.how_to_use_medicine
                                  ? obj5.how_to_use_medicine
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
