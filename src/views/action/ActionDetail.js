import { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
// material
import {
  Grid,
  Card,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { values } from "lodash";

// ----------------------------------------------------------------------

ActionDetail.propTypes = {
  sx: PropTypes.object,
};

export default function ActionDetail(props) {
  const {
    row,
    getData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
    closeSubDialog,
    getMenuActionData,
    application_id,
    menu_id
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [state, setState] = useState({
    name: "",
    code: "",
    application_id: "",
    menu_id: "",
    need_approval: 0,
    approval_type_value: 1,
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [menuOptions, setmenuOptions] = useState([]);
  const [applicationOptions, setapplicationOptions] = useState([]);

  const resetForm = () => {
    setState({
      name: "",
      code: "",
      application_id: "",
      menu_id: "",
      need_approval: 0,
      approval_type_value: "",
      description: "",
    });
    setErrors({});
  };

  const getmenuOptions = async (application_id) => {
    const params = {
      application_id: application_id,
    };
    const response = await axios.get(endpoint.menu.option, { params: params });
    if (response && response.data) {
      setmenuOptions(response.data);
    }
  };

  const getapplicationOptions = async () => {
    const response = await axios.get(endpoint.application.option);
    if (response && response.data) {
      setapplicationOptions(response.data);
    }
  };

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue;

    if (fieldName === "application_id") {
      value = eventValue.target.value;
      getmenuOptions(value);
    } else if (fieldName === "need_approval") {
      value = eventValue.target.checked ? 1 : 0;
    } else {
      value = eventValue.target.value;
    }

    newState[fieldName] = value;
    setState(newState);
  };

  const getDetail = (row) => {
    if (row) {
      setState({ ...row });
      getmenuOptions(row.application_id);
    }
  };

  const submit = async () => {
    if (true) {
      let params = {
        code: state.id,
        code: state.code,
        name: state.name,
        application_id: state.application_id,
        menu_id: state.menu_id,
        need_approval: state.need_approval,
        approval_type_value: state.approval_type_value,
        description: state.description,
      };
      if (actionCode === "CREATE") {
        await axios.post(endpoint.action.root, params);
      } else {
        params = { id: state.id, ...params };
        await axios.put(endpoint.action.root, params);
      }
      setisSubmitting(false);
      submitSuccess("saving data success");
      if (getMenuActionData) {
        getMenuActionData();
        closeSubDialog();
      } else {
        getData();
      }
    }
  };

  useEffect(() => {
    if (application_id && menu_id) {
      getmenuOptions(application_id);
      setState({
        ...state,
        application_id: application_id,
        menu_id: menu_id,
      });
    }
  }, [application_id, menu_id]);


  
  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    getapplicationOptions();
    if(row && props.actionCode!=='CREATE'){
      getDetail(row);
    }    
    
  }, [row]);

  

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      {/* <Form autoComplete="off"> */}
      <Grid container style={{ marginBottom: 16 }}>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="application-label">Application</InputLabel>
          <Select
            labelId="application-label"
            id="application-select"
            name="application_id"
            value={state.application_id}
            label="Application"
            onChange={(e) => handleChange("application_id", e)}
            error={errors.application_id}
          >
            {applicationOptions.map((application) => (
              <MenuItem key={application.id} value={application.id}>
                {application.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.application_id}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid container style={{ marginBottom: 16 }}>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="parent-label">Menu</InputLabel>
          <Select
            labelId="parent-label"
            id="parent-select"
            name="menu_id"
            value={state.menu_id}
            label="Menu"
            onChange={(e) => handleChange("menu_id", e)}
            error={errors.menu_id}
          >
            {menuOptions.map((menu) => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.menu_id}</FormHelperText>
        </FormControl>
      </Grid>

      <TextField
        name="name"
        value={state.name}
        onChange={(e) => handleChange("name", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Name"
        sx={{ mb: 3 }}
      />

      <TextField
        name="code"
        value={state.code}
        onChange={(e) => handleChange("code", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Code"
        error={errors.code}
        sx={{ mb: 3 }}
      />
      <Grid container style={{ marginBottom: 16 }}>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                value={state.need_approval}
                color="secondary"
                checked={state.need_approval === 1}
                onChange={(e) => handleChange("need_approval", e)}
              />
            }
            label="Neded Approval"
          ></FormControlLabel>
        </FormControl>
      </Grid>

      <Grid container style={{ marginBottom: 16 }}>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="level-type-select-label">Level Type</InputLabel>
          <Select
            name="approval_type_value"
            labelId="level-type-select-label"
            id="level-type-select-label"
            value={state.approval_type_value}
            label="Level Type"
            onChange={(e) => handleChange("approval_type_value", e)}
            error={errors.approval_type_value}
          >
            <MenuItem value="">
              <em>Level Type</em>
            </MenuItem>
            <MenuItem value={1}>One Level</MenuItem>
            <MenuItem value={2}>Multi Level</MenuItem>
          </Select>
          <FormHelperText>{errors.menu_id}</FormHelperText>
        </FormControl>
      </Grid>

      <TextField
        value={state.description}
        onChange={(e) => handleChange("description", e)}
        fullWidth
        autoComplete="off"
        type="text"
        label="Description"
        sx={{ mb: 3 }}
      />

      <Grid container>
        <Grid item xs={6} container justifyContent="flex-start">
          <Conditional condition={actionCode === "READ"}>
            <Button onClick={() => setactionCode("EDIT")}>edit</Button>
          </Conditional>
          <Conditional condition={actionCode !== "READ"}>
            <LoadingButton
              onClick={submit}
              variant="contained"
              pending={isSubmitting}
            >
              Save
            </LoadingButton>
          </Conditional>
        </Grid>

        <Grid item xs={6} container justifyContent="flex-end">
          {closeSubDialog && (
            <Button
              variant="contained"
              onClick={closeSubDialog}
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
      {/* </Form> */}
    </Card>
  );
}
