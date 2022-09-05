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
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
// ----------------------------------------------------------------------

ApproverForm.propTypes = {
  sx: PropTypes.object,
};

export default function ApproverForm(props) {
  const { action_id, getActionApproverData, sx, submitSuccess, submitError, closeSubDialog } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    role_id: 0,
    level: 1
  });
  const [roleOptions, setroleOptions] = useState([]);
  const [levelOptions, setlevelOptions] = useState([1,2,3,4,5,6,7,8,9,10]);

  const getroleOptions = async () => {
    const response = await axios.get(endpoint.role.option);
    if (response && response.data) {
      setroleOptions(response.data);
    }
  };

  
  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue.target.value;

    newState[fieldName] = value;
    setstate(newState);
  };

  const submit = async () => {
    let params = {
      action_id:action_id,
      role_id:state.role_id,
      level:state.level
    };
    await axios.put(endpoint.action.approver, params);
    setisSubmitting(false);
    submitSuccess("saving data success");
    getActionApproverData();
    closeSubDialog()
  };

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    getroleOptions()
  }, []);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <Grid container style={{ marginBottom: 16 }}>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role-select"
            value={state.role_id}
            onChange={(e) => handleChange("role_id", e)}
            label="Role"
          >
            {roleOptions.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
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
          <InputLabel id="level-label">Level</InputLabel>
          <Select
            labelId="level-label"
            id="level-select"
            label="Level"
            value={state.level}
            onChange={(e) => handleChange("level", e)}
          >
            {levelOptions.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Protected allowedCodes={['EDIT','CREATE']} >
          <LoadingButton
            onClick={submit}
            variant="contained"
            pending={isSubmitting}
          >
            Save
          </LoadingButton>
        </Protected>
      </Box>
    </Card>
  );
}
