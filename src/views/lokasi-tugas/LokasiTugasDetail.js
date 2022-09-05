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
  CircularProgress,
  Autocomplete,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import Protected from "src/components/Protected";
import { useDebounce } from "react-use";
// ----------------------------------------------------------------------

LokasiTugasDetail.propTypes = {
  sx: PropTypes.object,
};

export default function LokasiTugasDetail(props) {
  const { user, units, roles } = useSelector((state) => state.auth);
  const {
    row,
    getData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [openEmployeeAutoComplete, setopenEmployeeAutoComplete] = useState(
    false
  );
  const [
    employeeAutoCompleteLoading,
    setemployeeAutoCompleteLoading,
  ] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState("");
  const [actionCode, setactionCode] = useState("READ");
  //const [isSubmitting, setisSubmitting] = useState(false);
  const [ukslocationOptions, setukslocationOptions] = useState([]);
  //const [userOptions, setuserOptions] = useState([]);
  // const [officer, setOfficer] = useState([]);
  const [employeeOptions, setemployeeOptions] = useState([]);
  //const [errors, seterrors] = useState({});

  // const officerName = [
  //   "dr. Lina Yaurentius",
  //   "Riska Ayu Sagita",
  //   "Margaretha R Hasianta",
  //   "Yeni Silvia",
  //   "Ike Triyani Hadi",
  //   "dr. Stacia Octaviana",
  //   "Aureliana Natalia Sare ",
  // ];

  const [state, setstate] = useState({
    id: "",
    name: "",
    job_location_id: "",
  });

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
    }
  };

  const ValidationForm = Yup.object().shape({
    name: Yup.string().required("Nama Petugas Tidak Boleh Kosong"),
    job_location_id: Yup.string().required("Lokasi Tugas Tidak Boleh Kosong"),
  });

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = "";
    if (fieldName === "employee_id") {
      value = eventValue ? eventValue.id : "";
      newState["name"] = eventValue ? eventValue.name : "";
    } else {
      value = eventValue.target.value;
    }

    if (fieldName === "id") {
      getukslocationOptions(value);
      setOfficer(value);
      //getuserOptions(value);
      getemployeeOptions(value);
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
      await axios.post(endpoint.officer_registration.create, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.officer_registration.update, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };

*/
  }

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: state,
  //   validationSchema: ValidationForm,
  //   onSubmit: async (values, { setSubmitting }) => {
  //     if (actionCode === "CREATE") {
  //       await axios.post(endpoint.officer_registration.create, values);
  //     } else {
  //       await axios.put(endpoint.officer_registration.update, values);
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
          .post(endpoint.officer_registration.create, values)
          .catch(function (error) {
            submitError("Data sudah ada !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        let respon = await axios
          .put(endpoint.officer_registration.update, values)
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

  //Fungsi GetData Location
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

  //Fungsi GetData Employee
  const getemployeeOptions = async (id) => {
    setemployeeAutoCompleteLoading(true);
    const params = {
      id: id,
      roles_id: roles && roles.length > 0 ? roles[0].code : null,
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

  {
    /*
  //Fungsi GetData User
  const getuserOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.user.option, { params: params });
    if (response && response.data) {
      setuserOptions(response.data);
    }
  };

*/
  }

  useEffect(() => {
    getukslocationOptions();
    //getuserOptions();
    getemployeeOptions();
  }, []);

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
              <Autocomplete
                //disablePortal
                id="nama-petugas"
                freeSolo
                onOpen={() => {
                  setopenEmployeeAutoComplete(true);
                }}
                onClose={() => {
                  setopenEmployeeAutoComplete(false);
                }}
                loading={employeeAutoCompleteLoading}
                onChange={(event, newValue) => {
                  // console.log(JSON.stringify(newValue, null, " "));
                  handleChange("employee_id", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue);
                }}
                getOptionLabel={(option) => option.name}
                //value={state.nama}
                //onChange={(e) => handleChange("nama", e)}
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                options={employeeOptions}
                value={state !== null ? state : employeeOptions[0]}
                //getOptionLabel={(employee) => (employee.name ? employee.name : "")}
                //getOptionSelected={(employee, id) => employee.id === employee.id}
                // renderInput={(params) => <TextField {...params} label="Nama" />}
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

          <Grid container style={{ marginBottom: 16 }}></Grid>
          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="uks-lokasi-tugas">Pilih Lokasi Tugas</InputLabel>
              <Select
                {...getFieldProps("job_location_id")}
                labelId="lokasi-tugas"
                id="uks-lokasi-tugas"
                value={state.job_location_id}
                onChange={(e) => handleChange("job_location_id", e)}
                label="Pilih Lokasi Tugas"
                error={Boolean(
                  touched.job_location_id && errors.job_location_id
                )}
                helperText={touched.job_location_id && errors.job_location_id}
              >
                {ukslocationOptions.map((uks_location) => (
                  <MenuItem key={uks_location.id} value={uks_location.id}>
                    {uks_location.uks_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="nama-petugas">Pilih Nama Petugas</InputLabel>
              <Select
                {...getFieldProps("name")}
                labelId="nama-petugas"
                id="nama-petugas"
                value={state.name}
                onChange={(e) => handleChange("name", e)}
                label="Pilih Nama Petugas"
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              >
                {officerName.map((officer) => (
                  <MenuItem key={officer} value={officer}>
                    {officer}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
          <Grid container style={{ marginBottom: 16 }}></Grid>
          <Grid container style={{ marginBottom: 16 }}></Grid>

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
