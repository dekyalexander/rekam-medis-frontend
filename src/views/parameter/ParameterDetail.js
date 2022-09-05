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

ParameterDetail.propTypes = {
  sx: PropTypes.object,
};

export default function ParameterDetail(props) {
  const { row, getData, sx, submitSuccess, submitError } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: undefined,
    group: "",
    name: "",
    code: "",
    value: 1,
    description: "",
    owner_user_id:0,
    owner_role_id:0
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
    let value = eventValue.target.value

    newState[fieldName] = value;
    setstate(newState);
  };

  const submit = async () => {
    let params = {
      ...state
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.parameter.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.parameter.root, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };

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
        value={state.group}
        onChange={(e) => handleChange("group", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Group"
        error={Boolean(errors.group)}
        helperText={errors.group}
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
        value={state.value}
        onChange={(e) => handleChange("value", e)}
        fullWidth
        autoComplete="on"
        type="number"
        label="value"
        error={Boolean(errors.value)}
        helperText={errors.value}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.description}
        onChange={(e) => handleChange("description", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="description"
        error={Boolean(errors.description)}
        helperText={errors.description}
        sx={{ mb: 3 }}
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
