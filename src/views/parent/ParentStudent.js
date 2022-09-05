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
import ParentListHead from './ParentListHead';
import Conditional from '../../components/Conditional';
import StudentDetail from '../student/StudentDetail';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import { useDebounce } from "react-use";
import Protected from 'src/components/Protected';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
];

// ---------------------------------------------------------------------

export default function ParentStudent(props) {
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
  const [selectedStudent, setselectedStudent] = useState([]);
  const [newStudents, setnewStudents] = useState([]);
  const [studentOptions, setstudentOptions] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [openStudentAutoComplete, setopenStudentAutoComplete] = useState(false);
  const [studentAutoCompleteLoading, setstudentAutoCompleteLoading] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState('');
  const [selectStudent, setselectStudent] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('READ');

  
  const getParentStudentData = async() => {
    const params = {
      parent_id:row.id
    }
    const response = await axios.get(endpoint.parent.student,{params:params});
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getstudentOptions = async(autoCompleteKeyword) => {
    setstudentAutoCompleteLoading(true)
    const params = {
      name:autoCompleteKeyword
    }
    const response = await axios.get(endpoint.student.option,{params:params});
    if (response && response.data) {
      setstudentOptions(response.data);
    }
    setstudentAutoCompleteLoading(false)
    
  };

  useDebounce(
    () => {
      if(autoCompleteKeyword.trim()!=''){
        getstudentOptions(autoCompleteKeyword)
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
      setselectedStudent(newSelecteds);
      return;
    }
    setselectedStudent([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedStudent.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedStudent, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedStudent.slice(1));
    } else if (selectedIndex === selectedStudent.length - 1) {
      newSelected = newSelected.concat(selectedStudent.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedStudent.slice(0, selectedIndex),
        selectedStudent.slice(selectedIndex + 1)
      );
    }
    setselectedStudent(newSelected);
  };


  const showDeleteConfirmation = () => {
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selectedStudent}
        title="Student"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params={
      parent_id:row.id,
      student_ids:selectedStudent
    }
    const response = await axios.delete(endpoint.parent.student, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getParentStudentData();
    }
    setselectedStudent([])
  };

  const showSelectStudent = () => {
    setselectStudent(true);
  };

  const addStudent = async() => {
    const student_ids = newStudents.map(student=>(student.id))
    const params={
      parent_id:row.id,
      sex_type_value:row.sex_type_value,
      student_ids:student_ids
    }
    await axios.put(endpoint.parent.student, params);
    
    getParentStudentData()
    setselectStudent(false);
  };

  const selectNewStudent = (e)=>{
    setnewStudents(e.target.value)
  }

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getParentStudentData();
    }
    
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Conditional condition={selectStudent === true}>
              <Autocomplete
                multiple
                id="get-student"
                style={{ width: 300 }}
                open={openStudentAutoComplete}
                onOpen={() => {
                  setopenStudentAutoComplete(true);
                }}
                onClose={() => {
                  setopenStudentAutoComplete(false);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={studentOptions}
                loading={studentAutoCompleteLoading}
                onChange={(event, newValue) => {
                  setnewStudents(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Students"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {studentAutoCompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
                  onClick={addStudent}
                >
                  Submit Student
                </MButton>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: '0 8px' }}
                  onClick={()=>setselectStudent(false)}
                >
                  Cancel
                </MButton>
              </Conditional>
              <Conditional condition={selectedStudent.length > 0}>
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

              <Conditional condition={selectStudent === false}>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="primary"
                    style={{ margin: '0 8px' }}
                    onClick={showSelectStudent}
                  >
                    Add Student
                  </MButton>                
                </Protected>
              </Conditional>
          </Grid>
        </Grid>

        <Card style={{ marginBottom: 16 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ParentListHead
                  order={order}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selectedStudent.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                      const { id, name, path, icon } = row;
                      const isItemSelected = selectedStudent.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          parent="checkbox"
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
