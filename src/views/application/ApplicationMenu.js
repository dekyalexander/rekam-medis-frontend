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
  Input
} from '@material-ui/core';

import { MButton } from '../../components/@material-extend';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import ApplicationListHead from './ApplicationListHead';
import Conditional from '../../components/Conditional';
import MenuDetail from '../menu/MenuDetail';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import Protected from 'src/components/Protected';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'path', label: 'Path', alignRight: false },
  { id: 'icon', label: 'Icon', alignRight: false }
];

// ---------------------------------------------------------------------

export default function ApplicationMenu(props) {
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [newMenus, setnewMenus] = useState([]);
  const [menuOptions, setmenuOptions] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [selectMenu, setselectMenu] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('READ');

  const getApplicationMenuData = async() => {
    const params = {
      application_id:row.id
    }
    const response = await axios.get(endpoint.application.menu,{params:params});
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getmenuOptions = async() => {
    const params = {
      not_application_id:row.id
    }
    const response = await axios.get(endpoint.menu.option,{params:params});
    if (response && response.data) {
      setmenuOptions(response.data);
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
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelected);
  };


  const showDeleteConfirmation = () => {
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selectedIds}
        title="Menu"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      menu_ids: selectedIds
    };
    const response = await axios.delete(endpoint.application.menu, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getApplicationMenuData();
    }
    setSelectedIds([])
  };

  const showMenuForm = () => {
    setMaxWidth('md');
    setdialogContent(
      <MenuDetail 
      actionCode="CREATE" 
      closeSubDialog={closeSubDialog}
      application_id={row.id} 
      getApplicationMenuData={getApplicationMenuData}
      submitSuccess={submitSuccess}
      />
    );
    setopenSubDialog(true);
  };

  const showSelectMenu = () => {
    setselectMenu(true);
  };

  const addMenu = async() => {
    const params = {
      menu_ids: newMenus,
      application_id:row.id       
    }
    
    await axios.put(endpoint.application.menu, params);
    
    getApplicationMenuData()
    setselectMenu(false);
  };

  const selectNewMenu = (e)=>{
    setnewMenus(e.target.value)
  }

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getmenuOptions()
      getApplicationMenuData();
    }
    
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Conditional condition={selectMenu === true}>
                <FormControl variant="outlined" style={{ minWidth: 120 }}>
                  <InputLabel id="menu-label">Menu</InputLabel>
                  <Select
                    labelId="menu-label"
                    id="menu-select"
                    multiple
                    input={<Input />}
                    value={newMenus}
                    onChange={selectNewMenu}
                    label="Menu"
                  >
                    {menuOptions.map((menu) => (
                      <MenuItem key={menu.id} value={menu.id}>
                        {menu.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <MButton
                  variant="contained"
                  color="primary"
                  style={{ margin: '0 8px' }}
                  onClick={addMenu}
                >
                  Submit Menu
                </MButton>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: '0 8px' }}
                  onClick={()=>setselectMenu(false)}
                >
                  Cancel
                </MButton>
              </Conditional>
              <Conditional condition={selectedIds.length > 0}>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: '0 8px' }}
                  onClick={showDeleteConfirmation}
                >
                  Delete
                </MButton>
              </Conditional>

              <Conditional condition={selectMenu === false}>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="primary"
                    style={{ margin: '0 8px' }}
                    onClick={showSelectMenu}
                  >
                    Add Menu
                  </MButton>
                </Protected>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="secondary"
                    style={{ margin: '0 8px' }}
                    onClick={showMenuForm}
                  >
                    Create Menu
                  </MButton>
                </Protected>
              </Conditional>
          </Grid>
        </Grid>

        <Card style={{ marginBottom: 16 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ApplicationListHead
                  order={order}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selectedIds.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                      const { id, name, path, icon } = row;
                      const isItemSelected = selectedIds.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selectedIds={isItemSelected}
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
