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
  Select,
  Input,
  TextField,
  Autocomplete
} from '@material-ui/core';

import { MButton } from '../../components/@material-extend';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import UserListHead from './UserListHead';
import Conditional from '../../components/Conditional';
import UserDetail from './UserDetail';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import Protected from 'src/components/Protected';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'dataaccess', label: 'Data Access', alignRight: false }
];

// ---------------------------------------------------------------------

export default function UserRole(props) {
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
  const [selected, setSelected] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newRoles, setnewRoles] = useState([]);
  const [roleOption, setroleOption] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [selectRole, setselectRole] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('READ');

  const getUserRoleData = async() => {
    const params = {
      user_id:row.id
    }
    const response = await axios.get(endpoint.user.role,{params:params});
    if (response && response.data) {
      setdataTable(response.data);
    }
  };
  
  const getRoleOption = async() => {
    const params = {
      not_user_id:row.id
    }
    const response = await axios.get(endpoint.user.role,{params:params});
    if (response && response.data) {
      setroleOption(response.data);
    }    
  };

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
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };


  const showDeleteConfirmation = () => {
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selected}
        title="User Role"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      user_id: row.id,
      role_ids: selected
    };
    const response = await axios.delete(endpoint.user.role, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getUserRoleData();
    }
    setSelectedIds([])
  }; 
  
  const showSelectRole = () => {
    setselectRole(true);
  };

  const addRole = async() => {
    const data = {
      user_id: row.id,
      role_ids: newRoles.map(role=>role.id)
    }
    await axios.put(endpoint.user.role, data);    
    setnewRoles([])
    getUserRoleData()
    setselectRole(false);
  };

  const selectNewRole = (e)=>{
    setnewRoles(e)
  }

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getRoleOption()
      getUserRoleData();
    }
    
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
            <Conditional condition={selectRole === true}>
              <Autocomplete
                style={{ width: 200 }}
                multiple
                id="role"
                options={roleOption}
                getOptionLabel={(option) => option.name}
                value={newRoles}
                onChange={(event, newValue) => {
                  selectNewRole(newValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Role"
                    placeholder="Select role"
                  />
                )}
              />
              <MButton
                variant="contained"
                color="primary"
                style={{ margin: '0 8px' }}
                onClick={addRole}
              >
                Submit Role
              </MButton>
              <MButton
                variant="contained"
                color="error"
                style={{ margin: '0 8px' }}
                onClick={()=>setselectRole(false)}
              >
                Cancel
              </MButton>
            </Conditional>
            <Conditional condition={selected.length > 0}> {
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
            }
            </Conditional>
            <Conditional condition={selectRole === false}>
              <Protected allowedCodes={['EDIT']} >
                <MButton
                  variant="contained"
                  color="primary"
                  style={{ margin: '0 8px' }}
                  onClick={showSelectRole}
                >
                  Add Role
                </MButton>
              </Protected>
            </Conditional>              
            
          </Grid>
        </Grid>

        <Card style={{ marginBottom: 16 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                      const { id, name, path, icon } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;

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
                          <TableCell align="left">{path}</TableCell>
                          <TableCell align="left">{icon}</TableCell>
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
