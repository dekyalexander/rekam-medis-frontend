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
    qty: "",
    listofukslocations: { uks_name: "" },
    drug_expired_id: "",
  });

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

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };

    // let value = eventValue.target.value;

    let value = "";
    if (fieldName == "date_expired") {
      value = moment(eventValue).format("YYYY-MM-DD");
    } else value = eventValue.target.value;

    const header_detail = ["date_expired"];

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
    }
    newState[fieldName] = value;
    setstate(newState);
    console.log(eventValue);
  };

  let params = {
    id: state.id,
    drug_type_id: state.drug_type_id,
    drug_name_id: state.drug_name_id,
    drug_unit_id: state.drug_unit_id,
    qty: state.qty,
    location_id: state.location_id,
    description: state.description,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: params,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.drug_distribution.create, values)
          .catch(function (error) {
            submitError("Data sudah ada !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        let respon = await axios
          .post(endpoint.drug_distribution.update, values)
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
                labelId="jenis-obat"
                id="jenis-obat"
                value={state.drug_type_id}
                onChange={(e) => handleChange("drug_type_id", e)}
                label="Pilih Jenis Obat"
                inputProps={{ readOnly: true }}
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
                labelId="nama-obat"
                id="nama-obat"
                value={state.drug_name_id}
                onChange={(e) => handleChange("drug_name_id", e)}
                label="Pilih Nama Obat"
                inputProps={{ readOnly: true }}
              >
                {drugnameOptions.map((drug_name) => (
                  <MenuItem key={drug_name.id} value={drug_name.id}>
                    {drug_name.drug_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.qty}
                onChange={(e) => handleChange("qty", e)}
                fullWidth
                autoComplete="on"
                type="number"
                label="Jumlah"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="satuan-obat">Pilih Satuan Obat</InputLabel>
              <Select
                labelId="satuan-obat"
                id="satuan-obat"
                value={state.drug_unit_id}
                onChange={(e) => handleChange("drug_unit_id", e)}
                label="Pilih Satuan Obat"
                inputProps={{ readOnly: true }}
              >
                {drugunitOptions.map((drug_unit) => (
                  <MenuItem key={drug_unit.id} value={drug_unit.id}>
                    {drug_unit.drug_unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <DatePicker
                label="Tanggal Expired"
                readOnly
                value={state.drugexpired.date_expired || ""}
                hintText="DD/MM/YYYY"
                inputFormat="dd/MM/yyyy"
                onChange={(e) => handleChange("date_expired", e)}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </FormControl>
          </Grid>

          <TextField
            value={state.description}
            onChange={(e) => handleChange("description", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Keterangan"
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
                value={state.location_id || state.listofukslocations.uks_name}
                onChange={(e) => handleChange("location_id", e)}
                label="Pilih Lokasi Obat"
                inputProps={{ readOnly: true }}
              >
                {ukslocationOptions.map((drug) => (
                  <MenuItem key={drug.id} value={drug.id}>
                    {drug.uks_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
