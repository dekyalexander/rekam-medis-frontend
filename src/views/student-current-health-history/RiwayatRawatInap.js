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
  Input,
  Grid,
  Typography,
  Stack,
} from "@material-ui/core";
import DatePicker from "@material-ui/lab/DatePicker";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
// ----------------------------------------------------------------------

RiwayatRawatInap.propTypes = {
  sx: PropTypes.object,
};

export default function RiwayatRawatInap(props) {
  const { diagnosisOptions, value } = props;
  const [state, setState] = useState({
    nama_rs: "",
    diagnosis_lain: "",
  });

  //Fungsi GetData Diagnosis
  const getdiagnosisOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(
      endpoint.medical_history_student.option_diagnosis,
      {
        params: params,
      }
    );
    if (response && response.data) {
      setdiagnosisOptions(response.data);
    }
  };

  useEffect(() => {
    getdiagnosisOptions();
  }, []);

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue.target.value;
    if (fieldName === "id") {
      getdiagnosisOptions(value);
    }
    newState[fieldName] = value;
    setstate(newState);
  };

  return (
    <>
      <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Riwayat Rawat Inap</Typography>
      </Grid>

      <Grid container style={{ marginBottom: 16 }}>
        <TextField
          value={state.nama_rs}
          onChange={(e) => handleChange("nama_rs", e)}
          fullWidth
          autoComplete="on"
          type="text"
          label="Nama Rumah Sakit"
          sx={{ mb: 5 }}
        />
      </Grid>

      <Stack direction="row" spacing={2}>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <DatePicker
            disableFuture
            label="Tanggal Rawat"
            openTo="year"
            views={["year", "month", "day"]}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="diagnosis-umum">Pilih Diagnosis</InputLabel>
          <Select
            labelId="diagnosis-umum"
            id="diagnosis-umum"
            value={state.diagnosis}
            onChange={(e) => handleChange("diagnosis", e)}
            label="Pilih Diagnosis"
          >
            {diagnosisOptions.map((medical_history_student) => (
              <MenuItem
                key={medical_history_student.id}
                value={medical_history_student.diagnosis_name}
              >
                {medical_history_student.diagnosis_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TextField
        value={state.diagnosis_lain}
        onChange={(e) => handleChange("diagnosis_lain", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Diagnosis Lain"
        sx={{ mb: 5 }}
      />
    </>
  );
}
