import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// material
import {
  Grid,
  Card,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";

// ----------------------------------------------------------------------

MenuDetail.propTypes = {
  sx: PropTypes.object,
};

export default function MenuDetail(props) {
  const {
    row,
    getData,
    getApplicationMenuData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
    closeSubDialog,
    application_id,
  } = props;

  const [actionCode, setactionCode] = useState("READ");
  const [state, setstate] = useState({
    application_id: "",
    parent_id:"",
    name: "",
    path: "",
    icon: "",
  });
  const [menuOptions, setmenuOptions] = useState([]);
  const [applicationOptions, setapplicationOptions] = useState([]);
  const [isSubmitting, setisSubmitting] = useState(false);

  const getmenuOptions = async (application_id) => {
    const params={
      application_id : application_id
    }
    const response = await axios.get(endpoint.menu.option,{params:params});
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

  const getDetail = (row) => {
    if (row) {
      setstate({ ...row });
      getmenuOptions(row.application_id)
    }
  };
  
  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue.target.value;
    if(fieldName==='application_id'){
      getmenuOptions(value)
    }
    newState[fieldName] = value;
    setstate(newState);
  };

  const submit = async () => {
    const params = {
      id: state.id,
      application_id: state.application_id,
      parent_id: state.parent_id,
      name: state.name,
      path: state.path,
      icon: state.icon,
    };

    if (actionCode === "CREATE") {
      await axios.post(endpoint.menu.root, params);
    } else {
      await axios.put(endpoint.menu.root, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    if (getApplicationMenuData) {
      getApplicationMenuData();
      closeSubDialog();
    } else {
      getData();
    }
  };

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    getapplicationOptions();   
    if(row && props.actionCode!=='CREATE'){ 
      getDetail(row);
    }
  }, [row]);

  useEffect(() => {
    if (application_id) {
      setstate({
        ...state,
        application_id:application_id
      })
      getmenuOptions(application_id)
    }
  }, [application_id]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
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
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="parent_id-label">Parent Menu</InputLabel>
              <Select
                labelId="parent_id-label"
                id="parent_id-select"
                value={state.parent_id}
                onChange={(e) => handleChange("parent_id", e)}
                label="Parent Menu"
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {menuOptions.map((parent) => (
                  <MenuItem key={parent.id} value={parent.id}>
                    {parent.name}
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
            value={state.path}
            onChange={(e) => handleChange("path", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Path"
            sx={{ mb: 3 }}
          />

          <TextField
            value={state.icon}
            onChange={(e) => handleChange("icon", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Icon"
            sx={{ mb: 3 }}
          />

          <Grid container>
            <Grid item xs={6} container justifyContent="flex-start">
              <Conditional condition={actionCode === "READ"}>
                <Protected allowedCodes={["EDIT"]}>
                  <Button onClick={() => setactionCode("EDIT")}>edit</Button>
                </Protected>
              </Conditional>
              <Conditional condition={actionCode !== "READ"}>
                <Protected allowedCodes={["EDIT", "CREATE"]}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    pending={isSubmitting}
                    onClick={submit}
                  >
                    Save
                  </LoadingButton>
                </Protected>
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
    </Card>
  );
}
