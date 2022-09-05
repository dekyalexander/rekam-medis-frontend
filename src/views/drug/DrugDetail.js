import { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
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
  RadioGroup,
  Radio,
  Dialog,
  DialogActions,
  DialogTitle,
  OutlinedInput,
  DialogContent,
  IconButton,
  Autocomplete,
} from "@material-ui/core";
import DatePicker from "@material-ui/lab/DatePicker";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { format, parse } from "date-fns";
import { parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
// ----------------------------------------------------------------------

DrugDetail.propTypes = {
  sx: PropTypes.object,
};

export default function DrugDetail(props) {
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
  // const [isSubmitting, setisSubmitting] = useState(false);
  // const [errors, seterrors] = useState({});
  const [isUsernameChanged, setisUsernameChanged] = useState(false);
  const [locationdrugOptions, setlocationdrugOptions] = useState([]);
  const [ukslocationOptions, setukslocationOptions] = useState([]);
  const [drugtypeOptions, setdrugtypeOptions] = useState([]);
  const [drugnameOptions, setdrugnameOptions] = useState([]);
  const [drugunitOptions, setdrugunitOptions] = useState([]);
  //const [status, setStatus] = useState([]);

  // const [date_expired, setValue] = useState(new Date());

  //Object State
  const [state, setstate] = useState({
    id: "",
    drug_type_id: "",
    drug_name_id: "",
    drug_unit_id: "",
    description: "",
    drug_id: "",
    location_id: "",
    drugexpired: { date_expired: "" },
    stocks: { qty: "" },
    locationdrug: { location_id: "" },
    drug_expired_id: "",
  });

  //const descriptionsDrug = ["Ready", "Kosong"];
  //const unitDrug = ["Pcs", "Box"];

  //Fungsi GetData Drug Location
  const getlocationdrugOptions = async (drug_id) => {
    const params = {
      drug_id: drug_id,
    };
    const response = await axios.get(endpoint.drug.option_location_drug, {
      params: params,
    });
    if (response && response.data) {
      setlocationdrugOptions(response.data);
    }
    // console.log(response);
  };

  //Fungsi GetData Drug Location
  const getukslocationOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.drug_location.root, {
      params: params,
    });
    if (response && response.data) {
      setukslocationOptions(response.data);
    }
  };

  //Fungsi GetData Drug Type
  const getdrugtypeOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.drug_type.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugtypeOptions(response.data);
    }
  };

  //Fungsi GetData Drug Nama
  const getdrugnameOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.drug_name.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugnameOptions(response.data);
    }
  };

  //Fungsi GetData Drug Unit
  const getdrugunitOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.drug_unit.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugunitOptions(response.data);
    }
  };

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
    }
  };

  const ValidationForm = Yup.object().shape({
    drug_type_id: Yup.string().required("Jenis Obat Tidak Boleh Kosong"),
    drug_name_id: Yup.string().required("Nama Obat Tidak Boleh Kosong"),
    drug_unit_id: Yup.string().required("Satuan Obat Tidak Boleh Kosong"),
    qty: Yup.string().required("Jumlah Obat Tidak Boleh Kosong"),
    location_id: Yup.string().required("Lokasi Obat Tidak Boleh Kosong"),
    description: Yup.string().required("Keterangan Obat Tidak Boleh Kosong"),
    // date_expired: Yup.date()
    //   .required("Tanggal Kadaluarsa Obat Tidak Boleh Kosong")
    //   .nullable(),
  });

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    // console.log(eventValue);
    // console.log(fieldName);

    // let value = eventValue.target.value;

    let value = "";
    if (fieldName == "date_expired") {
      value = moment(eventValue).format("YYYY-MM-DD");
    } else value = eventValue.target.value;

    const header_detail = ["qty", "location_id", "date_expired"];

    if (header_detail.includes(fieldName)) {
      newState.locationdrug[fieldName] = value;
    } else {
      newState[fieldName] = value;
    }
    // setstate(newState);

    if (header_detail.includes(fieldName)) {
      newState.stocks[fieldName] = value;
    } else {
      newState[fieldName] = value;
    }
    // setstate(newState);

    if (header_detail.includes(fieldName)) {
      newState.drugexpired[fieldName] = value;
    } else {
      newState[fieldName] = value;
    }
    setstate(newState);

    if (fieldName === "id") {
      getukslocationOptions(value);
      getdrugtypeOptions(value);
      getdrugnameOptions(value);
      getdrugunitOptions(value);
      getlocationdrugOptions(value);
      //setStatus(value);
      // setValue(value);
    }
    newState[fieldName] = value;
    setstate(newState);
    console.log(eventValue);
  };

  // const submit = async () => {
  //   let params = {
  //     drug_type_id: state.drug_type_id,
  //     drug_name_id: state.drug_name_id,
  //     drug_unit_id: state.drug_unit_id,
  //     qty: state.qty,
  //     date_expired: format(date_expired, "yyyy-MM-dd"),
  //     description: state.description,
  //     drug_id: state.drug_id,
  //     location_id: state.location_id,
  //     drug_expired_id: state.drug_expired_id,
  //   };
  //   if (actionCode === "CREATE") {
  //     await axios.post(endpoint.drug.create, params);
  //   } else {
  //     params = { ...params, id: state.id };
  //     await axios.put(endpoint.drug.update, params);
  //   }
  //   setisSubmitting(false);
  //   submitSuccess("saving data success");
  //   getData();
  //   console.log(params);
  //   console.log(actionCode);
  // };

  let params = {
    id: state.id,
    drug_type_id: state.drug_type_id,
    drug_name_id: state.drug_name_id,
    drug_unit_id: state.drug_unit_id,
    qty: state.stocks.qty,
    // date_expired: format(date_expired, "yyyy-MM-dd"),
    // date_expired: format(state.drugexpired.date_expired, "yyyy-MM-dd"),
    date_expired: state.drugexpired.date_expired,
    description: state.description,
    location_id: state.locationdrug.location_id,
    // drug_id: state.drug_id,
    location_id: state.location_id,
    // drug_expired_id: state.drug_expired_id,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: params,
    validationSchema: ValidationForm,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.drug.create, values)
          .catch(function (error) {
            submitError("Data sudah ada !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        let respon = await axios
          .post(endpoint.drug.update, values)
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
      // console.log(values);
      props.closeMainDialog();
    },
  });

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: params,
  //   validationSchema: ValidationForm,

  //   onSubmit: async (values, { setSubmitting }) => {
  //     if (actionCode === "CREATE") {
  //       await axios.post(endpoint.drug.create, values);
  //     } else {
  //       await axios.put(endpoint.drug.update, values);
  //     }
  //     setSubmitting(false);
  //     submitSuccess("saving data success");
  //     getData();
  //     console.log(values);
  //   },
  // });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    getukslocationOptions();
    getdrugtypeOptions();
    getdrugnameOptions();
    getdrugunitOptions();
    //console.log(state);
  }, []);

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
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="jenis-obat">Pilih Jenis Obat</InputLabel>
              <Select
                {...getFieldProps("drug_type_id")}
                labelId="jenis-obat"
                id="jenis-obat"
                value={state.drug_type_id}
                onChange={(e) => handleChange("drug_type_id", e)}
                label="Pilih Jenis Obat"
                error={Boolean(touched.drug_type_id && errors.drug_type_id)}
                helperText={touched.drug_type_id && errors.drug_type_id}
              >
                {drugtypeOptions.map((drug_type) => (
                  <MenuItem key={drug_type.id} value={drug_type.id}>
                    {drug_type.drug_type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="nama-obat">Pilih Nama Obat</InputLabel>
              <Select
                {...getFieldProps("drug_name_id")}
                labelId="nama-obat"
                id="nama-obat"
                value={state.drug_name_id}
                onChange={(e) => handleChange("drug_name_id", e)}
                label="Pilih Nama Obat"
                error={Boolean(touched.drug_name_id && errors.drug_name_id)}
                helperText={touched.drug_name_id && errors.drug_name_id}
              >
                {drugnameOptions.map((drug_name) => (
                  <MenuItem key={drug_name.id} value={drug_name.id}>
                    {drug_name.drug_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/*
      <TextField
        value={state.nama_obat}
        onChange={(e) => handleChange("nama_obat", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Nama Obat"
        sx={{ mb: 5 }}
      />
      */}

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("qty")}
                value={state.stocks.qty || ""}
                onChange={(e) => handleChange("qty", e)}
                fullWidth
                autoComplete="on"
                type="number"
                label="Jumlah"
                error={Boolean(touched.qty && errors.qty)}
                helperText={touched.qty && errors.qty}
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="satuan-obat">Pilih Satuan Obat</InputLabel>
              <Select
                {...getFieldProps("drug_unit_id")}
                labelId="satuan-obat"
                id="satuan-obat"
                value={state.drug_unit_id}
                onChange={(e) => handleChange("drug_unit_id", e)}
                label="Pilih Satuan Obat"
                error={Boolean(touched.drug_unit_id && errors.drug_unit_id)}
                helperText={touched.drug_unit_id && errors.drug_unit_id}
              >
                {drugunitOptions.map((drug_unit) => (
                  <MenuItem key={drug_unit.id} value={drug_unit.id}>
                    {drug_unit.drug_unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {/*
      <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Tanggal Expired</Typography>
      </Grid>
      */}

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  {...getFieldProps("date_expired")}
                  label="Tanggal Expired"
                  value={date_expired}
                  // dateFormat="yyyy-MM-dd"
                  fullWidth
                  onChange={(e) => {
                    setValue(e);
                  }}
                  //onChange={(event, newValue) => {
                  //handleChange("tanggal", newValue);
                  //}}
                  renderInput={(params) => <TextField {...params} />}
                  error={Boolean(touched.date_expired && errors.date_expired)}
                  helperText={touched.date_expired && errors.date_expired}
                />
              </LocalizationProvider> */}
              <DatePicker
                {...getFieldProps("date_expired")}
                label="Tanggal Expired"
                value={state.drugexpired.date_expired || ""}
                hintText="DD/MM/YYYY"
                inputFormat="dd/MM/yyyy"
                onChange={(e) => handleChange("date_expired", e)}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
                error={Boolean(touched.date_expired && errors.date_expired)}
                helperText={touched.date_expired && errors.date_expired}
              />
            </FormControl>
          </Grid>

          <TextField
            {...getFieldProps("description")}
            value={state.description}
            onChange={(e) => handleChange("description", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Keterangan"
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
            rows={4}
            multiline
            sx={{ mb: 5 }}
          />

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="lokasi-obat">Pilih Lokasi Obat</InputLabel>
              <Select
                labelId="lokasi-obat"
                id="lokasi-obat"
                {...getFieldProps("location_id")}
                value={
                  state.locationdrug.location_id || state.location_id || ""
                }
                onChange={(e) => handleChange("location_id", e)}
                label="Pilih Lokasi Obat"
                error={Boolean(touched.location_id && errors.location_id)}
                helperText={touched.location_id && errors.location_id}
              >
                {ukslocationOptions.map((drug) => (
                  <MenuItem key={drug.id} value={drug.id}>
                    {drug.uks_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/*
      <Grid container style={{ marginBottom: 16 }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: "100%" }}
        >
          <InputLabel id="status-obat">Pilih Status Obat</InputLabel>
          <Select
            labelId="status-obat"
            id="status-obat"
            value={state.status}
            onChange={(e) => handleChange("status", e)}
            label="Pilih Status Obat"
          >
            {descriptionsDrug.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      */}
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
