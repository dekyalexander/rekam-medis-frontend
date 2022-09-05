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
import DrugListHead from "./DrugListHead";
import DrugListToolbar from "./DrugListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
import DrugForm from "./DrugForm";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import ActionConfirmation from "../../components/ActionConfirmation";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Protected from "src/components/Protected";
import useAuth from "src/hooks/useAuth";
import { LoadingButton } from "@material-ui/lab";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "drug_id", label: "Nama Obat", alignRight: false },
  { id: "location_id", label: "Lokasi Obat", alignRight: false },
  {
    id: "date_expired",
    label: "Tanggal Kadaluarsa Obat",
    alignRight: false,
  },
  { id: "qty_take", label: "Obat Keluar", alignRight: false },
  { id: "leftover_qty", label: "Sisa Obat", alignRight: false },
  { id: "description", label: "Keterangan", alignRight: false },
  { id: "created_at", label: "Tanggal Transaksi", alignRight: false },
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
      (_user) =>
        _user.drugname.drug_name.toLowerCase().indexOf(query.toLowerCase()) !==
        -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Drug() {
  //const {user} = useAuth()
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [drugnameOptions, setdrugnameOptions] = useState([]);
  const [locationdrugOptions, setlocationdrugOptions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("drug_name");
  const [filterName, setFilterName] = useState("");
  const [filter, setFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loadExcel, setLoadExcel] = useState(false);

  //Fungsi GetData Drug Transaction
  const getData = async () => {
    const params = { ...filter };

    const response = await axios.get(endpoint.drug.option_drug_recap, {
      params: params,
    });
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getExport = async (exportType) => {
    startLoading(exportType);
    const params = {
      ...filter,
      location_id: filter.location_id,
      created_at: filter.created_at,
      updated_at: filter.updated_at,
    };
    const response = await axios.get(endpoint.drug.export_recap_drug_out, {
      params: params,
    });
    if (exportType) {
      downloadFile(endpoint.drug.export_recap_drug_out, exportType, params);
    }
    if (response) {
      submitSuccess("Export excel success");
    } else {
      submitError("Export excel failed");
    }
    stopLoading(exportType);
  };

  const downloadFile = async (url, recap_of_remaining_drug, params) => {
    await axios
      .get(url, {
        params: params,
        responseType: "blob",
      })
      .then((rsp) => {
        const url = window.URL.createObjectURL(new Blob([rsp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "recap_of_remaining_drug.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(url);
        console.log(error);
        return { error: error };
      });
  };

  const getdrugnameOptions = async () => {
    const response = await axios.get(endpoint.drug_name.root);
    if (response && response.data) {
      setdrugnameOptions(response.data);
    }
  };

  const getlocationdrugOptions = async () => {
    const response = await axios.get(endpoint.drug_location.root);
    if (response && response.data) {
      setlocationdrugOptions(response.data);
    }
  };

  const handleChangeFilter = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = undefined;

    value = eventValue.target.value;

    newFilter[fieldName] = value;
    setFilter(newFilter);
  };

  const handleChangeFilterStartDate = (fieldName, eventValue) => {
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

  const handleChangeFilterEndDate = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = undefined;

    if (fieldName == "updated_at") {
      value = moment(eventValue).format("YYYY-MM-DD");
      newFilter["updated_at"] = null;
    } else {
      value = eventValue.target.value;
    }

    newFilter[fieldName] = value;
    setFilter(newFilter);
  };

  useEffect(() => {
    getData();
    getdrugnameOptions();
    getlocationdrugOptions();
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
  //     <DrugForm
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
  //       title="Drug"
  //     />
  //   );

  //   setopenDialog(true);
  // };

  // const handleDelete = async () => {
  //   const params = {
  //     ids: selectedIds,
  //   };
  //   const response = await axios.delete(endpoint.drug.delete, {
  //     data: params,
  //   });
  //   if (response) {
  //     submitSuccess("delete data success");
  //     getData();
  //   }
  // };

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

  const filteredData = applySortFilter(
    dataTable,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredData.length === 0;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

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
    <Page title="Medicine Balance">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            Medicine Balance
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
              Add
            </MButton>
          </Protected> */}

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
        <DrugListToolbar
          getData={getData}
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          handleChangeFilterStartDate={handleChangeFilterStartDate}
          handleChangeFilterEndDate={handleChangeFilterEndDate}
          drugnameOptions={drugnameOptions}
          locationdrugOptions={locationdrugOptions}
          numSelected={selectedIds.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <DrugListHead
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
                      drugname = {},
                      listofukslocations = {},
                      date_expired,
                      qty_take,
                      leftover_qty,
                      description,
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
                              text={drugname && drugname.drug_name}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          {listofukslocations && listofukslocations.uks_name}
                        </TableCell>
                        <TableCell align="left">
                          {format(new Date(date_expired), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell align="left">{qty_take}</TableCell>
                        <TableCell align="left">{leftover_qty}</TableCell>
                        <TableCell align="left">{description}</TableCell>
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
