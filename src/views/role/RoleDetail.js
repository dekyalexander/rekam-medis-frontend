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
  Switch
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
// ----------------------------------------------------------------------

RoleDetail.propTypes = {
  sx: PropTypes.object,
};

export default function RoleDetail(props) {
  const { row, getData, sx, submitSuccess, submitError } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: undefined,
    head_role_id: 0,
    name: "",
    code: "",
    data_access_value: 1,
    role_level_value:0,
    unit_id:0,
    subtitute_role_id:0,
    is_head: 0,
    is_active:1
  });
  const [roleOptions, setroleOptions] = useState([]);
  const [dataAccessOptions, setdataAccessOptions] = useState([]);
  const [levelOptions, setlevelOptions] = useState([]);
  const [unitOptions, setunitOptions] = useState([]);

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row
      });
    }
  };

  const getRoleOptions = async () => {
    const params = {
      not_id: row ? row.id : undefined,
    };
    const response = await axios.get(endpoint.role.option, { params: params });
    if (response && response.data) {
      setroleOptions(response.data);
    }
  };

  const getunitOptions = async () => {
    const params = {};
    const response = await axios.get(endpoint.unit.option, { params: params });
    if (response && response.data) {
      setunitOptions(response.data);
    }
  };

  const getlevelOptions = async () => {
    const params={
      group:'role_level'
    }
    const response = await axios.get(endpoint.parameter.option,{params:params});
    if (response && response.data) {
      setlevelOptions(response.data);
    }
    
  };

  const getdataAccessOptions = async () => {
    const params={
      group:'data_access'
    }
    const response = await axios.get(endpoint.parameter.option,{params:params});
    if (response && response.data) {
      setdataAccessOptions(response.data);
    }
    
  };

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue;

    if (["is_head","is_active"].includes(fieldName)) {
      value = eventValue.target.checked ? 1 : 0;
    }else {
      value = eventValue.target.value;
    }

    newState[fieldName] = value;
    setstate(newState);
  };

  const submit = async () => {
    let params = {
      head_role_id: state.head_role_id,
      name: state.name,
      code: state.code,
      data_access_value: state.data_access_value,
      is_head: state.is_head,
      role_level_value:state.role_level_value,
      unit_id:state.unit_id,
      subtitute_role_id:state.subtitute_role_id
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.role.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.role.root, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };


  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    getdataAccessOptions()
    getunitOptions()
    getlevelOptions()
    getRoleOptions();
    if(row && props.actionCode!=='CREATE'){
      getDetail(row);
    }
  }, [row]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <Grid container style={{ marginBottom: 16 }}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}          
          >
            <InputLabel id="role_level_value-label">Level</InputLabel>
            <Select
              labelId="role_level_value-label"
              id="role_level_value-select"
              label="Level"
              value={state.role_level_value}
              onChange={(e) => handleChange("role_level_value", e)}
            >
              {levelOptions.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}          
          >
            <InputLabel id="unit_id-label">Unit</InputLabel>
            <Select
              labelId="unit_id-label"
              id="unit_id-select"
              label="Unit"
              value={state.unit_id}
              onChange={(e) => handleChange("unit_id", e)}
            >
              {unitOptions.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="role-label">Head Role</InputLabel>
          <Select
            labelId="role-label"
            id="role-select"
            value={state.head_role_id}
            onChange={(e) => handleChange("head_role_id", e)}
            label="Head Role"
          >
            <MenuItem value={undefined}>
              <em>None</em>
            </MenuItem>
            {roleOptions.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <TextField
        value={state.name}
        onChange={(e) => handleChange("name", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Name"
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

      <Grid container style={{ marginBottom: 16 }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: "50%" }}          
        >
          <InputLabel id="data_access-label">Data Access</InputLabel>
          <Select
            labelId="data_access-label"
            id="data_access-select"
            label="Data Access"
            value={state.data_access_value}
            onChange={(e) => handleChange("data_access_value", e)}
          >
            {dataAccessOptions.map((dataAccess) => (
              <MenuItem key={dataAccess.value} value={dataAccess.value}>
                {dataAccess.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <FormControlLabel
        label="have subordinate"
        control={
          <Checkbox
            checked={state.is_head === 1}
            onChange={(e) => handleChange("is_head", e)}
          />
        }
      />
      
      <Grid container style={{ marginBottom: 16 }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: "50%" }}          
        >
          <InputLabel id="subtitute_role_id-label">Subtitute Role</InputLabel>
          <Select
            labelId="subtitute_role_id-label"
            id="subtitute_role_id-select"
            label="Level"
            value={state.subtitute_role_id}
            onChange={(e) => handleChange("subtitute_role_id", e)}
          >
            <MenuItem value={undefined}>
              <em>None</em>
            </MenuItem>
            
            {roleOptions.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <FormControlLabel
        control={
          <Switch            
            checked={state.is_active===1}
            onChange={(e) => handleChange("is_active", e)}
          />
        }
        label="Active"
      />

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
