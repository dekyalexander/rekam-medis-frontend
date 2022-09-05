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
import DatePicker from '@material-ui/lab/DatePicker';
import { format } from 'date-fns';
// ----------------------------------------------------------------------

ParentDetail.propTypes = {
  sx: PropTypes.object,
};

export default function ParentDetail(props) {
  const { row, getData, sx, submitSuccess, submitError } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    id: undefined,
    user: {
      username: ""
    },
    name: "",
    ktp: "",
    nkk: "",
    email: "",
    mobilePhone: "",
    birth_date: null,
    sex_type: {
      name: ""
    },
    parent_type: {
      name: ""
    },
    wali_type: {
      name: ""
    },
    job: "",
    jobCorporateName: "",
    jobPositionName: "",
    jobWorkAddress: "",
    address: ""
  });
  const [sex_typeOptions, setsex_typeOptions] = useState([]);
  const [parent_typeOptions, setparent_typeOptions] = useState([]);
  const [wali_typeOptions, setwali_typeOptions] = useState([]);

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = null

    if (fieldName === 'birth_date') {
      value = eventValue
    } else {
      value = eventValue.target.value
    }
    newState[fieldName] = value;
    setstate(newState);
  };

  const getsex_typeOptions = async () => {
    const params = {
      group: 'sex_type'
    }
    const response = await axios.get(endpoint.parameter.option, { params: params });
    if (response && response.data) {
      setsex_typeOptions(response.data);
    }

  };

  const getparent_typeOptions = async () => {
    const params = {
      group: 'parent_type'
    }
    const response = await axios.get(endpoint.parameter.option, { params: params });
    if (response && response.data) {
      setparent_typeOptions(response.data);
    }

  };

  const getwali_typeOptions = async () => {
    const params = {
      group: 'wali_type'
    }
    const response = await axios.get(endpoint.parameter.option, { params: params });
    if (response && response.data) {
      setwali_typeOptions(response.data);
    }

  };

  const getDetail = async (row) => {
    if (row) {
      const response = await axios.get(endpoint.parent.root + '/' + row.id);
      if (response) {
        const parent = response.data
        setstate({
          ...parent,
          birth_date: new Date(parent.birth_date)
        });
      }
    }
  };

  const submit = async () => {
    let params = {
      ...state,
      birth_date:format(new Date(state.birth_date), 'yyyy-MM-dd')
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.parent.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.parent.root, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };

  useEffect(() => {
    if (actionCode !== 'READ') {
      getsex_typeOptions()
      getparent_typeOptions()
      getwali_typeOptions()
    }
  }, [actionCode])

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if (row && props.actionCode !== 'CREATE') {
      getDetail(row);
    }
  }, [row]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>

      <TextField
        value={state.user && state.user.username}
        fullWidth
        autoComplete="on"
        type="text"
        label="Username"
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.name}
        onChange={(e) => handleChange("name", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Nama"
        error={Boolean(errors.name)}
        helperText={errors.name}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.ktp}
        onChange={(e) => handleChange("ktp", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Nomor KTP"
        error={Boolean(errors.ktp)}
        helperText={errors.ktp}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.nkk}
        onChange={(e) => handleChange("nkk", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Nomor KK"
        error={Boolean(errors.nkk)}
        helperText={errors.nkk}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.email}
        onChange={(e) => handleChange("email", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Email"
        error={Boolean(errors.email)}
        helperText={errors.email}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.mobilePhone}
        onChange={(e) => handleChange("mobilePhone", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Handphone"
        error={Boolean(errors.mobilePhone)}
        helperText={errors.mobilePhone}
        sx={{ mb: 3 }}
      />

      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <DatePicker
            label="Tanggal Lahir"
            value={state.birth_date}
            onChange={(e) => handleChange("birth_date", e)}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
          <TextField
            value={format(new Date(state.birth_date), 'dd - MMMM - yyyy')}
            fullWidth
            autoComplete="on"
            type="text"
            label="Tanggal Lahir"
            sx={{ mb: 3 }}
          />        
      </Conditional>


      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}
          >
            <InputLabel id="sex_type_value-label">Jenis Kelamin</InputLabel>
            <Select
              labelId="sex_type_value-label"
              id="sex_type_value-select"
              label="Jenis kelamin"
              value={state.sex_type_value}
              onChange={(e) => handleChange("sex_type_value", e)}
            >
              {sex_typeOptions.map((sex_type) => (
                <MenuItem key={sex_type.value} value={sex_type.value}>
                  {sex_type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.sex_type && state.sex_type.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Jenis kelamin"
          sx={{ mb: 3 }}
        />
      </Conditional>


      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}
          >
            <InputLabel id="parent_type_value-label">Tipe orang tua</InputLabel>
            <Select
              labelId="parent_type_value-label"
              id="parent_type_value-select"
              label="Tipe orang tua"
              value={state.parent_type_value}
              onChange={(e) => handleChange("parent_type_value", e)}
            >
              {parent_typeOptions.map((parent_type) => (
                <MenuItem key={parent_type.value} value={parent_type.value}>
                  {parent_type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.parent_type && state.parent_type.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Tipe Orang tua"
          sx={{ mb: 3 }}
        />
      </Conditional>

      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}
          >
            <InputLabel id="wali_type_value-label">Tipe Wali</InputLabel>
            <Select
              labelId="wali_type_value-label"
              id="wali_type_value-select"
              label="Tipe Wali"
              value={state.wali_type_value}
              onChange={(e) => handleChange("wali_type_value", e)}
            >
              {wali_typeOptions.map((wali_type) => (
                <MenuItem key={wali_type.value} value={wali_type.value}>
                  {wali_type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.wali_type && state.wali_type.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Tipe Wali"
          sx={{ mb: 3 }}
        />
      </Conditional>

      <TextField
        value={state.job}
        onChange={(e) => handleChange("job", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Pekerjaan"
        error={Boolean(errors.job)}
        helperText={errors.job}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.jobCorporateName}
        onChange={(e) => handleChange("jobCorporateName", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Nama Tempat Bekerja"
        error={Boolean(errors.jobCorporateName)}
        helperText={errors.jobCorporateName}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.jobPositionName}
        onChange={(e) => handleChange("jobPositionName", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Posisi pekerjaan"
        error={Boolean(errors.jobPositionName)}
        helperText={errors.jobPositionName}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.jobWorkAddress}
        onChange={(e) => handleChange("jobWorkAddress", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Alamat tempat kerja"
        error={Boolean(errors.jobWorkAddress)}
        helperText={errors.jobWorkAddress}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.address}
        onChange={(e) => handleChange("address", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Alamat rumah"
        error={Boolean(errors.address)}
        helperText={errors.address}
        sx={{ mb: 3 }}
      />



      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Conditional condition={actionCode === "READ"}>
          <Protected allowedCodes={['EDIT']} >
            <Button onClick={() => setactionCode("EDIT")}>edit</Button>
          </Protected>
        </Conditional>
        <Conditional condition={actionCode !== "READ"}>
          <Protected allowedCodes={['EDIT', 'CREATE']} >
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
