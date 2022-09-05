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
import ParentListHead from './ParentListHead';
import ParentListToolbar from './ParentListToolbar';
import ClickableText from '../../components/ClickableText';
import { dummyAplications } from '../../utils/dummy';
import ParentForm from './ParentForm';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import Protected from 'src/components/Protected';
import useAuth from 'src/hooks/useAuth';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'Username', label: 'Username', alignRight: false },   
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

export default function Parent() {
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
    keyword:''
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  
  const getData = async (newPage, newRowsPerPage) => {
    let parent_id = null
    let student_id = null
    if(user.user_type && user.user_type.code==='PARENT'){
      parent_id = user.parent?user.parent.id:null
    } else
    if(user.user_type && user.user_type.code==='STUDENT'){
      student_id = user.student?user.student.id:null
    }
    let params = {
      keyword:filters.keyword!==''? filters.keyword : undefined,
      school_id:filters.school_id,
      kelas_id:filters.kelas_id,
      parallel_id:filters.parallel_id,
      is_sibling:filters.is_sibling===1?1:undefined,
      parent_id:parent_id,
      student_id:student_id,
      page:Number.isInteger(newPage) ? newPage : page,
      rowsPerPage:newRowsPerPage ? newRowsPerPage : rowsPerPage
    }
    
    const response = await axios.get(endpoint.parent.root, { params: params });
    if(response && response.data){      
      setdataTable(response.data.data)
      setPage(response.data.current_page)
      setTotalRows(response.data.total)
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
      <ParentForm
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
        title="Parent"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds
    };
    const response = await axios.delete(endpoint.parent.root, {
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
    
    value = event.target.value;

    newFilters[field] = value;
    setfilters(newFilters);
    
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
    
    getData();
  }, []);


  return (
    <Page title="Parent">
        <Grid container style={{ padding: '16px 0' }}>
          <Grid item xs={4} container justifyContent="flex-start">
            <Typography gutterBottom variant="h4" component="h6">
              Parent
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            {selectedIds.length > 0 && (
              <Protected allowedCodes={['EDIT']} >
                <MButton
                variant="contained"
                color="error"
                style={{ margin: '0 8px' }}
                onClick={showDeleteConfirmation}
                >
                  Delete
                </MButton>
              </Protected>
              
            )}
            {selectedIds.length === 1 && (
              <Protected allowedCodes={['EDIT']} >
                <MButton
                variant="contained"
                color="info"
                style={{ margin: '0 8px' }}
                onClick={() => showDialog('EDIT')}
                >
                  Edit
                </MButton>
              </Protected>
              
            )}
            
          </Grid>
        </Grid>
        <Card>
          <ParentListToolbar
            getData={getData}
            numSelected={selectedIds.length}
            filters={filters}
            handleFilter={handleFilter}
            
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ParentListHead
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
                      const { id, group, value, name, user, is_active } = row;
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
                          <TableCell>
                            {user && user.username}
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
