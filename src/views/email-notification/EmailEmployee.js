import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import saveOutline from "@iconify/icons-eva/save-outline";
import closeFill from "@iconify/icons-eva/close-fill";
import emailOutline from "@iconify/icons-eva/email-outline";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import { useDebounce } from "react-use";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";

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
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
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
import EmailEmployeeListHead from "./EmailEmployeeListHead";
import EmailEmployeeListToolbar from "./EmailEmployeeListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Protected from "src/components/Protected";
import useAuth from "src/hooks/useAuth";
import { LoadingButton } from "@material-ui/lab";

// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: "email", label: "Email", alignRight: false }];

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
      (_user) => _user.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function EmailEmployee() {
  const { user } = useAuth();
  const theme = useTheme();
  //const dispatch = useDispatch();
  //const { userList } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  //const [totalRows, setTotalRows] = useState(0);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("email");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [unitOptions, setunitOptions] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("CREATE");
  const [filters, setfilters] = useState({});

  //Fungsi Menampilkan Data Email
  const getEmail = async (id) => {
    const params = { id: id };

    const response = await axios.get(
      endpoint.email_notification.email_employee,
      {
        params: params,
      }
    );
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getunitOptions = async () => {
    const response = await axios.get(endpoint.employee_unit.root);
    if (response && response.data) {
      setunitOptions(response.data);
    }
  };

  useEffect(() => {
    getunitOptions();
  }, []);

  const filterSuccess = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
  };

  const filterError = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = applySortFilter(
    dataTable,
    getComparator(order, orderBy),
    filterName
  );

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const isUserNotFound = filteredData.length === 0;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

  const handleFilter = (field, event) => {
    let newFilters = { ...filters };
    let value = null;

    if (field === "id") {
      value = event.target.value;
      filterSuccess("Berhasil Filter Unit");
      if (value !== null) {
        getEmail(value);
      } else {
        setdataTable([]);
      }
    } else {
      filterError("Gagal Filter Unit");
    }

    newFilters[field] = value;
    setstate(newFilters);
  };

  const [state, setstate] = useState({
    id: null,
    title: "",
    body: "",
  });

  const ValidationForm = Yup.object().shape({
    title: Yup.string().required("Subjek Tidak Boleh Kosong"),
    body: Yup.string().required("Deskripsi Tidak Boleh Kosong"),
  });

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue.target.value;

    if (fieldName === "id") {
    }

    newState[fieldName] = value;
    setstate(newState);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: state,
    validationSchema: ValidationForm,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        await axios.get(
          endpoint.email_notification.send_email_employee,
          values
        );
      }
      setSubmitting(false);
      submitSuccess("Berhasil Mengirim Email");
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="Email Employee">
      <Card variant="outlined">
        <CardContent>
          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="h4" component="h6">
              Filter Employee
            </Typography>
          </Grid>
          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="filter-employee">Filter Employee</InputLabel>
              <Select
                labelId="filter-employee"
                id="filter-employee"
                value={filters.id}
                onChange={(e) => handleFilter("id", e)}
                label="Filter Employee"
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {unitOptions.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </CardContent>
      </Card>
      <Grid container style={{ marginBottom: 16 }}></Grid>

      <Grid container spacing={2} columns={16}>
        <Grid item xs={8}>
          {state.id != null ? (
            <Card variant="outlined">
              <CardContent>
                <Grid container style={{ marginBottom: 16 }}>
                  <Typography variant="h4" component="h6">
                    Form Send Email Employee
                  </Typography>
                </Grid>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container style={{ marginBottom: 16 }}>
                      <TextField
                        {...getFieldProps("title")}
                        value={state.title}
                        onChange={(e) => handleChange("title", e)}
                        fullWidth
                        autoComplete="on"
                        type="text"
                        label="Subjek"
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                        sx={{ mb: 5 }}
                      />
                    </Grid>
                    <Grid container style={{ marginBottom: 16 }}>
                      <TextField
                        {...getFieldProps("body")}
                        value={state.body}
                        onChange={(e) => handleChange("body", e)}
                        fullWidth
                        autoComplete="on"
                        type="text"
                        label="Deskripsi"
                        multiline
                        rows={4}
                        error={Boolean(touched.body && errors.body)}
                        helperText={touched.body && errors.body}
                        sx={{ mb: 5 }}
                      />
                    </Grid>
                    <Grid item xs={18} container justifyContent="flex-end">
                      <Protected allowedCodes={["CREATE"]}>
                        <LoadingButton
                          sx={{
                            width: 50,
                          }}
                          color="info"
                          type="submit"
                          variant="contained"
                          pending={isSubmitting}
                        >
                          <Icon icon={saveOutline} /> Send
                        </LoadingButton>
                      </Protected>
                    </Grid>
                  </Form>
                </FormikProvider>
              </CardContent>
            </Card>
          ) : null}
        </Grid>

        <Grid item xs={8}>
          {state.id != null ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" component="h6">
                  List Email Employee
                </Typography>
              </CardContent>
              <Card>
                <EmailEmployeeListToolbar
                  getEmail={getEmail}
                  filterName={filterName}
                  onFilterName={handleFilterByName}
                />

                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <EmailEmployeeListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={dataTable.length}
                        numSelected={selectedIds.length}
                        onRequestSort={handleRequestSort}
                      />
                      <TableBody>
                        {filteredData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((email, e) => {
                            return (
                              <TableRow hover key={e} tabIndex={-1}>
                                <TableCell key={e}>{email}</TableCell>
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
            </Card>
          ) : null}
        </Grid>
      </Grid>
    </Page>
  );
}
