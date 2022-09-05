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
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
// ----------------------------------------------------------------------

BiodataDetail.propTypes = {
  sx: PropTypes.object,
};

export default function BiodataDetail(props) {
  const { row, getData, sx, submitSuccess, submitError, closeMainDialog } =
    props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: "",
    name: "",
    birth_date: "",
    birth_place: "",
    jenjang_id: "",
    handphone: "",
    address: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
    kodepos: "",
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
    let value = eventValue.target.value;

    if (fieldName === "id") {
    }

    newState[fieldName] = value;
    setstate(newState);
  };

  const submit = async () => {
    let params = {
      ...state,
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.student.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.student.root.update, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
    console.log(params);
    console.log(actionCode);
  };

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if (row && props.actionCode !== "CREATE") {
      getDetail(row);
    }
  }, [row]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <Grid container style={{ marginBottom: 16 }}>
        <TextField
          value={state.name}
          onChange={(e) => handleChange("name", e)}
          fullWidth
          autoComplete="on"
          type="text"
          label="Nama"
          sx={{ mb: 5 }}
        />
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Conditional condition={actionCode === "READ"}>
          <Protected allowedCodes={["EDIT"]}>
            <Button onClick={() => setactionCode("EDIT")}>edit</Button>
          </Protected>
        </Conditional>
        <Conditional condition={actionCode !== "READ"}>
          <Protected allowedCodes={["EDIT", "CREATE"]}>
            <LoadingButton
              onClick={submit}
              variant="contained"
              pending={isSubmitting}
            >
              Save
            </LoadingButton>
          </Protected>
        </Conditional>
        <Grid item xs={12} container justifyContent="flex-end">
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
      </Box>
    </Card>
  );
}
