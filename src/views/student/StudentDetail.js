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
  Checkbox
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

StudentDetail.propTypes = {
  sx: PropTypes.object,
};

export default function StudentDetail(props) {
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
    jenjang: {
      name: ""
    },
    school: {
      name: ""
    },
    kelas: {
      name: ""
    },
    parallel: {
      name: ""
    },
    masuk_tahun: {
      name: ""
    },
    masuk_jenjang: {
      name: ""
    },
    masuk_kelas: {
      name: ""
    },
    is_father_alive: 1,
    is_mother_alive: 1,
    is_poor: 0,
    nis: "",
    niy: "",
    nisn: "",
    nkk: "",
    father_ktp: "",
    mother_ktp: "",
    name: "",
    email: "",
    sex_type: {
      name: ""
    },
    address: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
    kodepos: "",
    photo: "",
    handphone: "",
    birth_place: "",
    birth_date: null,
    birth_order: 1,
    religion: {
      name: ""
    },
    nationality: "",
    language: "",
    is_adopted: 0,
    stay_with: {
      name: ""
    },
    siblings: 0,
    is_sibling_student: 0,
    foster: 0,
    step_siblings: 0,
    medical_history: "",
    is_active: 1,
    student_status: {
      name: ""
    },
    lulus_tahun: {
      name: ""
    },
    tahun_lulus: "",
    gol_darah: "",
    is_cacat: 0,
    tinggi: 0,
    berat: 0,
    sekolah_asal: "",

  });
  const [jenjangOptions, setjenjangOptions] = useState([]);
  const [kelasOptions, setkelasOptions] = useState([]);
  const [parallelOptions, setparallelOptions] = useState([]);
  const [tahunOptions, settahunOptions] = useState([]);
  const [sex_typeOptions, setsex_typeOptions] = useState([]);
  const [religionOptions, setreligionOptions] = useState([]);
  const [stay_withOptions, setstay_withOptions] = useState([]);
  const [student_statusOptions, setstudent_statusOptions] = useState([]);



  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = null
    if (["is_cacat", "is_active", "is_sibling_student", "is_adopted", "is_poor", "is_father_alive", "is_mother_alive"].includes(fieldName)) {
      value = eventValue.target.checked ? 1 : 0;
    } else if (fieldName === 'birth_date') {
      value = eventValue
    } else {
      value = eventValue.target.value;
    }
    newState[fieldName] = value;
    setstate(newState);
  };

  const getDetail = async (row) => {
    if (row) {
      const response = await axios.get(endpoint.student.root + '/' + row.id);
      if (response) {
        const student = response.data
        setstate({
          ...student,
          birth_date: new Date(student.birth_date)
        });
      }
    }
  };


  const getjenjangOptions = async () => {
    const response = await axios.get(endpoint.jenjang.option);
    if (response && response.data) {
      setjenjangOptions(response.data);
    }
  };

  const getkelasOptions = async () => {
    const response = await axios.get(endpoint.kelas.option);
    if (response && response.data) {
      setkelasOptions(response.data);
    }
  };

  const getparallelOptions = async () => {
    const response = await axios.get(endpoint.parallel.option);
    if (response && response.data) {
      setparallelOptions(response.data);
    }
  };

  const gettahunOptions = async () => {
    const response = await axios.get(endpoint.tahun_pelajaran.option);
    if (response && response.data) {
      settahunOptions(response.data);
    }
  };

  const getstudent_statusOptions = async () => {
    const params = {
      group: 'student_status'
    }
    const response = await axios.get(endpoint.parameter.option, { params: params });
    if (response && response.data) {
      setstudent_statusOptions(response.data);
    }

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

  const getstay_withOptions = async () => {
    const params = {
      group: 'stay_with'
    }
    const response = await axios.get(endpoint.parameter.option, { params: params });
    if (response && response.data) {
      setstay_withOptions(response.data);
    }

  };

  const getreligionOptions = async () => {
    const params = {
      group: 'religion'
    }
    const response = await axios.get(endpoint.parameter.option, { params: params });
    if (response && response.data) {
      setreligionOptions(response.data);
    }

  };


  const submit = async () => {
    let params = {
      ...state,
      birth_date: format(new Date(state.birth_date), 'yyyy-MM-dd')
    };
    if (actionCode === "CREATE") {
      await axios.post(endpoint.student.root, params);
    } else {
      params = { ...params, id: state.id };
      await axios.put(endpoint.student.root, params);
    }
    setisSubmitting(false);
    submitSuccess("saving data success");
    getData();
  };

  useEffect(() => {
    if (actionCode !== 'READ') {
      getsex_typeOptions()
      getstudent_statusOptions()
      getstay_withOptions()
      getreligionOptions()
      getjenjangOptions()
      getkelasOptions()
      getparallelOptions()
      gettahunOptions()
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
        value={state.niy}
        onChange={(e) => handleChange("niy", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="NIY"
        error={Boolean(errors.niy)}
        helperText={errors.niy}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.nis}
        onChange={(e) => handleChange("nis", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="NIS"
        error={Boolean(errors.nis)}
        helperText={errors.nis}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.nisn}
        onChange={(e) => handleChange("nisn", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="NISN"
        error={Boolean(errors.nisn)}
        helperText={errors.nisn}
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

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.jenjang && state.jenjang.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Jenjang"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="jenjang-label">Jenjang</InputLabel>
            <Select
              labelId="jenjang-label"
              id="jenjang-select"
              name="jenjang_id"
              value={state.jenjang_id}
              label="Jenjang"
              onChange={(e) => handleChange("jenjang_id", e)}
              error={errors.jenjang_id}
            >
              {jenjangOptions.map((jenjang) => (
                <MenuItem key={jenjang.id} value={jenjang.id}>
                  {jenjang.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.jenjang_id}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.kelas && state.kelas.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Kelas"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="kelas-label">Kelas</InputLabel>
            <Select
              labelId="kelas-label"
              id="kelas-select"
              name="kelas_id"
              value={state.kelas_id}
              label="Kelas"
              onChange={(e) => handleChange("kelas_id", e)}
              error={errors.kelas_id}
            >
              {kelasOptions.map((kelas) => (
                <MenuItem key={kelas.id} value={kelas.id}>
                  {kelas.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.kelas_id}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.parallel && state.parallel.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Parallel"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="parallel-label">Parallel</InputLabel>
            <Select
              labelId="parallel-label"
              id="parallel-select"
              name="parallel_id"
              value={state.parallel_id}
              label="Parallel"
              onChange={(e) => handleChange("parallel_id", e)}
              error={errors.parallel_id}
            >
              {parallelOptions.map((parallel) => (
                <MenuItem key={parallel.id} value={parallel.id}>
                  {parallel.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.parallel_id}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.masuk_tahun && state.masuk_tahun.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Tahun Masuk"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="masuk_tahun-label">Tahun Masuk</InputLabel>
            <Select
              labelId="masuk_tahun-label"
              id="masuk_tahun-select"
              name="masuk_tahun"
              value={state.masuk_tahun_id}
              label="Tahun Masuk"
              onChange={(e) => handleChange("masuk_tahun_id", e)}
              error={errors.masuk_tahun_id}
            >
              {tahunOptions.map((masuk_tahun) => (
                <MenuItem key={masuk_tahun.id} value={masuk_tahun.id}>
                  {masuk_tahun.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.masuk_tahun}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.masuk_jenjang && state.masuk_jenjang.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Jenjang Masuk"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="masuk_jenjang-label">Jenjang Masuk</InputLabel>
            <Select
              labelId="masuk_jenjang-label"
              id="masuk_jenjang-select"
              name="masuk_jenjang_id"
              value={state.masuk_jenjang_id}
              label="Jenjang Masuk"
              onChange={(e) => handleChange("masuk_jenjang_id", e)}
              error={errors.masuk_jenjang_id}
            >
              {jenjangOptions.map((masuk_jenjang) => (
                <MenuItem key={masuk_jenjang.id} value={masuk_jenjang.id}>
                  {masuk_jenjang.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.masuk_jenjang_id}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.masuk_kelas && state.masuk_kelas.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Kelas Masuk"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="masuk_kelas-label">Kelas Masuk</InputLabel>
            <Select
              labelId="masuk_kelas-label"
              id="masuk_kelas-select"
              name="masuk_kelas_id"
              value={state.masuk_kelas_id}
              label="Kelas Masuk"
              onChange={(e) => handleChange("masuk_kelas_id", e)}
              error={errors.masuk_kelas_id}
            >
              {kelasOptions.map((masuk_kelas) => (
                <MenuItem key={masuk_kelas.id} value={masuk_kelas.id}>
                  {masuk_kelas.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.masuk_kelas_id}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>


      <Grid container>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.is_father_alive === 1}
              onChange={(e) => handleChange("is_father_alive", e)}
            />
          }
          label="Ayah Hidup"
        />
      </Grid>

      <Grid container>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.is_mother_alive === 1}
              onChange={(e) => handleChange("is_mother_alive", e)}
            />
          }
          label="Ibu Hidup"
        />
      </Grid>

      <Grid container>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.is_poor === 1}
              onChange={(e) => handleChange("is_poor", e)}
            />
          }
          label="Kurang mampu"
        />
      </Grid>


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

      <TextField
        value={state.address}
        onChange={(e) => handleChange("address", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Alamat"
        error={Boolean(errors.address)}
        helperText={errors.address}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.kodepos}
        onChange={(e) => handleChange("kodepos", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Kode pos"
        error={Boolean(errors.kodepos)}
        helperText={errors.kodepos}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.handphone}
        onChange={(e) => handleChange("handphone", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Handphone"
        error={Boolean(errors.handphone)}
        helperText={errors.handphone}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.birth_place}
        onChange={(e) => handleChange("birth_place", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Tempat lahir"
        error={Boolean(errors.birth_place)}
        helperText={errors.birth_place}
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



      <TextField
        value={state.birth_order}
        onChange={(e) => handleChange("birth_order", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Anak ke"
        error={Boolean(errors.birth_order)}
        helperText={errors.birth_order}
        sx={{ mb: 3 }}
      />


      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}
          >
            <InputLabel id="religion_value-label">Agama</InputLabel>
            <Select
              labelId="religion_value-label"
              id="religion_value-select"
              label="Agama"
              value={state.religion_value}
              onChange={(e) => handleChange("religion_value", e)}
            >
              {religionOptions.map((religion) => (
                <MenuItem key={religion.value} value={religion.value}>
                  {religion.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.religion && state.religion.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Agama"
          sx={{ mb: 3 }}
        />
      </Conditional>

      <TextField
        value={state.nationality}
        onChange={(e) => handleChange("nationality", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Kewarganegaraan"
        error={Boolean(errors.nationality)}
        helperText={errors.nationality}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.language}
        onChange={(e) => handleChange("language", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Bahasa"
        error={Boolean(errors.language)}
        helperText={errors.language}
        sx={{ mb: 3 }}
      />

      <Grid container >
        <FormControlLabel
          control={
            <Checkbox
              checked={state.is_adopted === 1}
              onChange={(e) => handleChange("is_adopted", e)}
            />
          }
          label="Diadopsi"
        />
      </Grid>


      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}
          >
            <InputLabel id="stay_with_value-label">Tinggal bersama"</InputLabel>
            <Select
              labelId="stay_with_value-label"
              id="stay_with_value-select"
              label="Tinggal bersama"
              value={state.stay_with_value}
              onChange={(e) => handleChange("stay_with_value", e)}
            >
              {stay_withOptions.map((stay_with) => (
                <MenuItem key={stay_with.value} value={stay_with.value}>
                  {stay_with.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.stay_with && state.stay_with.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Tinggal bersama"
          sx={{ mb: 3 }}
        />
      </Conditional>

      <TextField
        value={state.siblings}
        onChange={(e) => handleChange("siblings", e)}
        fullWidth
        autoComplete="on"
        type="number"
        label="Jumlah saudara kandung"
        error={Boolean(errors.siblings)}
        helperText={errors.siblings}
        sx={{ mb: 3 }}
      />

      <Grid container >
        <FormControlLabel
          control={
            <Checkbox
              checked={state.is_sibling_student === 1}
              onChange={(e) => handleChange("is_sibling_student", e)}
            />
          }
          label="Saudara kandung di pahoa"
        />
      </Grid>

      <TextField
        value={state.foster}
        onChange={(e) => handleChange("foster", e)}
        fullWidth
        autoComplete="on"
        type="number"
        label="Jumlah saudara angkat"
        error={Boolean(errors.foster)}
        helperText={errors.foster}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.step_siblings}
        onChange={(e) => handleChange("step_siblings", e)}
        fullWidth
        autoComplete="on"
        type="number"
        label="Jumlah saudara tiri"
        error={Boolean(errors.step_siblings)}
        helperText={errors.step_siblings}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.medical_history}
        onChange={(e) => handleChange("medical_history", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Riwayat medis"
        error={Boolean(errors.medical_history)}
        helperText={errors.medical_history}
        sx={{ mb: 3 }}
      />

      <Grid container>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.is_active === 1}
              onChange={(e) => handleChange("is_active", e)}
            />
          }
          label="Active"
        />
      </Grid>

      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}
          >
            <InputLabel id="student_status_value-label">Status</InputLabel>
            <Select
              labelId="student_status_value-label"
              id="student_status_value-select"
              label="Status"
              value={state.student_status_value}
              onChange={(e) => handleChange("student_status_value", e)}
            >
              {student_statusOptions.map((student_status) => (
                <MenuItem key={student_status.value} value={student_status.value}>
                  {student_status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.student_status && state.student_status.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Status"
          sx={{ mb: 3 }}
        />
      </Conditional>

      <Conditional condition={actionCode === "READ"}>
        <TextField
          value={state.lulus_tahun && state.lulus_tahun.name}
          fullWidth
          autoComplete="on"
          type="text"
          label="Tahun Lulus"
          sx={{ mb: 3 }}
        />
      </Conditional>
      <Conditional condition={actionCode !== "READ"}>
        <Grid container style={{ marginBottom: 16 }}>
          <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
            <InputLabel id="lulus_tahun-label">Tahun Lulus</InputLabel>
            <Select
              labelId="lulus_tahun-label"
              id="lulus_tahun-select"
              name="lulus_tahun"
              value={state.lulus_tahun_id}
              label="Tahun Lulus"
              onChange={(e) => handleChange("lulus_tahun_id", e)}
              error={errors.lulus_tahun_id}
            >
              {tahunOptions.map((lulus_tahun) => (
                <MenuItem key={lulus_tahun.id} value={lulus_tahun.id}>
                  {lulus_tahun.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.lulus_tahun}</FormHelperText>
          </FormControl>
        </Grid>
      </Conditional>

      <TextField
        value={state.gol_darah}
        onChange={(e) => handleChange("gol_darah", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Golongan darah"
        error={Boolean(errors.gol_darah)}
        helperText={errors.gol_darah}
        sx={{ mb: 3 }}
      />

      <Grid container>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.is_cacat === 1}
              onChange={(e) => handleChange("is_cacat", e)}
            />
          }
          label="Disabilitas"
        />
      </Grid>

      <TextField
        value={state.tinggi}
        onChange={(e) => handleChange("tinggi", e)}
        fullWidth
        autoComplete="on"
        type="number"
        label="Tinggi badan (cm)"
        error={Boolean(errors.tinggi)}
        helperText={errors.tinggi}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.berat}
        onChange={(e) => handleChange("berat", e)}
        fullWidth
        autoComplete="on"
        type="number"
        label="Berat badan (kg)"
        error={Boolean(errors.berat)}
        helperText={errors.berat}
        sx={{ mb: 3 }}
      />

      <TextField
        value={state.sekolah_asal}
        onChange={(e) => handleChange("sekolah_asal", e)}
        fullWidth
        autoComplete="on"
        type="text"
        label="Sekolah asal"
        error={Boolean(errors.sekolah_asal)}
        helperText={errors.sekolah_asal}
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
