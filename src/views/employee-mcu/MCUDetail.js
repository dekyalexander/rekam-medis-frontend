import { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useFormik, Form, FormikProvider } from "formik";
import moment from "moment";
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
  Input,
  Grid,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Typography,
  Stack,
  InputAdornment,
  RadioGroup,
  Radio,
  Dialog,
  DialogActions,
  DialogTitle,
  OutlinedInput,
  DialogContent,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@material-ui/core";
import DatePicker from "@material-ui/lab/DatePicker";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { format, parse } from "date-fns";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
import { useDebounce } from "react-use";
// ----------------------------------------------------------------------

MCUDetail.propTypes = {
  sx: PropTypes.object,
};

export default function MCUDetail(props) {
  const {
    row,
    getData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { user, units, roles } = useSelector((state) => state.auth);
  const [actionCode, setactionCode] = useState("READ");
  //const [isUsernameChanged, setisUsernameChanged] = useState(false);
  const [diagnosisgeneralOptions, setdiagnosisgeneralOptions] = useState([]);
  const [employeeOptions, setemployeeOptions] = useState([]);
  const [openEmployeeAutoComplete, setopenEmployeeAutoComplete] = useState(
    false
  );
  const [
    employeeAutoCompleteLoading,
    setemployeeAutoCompleteLoading,
  ] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState("");

  const [dynamicForm, setDynamicForm] = useState({
    employeemcugeneraldiagnosis: [
      {
        diagnosis_id: "",
      },
    ],
  });

  const [selectedFile, setSelectedFile] = useState([]);

  const [state, setstate] = useState({
    id: "",
    name: "",
    nik: "",
    unit: "",
    inspection_date: "",
    blood_pressure: "",
    heart_rate: "",
    breathing_ratio: "",
    body_temperature: "",
    sp02: "",
    weight: "",
    height: "",
    bmi_calculation_results: "",
    bmi_diagnosis: "",
    file: "",
  });

  //Fungsi GetData Diagnosis General
  const getdiagnosisgeneralOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.diagnosis_general.root, {
      params: params,
    });
    if (response && response.data) {
      setdiagnosisgeneralOptions(response.data);
    }
  };

  //Fungsi GetData Employee
  const getemployeeOptions = async (id) => {
    setemployeeAutoCompleteLoading(true);

    // Cek Id Role
    const rolesData = roles.filter((role) => role.id == "21");

    let role = "";
    if (rolesData.length > 0) {
      role = rolesData[0].id;
    } else {
      role = roles[0].id;
    }
    const params = {
      id: id,
      roles_id: roles && roles.length > 0 ? role : null,
      user_id: user.id,
    };
    const response = await axios.get(endpoint.employee.option, {
      params: params,
    });
    if (response && response.data) {
      setemployeeOptions(response.data);
    }
    setemployeeAutoCompleteLoading(false);
  };

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
      setDynamicForm({
        employeemcugeneraldiagnosis:
          row.employeemcugeneraldiagnosis.length > 0
            ? row.employeemcugeneraldiagnosis.map((data) => ({
                diagnosis_id: data.diagnosis_id,
              }))
            : [{ diagnosis_id: "" }],
      });
    }
  };

  const ValidationForm = Yup.object().shape({
    name: Yup.string().required("Nama Tidak Boleh Kosong"),
    nik: Yup.string().required("NIK Tidak Boleh Kosong"),
    inspection_date: Yup.string().required(
      "Tanggal Periksa Tidak Boleh Kosong"
    ),
  });

  const handleChange = (index, eventValue) => {
    let newState = { ...state };
    let value = "";
    if (index === "employee_id") {
      value = eventValue ? eventValue.id : "";
      newState["name"] = eventValue ? eventValue.name : "";
    } else {
      value = eventValue.target.value;
    }

    if (index === "employee_id") {
      value = eventValue ? eventValue.id : "";
      newState["nik"] = eventValue ? eventValue.nik : "";
    } else {
      value = eventValue.target.value;
    }

    if (index === "employee_id") {
      value = eventValue ? eventValue.id : "";
      if (eventValue) {
        newState["unit"] = eventValue.employeecareer
          ? eventValue.employeecareer.employeeposition.employeeunit.name
          : "";
      } else {
        value: "";
      }
    } else {
      value = eventValue.target.value;
    }
    if (index === "id") {
    }
    newState[index] = value;
    setstate(newState);
  };

  const fileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleChangeDate = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = "";

    if (fieldName == "inspection_date") {
      value = moment(eventValue).format("YYYY-MM-DD");
    } else {
      value = eventValue.target.value;
    }
    const header_details = ["inspection_date"];

    if (header_details.includes(fieldName)) {
      newState[fieldName] = value;
    } else {
      newState[fieldName] = value;
    }
    setstate(newState);
  };

  const handleChangeField = (index, event) => {
    if (["diagnosis_id"].includes(event.target.name)) {
      let employeemcugeneraldiagnosis = [
        ...dynamicForm.employeemcugeneraldiagnosis,
      ];
      employeemcugeneraldiagnosis[index][event.target.name] =
        event.target.value;
      setDynamicForm({ employeemcugeneraldiagnosis });
    } else {
      setDynamicForm({
        [event.target.name]: event.target.value,
      });
    }
  };

  //handleAddFields Diagnosis Umum

  const handleAddFields = () => {
    setDynamicForm({
      employeemcugeneraldiagnosis: [
        ...dynamicForm.employeemcugeneraldiagnosis,
        {
          diagnosis_id: "",
        },
      ],
    });
  };

  //handleRemoveFields Diagnosis Umum

  const handleRemoveFields = (index) => {
    dynamicForm.employeemcugeneraldiagnosis.splice(index, 1);

    setDynamicForm({
      employeemcugeneraldiagnosis: dynamicForm.employeemcugeneraldiagnosis,
    });
  };

  const hitungHasilDiagnosis = () => {
    let tinggi = parseFloat(state.height);
    let berat = parseFloat(state.weight);
    let bmi = berat / (tinggi * tinggi);
    if (state.weight === "") {
      return "";
    } else if (state.height === "") {
      return "";
    } else if (bmi > 27) {
      return "Overweight";
    } else if ((bmi >= 25.1) & (bmi <= 27)) {
      return "Overweight";
    } else if ((bmi >= 18.5) & (bmi <= 25)) {
      return "Normal";
    } else if ((bmi >= 17) & (bmi <= 18.4)) {
      return "Underweight";
    } else {
      return "Underweight";
    }
  };

  const hitungHasilBMI = () => {
    let tinggi = parseFloat(state.height);
    let berat = parseFloat(state.weight);
    let bmi = berat / (tinggi * tinggi);
    if (state.weight === "") {
      return "";
    } else if (state.height === "") {
      return "";
    } else {
      return parseFloat(bmi).toFixed(1);
    }
  };

  useEffect(() => {
    state.bmi_calculation_results = hitungHasilBMI();
  }, [state.weight, state.height]);

  useEffect(() => {
    state.bmi_diagnosis = hitungHasilDiagnosis();
  }, [state.weight, state.height]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: state.name,
      nik: state.nik,
      unit: state.unit,
      inspection_date: state.inspection_date,
      blood_pressure: state.blood_pressure,
      heart_rate: state.heart_rate,
      breathing_ratio: state.breathing_ratio,
      body_temperature: state.body_temperature,
      sp02: state.sp02,
      weight: state.weight,
      height: state.height,
      bmi_calculation_results: state.bmi_calculation_results,
      bmi_diagnosis: state.bmi_diagnosis,
      file: selectedFile,
      dynamicForm: dynamicForm.employeemcugeneraldiagnosis,
    },
    validationSchema: ValidationForm,

    onSubmit: async (values, { setSubmitting }) => {
      let payload = new FormData();
      payload.append("name", values.name);
      payload.append("nik", values.nik);
      payload.append("unit", values.unit);
      payload.append("inspection_date", values.inspection_date);
      payload.append("blood_pressure", values.blood_pressure);
      payload.append("heart_rate", values.heart_rate);
      payload.append("breathing_ratio", values.breathing_ratio);
      payload.append("body_temperature", values.body_temperature);
      payload.append("sp02", values.sp02);
      payload.append("weight", values.weight);
      payload.append("height", values.height);
      payload.append("bmi_calculation_results", values.bmi_calculation_results);
      payload.append("bmi_diagnosis", values.bmi_diagnosis);
      payload.append("file", values.file);

      payload.append("dynamicForm", JSON.stringify(values.dynamicForm));
      const headers = {
        "content-type": "multipart/form-data",
      };
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.employee_mcu.create, payload, headers)
          .catch(function (error) {
            submitError("Data gagal disimpan !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        payload.append("id", row.id);
        let respon = await axios
          .post(endpoint.employee_mcu.update, payload, headers)
          .catch(function (error) {
            submitError("Data gagal di edit !");
          });
        if (respon) {
          submitSuccess("Data berhasil di edit !");
        }
      }
      setSubmitting(false);
      getData();
      props.closeMainDialog();
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    getdiagnosisgeneralOptions();
    getemployeeOptions();
  }, []);

  useEffect(() => {
    console.log(dynamicForm);
  }, [dynamicForm]);

  useDebounce(
    () => {
      if (autoCompleteKeyword.trim() != "") {
        getemployeeOptions(autoCompleteKeyword);
      }
    },
    500,
    [autoCompleteKeyword]
  );

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    getDetail(row);
  }, [row]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <Autocomplete
                id="nama-pasien"
                freeSolo
                onOpen={() => {
                  setopenEmployeeAutoComplete(true);
                }}
                onClose={() => {
                  setopenEmployeeAutoComplete(false);
                }}
                loading={employeeAutoCompleteLoading}
                onChange={(event, newValue) => {
                  handleChange("employee_id", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                options={employeeOptions}
                value={state !== null ? state : employeeOptions[0]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...getFieldProps("name")}
                    label="Nama"
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {employeeAutoCompleteLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <TextField
            {...getFieldProps("nik")}
            value={state && state.nik}
            onChange={(e) => handleChange("nik", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="NIK"
            error={Boolean(touched.nik && errors.nik)}
            helperText={touched.nik && errors.nik}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <TextField
            value={state && state.unit}
            onChange={(e) => handleChange("unit", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Unit"
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Tanggal Periksa</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <DatePicker
                {...getFieldProps("inspection_date")}
                label="Tanggal Periksa"
                value={state.inspection_date || ""}
                hintText="DD/MM/YYYY"
                inputFormat="dd/MM/yyyy"
                onChange={(e) => handleChangeDate("inspection_date", e)}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
                error={Boolean(
                  touched.inspection_date && errors.inspection_date
                )}
                helperText={touched.inspection_date && errors.inspection_date}
              />
            </FormControl>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="h5">Tanda Vital</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.blood_pressure}
                fullWidth
                autoComplete="on"
                onChange={(e) => handleChange("blood_pressure", e)}
                type="text"
                label="Tekanan Darah"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.heart_rate}
                fullWidth
                autoComplete="on"
                onChange={(e) => handleChange("heart_rate", e)}
                type="text"
                label="Detak Jantung"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                onChange={(e) => handleChange("breathing_ratio", e)}
                fullWidth
                autoComplete="on"
                value={state.breathing_ratio}
                type="text"
                label="Pernapasan"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.body_temperature}
                onChange={(e) => handleChange("body_temperature", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Suhu Tubuh"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <TextField
              value={state.sp02}
              onChange={(e) => handleChange("sp02", e)}
              fullWidth
              autoComplete="on"
              type="text"
              label="SpO2"
              sx={{ mb: 5 }}
            />
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Pemeriksaan Umum</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("weight")}
                value={state.weight}
                onChange={(e) => handleChange("weight", e)}
                fullWidth
                autoComplete="on"
                type="number"
                label="Berat Badan"
                error={Boolean(touched.weight && errors.weight)}
                helperText={touched.weight && errors.weight}
                sx={{ mb: 5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Kg</InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("height")}
                value={state.height}
                onChange={(e) => handleChange("height", e)}
                fullWidth
                autoComplete="on"
                type="number"
                label="Tinggi Badan"
                error={Boolean(touched.height && errors.height)}
                helperText={touched.height && errors.height}
                sx={{ mb: 5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">M</InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("bmi_calculation_results")}
                value={state.bmi_calculation_results}
                onChange={(e) => handleChange("bmi_calculation_results", e)}
                fullWidth
                autoComplete="on"
                type="number"
                label="Hasil Perhitungan BMI"
                error={Boolean(
                  touched.bmi_calculation_results &&
                    errors.bmi_calculation_results
                )}
                helperText={
                  touched.bmi_calculation_results &&
                  errors.bmi_calculation_results
                }
                sx={{ mb: 5 }}
                inputProps={{ readOnly: true }}
              />
            </FormControl>

            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("bmi_diagnosis")}
                value={state.bmi_diagnosis}
                onChange={(e) => handleChange("bmi_diagnosis", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Diagnosis BMI"
                error={Boolean(touched.bmi_diagnosis && errors.bmi_diagnosis)}
                helperText={touched.bmi_diagnosis && errors.bmi_diagnosis}
                sx={{ mb: 5 }}
                inputProps={{ readOnly: true }}
              />
            </FormControl>
          </Stack>

          {dynamicForm.employeemcugeneraldiagnosis.map(
            (GeneralDiagnosis, index) => {
              return (
                <Grid key={index}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "95%" }}
                    >
                      <InputLabel id="diagnosis_umum">
                        Pilih Diagnosis Umum
                      </InputLabel>
                      <Select
                        labelId="diagnosis_umum"
                        id="diagnosis_umum"
                        name="diagnosis_id"
                        value={GeneralDiagnosis.diagnosis_id}
                        onChange={(e) => handleChangeField(index, e)}
                        label="Pilih Diagnosis Umum"
                      >
                        {diagnosisgeneralOptions.map((diagnosis_general) => (
                          <MenuItem
                            key={diagnosis_general.id}
                            value={diagnosis_general.id}
                          >
                            {diagnosis_general.diagnosis_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "5%" }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        disabled={
                          dynamicForm.employeemcugeneraldiagnosis.length === 1
                        }
                        onClick={() => handleRemoveFields(index)}
                        style={{ margin: "0 25px", width: "70%" }}
                      >
                        <RemoveIcon />
                        Delete
                      </Button>
                    </FormControl>
                  </Stack>

                  <Grid
                    container
                    style={{ marginBottom: 16 }}
                    item
                    xs={12}
                    justifyContent="flex-end"
                  ></Grid>
                  <Grid
                    container
                    style={{ marginBottom: 16 }}
                    item
                    xs={12}
                    justifyContent="flex-end"
                  ></Grid>
                </Grid>
              );
            }
          )}

          <Grid
            container
            style={{ marginBottom: 16 }}
            item
            xs={12}
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              color="info"
              onClick={handleAddFields}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="h5">Pemeriksaan Penunjang</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">
              Upload File Hasil Pemeriksaan Radiologi / Laboratorium
            </Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <InputLabel htmlFor="contained-button-file">
              <Input onChange={fileChange} name="file" type="file" />
              {state.file}
            </InputLabel>
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
