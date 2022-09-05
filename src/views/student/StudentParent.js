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
import StudentListHead from './StudentListHead';
import Conditional from '../../components/Conditional';
import ParentDetail from '../parent/ParentDetail';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import { useDebounce } from "react-use";
import Protected from 'src/components/Protected';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
];

// ---------------------------------------------------------------------

export default function StudentParent(props) {
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
  const [selectedParent, setselectedParent] = useState([]);
  const [newParents, setnewParents] = useState([]);
  const [parentOptions, setparentOptions] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [openParentAutoComplete, setopenParentAutoComplete] = useState(false);
  const [parentAutoCompleteLoading, setparentAutoCompleteLoading] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState('');
  const [selectParent, setselectParent] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('READ');

  
  const getStudentParentData = async() => {
    const params = {
      student_id:row.id
    }
    const response = await axios.get(endpoint.student.parent,{params:params});
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getparentOptions = async(autoCompleteKeyword) => {
    setparentAutoCompleteLoading(true)
    const params = {
      name:autoCompleteKeyword
    }
    const response = await axios.get(endpoint.parent.option,{params:params});
    if (response && response.data) {
      setparentOptions(response.data);
    }
    setparentAutoCompleteLoading(false)
    
  };

  useDebounce(
    () => {
      if(autoCompleteKeyword.trim()!=''){
        getparentOptions(autoCompleteKeyword)
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
      setselectedParent(newSelecteds);
      return;
    }
    setselectedParent([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedParent.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedParent, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedParent.slice(1));
    } else if (selectedIndex === selectedParent.length - 1) {
      newSelected = newSelected.concat(selectedParent.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedParent.slice(0, selectedIndex),
        selectedParent.slice(selectedIndex + 1)
      );
    }
    setselectedParent(newSelected);
  };


  const showDeleteConfirmation = () => {
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selectedParent}
        title="Parent"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params={
      student_id:row.id,
      parent_ids:selectedParent
    }
    const response = await axios.delete(endpoint.student.parent, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getStudentParentData();
    }
    setselectedParent([])
  };

  const showSelectParent = () => {
    setselectParent(true);
  };

  const addParent = async() => {
    const parent_ids = newParents.map(parent=>(parent.id))
    const params={
      student_id:row.id,
      parent_ids:parent_ids
    }
    await axios.put(endpoint.student.parent, params);
    
    getStudentParentData()
    setselectParent(false);
  };

  const selectNewParent = (e)=>{
    setnewParents(e.target.value)
  }

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getStudentParentData();
    }
    
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Conditional condition={selectParent === true}>
              <Autocomplete
                multiple
                id="get-parent"
                style={{ width: 300 }}
                open={openParentAutoComplete}
                onOpen={() => {
                  setopenParentAutoComplete(true);
                }}
                onClose={() => {
                  setopenParentAutoComplete(false);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={parentOptions}
                loading={parentAutoCompleteLoading}
                onChange={(event, newValue) => {
                  setnewParents(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Parents"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {parentAutoCompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
                  onClick={addParent}
                >
                  Submit Parent
                </MButton>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: '0 8px' }}
                  onClick={()=>setselectParent(false)}
                >
                  Cancel
                </MButton>
              </Conditional>
              <Conditional condition={selectedParent.length > 0}>
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

              <Conditional condition={selectParent === false}>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="primary"
                    style={{ margin: '0 8px' }}
                    onClick={showSelectParent}
                  >
                    Add Parent
                  </MButton>                
                </Protected>
              </Conditional>
          </Grid>
        </Grid>

        <Card style={{ marginBottom: 16 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <StudentListHead
                  order={order}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selectedParent.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                      const { id, name, path, icon } = row;
                      const isItemSelected = selectedParent.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          student="checkbox"
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
