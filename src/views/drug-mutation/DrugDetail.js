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
  Typography,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Switch,
  Stack,
  CircularProgress,
  Autocomplete,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
import { useDebounce } from "react-use";
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
  // const [selectedMedicineName, setselectedMedicineName] = useState(null);
  const [drugdistributionOptions, setdrugdistributionOptions] = useState([]);
  const [druglocationuksOptions, setdruglocationuksOptions] = useState([]);
  const [drugnameOptions, setdrugnameOptions] = useState([]);

  const [openDrugAutoComplete, setopenDrugAutoComplete] = useState(false);

  const [drugAutoCompleteLoading, setdrugAutoCompleteLoading] = useState(false);

  // Medicine Location
  const [
    openMedicineLocationAutoComplete,
    setopenMedicineLocationAutoComplete,
  ] = useState(false);
  const [
    MedicineLocationAutoCompleteLoading,
    setMedicineLocationAutoCompleteLoading,
  ] = useState(false);
  // Medicine Name
  const [
    openMedicineNameAutoComplete,
    setopenMedicineNameAutoComplete,
  ] = useState(false);
  const [
    MedicineNameAutoCompleteLoading,
    setMedicineNameAutoCompleteLoading,
  ] = useState(false);

  // Medicine Location Keyword
  const [
    autoCompleteMedicineLocationKeyword,
    setAutoCompleteMedicineLocationKeyword,
  ] = useState("");

  // Medicine Name Keyword
  const [
    autoCompleteMedicineNameKeyword,
    setAutoCompleteMedicineNameKeyword,
  ] = useState("");

  //const [isSubmitting, setisSubmitting] = useState(false);
  //const [errors, seterrors] = useState({});
  const [statetransferfrom, setstatetransferfrom] = useState({
    id: "",
    location_id: "",
    drug_id: "",
    drug_expired_id: "",
    listofukslocations: { uks_name: "" },
    drugname: { drug_name: "" },
    drugname: { drug_kode: "" },
    drugunit: { drug_unit: "" },
    drugexpired: { date_expired: "" },
    qty: "",
  });

  const [statetransferto, setstatetransferto] = useState({
    selected_id: null,
    location_id: null,
    drug_id: null,
    drug_id_backup: null,
    drug_distribution_id: null,
    drug_kode: "",
    unit: "",
    drug_expired_id: "",
    qty: "",
    qty_mutation: "",
  });

  //Fungsi GetData Drug Distribution

  // const getdrugdistributionOptions = async () => {
  //   setdrugAutoCompleteLoading(true);
  //   const params = {
  //     location_id: statetransferto.location_id,
  //     drug_name_id: statetransferto.drug_id,
  //   };
  //   const response = await axios.get(endpoint.drug.option_distribution, {
  //     params: params,
  //   });
  //   if (response && response.data) {
  //     setdrugdistributionOptions(response.data);
  //   }
  //   // console.log("Drug Distribution", response.data);
  //   setdrugAutoCompleteLoading(false);
  // };

  //Fungsi GetData Drug Location UKS

  const getdrugukslocationOptions = async () => {
    setMedicineLocationAutoCompleteLoading(true);
    const response = await axios.get(endpoint.drug_location.root);
    if (response && response.data) {
      setdruglocationuksOptions(response.data);
    }
    // console.log();
    setMedicineLocationAutoCompleteLoading(false);
  };

  //Fungsi GetData Drug Name

  const getdrugnameOptions = async (selected_id) => {
    setMedicineNameAutoCompleteLoading(true);
    const params = {
      id: selected_id,
    };
    const response = await axios.get(endpoint.drug_name.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugnameOptions(response.data);
    }
    // console.log("getdrugnameOptions", response.data);
    setMedicineNameAutoCompleteLoading(false);
  };

  const getDetail = (row) => {
    if (row) {
      setstatetransferfrom({
        ...row,
      });
    }
  };

  const ValidationForm = Yup.object().shape({
    drug_id: Yup.string().required("Nama Obat Tidak Boleh Kosong"),
    location_id: Yup.string().required("Lokasi Obat Tidak Boleh Kosong"),
    unit: Yup.string().required("Unit Obat Tidak Boleh Kosong"),
    drug_kode: Yup.string().required("Kode Obat Tidak Boleh Kosong"),
    qty: Yup.string().required("Qty Tidak Boleh Kosong"),
    qty_mutation: Yup.string().required("Qty Mutasi Tidak Boleh Kosong"),
  });

  const handleChangeTransferFrom = (index, event) => {
    let newState = { ...statetransferfrom };

    let value = event.target.value;

    newState[index] = value;

    setstatetransferfrom(selectedMedicine);

    // Untuk Combobox Bertingkat

    // let selectedMedicine = drugdistributionOptions.filter(
    //   (medicine) => medicine.locationdrug.listofukslocations.id == value
    // )[0];

    // Function Qty Filter

    // if (index === "id") {
    // }

    // newState[index] = value;
    // setstatetransferfrom(newState);

    // Function Option Two

    // let value_drug_location = "";
    // value_drug_location = drugdistributionOptions.filter(
    //   (drug) => drug.locationdrug.listofukslocations.id == event.target.value
    // );

    // if (index === "location_id") {
    //   let drug = { ...statetransferfrom };
    //   let value = event.target.value;

    //   drug["drug_id"] = value_drug_location
    //     ? value_drug_location[0].drugname.id
    //     : "";

    //   drug[index] = value;
    //   setstatetransferfrom(drug);
    // }

    // if (index === "drug_id") {
    //   let drug = { ...statetransferfrom };

    //   drug["drug_kode"] = value_drug_location
    //     ? value_drug_location[0].drugname.drug_kode
    //     : 0;

    //   drug["unit"] = value_drug_location
    //     ? value_drug_location[0].drugunit.drug_unit
    //     : 0;

    //   drug["drug_expired_id"] = value_drug_location
    //     ? value_drug_location[0].drugexpired.date_expired
    //     : 0;

    //   drug["qty_distribution"] = value_drug_location
    //     ? value_drug_location[0].qty
    //     : 0;

    //   setstatetransferfrom(drug);
    // }

    // console.log(index);
    // console.log(event);
  };

  const handleChangeTransferTo = (index, event) => {
    let newState = { ...statetransferto };

    let value = null;

    if (index === "location_id") {
      value = event ? event.id : "";
      // setselectedMedicineName(value);
      if (value !== null) {
        getdrugnameOptions(value);
        // if (setdrugnameOptions([]) === []) {
        //   submitError("data tidak ditemukan");
        // } else {
        //   getdrugnameOptions(value);
        //   submitSuccess("data tersedia");
        // }
      }
    } else if (index === "drug_id_backup") {
      value = event ? event : "";
      newState["drug_id"] = event ? event.id : "";
      newState["drug_distribution_id"] = event
        ? event.drugdistribution[0].id
        : "";
      newState["drug_kode"] = event ? event.drug_kode : "";
      newState["unit"] = event
        ? event.drugdistribution[0].drugunit.drug_unit
        : "";
      newState["drug_expired_id"] = event
        ? event.drugdistribution[0].drugexpired.date_expired
        : "";
      newState["qty"] = event ? event.drugdistribution[0].qty : "";
    } else {
      value = event.target.value;
    }

    newState[index] = value;
    setstatetransferto(newState);

    // Function Option Two

    // let value_drug_location = "";
    // value_drug_location = drugdistributionOptions.filter(
    //   (drug) => drug.locationdrug.listofukslocations.id == event.target.value
    // );

    // if (index === "location_id") {
    //   let drug = { ...statetransferto };
    //   let value = event.target.value;

    //   drug["drug_id"] = value_drug_location
    //     ? value_drug_location[0].drugname.id
    //     : "";
    //   drug[index] = value;
    //   setstatetransferto(drug);
    // }

    // if (index === "drug_id") {
    //   let drug = { ...statetransferto };

    //   drug["drug_kode"] = value_drug_location
    //     ? value_drug_location[0].drugname.drug_kode
    //     : 0;

    //   drug["unit"] = value_drug_location
    //     ? value_drug_location[0].drugunit.drug_unit
    //     : 0;

    //   drug["drug_expired_id"] = value_drug_location
    //     ? value_drug_location[0].drugexpired.date_expired
    //     : 0;

    //   drug["qty"] = value_drug_location ? value_drug_location[0].qty : 0;

    //   setstatetransferto(drug);
    // }

    if (index === "qty_mutation") {
      let drugtransferfrom = { ...statetransferfrom };
      let drugtransferto = { ...statetransferto };
      // let value = +event.target.value;
      let value = +event.target.value;

      // if (drugtransferto["qty"] !== "") {
      //   drugtransferfrom["qty"] = Math.max(0, drugtransferfrom["qty"] - value);
      //   drugtransferto["qty"] = drugtransferto["qty"] + value;
      // }

      // if (drugtransferto["qty_mutation"] > drugtransferfrom["qty"]) {
      //   drugtransferto["qty_mutation"] = drugtransferfrom["qty"];
      // }

      // if (drugtransferto["qty_mutation"] > drugtransferto["qty"]) {
      //   drugtransferto["qty_mutation"] = drugtransferto["qty"];
      // }

      drugtransferfrom[index] = value;
      drugtransferto[index] = value;
      setstatetransferto(drugtransferto);
      setstatetransferfrom(drugtransferfrom);
    }

    // console.log(index);
    // console.log(event);
    // console.log(newState);
    // console.log(value);
  };

  const formik = useFormik({
    enableReinitialize: true,
    // validationSchema: ValidationForm,
    initialValues: {
      // State Transfer From

      id: statetransferfrom.id,
      location_id: statetransferfrom.location_id,
      drug_id: statetransferfrom.drug_id,
      drug_expired_id: statetransferfrom.drug_expired_id,
      qty: statetransferfrom.qty - statetransferto.qty_mutation,

      // State Transfer To
      statetransferto: JSON.stringify(statetransferto),
    },
    // validationSchema: ValidationForm,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.drug_mutation.create, values)
          .catch(function (error) {
            submitError("Gagal Transfer Obat !");
          });
        if (respon) {
          submitSuccess("Berhasil Transfer Obat!");
        }
      } else {
        let respon = await axios
          .post(endpoint.drug_mutation.update, values)
          .catch(function (error) {
            submitError("Gagal Transfer Obat !");
          });
        if (respon) {
          submitSuccess("Berhasil Transfer Obat !");
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
    // getdrugdistributionOptions();
    getdrugukslocationOptions();
    // getdrugnameOptions();
  }, []);

  useEffect(() => {
    console.log(drugnameOptions);
  }, [drugnameOptions]);

  // useEffect(() => {
  //   if (selectedMedicineName) {
  //     getdrugnameOptions(selectedMedicineName);
  //   }
  // }, [selectedMedicineName]);

  // Medicine Location

  useDebounce(
    () => {
      if (autoCompleteMedicineLocationKeyword.trim() != "") {
        getdrugukslocationOptions(autoCompleteMedicineLocationKeyword);
      }
    },
    500,
    [autoCompleteMedicineLocationKeyword]
  );

  // Medicine Name

  useDebounce(
    () => {
      if (autoCompleteMedicineNameKeyword.trim() != "") {
        getdrugnameOptions(autoCompleteMedicineNameKeyword);
      }
    },
    500,
    [autoCompleteMedicineNameKeyword]
  );

  // Untuk Combobox Bertingkat

  // useEffect(() => {
  //   setstatetransferfrom(drugdistributionOptions[1]);
  // }, []);

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if (row && props.actionCode !== "CREATE") {
      getDetail(row);
    }
  }, [row]);

  useEffect(() => {
    console.log("Distribusi Obat Transfer Dari", statetransferfrom);
  }, [statetransferfrom]);

  useEffect(() => {
    console.log("Distribusi Obat Transfer Ke", statetransferto);
  }, [statetransferto]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Transfer From</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <TextField
                {...getFieldProps("uks_name")}
                value={statetransferfrom.listofukslocations.uks_name}
                autoComplete="on"
                type="text"
                label="Lokasi Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferFrom("uks_name", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.locationdrug && errors.locationdrug)}
                helperText={touched.locationdrug && errors.locationdrug}
              />
              {/* <InputLabel id="lokasi-obat">Pilih Lokasi Obat</InputLabel>
              <Select
                {...getFieldProps("location_id")}
                labelId="lokasi-obat"
                id="lokasi-obat"
                value={statetransferfrom?.location_id}
                onChange={(e) => handleChangeTransferFrom("location_id", e)}
                label="Pilih Lokasi Obat"
                error={Boolean(touched.location_id && errors.location_id)}
                helperText={touched.location_id && errors.location_id}
                // inputProps={{ readOnly: true }}
              >
                {druglocationuksOptions.map((drug_location) => (
                  <MenuItem key={drug_location.id} value={drug_location.id}>
                    {drug_location.uks_name}
                  </MenuItem>
                ))}
              </Select> */}
            </FormControl>
          </Grid>
          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("drug_name")}
                value={statetransferfrom.drugname.drug_name}
                autoComplete="on"
                type="text"
                label="Nama Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferFrom("drug_name", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.drug_name && errors.drug_name)}
                helperText={touched.drug_name && errors.drug_name}
              />
              {/* <InputLabel id="nama-obat">Pilih Nama Obat</InputLabel>
              <Select
                {...getFieldProps("drug_id")}
                labelId="nama-obat"
                id="nama-obat"
                value={statetransferfrom?.drug_id}
                onChange={(e) => handleChangeTransferFrom("drug_id", e)}
                label="Pilih Nama Obat"
                // inputProps={{ readOnly: true }}
                error={Boolean(touched.drug_id && errors.drug_id)}
                helperText={touched.drug_id && errors.drug_id}
              >
                {drugnameOptions.map((drug) => (
                  <MenuItem key={drug.id} value={drug.id}>
                    {drug.drug_name}
                  </MenuItem>
                ))}
              </Select> */}
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("drug_kode")}
                value={statetransferfrom.drugname.drug_kode}
                autoComplete="on"
                type="text"
                label="Kode Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferFrom("drug_kode", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.drug_kode && errors.drug_kode)}
                helperText={touched.drug_kode && errors.drug_kode}
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={3}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "35%" }}
            >
              <TextField
                {...getFieldProps("drug_unit")}
                value={statetransferfrom.drugunit.drug_unit}
                autoComplete="on"
                type="text"
                label="Satuan"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferFrom("drug_unit", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.drug_unit && errors.drug_unit)}
                helperText={touched.drug_unit && errors.drug_unit}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "35%" }}
            >
              <TextField
                {...getFieldProps("date_expired")}
                value={statetransferfrom.drugexpired.date_expired}
                autoComplete="on"
                type="text"
                label="Tanggal Kadaluarsa Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferFrom("date_expired", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.date_expired && errors.date_expired)}
                helperText={touched.date_expired && errors.date_expired}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "35%" }}
            >
              <TextField
                {...getFieldProps("qty")}
                value={
                  statetransferfrom.qty
                    ? statetransferto.qty_mutation > statetransferfrom.qty
                      ? statetransferfrom.qty
                      : statetransferfrom.qty - statetransferto.qty_mutation
                    : ""
                }
                autoComplete="on"
                type="number"
                label="Jumlah Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferFrom("qty", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.qty && errors.qty)}
                helperText={touched.qty && errors.qty}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Transfer To</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              {/* <InputLabel id="lokasi-obat">Pilih Lokasi Obat</InputLabel>
              <Select
                {...getFieldProps("location_id")}
                labelId="lokasi-obat"
                id="lokasi-obat"
                value={statetransferto.location_id}
                onChange={(e) => handleChangeTransferTo("location_id", e)}
                label="Pilih Lokasi Obat"
                error={Boolean(
                  touched.location_id && errors.location_id
                )}
                helperText={
                  touched.location_id && errors.location_id
                }
              >
                {druglocationuksOptions.map((drug_location) => (
                  <MenuItem key={drug_location.id} value={drug_location.id}>
                    {drug_location.uks_name}
                  </MenuItem>
                ))}
              </Select> */}
              <Autocomplete
                id="lokasi-obat"
                freeSolo
                onOpen={() => {
                  setopenMedicineLocationAutoComplete(true);
                }}
                onClose={() => {
                  setopenMedicineLocationAutoComplete(false);
                }}
                loading={MedicineLocationAutoCompleteLoading}
                onChange={(event, newValue) => {
                  handleChangeTransferTo("location_id", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteMedicineLocationKeyword(newInputValue);
                }}
                getOptionLabel={(option) =>
                  option.uks_name ? option.uks_name : ""
                }
                getOptionSelected={(option, value) =>
                  option.uks_name === value.uks_name
                }
                options={druglocationuksOptions}
                value={1}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...getFieldProps("location_id")}
                    label="Lokasi Obat"
                    error={Boolean(touched.location_id && errors.location_id)}
                    helperText={touched.location_id && errors.location_id}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {MedicineLocationAutoCompleteLoading ? (
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
          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              {/* <InputLabel id="nama-obat">Pilih Nama Obat</InputLabel>
              <Select
                {...getFieldProps("drug_id")}
                labelId="nama-obat"
                id="nama-obat"
                value={statetransferto.drug_id}
                onChange={(e) => handleChangeTransferTo("drug_id", e)}
                label="Pilih Nama Obat"
                error={Boolean(touched.drug_id && errors.drug_id)}
                helperText={touched.drug_id && errors.drug_id}
              >
                {drugdistributionOptions.map((drug) => (
                  <MenuItem key={drug.id} value={drug.id}>
                    {drug.drugname.drug_name}
                  </MenuItem>
                ))}
              </Select> */}
              <Autocomplete
                id="nama-obat"
                freeSolo
                onOpen={() => {
                  setopenMedicineNameAutoComplete(true);
                }}
                onClose={() => {
                  setopenMedicineNameAutoComplete(false);
                }}
                loading={MedicineNameAutoCompleteLoading}
                onChange={(event, newValue) => {
                  handleChangeTransferTo("drug_id_backup", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteMedicineNameKeyword(newInputValue);
                }}
                getOptionLabel={(option) =>
                  option.drug_name ? option.drug_name : ""
                }
                getOptionSelected={(option, value) =>
                  option.drug_name === value.drug_name
                }
                options={drugnameOptions}
                value={statetransferto.drug_id_backup}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...getFieldProps("drug_id")}
                    label="Nama Obat"
                    error={Boolean(touched.drug_id && errors.drug_id)}
                    helperText={touched.drug_id && errors.drug_id}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {MedicineNameAutoCompleteLoading ? (
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
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("drug_kode")}
                value={statetransferto.drug_kode}
                autoComplete="on"
                type="text"
                label="Kode Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferTo("drug_kode", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.drug_kode && errors.drug_kode)}
                helperText={touched.drug_kode && errors.drug_kode}
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={3}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "35%" }}
            >
              <TextField
                {...getFieldProps("unit")}
                value={statetransferto.unit}
                autoComplete="on"
                type="text"
                label="Satuan"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferTo("unit", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.unit && errors.unit)}
                helperText={touched.unit && errors.unit}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "35%" }}
            >
              <TextField
                value={statetransferto.drug_expired_id}
                autoComplete="on"
                type="text"
                label="Tanggal Kadaluarsa Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferTo("drug_expired_id", e)}
                inputProps={{ readOnly: true }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "35%" }}
            >
              <TextField
                {...getFieldProps("qty")}
                value={
                  statetransferto.qty
                    ? statetransferto.qty_mutation > statetransferto.qty
                      ? statetransferto.qty
                      : statetransferto.qty + statetransferto.qty_mutation
                    : ""
                }
                autoComplete="on"
                type="number"
                label="Jumlah Obat"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferTo("qty", e)}
                inputProps={{ readOnly: true }}
                error={Boolean(touched.qty && errors.qty)}
                helperText={touched.qty && errors.qty}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <TextField
                {...getFieldProps("qty_mutation")}
                value={statetransferto.qty_mutation || ""}
                autoComplete="on"
                type="number"
                label="Jumlah Mutasi"
                sx={{ mb: 5 }}
                onChange={(e) => handleChangeTransferTo("qty_mutation", e)}
                error={Boolean(touched.qty_mutation && errors.qty_mutation)}
                helperText={touched.qty_mutation && errors.qty_mutation}
              />
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
