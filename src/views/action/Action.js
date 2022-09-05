import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";

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
import ActionListHead from "./ActionListHead";
import ActionListToolbar from "./ActionListToolbar";
import ClickableText from "../../components/ClickableText";
import { dummyAplications } from "../../utils/dummy";
import ActionForm from "./ActionForm";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import ApprovalTypeChip from "src/components/ApprovalTypeChip";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "code", label: "Code", alignRight: false },
  { id: "menu_id", label: "Menu", alignRight: false },
  { id: "application_id", label: "Application", alignRight: false },  
  { id: "need_approval", label: "Need Approval", alignRight: false },
  { id: "approval_type_value", label: "Type Approval", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
];
//{ id: "path", label: "Description", alignRight: false },
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

export default function Action() {
  const theme = useTheme();
  // const dispatch = useDispatch();
  // const { userList } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [totalRows, setTotalRows] = useState(0)
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [menuOptions, setmenuOptions] = useState([]);
  const [applicationOptions, setapplicationOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filter, setFilter] = useState({});
  const [idMenu, setIdMenu] = useState("");

  const getData = async (newPage, newRowsPerPage) => {
    let params = {
      ...filter,
      page:newPage ? newPage : page,
      rowsPerPage:newRowsPerPage ? newRowsPerPage : rowsPerPage
    }
    const response = await axios.get(endpoint.action.root, { params: params });
    if(response && response.data){      
      setdataTable(response.data.data)
      setPage(response.data.current_page)
      setTotalRows(response.data.total)
    }
  };


  const handleChangePage=(event, newPage)=>{
    setPage(newPage+1)
    getData(newPage+1,null)
  }

  const handleChangeRowsPerPage = (event)=> {
      setRowsPerPage(+event.target.value);
      setPage(1);
      getData(1,+event.target.value)
  } 

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

  // const handleFilterOptionApp = (e) => {
  //   setFilterOptionApp(e.target.value);
  //   console.log("INi adalah value dari APP :", filterOptionApp);
  // };

  // const handleFilterOptionMenu = (e) => {
  //   setFilterOptionMenu(e.target.value);
  //   console.log("INi adalah value dari Menu 2:", filterOptionMenu);
  // };

  const getmenuOptions = async (application_id) => {
    const params = { application_id: application_id };
    const response = await axios.get(endpoint.menu.option, { params: params });
    if (response && response.data) {
      setmenuOptions(response.data);
    }
  };

  const getapplicationOptions = async () => {
    const response = await axios.get(endpoint.application.option);
    if (response && response.data) {
      setapplicationOptions(response.data);
    }
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
      <ActionForm
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
        title="Record"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds,
    };
    const response = await axios.delete(endpoint.action.root, {
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
      const newSelecteds = dataTable.map(data=>data.id);
      setSelectedIds(newSelecteds);
      return;
    }

    setSelectedIds([]);
  };

  const handleClick = (event, id, row) => {
    if(selectedIds.includes(row.id)){
      const ids = selectedIds.filter(item=>item!==row.id)
      setSelectedIds(ids)
      
      if(ids.length===1){
        const existingRow = dataTable.filter(data=>(data.id===ids[0]))
        setSelectedRow(existingRow[0])
      }
      else{
        setSelectedRow(null)
      }      
      
    }else{
      
      setSelectedIds([...selectedIds,row.id])
      setSelectedRow(row)
    }
  };


  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleChangeFilter = (fieldName, eventValue) => {
    let newFilter = { ...filter };
    let value = undefined;
    value = eventValue.target.value;
    newFilter[fieldName] = value;
    setFilter(newFilter);
    if(fieldName==='application_id'){
      getmenuOptions(value)
    }
    //setIdMenu(value);
  };

  
  const filteredUsers = applySortFilter(
    dataTable,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    getData();
    getapplicationOptions();
  }, []);

  //useEffect(() => {
    //getmenuOptions();
  //}, [idMenu]);

  // useEffect(() => {
  //   setFilterOption(filterOptionApp);
  // }, [filterOptionApp]);

  return (
    <Page title="Action">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            Action
          </Typography>
        </Grid>
        <Grid item xs={8} container justifyContent="flex-end">
          {selectedIds.length > 0 && (
            <MButton
              variant="contained"
              color="error"
              style={{ margin: "0 8px" }}
              onClick={showDeleteConfirmation}
            >
              Delete
            </MButton>
          )}
          {selectedIds.length === 1 && (
            <MButton
              variant="contained"
              color="info"
              style={{ margin: "0 8px" }}
              onClick={() => showDialog("EDIT")}
            >
              Edit
            </MButton>
          )}

          <MButton
            variant="contained"
            color="primary"
            style={{ margin: "0 8px" }}
            onClick={() => showDialog("CREATE", selectedRow)}
          >
            New Action
          </MButton>
        </Grid>
      </Grid>

      <Card>
        <ActionListToolbar
          getData={getData}
          filter={filter}
          optionsApp={applicationOptions}
          optionsMenu={menuOptions}
          // onChangeFilterApp={handleFilterOptionApp}
          // onChangeFilterMenu={handleFilterOptionMenu}
          // valueApplication={filterOptionApp}
          //valueMenu={filterOptionMenu}
          numSelected={selectedIds.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          handleChangeFilter={handleChangeFilter}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ActionListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataTable.length}
                numSelected={selectedIds.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {dataTable.map((row) => {
                    const {
                      id,
                      name,
                      code,
                      application,
                      menu,
                      need_approval,
                      approval_type_value,
                      description,
                    } = row;
                    const isItemSelected = selectedIds.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selectedIds={isItemSelected}
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
                        <TableCell align="left">{code}</TableCell>
                        <TableCell align="left">{menu && menu.name}</TableCell>
                        <TableCell align="left">
                          {application && application.name}
                        </TableCell>
                        <TableCell align="left"><Checkbox checked={need_approval===1} /></TableCell>
                        <TableCell align="left">
                          <ApprovalTypeChip approval_type_value = {approval_type_value} />
                        </TableCell>
                        <TableCell align="left">{description}</TableCell>
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
          page={page-1}
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
