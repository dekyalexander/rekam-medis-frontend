import { useSnackbar } from 'notistack';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { useDebounce } from "react-use";

// material
import { useTheme } from '@material-ui/core/styles';
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
  DialogContentText
} from '@material-ui/core';
import { MButton, MIconButton } from '../../components/@material-extend';
// redux
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import UserListHead from './UserListHead';
import UserListToolbar from './UserListToolbar';
import ClickableText from '../../components/ClickableText';
import { dummyAplications } from '../../utils/dummy';
import UserForm from './UserForm';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import ActionConfirmation from '../../components/ActionConfirmation';
import Protected from 'src/components/Protected';
import useAuth from 'src/hooks/useAuth';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'email', alignRight: false },
  { id: 'username', label: 'User Name', alignRight: false }
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
  return order === 'desc'
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

export default function User() {
  const {user} = useAuth()
  const theme = useTheme();
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0)
  const [order, setOrder] = useState('asc');  
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [filters, setfilters] = useState({
    keyword:'',
    is_sibling:0
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [schoolOptions, setschoolOptions] = useState([]);
  const [userOptions, setuserOptions] = useState([]);
  const [parallelOptions, setparallelOptions] = useState([]);
  const [syncTK, setsyncTK] = useState(false);
  
  const getData = async (newPage, newRowsPerPage) => {
    let parent_id = null
    let user_id = null
    if(user.user_type && user.user_type.code==='PARENT'){
      parent_id = user.parent?user.parent.id:null
    } else
    if(user.user_type && user.user_type.code==='STUDENT'){
      user_id = user.user?user.user.id:null
    }
    let params = {
      keyword:filters.keyword!==''? filters.keyword : undefined,
      school_id:filters.school_id,
      user_id:filters.user_id,
      parallel_id:filters.parallel_id,
      is_sibling:filters.is_sibling===1?1:undefined,
      parent_id:parent_id,
      user_id:user_id,
      page:Number.isInteger(newPage) ? newPage : page,
      rowsPerPage:newRowsPerPage ? newRowsPerPage : rowsPerPage
    }
    
    const response = await axios.get(endpoint.user.root, { params: params });
    if(response && response.data){      
      setdataTable(response.data.data)
      setPage(response.data.current_page)
      setTotalRows(response.data.total)
    }
  };

  const getschoolOptions = async () => {
    const response = await axios.get(endpoint.school.option);
    if (response && response.data) {
      setschoolOptions(response.data);
    }
  };

  const getuserOptions = async (school_id) => {
    const params ={
      school_id:school_id
    }
    const response = await axios.get(endpoint.user.option,{params:params});
    if (response && response.data) {
      setuserOptions(response.data);
    }
  };

  const getparallelOptions = async (user_id) => {
    const params ={
      user_id:user_id
    }
    const response = await axios.get(endpoint.parallel.option,{params:params});
    if (response && response.data) {
      setparallelOptions(response.data);
    }
  };

  const submitSuccess = (message) => {
    enqueueSnackbar(message, {
      variant: 'success',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  };

  const submitError = (message) => {
    enqueueSnackbar(message, {
      variant: 'error',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  };

  const syncUser = async(jenjang_code) => {
    if(jenjang_code==='TK'){
      setsyncTK(true)
    }
    const params = {
      jenjang_code: jenjang_code
    };
    const response = await axios.post(endpoint.user.sync, params)
    
    if (response) {
      submitSuccess('sync data success');
      getData();
    }
    setsyncTK(false)
  };

  const handleClose = () => {
    setopenDialog(false);
  };

  const showDialog = (actionCode, rowParam) => {
    let row=undefined
    if(rowParam){
      row = rowParam
    }else{
      row = selectedRow
    }
    setMaxWidth('md');
    setdialogContent(
      <UserForm
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
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={handleClose}
        handleDelete={handleDelete}
        selectedIds={selectedIds}
        title="User"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds
    };
    const response = await axios.delete(endpoint.user.root, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getData();
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
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


  const handleChangePage=(event, newPage)=>{
    setPage(newPage+1)
    getData(newPage+1,null)
  }

  const handleChangeRowsPerPage = (event)=> {
      setRowsPerPage(+event.target.value);
      setPage(1);
      getData(1,+event.target.value)
  } 

  const handleFilter = (field, event) => {
    let newFilters = { ...filters };
    let value = null

    if (field === "school_id") {
      value = event.target.value;
      getuserOptions(value)
      newFilters['user_id'] = null;
      newFilters['parallel_id'] = null;
    }else
    if (field === "user_id") {
      value = event.target.value;
      getparallelOptions(value)
      newFilters['parallel_id'] = null;
    }else
    if (field === "is_sibling") {
         value = event.target.checked ? 1 : 0;
    }else {
      value = event.target.value;
    }

    newFilters[field] = value;
    setfilters(newFilters);
    
  };

  const resetPassword = async () => {
    const params = {
      user_id: selectedIds[0]
    };
    const response = await axios.put(endpoint.user.reset_password, params);
    if (response) {
      submitSuccess('reset password success');
      getData();
    }
  };

  const resetPasswordConfirmation = () => {
    setMaxWidth("sm");
    setdialogContent(
      <ActionConfirmation
        handleClose={handleClose}
        onAction={resetPassword}
        actionName="Reset Password"
      />
    );

    setopenDialog(true);
  };

  
  const filteredData = applySortFilter(
    dataTable,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredData.length === 0;

  useDebounce(
    () => {
      if(filters.keyword.trim()!=''){
        console.log(filters.keyword);
      }      
    },
    500,
    [filters.keyword]
  );

  useEffect(() => {
    getschoolOptions()
    getData();
  }, []);


  return (
    <Page title="User">
        <Grid container style={{ padding: '16px 0' }}>
          <Grid item xs={4} container justifyContent="flex-start">
            <Typography gutterBottom variant="h4" component="h6">
              User
            </Typography>
          </Grid>
          <Grid item xs={8} container justifyContent="flex-end">             
            {selectedIds.length === 1 && (
              <>
              <MButton
                variant="contained"
                color="warning"
                style={{ margin: "0 8px" }}
                onClick={resetPasswordConfirmation}
              >
                Reset Password
              </MButton>

              <MButton
                variant="contained"
                color="info"
                style={{ margin: '0 8px' }}
                onClick={() => showDialog('EDIT')}
              >
                Edit
              </MButton>
              </>
            )}
          </Grid>                    
        </Grid>
        <Card>
          <UserListToolbar
            getData={getData}
            numSelected={selectedIds.length}
            filters={filters}
            handleFilter={handleFilter}
            schoolOptions={schoolOptions}
            userOptions={userOptions}
            parallelOptions={parallelOptions}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
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
                      const { id, name, email, username } = row;
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
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <ClickableText
                                variant="subtitle2"
                                onClick={() => showDialog('READ', row)}
                                text={name}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="left">{email}</TableCell>                          
                          <TableCell align="left">{username}</TableCell>                      
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
