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
import StatusChip from "src/components/StatusChip";
// ----------------------------------------------------------------------

TahunPelajaranDetail.propTypes = {
  sx: PropTypes.object,
};

export default function TahunPelajaranDetail(props) {
  const { row, getData, sx, submitSuccess, submitError } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: undefined,
    name: "",
    start_date: undefined,
    end_date: undefined,
    is_active: 0
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

    if (fieldName === "is_active") {
         value = eventValue.target.checked ? 1 : 0;
       }else {
         value = eventValue.target.value;
    }

    newState[fieldName] = value;
    setstate(newState);
  };

  const submit = async () => {
    let params = {
      ...state
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.tahun_pelajaran.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.tahun_pelajaran.root, params);
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

      <Conditional condition={actionCode === "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <StatusChip status={state.is_active}/>
        </Grid>
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControlLabel
            control={
              <Switch            
                checked={state.is_active===1}
                onChange={(e) => handleChange("is_active", e)}
              />
            }
            label="Status"
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
