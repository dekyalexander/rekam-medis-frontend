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

DiagnosisDetail.propTypes = {
  sx: PropTypes.object,
};

export default function DiagnosisDetail(props) {
  const {
    row,
    getData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  //const [isSubmitting, setisSubmitting] = useState(false);
  //const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: "",
    diagnosis_kode: "",
    diagnosis_name: "",
  });

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
    }
  };

  const ValidationForm = Yup.object().shape({
    diagnosis_kode: Yup.string()
      // .min(4, "Mininum 4 Karakter")
      // .max(5, "Maximum 5 Karakter")
      .required("Kode Diagnosis Tidak Boleh Kosong"),
    diagnosis_name: Yup.string()
      // .max(30, "Maximum 30 Karakter")
      .required("Nama Diagnosis Tidak Boleh Kosong"),
  });

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue.target.value;

    if (fieldName === "id") {
    }

    newState[fieldName] = value;
    setstate(newState);
  };

  {
    /*
  const submit = async () => {
    let params = {
      ...state,
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.diagnosis_bmi.create, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.diagnosis_bmi.update, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
    console.log(params);
    console.log(actionCode);
  };
*/
  }

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: state,
  //   validationSchema: ValidationForm,
  //   onSubmit: async (values, { setSubmitting }) => {
  //     if (actionCode === "CREATE") {
  //       await axios.post(endpoint.diagnosis_bmi.create, values);
  //     } else {
  //       await axios.put(endpoint.diagnosis_bmi.update, values);
  //     }
  //     setSubmitting(false);
  //     submitSuccess("saving data success");
  //     getData();
  //   },
  // });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: state,
    validationSchema: ValidationForm,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.diagnosis_bmi.create, values)
          .catch(function (error) {
            submitError("Data sudah ada !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        let respon = await axios
          .put(endpoint.diagnosis_bmi.update, values)
          .catch(function (error) {
            submitError("Data gagal di edit !");
          });
        if (respon) {
          submitSuccess("Data berhasil di edit !");
        }
      }
      setSubmitting(false);
      // submitSuccess("saving data success");
      getData();
      props.closeMainDialog();
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

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
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container style={{ marginBottom: 16 }}>
            <TextField
              {...getFieldProps("diagnosis_kode")}
              value={state.diagnosis_kode}
              onChange={(e) => handleChange("diagnosis_kode", e)}
              fullWidth
              autoComplete="on"
              type="text"
              label="Kode Diagnosis"
              error={Boolean(touched.diagnosis_kode && errors.diagnosis_kode)}
              helperText={touched.diagnosis_kode && errors.diagnosis_kode}
              sx={{ mb: 5 }}
            />
          </Grid>
          <Grid container style={{ marginBottom: 16 }}>
            <TextField
              {...getFieldProps("diagnosis_name")}
              value={state.diagnosis_name}
              onChange={(e) => handleChange("diagnosis_name", e)}
              fullWidth
              autoComplete="on"
              type="text"
              label="Nama Diagnosis"
              error={Boolean(touched.diagnosis_name && errors.diagnosis_name)}
              helperText={touched.diagnosis_name && errors.diagnosis_name}
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
                  type="submit"
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
        </Form>
      </FormikProvider>
    </Card>
  );
}
