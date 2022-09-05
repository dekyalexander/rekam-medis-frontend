import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Button,
  Grid,
  Typography,
  TableContainer,
  Dialog,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Input,
  CircularProgress
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MButton } from '../../components/@material-extend';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import RoleListHead from './RoleListHead';
import Conditional from '../../components/Conditional';
import UserDetail from '../user/UserDetail';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import { useDebounce } from "react-use";
import Protected from 'src/components/Protected';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
];

// ---------------------------------------------------------------------

export default function RoleUser(props) {
  const {
    row,
    submitSuccess,
    submitError,
    closeMainDialog
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [dataTable, setdataTable] = useState([]);
  const [selectedUser, setselectedUser] = useState([]);
  const [newUsers, setnewUsers] = useState([]);
  const [userOptions, setuserOptions] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [openUserAutoComplete, setopenUserAutoComplete] = useState(false);
  const [userAutoCompleteLoading, setuserAutoCompleteLoading] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState('');
  const [selectUser, setselectUser] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('READ');

  
  const getRoleUserData = async() => {
    const params = {
      role_id:row.id
    }
    const response = await axios.get(endpoint.role.user,{params:params});
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getuserOptions = async(autoCompleteKeyword) => {
    setuserAutoCompleteLoading(true)
    const params = {
      name:autoCompleteKeyword
    }
    const response = await axios.get(endpoint.user.option,{params:params});
    if (response && response.data) {
      setuserOptions(response.data);
    }
    setuserAutoCompleteLoading(false)
    
  };

  useDebounce(
    () => {
      if(autoCompleteKeyword.trim()!=''){
        getuserOptions(autoCompleteKeyword)
      }      
    },
    500,
    [autoCompleteKeyword]
  );

  const closeSubDialog = () => {
    setopenSubDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((n) => n.id);
      setselectedUser(newSelecteds);
      return;
    }
    setselectedUser([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedUser.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUser, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUser.slice(1));
    } else if (selectedIndex === selectedUser.length - 1) {
      newSelected = newSelected.concat(selectedUser.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUser.slice(0, selectedIndex),
        selectedUser.slice(selectedIndex + 1)
      );
    }
    setselectedUser(newSelected);
  };


  const showDeleteConfirmation = () => {
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selectedUser}
        title="User"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params={
      role_id:row.id,
      user_ids:selectedUser
    }
    const response = await axios.delete(endpoint.role.user, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getRoleUserData();
    }
    setselectedUser([])
  };

  const showSelectUser = () => {
    setselectUser(true);
  };

  const addUser = async() => {
    const user_ids = newUsers.map(user=>(user.id))
    const params={
      role_id:row.id,
      user_ids:user_ids
    }
    await axios.put(endpoint.role.user, params);
    
    getRoleUserData()
    setselectUser(false);
  };

  const selectNewUser = (e)=>{
    setnewUsers(e.target.value)
  }

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getRoleUserData();
    }
    
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Conditional condition={selectUser === true}>
              <Autocomplete
                multiple
                id="get-user"
                style={{ width: 300 }}
                open={openUserAutoComplete}
                onOpen={() => {
                  setopenUserAutoComplete(true);
                }}
                onClose={() => {
                  setopenUserAutoComplete(false);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={userOptions}
                loading={userAutoCompleteLoading}
                onChange={(event, newValue) => {
                  setnewUsers(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Users"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {userAutoCompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
                <MButton
                  variant="contained"
                  color="primary"
                  style={{ margin: '0 8px' }}
                  onClick={addUser}
                >
                  Submit User
                </MButton>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: '0 8px' }}
                  onClick={()=>setselectUser(false)}
                >
                  Cancel
                </MButton>
              </Conditional>
              <Conditional condition={selectedUser.length > 0}>
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
              </Conditional>

              <Conditional condition={selectUser === false}>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="primary"
                    style={{ margin: '0 8px' }}
                    onClick={showSelectUser}
                  >
                    Add User
                  </MButton>                
                </Protected>
              </Conditional>
          </Grid>
        </Grid>

        <Card style={{ marginBottom: 16 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RoleListHead
                  order={order}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selectedUser.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                      const { id, name, path, icon } = row;
                      const isItemSelected = selectedUser.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={(event) => handleClick(event, id)}
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
                              {name}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  
                </TableBody>
                
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        <Grid container>
          <Grid item xs={6} container justifyContent="flex-start">
            
          </Grid>

          <Grid item xs={6} container justifyContent="flex-end">
            {props.closeSubDialog && (
              <Button
                variant="contained"
                onClick={props.closeSubDialog}
                color="inherit"
              >
                close
              </Button>
            )}

            {closeMainDialog && (
              <Button
                variant="contained"
                onClick={closeMainDialog}
                color="inherit"
              >
                close
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={openSubDialog}
        maxWidth={maxWidth}
        onClose={closeSubDialog}
        fullWidth
        scroll="body"
      >
        {dialogContent}
      </Dialog>
    </>
  );
}
