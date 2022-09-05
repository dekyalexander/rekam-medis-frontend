import { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Box,
  Card,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Switch,
  CircularProgress,
  Autocomplete
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
import { useDebounce } from "react-use";
// ----------------------------------------------------------------------

SchoolDetail.propTypes = {
  sx: PropTypes.object,
};

export default function SchoolDetail(props) {
  const { row, getData, sx, submitSuccess, submitError } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [openEmployeeAutoComplete, setopenEmployeeAutoComplete] = useState(false);
  const [employeeAutoCompleteLoading, setemployeeAutoCompleteLoading] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState('');
  const [jenjangOptions, setjenjangOptions] = useState([]);
  const [employeeOptions, setemployeeOptions] = useState([]);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: undefined,
    name: "",
    code: "",
    jenjang_id:null,
    jenjang:null,
    head_employee_id:null,
    head_employee:null
  });
  

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
    }
  };

  
  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = null

    if(fieldName==='head_employee'){
      value = eventValue
      newState['head_employee_id'] = eventValue.id
    }else{
      value = eventValue.target.value
    }

    newState[fieldName] = value;
    setstate(newState);
  };

  const getjenjangOptions = async () => {
    const response = await axios.get(endpoint.jenjang.option);
    if (response && response.data) {
      setjenjangOptions(response.data);
    }
  };

  const getemployeeOptions = async() => {
    setemployeeAutoCompleteLoading(true)
    const params = {
      
    }
    const response = await axios.get(endpoint.employee.option,{params:params});
    if (response && response.data) {
      setemployeeOptions(response.data);
    }
    setemployeeAutoCompleteLoading(false)
    
  };

  useDebounce(
    () => {
      if(autoCompleteKeyword.trim()!=''){
        getemployeeOptions(autoCompleteKeyword)
      }      
    },
    500,
    [autoCompleteKeyword]
  );

  const submit = async () => {
    let params = {
      ...state
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.school.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.school.root, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };

  useEffect(() => {
    if(actionCode!=='READ'){
      getjenjangOptions()
    }
  }, [actionCode])

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row && props.actionCode!=='CREATE'){
      getDetail(row);
    }
  }, [row]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>      

      

      <TextField
        value={state.name}
        onChange={(e) => handleChange("name", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="name"
        error={Boolean(errors.name)}
        helperText={errors.name}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.code}
        onChange={(e) => handleChange("code", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Code"
        error={Boolean(errors.code)}
        helperText={errors.code}
        sx={{ mb: 3 }}
      />

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.jenjang && state.jenjang.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Jenjang"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="jenjang-label">Jenjang</InputLabel>
            <Select
              labelId="jenjang-label"
              id="jenjang-select"
              name="jenjang_id"
              value={state.jenjang_id}
              label="Jenjang"
              onChange={(e) => handleChange("jenjang_id", e)}
              error={errors.jenjang_id}
            >
              {jenjangOptions.map((jenjang) => (
                <MenuItem key={jenjang.id} value={jenjang.id}>
                  {jenjang.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.jenjang_id}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

      
      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.head_employee&&state.head_employee.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Head Master"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <Autocomplete
            id="get-employee"
            style={{ width: 300 }}
            open={openEmployeeAutoComplete}
            onOpen={() => {
              setopenEmployeeAutoComplete(true);
            }}
            onClose={() => {
              setopenEmployeeAutoComplete(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={employeeOptions}
            loading={employeeAutoCompleteLoading}
            onChange={(event, newValue) => {
              handleChange('head_employee',newValue)
            }}
            onInputChange={(event, newInputValue) => {
              setAutoCompleteKeyword(newInputValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employees"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeeAutoCompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Conditional>

      
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Conditional condition={actionCode === "READ"}>
          <Protected allowedCodes={['EDIT']} >
            <Button onClick={() => setactionCode("EDIT")}>edit</Button>
          </Protected>
        </Conditional>
        <Conditional condition={actionCode !== "READ"}>
          <Protected allowedCodes={['EDIT','CREATE']} >
            <LoadingButton
              onClick={submit}
              variant="contained"
              pending={isSubmitting}
            >
              Save
            </LoadingButton>
          </Protected>
        </Conditional>
      </Box>
    </Card>
  );
}
