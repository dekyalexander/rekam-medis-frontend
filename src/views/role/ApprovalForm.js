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

ApprovalForm.propTypes = {
  sx: PropTypes.object,
};

export default function ApprovalForm(props) {
  const { role_id, getRoleApprovalData, sx, submitSuccess, submitError } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    application_id: 0,
    menu_id: 0,
    action_id: 0,
    level: 1
  });
  const [menuOptions, setmenuOptions] = useState([]);
  const [applicationOptions, setapplicationOptions] = useState([]);
  const [actionOptions, setactionOptions] = useState([]);
  const [levelOptions, setlevelOptions] = useState([1,2,3,4,5,6,7,8,9,10]);

  const getapplicationOptions = async () => {
    const response = await axios.get(endpoint.application.option);
    if (response && response.data) {
      setapplicationOptions(response.data);
    }
  };

  const getmenuOptions = async (application_id) => {
    const params={
      application_id:application_id
    }
    const response = await axios.get(endpoint.menu.option, {params:params});
    if (response && response.data) {
      setmenuOptions(response.data);
    }
  };

  const getactionOptions = async (application_id, menu_id) => {
    const params = {
      application_id:application_id,
      menu_id:menu_id
    };
    const response = await axios.get(endpoint.action.option, { params: params });
    if (response && response.data) {
      setactionOptions(response.data);
    }
  };

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue;

    if (fieldName === "application_id") {
      value = eventValue.target.value;
      getmenuOptions(value)
      newState['menu_id']=0
      newState['action_id']=0
    } 
    else if (fieldName === "menu_id") {
      value = eventValue.target.value;
      getactionOptions(state.application_id,value)
      newState['action_id']=0
    } 
    
    value = eventValue.target.value;

    newState[fieldName] = value;
    setstate(newState);
  };

  const submit = async () => {
    let params = {
      ...state,
      role_id:role_id
    };
    await axios.put(endpoint.role.approval, params);
    setisSubmitting(false);
    submitSuccess("saving data success");
    getRoleApprovalData();
  };

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    getapplicationOptions()
  }, []);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <Grid container style={{ marginBottom: 16 }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: '50%' }}
        >
          <InputLabel id="application-label">Application</InputLabel>
          <Select
            labelId="application-label"
            id="application-select"            
            value={state.application_id}
            onChange={(e) => handleChange("application_id", e)}
            label="Application"
          >
            {applicationOptions.map((application) => (
              <MenuItem key={application.id} value={application.id}>
                {application.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid container style={{ marginBottom: 16 }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: '50%' }}
        >
          <InputLabel id="menu-label">Menu</InputLabel>
          <Select
            labelId="menu-label"
            id="menu-select"            
            value={state.menu_id}
            onChange={(e) => handleChange("menu_id", e)}
            label="Menu"
          >
            {menuOptions.map((menu) => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid container style={{ marginBottom: 16 }}>               
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="action-label">Action</InputLabel>
          <Select
            labelId="action-label"
            id="action-select"
            value={state.action_id}
            onChange={(e) => handleChange("action_id", e)}
            label="Action"
          >
            <MenuItem value={undefined}>
              <em>None</em>
            </MenuItem>
            {actionOptions.map((role) => (
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
