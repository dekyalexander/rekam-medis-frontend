import { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useFormik, Form, FormikProvider } from "formik";
import moment from "moment";
import format from "date-fns/format";
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
  InputAdornment,
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
  CircularProgress,
  Autocomplete,
} from "@material-ui/core";
import DatePicker from "@material-ui/lab/DatePicker";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
// import { format, parse } from "date-fns";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import Protected from "src/components/Protected";
import { useDebounce } from "react-use";
// import ResepObat from "./ResepObat";
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
  const { user, units, roles } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  // const [isSubmitting, setisSubmitting] = useState(false);
  // const [errors, seterrors] = useState({});
  const [openStudentAutoComplete, setopenStudentAutoComplete] = useState(false);
  const [studentAutoCompleteLoading, setstudentAutoCompleteLoading] = useState(
    false
  );
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState("");
  //const [isUsernameChanged, setisUsernameChanged] = useState(false);
  //const [eyevisusOptions, seteyevisusOptions] = useState([]);
  //const [jenjangOptions, setjenjangOptions] = useState([]);
  // const [diagnosisbmiOptions, setdiagnosisbmiOptions] = useState([]);
  const [diagnosismcuOptions, setdiagnosismcuOptions] = useState([]);
  const [diagnosisgeneralOptions, setdiagnosisgeneralOptions] = useState([]);
  //const [ukslocationOptions, setukslocationOptions] = useState([]);
  const [diagnosiseyeOptions, setdiagnosiseyeOptions] = useState([]);
  //const [drugOptions, setdrugOptions] = useState([]);
  const [studentOptions, setstudentOptions] = useState([]);

  //Datepicker
  // const [inspection_date, setinspectiondateValue] = useState(new Date());
  //const [umur, setumurValue] = useState(new Date());

  const eyeVisusOD = [
    "20/15",
    "20/20",
    "20/25",
    "20/30",
    "20/40",
    "20/50",
    "20/25",
    "20/70",
    "20/100",
    "20/200",
  ];
  const eyeVisusOS = [
    "20/15",
    "20/20",
    "20/25",
    "20/30",
    "20/40",
    "20/50",
    "20/25",
    "20/70",
    "20/100",
    "20/200",
  ];

  // const kesimpulanLK = ["Mikrosefali", "Normal"];

  // const kesimpulanLILA = [
  //   "Persediaan Lemak Tubuh Sedikit / Malnutrisi",
  //   "Persediaan Lemak Tubuh Cukup Banyak",
  //   "Normal",
  // ];

  // State Dynamic Form General Diagnosis

  const [
    dynamicFormGeneralDiagnosis,
    setDynamicFormGeneralDiagnosis,
  ] = useState({
    studentmcugeneraldiagnosis: [
      {
        diagnosis_general_id: "",
      },
    ],
  });

  // State Dynamic Form Eye Diagnosis

  const [dynamicFormEyeDiagnosis, setDynamicFormEyeDiagnosis] = useState({
    studentmcueyediagnosis: [
      {
        diagnosis_eye_id: "",
      },
    ],
  });

  // State Dynamic Form Dental And Oral Diagnosis

  const [
    dynamicFormDentalAndOralDiagnosis,
    setDynamicFormDentalAndOralDiagnosis,
  ] = useState({
    studentmcudentalandoraldiagnosis: [
      {
        diagnosis_dental_id: "",
      },
    ],
  });

  // State General

  const [state, setstate] = useState({
    id: "",
    name: "",
    niy: "",
    level: "",
    kelas: { code: "" },
    school_year: "",
    inspection_date: "",
    od_eyes: "",
    os_eyes: "",
    color_blind: "",
    eye_diagnosis: "",
    blood_pressure: "",
    pulse: "",
    respiration: "",
    temperature: "",
    general_diagnosis: "",
    dental_occlusion: "",
    tooth_gap: "",
    crowding_teeth: "",
    dental_debris: "",
    tartar: "",
    tooth_abscess: "",
    tongue: "",
    other: "",
    dental_diagnosis: "",
    suggestion: "",
    studentexamination: {
      weight: "",
      height: "",
      bmi_calculation_results: "",
      bmi_diagnosis: "",
      gender: "",
      age: "",
      lk: "",
      lila: "",
      conclusion_lk: "",
      conclusion_lila: "",
    },
    student_mcu_id: "",
  });

  {
    /*
  //Fungsi GetData Eye Visus
  const geteyevisusOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.student_mcu.option_eye_visus, {
      params: params,
    });
    if (response && response.data) {
      seteyevisusOptions(response.data);
    }
  };
*/
  }

  {
    /*
  //Fungsi GetData Jenjang
  const getjenjangOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.jenjang.option, {
      params: params,
    });
    if (response && response.data) {
      setjenjangOptions(response.data);
    }
    console.log(response);
  };
*/
  }

  //Fungsi GetData Diagnosis BMI
  // const getdiagnosisbmiOptions = async (id) => {
  //   const params = {
  //     id: id,
  //   };
  //   const response = await axios.get(
  //     endpoint.student_mcu.option_diagnosis_bmi,
  //     {
  //       params: params,
  //     }
  //   );
  //   if (response && response.data) {
  //     setdiagnosisbmiOptions(response.data);
  //   }
  // };

  //Fungsi GetData Diagnosis MCU
  const getdiagnosismcuOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.diagnosis_mcu.root, {
      params: params,
    });
    if (response && response.data) {
      setdiagnosismcuOptions(response.data);
    }
  };

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

  //Fungsi Perhitungan BMI
  // const hitungHasilBMI = () => {
  //   let tinggi = parseFloat(state.studentexamination.height);
  //   let berat = parseFloat(state.studentexamination.weight);
  //   let bmi = berat / (tinggi * tinggi);
  //   if (state.studentexamination.weight === "") {
  //     return "";
  //   } else if (state.studentexamination.height === "") {
  //     return "";
  //   } else {
  //     // return state.studentexamination.weight / state.studentexamination.height;
  //     return parseFloat(bmi).toFixed(1);
  //   }
  // };

  const hitungHasilDiagnosis = () => {
    let tinggi = parseFloat(state.studentexamination.height);
    let berat = parseFloat(state.studentexamination.weight);
    let bmi = berat / (tinggi * tinggi);
    if (state.studentexamination.weight === "") {
      return "";
    } else if (state.studentexamination.height === "") {
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
    let tinggi = parseFloat(state.studentexamination.height);
    let berat = parseFloat(state.studentexamination.weight);
    let bmi = berat / (tinggi * tinggi);
    if (state.studentexamination.weight === "") {
      return "";
    } else if (state.studentexamination.height === "") {
      return "";
    } else {
      return parseFloat(bmi).toFixed(1);
    }
  };

  useEffect(() => {
    state.studentexamination.bmi_calculation_results = hitungHasilBMI();
  }, [state.studentexamination.weight, state.studentexamination.height]);

  useEffect(() => {
    state.studentexamination.bmi_diagnosis = hitungHasilDiagnosis();
  }, [state.studentexamination.weight, state.studentexamination.height]);

  // Perhitungan Lingkar Kepala
  const hitungHasilLingkarKepala = () => {
    let usia = state.studentexamination.age;
    let jenis_kelamin = state.gender;
    let lingkar_kepala = parseFloat(state.studentexamination.lk);
    if (state.studentexamination.age === "") {
      return "";
    } else if (state.gender === "") {
      return "";
    } else if (state.studentexamination.lk === "") {
      return "";
    } else if (
      (usia == 2) &
      (jenis_kelamin == "Wanita") &
      (lingkar_kepala >= 45.7)
    ) {
      return "Mikrosefali";
    } else if (
      (usia == 2) &
      (jenis_kelamin == "Pria") &
      (lingkar_kepala >= 46.8)
    ) {
      return "Mikrosefali";
    } else if (
      (usia == 3) &
      (jenis_kelamin == "Wanita") &
      (lingkar_kepala >= 47)
    ) {
      return "Mikrosefali";
    } else if (
      (usia == 3) &
      (jenis_kelamin == "Pria") &
      (lingkar_kepala >= 48)
    ) {
      return "Mikrosefali";
    } else if (
      (usia == 4) &
      (jenis_kelamin == "Wanita") &
      (lingkar_kepala >= 47.9)
    ) {
      return "Mikrosefali";
    } else if (
      (usia == 4) &
      (jenis_kelamin == "Pria") &
      (lingkar_kepala >= 48.7)
    ) {
      return "Mikrosefali";
    } else if (
      (usia == 5) &
      (jenis_kelamin == "Wanita") &
      (lingkar_kepala >= 48.4)
    ) {
      return "Mikrosefali";
    } else if (
      (usia == 5) &
      (jenis_kelamin == "Pria") &
      (lingkar_kepala >= 49.2)
    ) {
      return "Mikrosefali";
    } else if (
      (usia <= 15) &
      (jenis_kelamin == "Wanita") &
      (lingkar_kepala == "")
    ) {
      return "Mikrosefali";
    } else if (
      (usia <= 15) &
      (jenis_kelamin == "Pria") &
      (lingkar_kepala == "")
    ) {
      return "Mikrosefali";
    } else if (
      (usia >= 85) &
      (jenis_kelamin == "Wanita") &
      (lingkar_kepala == "")
    ) {
      return "Makrosefali";
    } else if (
      (usia >= 85) &
      (jenis_kelamin == "Pria") &
      (lingkar_kepala == "")
    ) {
      return "Makrosefali";
    } else if (
      (usia >= 15) &
      (jenis_kelamin == "Wanita") &
      (lingkar_kepala == "")
    ) {
      return "Normal";
    } else if (
      (usia >= 15) &
      (jenis_kelamin == "Pria") &
      (lingkar_kepala == "")
    ) {
      return "Normal";
    } else {
      return "";
    }
  };

  useEffect(() => {
    state.studentexamination.conclusion_lk = hitungHasilLingkarKepala();
  }, [state.studentexamination.lk]);

  // Perhitungan Lingkar Lengan Atas
  const hitungHasilLingkarLenganAtas = () => {
    let usia = state.studentexamination.age;
    let jenis_kelamin = state.gender;
    let lingkar_lengan_atas = parseFloat(state.studentexamination.lila);
    if (state.studentexamination.age === "") {
      return "";
    } else if (state.gender === "") {
      return "";
    } else if (state.studentexamination.lila === "") {
      return "";
    } else if (
      (usia == 2) &
      (jenis_kelamin == "Wanita") &
      (lingkar_lengan_atas >= 14.2)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia == 2) &
      (jenis_kelamin == "Pria") &
      (lingkar_lengan_atas >= 14.4)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia == 3) &
      (jenis_kelamin == "Wanita") &
      (lingkar_lengan_atas >= 14.4)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia == 3) &
      (jenis_kelamin == "Pria") &
      (lingkar_lengan_atas >= 14.5)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia == 4) &
      (jenis_kelamin == "Wanita") &
      (lingkar_lengan_atas >= 14.8)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia == 4) &
      (jenis_kelamin == "Pria") &
      (lingkar_lengan_atas >= 14.8)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia == 5) &
      (jenis_kelamin == "Wanita") &
      (lingkar_lengan_atas >= 15.3)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia == 5) &
      (jenis_kelamin == "Pria") &
      (lingkar_lengan_atas >= 15.1)
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia <= 15) &
      (jenis_kelamin == "Wanita") &
      (lingkar_lengan_atas == "")
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia <= 15) &
      (jenis_kelamin == "Pria") &
      (lingkar_lengan_atas == "")
    ) {
      return "Persediaan Lemak Tubuh Sedikit / Malnutrisi";
    } else if (
      (usia >= 85) &
      (jenis_kelamin == "Wanita") &
      (lingkar_lengan_atas == "")
    ) {
      return "Persediaan Lemak Tubuh Cukup Banyak";
    } else if (
      (usia >= 85) &
      (jenis_kelamin == "Pria") &
      (lingkar_lengan_atas == "")
    ) {
      return "Persediaan Lemak Tubuh Cukup Banyak";
    } else if (
      (usia >= 15) &
      (jenis_kelamin == "Wanita") &
      (lingkar_lengan_atas == "")
    ) {
      return "Normal";
    } else if (
      (usia >= 15) &
      (jenis_kelamin == "Pria") &
      (lingkar_lengan_atas == "")
    ) {
      return "Normal";
    } else {
      return "";
    }
  };

  useEffect(() => {
    state.studentexamination.conclusion_lila = hitungHasilLingkarLenganAtas();
  }, [state.studentexamination.lila]);

  //Fungsi GetData Diagnosis Eye
  const getdiagnosiseyeOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(
      endpoint.student_mcu.option_eye_diagnosis,
      {
        params: params,
      }
    );
    if (response && response.data) {
      setdiagnosiseyeOptions(response.data);
    }
  };

  //Fungsi GetData Location UKS
  {
    /*
  const getukslocationOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.uks_location.root, {
      params: params,
    });
    if (response && response.data) {
      setukslocationOptions(response.data);
    }
  };
*/
  }

  //Fungsi GetData Drug
  {
    /*
  const getdrugOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(endpoint.drug.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugOptions(response.data);
    }
  };
  */
  }

  //Fungsi GetData Student
  const getstudentOptions = async (id) => {
    setstudentAutoCompleteLoading(true);
    // const rolesData = roles.filter((role) => role.code == "UKS");

    // let role = "";
    // if (rolesData.length > 0) {
    //   role = rolesData[0].code;
    // } else {
    //   role = roles[0].code;
    // }

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
    const response = await axios.get(endpoint.student.option, {
      params: params,
    });
    if (response && response.data) {
      //console.log(response.data);
      setstudentOptions(response.data);
    }
    // console.log(response);
    setstudentAutoCompleteLoading(false);
  };

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
      setDynamicFormGeneralDiagnosis({
        studentmcugeneraldiagnosis:
          row.studentmcugeneraldiagnosis.length > 0
            ? row.studentmcugeneraldiagnosis.map((data) => ({
                diagnosis_general_id: data.diagnosis_general_id,
              }))
            : [{ diagnosis_general_id: "" }],
      });
      setDynamicFormEyeDiagnosis({
        studentmcueyediagnosis:
          row.studentmcueyediagnosis.length > 0
            ? row.studentmcueyediagnosis.map((data) => ({
                diagnosis_eye_id: data.diagnosis_eye_id,
              }))
            : [{ diagnosis_eye_id: "" }],
      });
      setDynamicFormDentalAndOralDiagnosis({
        studentmcudentalandoraldiagnosis:
          row.studentmcudentalandoraldiagnosis.length > 0
            ? row.studentmcudentalandoraldiagnosis.map((data) => ({
                diagnosis_dental_id: data.diagnosis_dental_id,
              }))
            : [{ diagnosis_dental_id: "" }],
      });
    }
    // console.log("setstate", state);
  };

  const ValidationForm = Yup.object().shape({
    name: Yup.string().required("Nama Tidak Boleh Kosong"),
    niy: Yup.string().required("NIY Tidak Boleh Kosong"),
    level: Yup.string().required("Jenjang Tidak Boleh Kosong"),
    // code: Yup.string().required("Kelas Tidak Boleh Kosong"),
    school_year: Yup.string().required("Tahun Ajaran Tidak Boleh Kosong"),
    inspection_date: Yup.date().required("Tanggal Periksa Tidak Boleh Kosong"),
    // weight: Yup.string().required("Berat Badan Tidak Boleh Kosong"),
    // height: Yup.string().required("Tinggi Badan Tidak Boleh Kosong"),
    // age: Yup.string().required("Umur Tidak Boleh Kosong"),
    gender: Yup.string().required("Jenis Kelamin Tidak Boleh Kosong"),
    // bmi_calculation_results: Yup.string().required(
    //   "Hasil Perhitungan BMI Tidak Boleh Kosong"
    // ),
    // bmi_diagnosis: Yup.string().required("Diagnosis BMI Tidak Boleh Kosong"),
    // lk: Yup.string().required("Lingkar Kepala Tidak Boleh Kosong"),
    // lila: Yup.string().required("Lingkar Lengan Atas Tidak Boleh Kosong"),
    // conclusion_lk: Yup.string().required(
    //   "Kesimpulan Lingkar Kepala Tidak Boleh Kosong"
    // ),
    // conclusion_lila: Yup.string().required(
    //   "Kesimpulan Lingkar Lengan Atas Tidak Boleh Kosong"
    // ),
    // blood_pressure: Yup.string().required("Tekanan Darah Tidak Boleh Kosong"),
    // pulse: Yup.string().required("Nadi Tidak Boleh Kosong"),
    // respiration: Yup.string().required("Pernapasan Tidak Boleh Kosong"),
    // temperature: Yup.string().required("Suhu Tidak Boleh Kosong"),
    // general_diagnosis: Yup.string().required(
    //   "Diagnosis Umum Tidak Boleh Kosong"
    // ),
    // od_eyes: Yup.string().required("Ocular Dextra Tidak Boleh Kosong"),
    // os_eyes: Yup.string().required("Ocular Sinistra Tidak Boleh Kosong"),
    // color_blind: Yup.string().required("Buta Warna Tidak Boleh Kosong"),
    // eye_diagnosis: Yup.string().required("Diagnosis Mata Tidak Boleh Kosong"),
    // dental_diagnosis: Yup.string().required(
    //   "Diagnosis Gigi Tidak Boleh Kosong"
    // ),
    // suggestion: Yup.string().required("Saran Tidak Boleh Kosong"),
  });

  //Backup handleChange
  {
    /*
  const handleChangeField = (index, event) => {
    let values = [...dynamicForm];
    values[index][event.target.name] = event.target.value;
    setDynamicForm(values);
  };
  */
  }

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

    // console.log(fieldName);
    // console.log(eventValue);
    setstate(newState);
  };

  const handleChange = (index, eventValue) => {
    let newState1 = { ...state };
    //let newState2 = [...dynamicForm];

    let value = "";

    if (index === "student_id") {
      value = eventValue ? eventValue.id : "";
      newState1["name"] = eventValue ? eventValue.name : "";
    } else {
      value = eventValue.target.value;
    }

    if (index === "student_id") {
      value = eventValue ? eventValue.id : "";
      newState1["niy"] = eventValue ? eventValue.niy : "";
    } else {
      value = eventValue.target.value;
    }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1["level"] = eventValue ? eventValue.jenjang.code : "";
    // } else {
    //   value = eventValue.target.value;
    // }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1["kelas"] = eventValue ? eventValue.kelas.name : "";
    // } else {
    //   value = eventValue.target.value;
    // }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1["school_year"] = eventValue
    //     ? eventValue.tahunpelajaran.name
    //     : "";
    // } else {
    //   value = eventValue.target.value;
    // }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1.studentexamination["age"] = eventValue
    //     ? eventValue.birth_date
    //     : "";
    // } else {
    //   value = eventValue.target.value;
    // }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1["gender"] = eventValue ? eventValue.sex_type_value : "";
    // } else {
    //   value = eventValue.target.value;
    // }

    if (index === "student_id") {
      value = eventValue ? eventValue.id : "";
      if (eventValue) {
        newState1["level"] = eventValue ? eventValue.jenjang.code : "";
      } else {
        value: "";
      }
    } else {
      value = eventValue.target.value;
    }

    if (index === "student_id") {
      value = eventValue ? eventValue.id : "";
      if (eventValue) {
        newState1.kelas["code"] = eventValue ? eventValue.kelas.name : "";
      } else {
        value: "";
      }
    } else {
      value = eventValue.target.value;
    }

    if (index === "student_id") {
      value = eventValue ? eventValue.id : "";
      if (eventValue) {
        newState1["school_year"] = eventValue.studentmutation[0]
          ? eventValue.studentmutation[0].tahunpelajaran.name
          : "Tahun Ajaran Tidak Ditemukan";
      } else {
        value: "";
      }
    } else {
      value = eventValue.target.value;
    }

    if (index === "student_id") {
      value = eventValue ? eventValue.id : "";
      if (eventValue) {
        if (newState1.studentexamination["age"] !== "") {
          newState1.studentexamination["age"] = eventValue
            ? (eventValue = Math.max(
                0,
                moment().format("YYYY") -
                  moment(eventValue.birth_date).format("YYYY")
              ))
            : 0;
        } else if (newState1.studentexamination["age"] === NaN) {
          newState1.studentexamination["age"] = moment(
            eventValue.birth_date
          ).format("YYYY");
        } else {
          newState1.studentexamination["age"] = 0;
        }
        // newState1.studentexamination["age"] = eventValue
        //   ? (eventValue =
        //       moment().format("YYYY") -
        //       moment(eventValue.birth_date).format("YYYY"))
        //   : 0;
      } else {
        value: "";
      }
    } else {
      value = eventValue.target.value;
    }

    const header_detail = [
      "weight",
      "height",
      "bmi_calculation_results",
      "bmi_diagnosis",
      "gender",
      "age",
      "lk",
      "lila",
      "conclusion_lk",
      "conclusion_lila",
    ];

    if (header_detail.includes(index)) {
      newState1.studentexamination[index] = value;
    } else {
      newState1[index] = value;
    }
    setstate(newState1);

    if (index === "id") {
      geteyevisusOptions(value);
      //getjenjangOptions(value);
      // getdiagnosisbmiOptions(value);
      getdiagnosismcuOptions(value);
      getdiagnosisgeneralOptions(value);
      getdiagnosiseyeOptions(value);
      getstudentOptions(value);
      //getdrugOptions(value);
      //getukslocationOptions(value);
      setinspectiondateValue(value);
      //setumurValue(value);
    }
    newState1[index] = value;

    setstate(newState1);
    //newState2[index] = value;
    //setDynamicForm(newState2);
    console.log(eventValue);
    // console.log(value);
    // console.log(
    //   moment().format("YYYY") - moment(eventValue.birth_date).format("YYYY")
    // );
  };

  // Function Onchange Dynamic Form General Diagnosis

  const handleChangeFieldGeneralDiagnosis = (index, event) => {
    if (["diagnosis_general_id"].includes(event.target.name)) {
      let studentmcugeneraldiagnosis = [
        ...dynamicFormGeneralDiagnosis.studentmcugeneraldiagnosis,
      ];
      studentmcugeneraldiagnosis[index][event.target.name] = event.target.value;
      setDynamicFormGeneralDiagnosis({ studentmcugeneraldiagnosis });
    } else {
      setDynamicFormGeneralDiagnosis({
        [event.target.name]: event.target.value,
      });
    }
  };

  // Function Onchange Dynamic Form Eye Diagnosis

  const handleChangeFieldEyeDiagnosis = (index, event) => {
    if (["diagnosis_eye_id"].includes(event.target.name)) {
      let studentmcueyediagnosis = [
        ...dynamicFormEyeDiagnosis.studentmcueyediagnosis,
      ];
      studentmcueyediagnosis[index][event.target.name] = event.target.value;
      setDynamicFormEyeDiagnosis({ studentmcueyediagnosis });
    } else {
      setDynamicFormEyeDiagnosis({
        [event.target.name]: event.target.value,
      });
    }
  };

  // Function Onchange Dynamic Form Dental And Oral Diagnosis

  const handleChangeFieldDentalAndOralDiagnosis = (index, event) => {
    if (["diagnosis_dental_id"].includes(event.target.name)) {
      let studentmcudentalandoraldiagnosis = [
        ...dynamicFormDentalAndOralDiagnosis.studentmcudentalandoraldiagnosis,
      ];
      studentmcudentalandoraldiagnosis[index][event.target.name] =
        event.target.value;
      setDynamicFormDentalAndOralDiagnosis({
        studentmcudentalandoraldiagnosis,
      });
    } else {
      setDynamicFormDentalAndOralDiagnosis({
        [event.target.name]: event.target.value,
      });
    }
  };

  // Function Add And Delete Dynamic Form General Diagnosis

  const handleAddFieldsGeneralDiagnosis = () => {
    setDynamicFormGeneralDiagnosis({
      studentmcugeneraldiagnosis: [
        ...dynamicFormGeneralDiagnosis.studentmcugeneraldiagnosis,
        {
          diagnosis_general_id: "",
        },
      ],
    });
  };

  const handleRemoveFieldsGeneralDiagnosis = (index) => {
    dynamicFormGeneralDiagnosis.studentmcugeneraldiagnosis.splice(index, 1);

    setDynamicFormGeneralDiagnosis({
      studentmcugeneraldiagnosis:
        dynamicFormGeneralDiagnosis.studentmcugeneraldiagnosis,
    });
  };

  // Function Add And Delete Dynamic Form Eye Diagnosis

  const handleAddFieldsEyeDiagnosis = () => {
    setDynamicFormEyeDiagnosis({
      studentmcueyediagnosis: [
        ...dynamicFormEyeDiagnosis.studentmcueyediagnosis,
        {
          diagnosis_eye_id: "",
        },
      ],
    });
  };

  const handleRemoveFieldsEyeDiagnosis = (index) => {
    dynamicFormEyeDiagnosis.studentmcueyediagnosis.splice(index, 1);

    setDynamicFormEyeDiagnosis({
      studentmcueyediagnosis: dynamicFormEyeDiagnosis.studentmcueyediagnosis,
    });
  };

  // Function Add And Delete Dynamic Form Eye Diagnosis

  const handleAddFieldsDentalAndOralDiagnosis = () => {
    setDynamicFormDentalAndOralDiagnosis({
      studentmcudentalandoraldiagnosis: [
        ...dynamicFormDentalAndOralDiagnosis.studentmcudentalandoraldiagnosis,
        {
          diagnosis_dental_id: "",
        },
      ],
    });
  };

  const handleRemoveFieldsDentalAndOralDiagnosis = (index) => {
    dynamicFormDentalAndOralDiagnosis.studentmcudentalandoraldiagnosis.splice(
      index,
      1
    );

    setDynamicFormDentalAndOralDiagnosis({
      studentmcudentalandoraldiagnosis:
        dynamicFormDentalAndOralDiagnosis.studentmcudentalandoraldiagnosis,
    });
  };

  {
    /* const handleChangeInput = (id, event) => {
    const newInputFields = state.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setstate(newInputFields);
  }; */
  }

  //handleAddFields yang dipakai
  {
    /*
  const handleAddFields = () => {
    setDynamicForm([
      ...dynamicForm,
      {
        id_mcu_siswa: null,
        lokasi_obat: "",
        nama_obat: "",
        jumlah_obat: "",
        satuan: "",
        cara_penggunaan_obat: "",
      },
    ]);
  };
*/
  }

  //handleRemoveFields yang dipakai
  {
    /*
  const handleRemoveFields = (index) => {
    const values = [...dynamicForm];
    values.splice(index, 1);
    setDynamicForm(values);
  };
  */
  }

  // const submit = async () => {
  //   let params = {
  //     name: state.name,
  //     level: state.level,
  //     kelas: state.kelas,
  //     school_year: state.school_year,
  //     //inspection_date: state.tanggal_periksa,
  //     inspection_date: format(inspection_date, "yyyy-MM-dd"),
  //     od_eyes: state.od_eyes,
  //     os_eyes: state.os_eyes,
  //     color_blind: state.color_blind,
  //     eye_diagnosis: state.eye_diagnosis,
  //     blood_pressure: state.blood_pressure,
  //     pulse: state.pulse,
  //     respiration: state.respiration,
  //     temperature: state.temperature,
  //     general_diagnosis: state.general_diagnosis,
  //     dental_occlusion: state.dental_occlusion,
  //     tooth_gap: state.tooth_gap,
  //     crowding_teeth: state.crowding_teeth,
  //     dental_debris: state.dental_debris,
  //     tartar: state.tartar,
  //     tooth_abscess: state.tooth_abscess,
  //     tongue: state.tongue,
  //     other: state.other,
  //     dental_diagnosis: state.dental_diagnosis,
  //     suggestion: state.suggestion,
  //     weight: state.weight,
  //     height: state.height,
  //     bmi_calculation_results: state.bmi_calculation_results,
  //     bmi_diagnosis: state.bmi_diagnosis,
  //     gender: state.gender,
  //     age: state.age,
  //     //age: format(umur, "yyyy-MM-dd"),
  //     lk: state.lk,
  //     lila: state.lila,
  //     conclusion_lk: state.conclusion_lk,
  //     conclusion_lila: state.conclusion_lila,
  //     //location_drug: dynamicForm.lokasi_obat,
  //     //drug_name: dynamicForm.nama_obat,
  //     //amount_medicine: dynamicForm.jumlah_obat,
  //     //unit: dynamicForm.satuan,
  //     //how_to_use_medicine: dynamicForm.cara_penggunaan_obat,
  //     student_mcu_id: state.student_mcu_id,
  //     //student_mcu_id: dynamicForm.id_mcu_siswa,
  //   };
  //   if (actionCode === "CREATE") {
  //     await axios.post(endpoint.student_mcu.create, params);
  //   } else {
  //     params = { ...params, id: state.id };
  //     await axios.put(endpoint.student_mcu.update, params);
  //   }
  //   setisSubmitting(false);
  //   submitSuccess("saving data success");
  //   getData();
  //   console.log(params);
  //   console.log(actionCode);
  // };

  let params = {
    id: state.id,
    name: state.name,
    niy: state.niy,
    level: state.level,
    kelas: state.kelas.code,
    school_year: state.school_year,
    // inspection_date: format(inspection_date, "yyyy-MM-dd"),
    inspection_date: state.inspection_date,
    od_eyes: state.od_eyes,
    os_eyes: state.os_eyes,
    color_blind: state.color_blind,
    // eye_diagnosis: state.eye_diagnosis,
    blood_pressure: state.blood_pressure,
    pulse: state.pulse,
    respiration: state.respiration,
    temperature: state.temperature,
    // general_diagnosis: state.general_diagnosis,
    dental_occlusion: state.dental_occlusion,
    tooth_gap: state.tooth_gap,
    crowding_teeth: state.crowding_teeth,
    dental_debris: state.dental_debris,
    tartar: state.tartar,
    tooth_abscess: state.tooth_abscess,
    tongue: state.tongue,
    other: state.other,
    // dental_diagnosis: state.dental_diagnosis,
    suggestion: state.suggestion,
    weight: state.studentexamination.weight,
    height: state.studentexamination.height,
    bmi_calculation_results: state.studentexamination.bmi_calculation_results,
    bmi_diagnosis: state.studentexamination.bmi_diagnosis,
    gender: state.studentexamination.gender,
    age: state.studentexamination.age,
    lk: state.studentexamination.lk,
    lila: state.studentexamination.lila,
    conclusion_lk: state.studentexamination.conclusion_lk,
    conclusion_lila: state.studentexamination.conclusion_lila,
    dynamicFormGeneralDiagnosis: JSON.stringify(
      dynamicFormGeneralDiagnosis.studentmcugeneraldiagnosis
    ),
    dynamicFormEyeDiagnosis: JSON.stringify(
      dynamicFormEyeDiagnosis.studentmcueyediagnosis
    ),
    dynamicFormDentalAndOralDiagnosis: JSON.stringify(
      dynamicFormDentalAndOralDiagnosis.studentmcudentalandoraldiagnosis
    ),
    student_mcu_id: state.student_mcu_id,
  };

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: params,
  //   validationSchema: ValidationForm,

  //   onSubmit: async (values, { setSubmitting }) => {
  //     if (actionCode === "CREATE") {
  //       await axios.post(endpoint.student_mcu.create, values);
  //     } else {
  //       await axios.put(endpoint.student_mcu.update, values);
  //     }
  //     setSubmitting(false);
  //     submitSuccess("saving data success");
  //     getData();
  //   },
  // });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: params,
    validationSchema: ValidationForm,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.student_mcu.create, values)
          .catch(function (error) {
            submitError("Data sudah ada !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        let respon = await axios
          .post(endpoint.student_mcu.update, values)
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
    //geteyevisusOptions();
    // getdiagnosisbmiOptions();
    //getjenjangOptions();
    getdiagnosismcuOptions();
    getdiagnosisgeneralOptions();
    getdiagnosiseyeOptions();
    //getukslocationOptions();
    //getdrugOptions();
    getstudentOptions();
    //console.log(state);
  }, []);

  // useEffect(() => {
  //   console.log(inspection_date);
  // }, [inspection_date]);

  // useEffect(() => {
  //   console.log(moment().format("YYYY-MM-DD"));
  // });

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  useEffect(() => {
    console.log(dynamicFormGeneralDiagnosis);
  }, [dynamicFormGeneralDiagnosis]);

  useEffect(() => {
    console.log(dynamicFormEyeDiagnosis);
  }, [dynamicFormEyeDiagnosis]);

  useEffect(() => {
    console.log(dynamicFormDentalAndOralDiagnosis);
  }, [dynamicFormDentalAndOralDiagnosis]);

  useDebounce(
    () => {
      if (autoCompleteKeyword.trim() != "") {
        getstudentOptions(autoCompleteKeyword);
      }
    },
    500,
    [autoCompleteKeyword]
  );

  //useEffect(() => {
  //console.log(umur);
  //}, [umur]);

  {
    /*
  useEffect(() => {
    console.log(dynamicForm);
  }, [dynamicForm]);
*/
  }

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
              {/*
          <Autocomplete
            disablePortal
            id="nama-pasien"
            value={state.nama}
            onChange={(e) => handleChange("nama", e)}
            options={userOptions}
            getOptionLabel={(user) => (user.name ? user.name : "")}
            getOptionSelected={(user, id) => user.id === user.id}
            renderInput={(params) => <TextField {...params} label="Nama" />}
          />
          */}
              <Autocomplete
                id="name"
                freeSolo
                onOpen={() => {
                  setopenStudentAutoComplete(true);
                }}
                onClose={() => {
                  setopenStudentAutoComplete(false);
                }}
                loading={studentAutoCompleteLoading}
                // value={state.name}
                onChange={(event, newValue) => {
                  // console.log(JSON.stringify(newValue, null, " "));
                  handleChange("student_id", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue);
                }}
                getOptionLabel={(option) => option.name || ""}
                // value={studentOptions.find((v) => v.name[0]) || {}}
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                // onChange={(e) => handleChange("nama", e)}
                // options={studentOptions.map((student) => student.name)}
                options={studentOptions}
                value={state !== null ? state : studentOptions[0]}
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
                          {studentAutoCompleteLoading ? (
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
            {...getFieldProps("niy")}
            value={state && state.niy}
            onChange={(e) => handleChange("niy", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="NIY"
            error={Boolean(touched.niy && errors.niy)}
            helperText={touched.niy && errors.niy}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <TextField
            {...getFieldProps("level")}
            value={state && state.level}
            onChange={(e) => handleChange("level", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Jenjang"
            error={Boolean(touched.level && errors.level)}
            helperText={touched.level && errors.level}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <TextField
            // {...getFieldProps("code")}
            value={state && state.kelas.code}
            onChange={(e) => handleChange("code", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Kelas"
            // error={Boolean(touched.code && errors.code)}
            // helperText={touched.code && errors.code}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <TextField
            {...getFieldProps("school_year")}
            value={state && state.school_year}
            onChange={(e) => handleChange("school_year", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Tahun Ajaran"
            error={Boolean(touched.school_year && errors.school_year)}
            helperText={touched.school_year && errors.school_year}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <TextField
            {...getFieldProps("age")}
            value={state && state.studentexamination.age}
            onChange={(e) => handleChange("age", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Umur"
            error={Boolean(touched.age && errors.age)}
            helperText={touched.age && errors.age}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          {/*
      <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Umur</Typography>
      </Grid>
      */}

          {/*
      <Grid container style={{ marginBottom: 16 }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: "100%" }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Umur"
              value={umur}
              fullWidth
              onChange={(e) => {
                setumurValue(e);
              }}
              //onChange={(event, newValue) => {
              //handleChange("tanggal", newValue);
              //}}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>
      */}

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Jenis Kelamin</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              {...getFieldProps("gender")}
              row
              aria-label="gender"
              value={state.studentexamination.gender}
              onChange={(e) => handleChange("gender", e)}
              name="row-radio-buttons-group"
              error={Boolean(touched.gender && errors.gender)}
              helperText={touched.gender && errors.gender}
            >
              <FormControlLabel value="Pria" control={<Radio />} label="Pria" />
              <FormControlLabel
                value="Wanita"
                control={<Radio />}
                label="Wanita"
              />
            </RadioGroup>
          </Grid>

          {/*
      <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Tanggal Periksa</Typography>
      </Grid>
      */}

          <Grid container style={{ marginBottom: 16 }}>
            {/*
        <TextField
          value={state.tanggal_periksa}
          onChange={(e) => handleChange("tanggal_periksa", e)}
          fullWidth
          autoComplete="on"
          type="date"
          label=""
          error={Boolean(errors.code)}
          helperText={errors.code}
          sx={{ mb: 5 }}
        />
        */}
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  {...getFieldProps("inspection_date")}
                  label="Tanggal Periksa"
                  error={Boolean(
                    touched.inspection_date && errors.inspection_date
                  )}
                  helperText={touched.inspection_date && errors.inspection_date}
                  value={inspection_date}
                  fullWidth
                  onChange={(e) => {
                    setinspectiondateValue(e);
                  }}
                  //onChange={(event, newValue) => {
                  //handleChange("tanggal", newValue);
                  //}}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider> */}
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
            <Typography variant="p">Pemeriksaan Umum</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              {/* <InputLabel htmlFor="weight">Berat Badan</InputLabel>
          <Input
            value={state.weight}
            onChange={(e) => handleChange("weight", e)}
            fullWidth
            autoComplete="on"
            type="number"
            sx={{ mb: 5 }}
            startAdornment={
              <InputAdornment position="start">Kg</InputAdornment>
            }
          /> */}
              <TextField
                {...getFieldProps("weight")}
                value={state.studentexamination.weight}
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
              {/* <InputLabel htmlFor="height">Tinggi Badan</InputLabel>
          <Input
            value={state.height}
            onChange={(e) => handleChange("height", e)}
            fullWidth
            autoComplete="on"
            type="number"
            sx={{ mb: 5 }}
            startAdornment={<InputAdornment position="start">M</InputAdornment>}
          /> */}
              <TextField
                {...getFieldProps("height")}
                value={state.studentexamination.height}
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
                value={state.studentexamination.bmi_calculation_results}
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
            {/* <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="diagnosis-bmi">Pilih Diagnosis BMI</InputLabel>
              <Select
                {...getFieldProps("bmi_diagnosis")}
                labelId="diagnosis-bmi"
                id="diagnosis-bmi"
                value={state.studentexamination.bmi_diagnosis}
                onChange={(e) => handleChange("bmi_diagnosis", e)}
                label="Pilih Diagnosis BMI"
                error={Boolean(touched.bmi_diagnosis && errors.bmi_diagnosis)}
                helperText={touched.bmi_diagnosis && errors.bmi_diagnosis}
              >
                {diagnosisbmiOptions.map((student_mcu) => (
                  <MenuItem key={student_mcu.id} value={student_mcu.id}>
                    {student_mcu.diagnosis_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("bmi_diagnosis")}
                value={state.studentexamination.bmi_diagnosis}
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

          {state.level === "TK" ? (
            <Stack direction="row" spacing={2}>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, width: "50%" }}
              >
                <TextField
                  {...getFieldProps("lk")}
                  value={state.studentexamination.lk}
                  onChange={(e) => handleChange("lk", e)}
                  fullWidth
                  autoComplete="on"
                  type="text"
                  label="Lingkar Kepala"
                  error={Boolean(touched.lk && errors.lk)}
                  helperText={touched.lk && errors.lk}
                  sx={{ mb: 5 }}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, width: "50%" }}
              >
                <TextField
                  {...getFieldProps("lila")}
                  value={state.studentexamination.lila}
                  onChange={(e) => handleChange("lila", e)}
                  fullWidth
                  autoComplete="on"
                  type="text"
                  label="Lingkar Lengan Atas"
                  error={Boolean(touched.lila && errors.lila)}
                  helperText={touched.lila && errors.lila}
                  sx={{ mb: 5 }}
                />
              </FormControl>
            </Stack>
          ) : null}

          {state.level === "TK" ? (
            <Stack direction="row" spacing={2}>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, width: "50%" }}
              >
                <TextField
                  {...getFieldProps("conclusion_lk")}
                  value={state.studentexamination.conclusion_lk}
                  onChange={(e) => handleChange("conclusion_lk", e)}
                  fullWidth
                  autoComplete="on"
                  type="text"
                  label="Kesimpulan Lingkar Kepala"
                  sx={{ mb: 5 }}
                  inputProps={{ readOnly: true }}
                  error={Boolean(touched.conclusion_lk && errors.conclusion_lk)}
                  helperText={touched.conclusion_lk && errors.conclusion_lk}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, width: "50%" }}
              >
                <TextField
                  {...getFieldProps("conclusion_lila")}
                  value={state.studentexamination.conclusion_lila}
                  onChange={(e) => handleChange("conclusion_lila", e)}
                  fullWidth
                  autoComplete="on"
                  type="text"
                  label="Kesimpulan Lingkar Lengan Atas"
                  sx={{ mb: 5 }}
                  inputProps={{ readOnly: true }}
                  error={Boolean(
                    touched.conclusion_lila && errors.conclusion_lila
                  )}
                  helperText={touched.conclusion_lila && errors.conclusion_lila}
                />
              </FormControl>
            </Stack>
          ) : null}

          <Grid container style={{ marginBottom: 17 }}></Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("blood_pressure")}
                value={state.blood_pressure}
                onChange={(e) => handleChange("blood_pressure", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Tekanan Darah"
                error={Boolean(touched.blood_pressure && errors.blood_pressure)}
                helperText={touched.blood_pressure && errors.blood_pressure}
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("pulse")}
                value={state.pulse}
                onChange={(e) => handleChange("pulse", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Nadi"
                error={Boolean(touched.pulse && errors.pulse)}
                helperText={touched.pulse && errors.pulse}
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
                {...getFieldProps("respiration")}
                value={state.respiration}
                onChange={(e) => handleChange("respiration", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Pernapasan"
                error={Boolean(touched.respiration && errors.respiration)}
                helperText={touched.respiration && errors.respiration}
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("temperature")}
                value={state.temperature}
                onChange={(e) => handleChange("temperature", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Suhu"
                error={Boolean(touched.temperature && errors.temperature)}
                helperText={touched.temperature && errors.temperature}
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          {/* <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="diagnosis_umum">Pilih Diagnosis Umum</InputLabel>
              <Select
                {...getFieldProps("general_diagnosis")}
                labelId="diagnosis_umum"
                id="diagnosis_umum"
                value={state.general_diagnosis}
                onChange={(e) => handleChange("general_diagnosis", e)}
                label="Pilih Diagnosis Umum"
                error={Boolean(
                  touched.general_diagnosis && errors.general_diagnosis
                )}
                helperText={
                  touched.general_diagnosis && errors.general_diagnosis
                }
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
          </Grid> */}

          {dynamicFormGeneralDiagnosis.studentmcugeneraldiagnosis.map(
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
                        name="diagnosis_general_id"
                        value={GeneralDiagnosis.diagnosis_general_id}
                        onChange={(e) =>
                          handleChangeFieldGeneralDiagnosis(index, e)
                        }
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
                          dynamicFormGeneralDiagnosis.studentmcugeneraldiagnosis
                            .length === 1
                        }
                        onClick={() =>
                          handleRemoveFieldsGeneralDiagnosis(index)
                        }
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
              onClick={handleAddFieldsGeneralDiagnosis}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Pemeriksaan Visus Mata</Typography>
          </Grid>

          {/*
      <Stack direction="row" spacing={2}>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="ocular-dextra">Pilih Ocular Dextra</InputLabel>
          <Select
            labelId="ocular-dextra"
            id="ocular-dextra"
            value={state.ocular_dextra}
            onChange={(e) => handleChange("ocular_dextra", e)}
            label="Pilih Ocular Dextra"
          >
            {eyevisusOptions.map((student_mcu) => (
              <MenuItem key={student_mcu.id} value={student_mcu.od}>
                {student_mcu.od}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: 120, width: "50%" }}>
          <InputLabel id="ocular-sinistra">Pilih Ocular Sinistra</InputLabel>
          <Select
            labelId="ocular-sinistra"
            id="ocular-sinistra"
            value={state.ocular_sinistra}
            onChange={(e) => handleChange("ocular_sinistra", e)}
            label="Pilih Ocular Sinistra"
          >
            {eyevisusOptions.map((student_mcu) => (
              <MenuItem key={student_mcu.id} value={student_mcu.os}>
                {student_mcu.os}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      */}

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="ocular-dextra">Pilih Ocular Dextra</InputLabel>
              <Select
                {...getFieldProps("od_eyes")}
                labelId="ocular-dextra"
                id="ocular-dextra"
                value={state.od_eyes}
                onChange={(e) => handleChange("od_eyes", e)}
                label="Pilih Ocular Dextra"
                error={Boolean(touched.od_eyes && errors.od_eyes)}
                helperText={touched.od_eyes && errors.od_eyes}
              >
                {eyeVisusOD.map((visus_od) => (
                  <MenuItem key={visus_od} value={visus_od}>
                    {visus_od}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="ocular-sinistra">
                Pilih Ocular Sinistra
              </InputLabel>
              <Select
                {...getFieldProps("os_eyes")}
                labelId="ocular-sinistra"
                id="ocular-sinistra"
                value={state.os_eyes}
                onChange={(e) => handleChange("os_eyes", e)}
                label="Pilih Ocular Sinistra"
                error={Boolean(touched.os_eyes && errors.os_eyes)}
                helperText={touched.os_eyes && errors.os_eyes}
              >
                {eyeVisusOS.map((visus_os) => (
                  <MenuItem key={visus_os} value={visus_os}>
                    {visus_os}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Buta Warna</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              {...getFieldProps("color_blind")}
              row
              aria-label="color-blind"
              value={state.color_blind}
              onChange={(e) => handleChange("color_blind", e)}
              name="row-radio-buttons-group"
              error={Boolean(touched.color_blind && errors.color_blind)}
              helperText={touched.color_blind && errors.color_blind}
            >
              <FormControlLabel value="Ya" control={<Radio />} label="Ya" />
              <FormControlLabel
                value="Tidak"
                control={<Radio />}
                label="Tidak"
              />
            </RadioGroup>
          </Grid>

          {/* <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="diagnosis-mata">Pilih Diagnosis Mata</InputLabel>
              <Select
                {...getFieldProps("eye_diagnosis")}
                labelId="diagnosis-mata"
                id="diagnosis-mata"
                value={state.eye_diagnosis}
                onChange={(e) => handleChange("eye_diagnosis", e)}
                label="Pilih Diagnosis Mata"
                error={Boolean(touched.eye_diagnosis && errors.eye_diagnosis)}
                helperText={touched.eye_diagnosis && errors.eye_diagnosis}
              >
                {diagnosiseyeOptions.map((student_mcu) => (
                  <MenuItem key={student_mcu.id} value={student_mcu.id}>
                    {student_mcu.diagnosis_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {dynamicFormEyeDiagnosis.studentmcueyediagnosis.map(
            (EyeDiagnosis, index) => {
              return (
                <Grid key={index}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "95%" }}
                    >
                      <InputLabel id="diagnosis-mata">
                        Pilih Diagnosis Mata
                      </InputLabel>
                      <Select
                        labelId="diagnosis-mata"
                        id="diagnosis-mata"
                        name="diagnosis_eye_id"
                        value={EyeDiagnosis.diagnosis_eye_id}
                        onChange={(e) =>
                          handleChangeFieldEyeDiagnosis(index, e)
                        }
                        label="Pilih Diagnosis Mata"
                      >
                        {diagnosiseyeOptions.map((student_mcu) => (
                          <MenuItem key={student_mcu.id} value={student_mcu.id}>
                            {student_mcu.diagnosis_name}
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
                          dynamicFormEyeDiagnosis.studentmcueyediagnosis
                            .length === 1
                        }
                        onClick={() => handleRemoveFieldsEyeDiagnosis(index)}
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
              onClick={handleAddFieldsEyeDiagnosis}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Pemeriksaan Gigi</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.dental_occlusion}
                onChange={(e) => handleChange("dental_occlusion", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Oklusi"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.tooth_gap}
                onChange={(e) => handleChange("tooth_gap", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Celah"
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
                value={state.crowding_teeth}
                onChange={(e) => handleChange("crowding_teeth", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Berjejal"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.dental_debris}
                onChange={(e) => handleChange("dental_debris", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Debris"
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
                value={state.tartar}
                onChange={(e) => handleChange("tartar", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Karang Gigi"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.tooth_abscess}
                onChange={(e) => handleChange("tooth_abscess", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Abses"
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
                value={state.tongue}
                onChange={(e) => handleChange("tongue", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Lidah"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.other}
                onChange={(e) => handleChange("other", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Lain Nya"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          {/* <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="diagnosis-gigi">
                Pilih Diagnosis Gigi Dan Mulut
              </InputLabel>
              <Select
                {...getFieldProps("dental_diagnosis")}
                labelId="diagnosis-gigi"
                id="diagnosis-gigi"
                value={state.dental_diagnosis}
                onChange={(e) => handleChange("dental_diagnosis", e)}
                label="Pilih Diagnosis Gigi Dan Mulut"
                error={Boolean(
                  touched.dental_diagnosis && errors.dental_diagnosis
                )}
                helperText={touched.dental_diagnosis && errors.dental_diagnosis}
              >
                {diagnosismcuOptions.map((diagnosis_mcu) => (
                  <MenuItem key={diagnosis_mcu.id} value={diagnosis_mcu.id}>
                    {diagnosis_mcu.diagnosis_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {dynamicFormDentalAndOralDiagnosis.studentmcudentalandoraldiagnosis.map(
            (DentalAndOralDiagnosis, index) => {
              return (
                <Grid key={index}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "95%" }}
                    >
                      <InputLabel id="diagnosis-gigi">
                        Pilih Diagnosis Gigi Dan Mulut
                      </InputLabel>
                      <Select
                        labelId="diagnosis-gigi-dan-mulut"
                        id="diagnosis-gigi-dan-mulut"
                        name="diagnosis_dental_id"
                        value={DentalAndOralDiagnosis.diagnosis_dental_id}
                        onChange={(e) =>
                          handleChangeFieldDentalAndOralDiagnosis(index, e)
                        }
                        label="Pilih Diagnosis Gigi Dan Mulut"
                      >
                        {diagnosismcuOptions.map((diagnosis_mcu) => (
                          <MenuItem
                            key={diagnosis_mcu.id}
                            value={diagnosis_mcu.id}
                          >
                            {diagnosis_mcu.diagnosis_name}
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
                          dynamicFormDentalAndOralDiagnosis
                            .studentmcudentalandoraldiagnosis.length === 1
                        }
                        onClick={() =>
                          handleRemoveFieldsDentalAndOralDiagnosis(index)
                        }
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
              onClick={handleAddFieldsDentalAndOralDiagnosis}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <TextField
            {...getFieldProps("suggestion")}
            value={state.suggestion}
            onChange={(e) => handleChange("suggestion", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Saran"
            error={Boolean(touched.suggestion && errors.suggestion)}
            helperText={touched.suggestion && errors.suggestion}
            multiline
            rows={4}
            sx={{ mb: 5 }}
          />

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
