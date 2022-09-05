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

KelasDetail.propTypes = {
  sx: PropTypes.object,
};

export default function KelasDetail(props) {
  const { row, getData, sx, submitSuccess, submitError } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [jenjangOptions, setjenjangOptions] = useState([]);
  const [schoolOptions, setschoolOptions] = useState([]);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: undefined,
    name: "",
    code: "",
    jenjang_id:null,
    jenjang:null,
    school_id:null,
    school:null,
        
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

  const getjenjangOptions = async () => {
    const response = await axios.get(endpoint.jenjang.option);
    if (response && response.data) {
      setjenjangOptions(response.data);
    }
  };

  const getschoolOptions = async () => {
    const response = await axios.get(endpoint.school.option);
    if (response && response.data) {
      setschoolOptions(response.data);
    }
  };

  const submit = async () => {
    let params = {
      ...state
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.kelas.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.kelas.root, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };

  useEffect(() => {
    if(actionCode!=='READ'){
      getjenjangOptions()
      getschoolOptions()
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
          value={state.school && state.school.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="School"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="school-label">School</InputLabel>
            <Select
              labelId="school-label"
              id="school-select"
              name="school_id"
              value={state.school_id}
              label="School"
              onChange={(e) => handleChange("school_id", e)}
              error={errors.school_id}
            >
              {schoolOptions.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.school_id}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

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
