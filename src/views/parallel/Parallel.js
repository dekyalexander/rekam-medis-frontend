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
import ParallelListHead from './ParallelListHead';
import ParallelListToolbar from './ParallelListToolbar';
import ClickableText from '../../components/ClickableText';
import { dummyAplications } from '../../utils/dummy';
import ParallelForm from './ParallelForm';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import Protected from 'src/components/Protected';
import useAuth from 'src/hooks/useAuth';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: 'jurusan', label: 'Jurusan', alignRight: false },
  { id: 'jenjang', label: 'Jenjang', alignRight: false },
  { id: 'school', label: 'School', alignRight: false }
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

export default function Parallel() {
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
  const [kelasOptions, setkelasOptions] = useState([]);
  const [syncTK, setsyncTK] = useState(false);
  const [syncSD, setsyncSD] = useState(false);
  const [syncSMP, setsyncSMP] = useState(false);
  const [syncSMA, setsyncSMA] = useState(false);
  const [syncPCI, setsyncPCI] = useState(false);
  
  const getData = async (newPage, newRowsPerPage) => {
    let params = {
      keyword:filters.keyword!==''? filters.keyword : undefined,
      page:Number.isInteger(newPage) ? newPage : page,
      rowsPerPage:newRowsPerPage ? newRowsPerPage : rowsPerPage
    }
    
    const response = await axios.get(endpoint.parallel.root, { params: params });
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

  const getkelasOptions = async (school_id) => {
    const params ={
      school_id:school_id
    }
    const response = await axios.get(endpoint.kelas.option,{params:params});
    if (response && response.data) {
      setkelasOptions(response.data);
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

  const syncParallel = async(jenjang_code) => {
    startLoading(jenjang_code)
    const params = {
      jenjang_code: jenjang_code
    };
    const response = await axios.post(endpoint.parallel.sync, params)
    
    if (response) {
      submitSuccess('sync data success');
      getData();
    }
    stopLoading(jenjang_code)
  };

  const startLoading = (jenjang_code) => {
    if(jenjang_code==='TK'){
      setsyncTK(true)
    }else
    if(jenjang_code==='SD'){
      setsyncSD(true)
    }else
    if(jenjang_code==='SMP'){
      setsyncSMP(true)
    }else
    if(jenjang_code==='SMA'){
      setsyncSMA(true)
    }else
    if(jenjang_code==='PCI'){
      setsyncPCI(true)
    }    
  };

  const stopLoading = (jenjang_code) => {
    if(jenjang_code==='TK'){
      setsyncTK(false)
    }else
    if(jenjang_code==='SD'){
      setsyncSD(false)
    }else
    if(jenjang_code==='SMP'){
      setsyncSMP(false)
    }else
    if(jenjang_code==='SMA'){
      setsyncSMA(false)
    }else
    if(jenjang_code==='PCI'){
      setsyncPCI(false)
    }    
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
      <ParallelForm
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
        title="Parallel"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds
    };
    const response = await axios.delete(endpoint.parallel.root, {
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
      getkelasOptions(value)
      newFilters['kelas_id'] = null;
    }else
    if (field === "kelas_id") {
      value = event.target.value;
      newFilters['kelas_id'] = null;
    }else
    if (field === "is_sibling") {
         value = event.target.checked ? 1 : 0;
    }else {
      value = event.target.value;
    }

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
    getschoolOptions()
    getData();
  }, []);


  return (
    <Page title="Parallel">
        <Grid container style={{ padding: '16px 0' }}>
          <Grid item xs={4} container justifyContent="flex-start">
            <Typography gutterBottom variant="h4" component="h6">
              Parallel
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

<Protected allowedCodes={['SYNC_PCI']} >             
              <LoadingButton                
                size="medium"
                type="button"
                variant="contained"
                style={{ margin: '0 8px' }}
                pending={syncPCI}
                onClick={() => syncParallel('PCI')}
              >
                Sync PCI
              </LoadingButton>
            </Protected>
            
            <Protected allowedCodes={['SYNC_SMA']} >            
              <LoadingButton                
                size="medium"
                type="button"
                variant="contained"
                style={{ margin: '0 8px' }}
                pending={syncSMA}
                onClick={() => syncParallel('SMA')}
              >
                Sync SMA
              </LoadingButton>
            </Protected>

            <Protected allowedCodes={['SYNC_SMP']} >              
              <LoadingButton                
                size="medium"
                type="button"
                variant="contained"
                style={{ margin: '0 8px' }}
                pending={syncSMP}
                onClick={() => syncParallel('SMP')}
              >
                Sync SMP
              </LoadingButton>
            </Protected>
            <Protected allowedCodes={['SYNC_SD']} >
              
              <LoadingButton                
                size="medium"
                type="button"
                variant="contained"
                style={{ margin: '0 8px' }}
                pending={syncSD}
                onClick={() => syncParallel('SD')}
              >
                Sync SD 
              </LoadingButton>
            </Protected>

            <Protected allowedCodes={['SYNC_TK']} >             
              <LoadingButton                
                size="medium"
                type="button"
                variant="contained"
                style={{ margin: '0 8px' }}
                pending={syncTK}
                onClick={() => syncParallel('TK')}
              >
                Sync TK 
              </LoadingButton>
            </Protected>
            
          </Grid>
        </Grid>
        <Card>
          <ParallelListToolbar
            getData={getData}
            numSelected={selectedIds.length}
            filters={filters}
            handleFilter={handleFilter}
            schoolOptions={schoolOptions}
            kelasOptions={kelasOptions}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ParallelListHead
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
                      const { id, jenjang, name, code, school, kelas, jurusan } = row;
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
                          <TableCell align="left">{code}</TableCell>
                          <TableCell align="left">{kelas&&kelas.name}</TableCell>                          
                          <TableCell align="left">{jurusan&&jurusan.code}</TableCell>                          
                          <TableCell align="left">{jenjang&&jenjang.name}</TableCell>                          
                          <TableCell align="left">{school&&school.name}</TableCell>                          
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
