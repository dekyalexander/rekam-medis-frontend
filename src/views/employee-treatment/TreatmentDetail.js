import { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Autocomplete,
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
import { useDispatch, useSelector } from "react-redux";
import Protected from "src/components/Protected";
import { useDebounce } from "react-use";
// import ResepObat from "./ResepObat";
// ----------------------------------------------------------------------

TreatmentDetail.propTypes = {
  sx: PropTypes.object,
};

export default function TreatmentDetail(props) {
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

  // Employee
  const [openEmployeeAutoComplete, setopenEmployeeAutoComplete] = useState(
    false
  );
  const [
    employeeAutoCompleteLoading,
    setemployeeAutoCompleteLoading,
  ] = useState(false);

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

  // Employee Keyword
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState("");

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

  //const [isUsernameChanged, setisUsernameChanged] = useState(false);
  //const [studentOptions, setstudentOptions] = useState([]);
  const [diagnosisgeneralOptions, setdiagnosisgeneralOptions] = useState([]);
  const [ukslocationOptions, setukslocationOptions] = useState([]);
  // const [
  //   ukslocationjobofficerOptions,
  //   setukslocationjobofficerOptions,
  // ] = useState([]);
  // const [drugukslocationOptions, setdrugukslocationOptions] = useState([]);
  const [drugnameOptions, setdrugnameOptions] = useState([]);
  // const [drugOptions, setdrugOptions] = useState([]);
  // const [unitOptions, setunitOptions] = useState([]);
  const [employeeOptions, setemployeeOptions] = useState([]);

  // const [uploadDone, setUploadDone] = useState(false);
  // const [uploading, setUploading] = useState(false);
  // const inputFileRef = useRef(null);

  //Datepicker
  //const [value, setValue] = useState(new Date());
  // const [inspection_date, setinspectiondateValue] = useState(new Date());

  //Pemeriksaan Fisik

  const tandadistressPemeriksaanFisik = [
    "Pernapasan Cepat",
    "Suara Whezzing (Mengi)",
    "Batuk Terus-Menerus",
    "Tidak Ada Gejala",
  ];

  const tandakecemasanPemeriksaanFisik = [
    "Mondar-Mandir",
    "Ekspresi Wajah",
    "Tangan Dingin Berkeringat",
    "Tidak Ada Gejala",
  ];

  const tandakesakitanPemeriksaanFisik = [
    "Wajah Pucat",
    "Berkeringat",
    "Memegang Bagian yang Sakit",
    "Tidak Ada Gejala",
  ];

  const suara = ["Bindeng", "Parau", "Tidak Ada Gejala"];

  const [selectedFile, setSelectedFile] = useState([]);

  // State Dynamic Form General Diagnosis
  const [
    dynamicFormGeneralDiagnosis,
    setDynamicFormGeneralDiagnosis,
  ] = useState({
    employeetreatmentgeneraldiagnosis: [
      {
        diagnosis_id: "",
      },
    ],
  });

  // State Dynamic Form Medical Prescription
  const [dynamicForm, setDynamicForm] = useState({
    employeemedicalprescription: [
      {
        drugnameOptions: [],
        location_id: "",
        drug_id: "",
        drug_id_backup: "",
        drug_distribution_id: "",
        amount_medicine: "",
        unit_drug: "",
        how_to_use_medicine: "",
        qty: "",
        date_expired: "",
        drug_kode: "",
        description: "",
      },
    ],
  });

  const [state, setstate] = useState({
    id: "",
    name: "",
    nik: "",
    unit: "",
    inspection_date: "",
    anamnesa: "",
    generalphysicalexamination: {
      awareness: "",
      distress_sign: "",
      anxiety_sign: "",
      sign_of_pain: "",
      voice: "",
    },
    employeevitalsigns: {
      blood_pressure: "",
      heart_rate: "",
      breathing_ratio: "",
      body_temperature: "",
      sp02: "",
    },
    head: "",
    neck: "",
    eye: "",
    nose: "",
    tongue: "",
    tooth: "",
    gum: "",
    throat: "",
    tonsils: "",
    ear: "",
    lymph_nodes_and_neck: "",
    heart: "",
    lungs: "",
    epigastrium: "",
    hearts: "",
    spleen: "",
    intestines: "",
    hand: "",
    foot: "",
    skin: "",
    file: "",
    description: "",

    employee_treat_id: null,
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

  //Fungsi GetData Location UKS

  const getukslocationOptions = async () => {
    setMedicineLocationAutoCompleteLoading(true);
    const response = await axios.get(endpoint.drug_location.root);
    if (response && response.data) {
      setukslocationOptions(response.data);
    }
    setMedicineLocationAutoCompleteLoading(false);
  };

  //Fungsi GetData Drug Location UKS

  // const getdrugukslocationOptions = async (id) => {
  //   const params = {
  //     id: id,
  //   };
  //   const response = await axios.get(endpoint.drug.root, {
  //     params: params,
  //   });
  //   if (response && response.data) {
  //     setdrugukslocationOptions(response.data);
  //   }
  // };

  //Fungsi GetData Registration Location UKS Job Officer

  // const getukslocationjobofficerOptions = async (id) => {
  //   const params = {
  //     id: id,
  //   };
  //   const response = await axios.get(endpoint.officer_registration.root, {
  //     params: params,
  //   });
  //   if (response && response.data) {
  //     setukslocationjobofficerOptions(response.data);
  //   }
  // };

  //Fungsi GetData Drug Name

  const getdrugnameOptions = async () => {
    setMedicineNameAutoCompleteLoading(true);
    const params = {
      id: dynamicForm.employeemedicalprescription.location_id,
    };
    const response = await axios.get(endpoint.drug_name.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugnameOptions(response.data);
    }
    setMedicineNameAutoCompleteLoading(false);
  };

  const getdrugnameOptionsSample = async (index = "", value = "") => {
    setMedicineNameAutoCompleteLoading(true);

    const params = {
      id: value,
    };
    const response = await axios.get(endpoint.drug_name.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugnameOptions(response.data);

      let employeemedicalprescription = [
        ...dynamicForm.employeemedicalprescription,
      ];
      employeemedicalprescription[index]["drugnameOptions"] = response.data;
      setDynamicForm({ employeemedicalprescription });
    }
    // console.log(response);
    setMedicineNameAutoCompleteLoading(false);
  };

  //Fungsi GetData Drug

  // const getdrugOptions = async (id) => {
  //   const params = {
  //     id: id,
  //   };
  //   const response = await axios.get(endpoint.drug.option_distribution, {
  //     params: params,
  //   });
  //   if (response && response.data) {
  //     setdrugOptions(response.data);
  //   }
  //   // console.log(response);
  // };

  //Fungsi GetData Drug Unit

  // const getunitOptions = async (id) => {
  //   const params = {
  //     id: id,
  //   };
  //   const response = await axios.get(endpoint.drug_unit.root, {
  //     params: params,
  //   });
  //   if (response && response.data) {
  //     setunitOptions(response.data);
  //   }
  // };

  //Fungsi GetData Employee
  const getemployeeOptions = async (id) => {
    setemployeeAutoCompleteLoading(true);
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
    const response = await axios.get(endpoint.employee.option, {
      params: params,
    });
    if (response && response.data) {
      setemployeeOptions(response.data);
    }
    setemployeeAutoCompleteLoading(false);
  };

  const getDetail = (row) => {
    console.log(row);
    if (row) {
      setstate({
        ...row,
      });
      setDynamicForm({
        employeemedicalprescription:
          row.employeemedicalprescription.length > 0
            ? row.employeemedicalprescription.map((data) => ({
                location_id: data.location_id,
                drug_id: data.drug_id,
                amount_medicine: data.amount_medicine,
                unit_drug: data.unit_drug,
                how_to_use_medicine: data.how_to_use_medicine,
              }))
            : [
                {
                  location_id: "",
                  drug_id: "",
                  unit_drug: "",
                  amount_medicine: "",
                  how_to_use_medicine: "",
                },
              ],
      });

      setDynamicFormGeneralDiagnosis({
        employeetreatmentgeneraldiagnosis:
          row.employeetreatmentgeneraldiagnosis.length > 0
            ? row.employeetreatmentgeneraldiagnosis.map((data) => ({
                diagnosis_id: data.diagnosis_id,
              }))
            : [{ diagnosis_id: "" }],
      });
    }
    // console.log(row);
  };

  const ValidationForm = Yup.object().shape({
    name: Yup.string().required("Nama Tidak Boleh Kosong"),
    nik: Yup.string().required("NIK Tidak Boleh Kosong"),
    // unit: Yup.string().required("Unit Tidak Boleh Kosong"),
    inspection_date: Yup.string().required(
      "Tanggal Periksa Tidak Boleh Kosong"
    ),
    // anamnesa: Yup.string().required("Anamnesa Tidak Boleh Kosong"),
    // awareness: Yup.string().required("Kesadaran Tidak Boleh Kosong"),
    // distress_sign: Yup.string().required("Tanda Distress Tidak Boleh Kosong"),
    // anxiety_sign: Yup.string().required("Tanda Kecemasan Tidak Boleh Kosong"),
    // sign_of_pain: Yup.string().required("Tanda Kesakitan Tidak Boleh Kosong"),
    // voice: Yup.string().required("Suara Tidak Boleh Kosong"),
    // blood_pressure: Yup.string().required("Tekanan Darah Tidak Boleh Kosong"),
    // heart_rate: Yup.string().required("Detak Jantung Tidak Boleh Kosong"),
    // breathing_ratio: Yup.string().required("Pernapasan Tidak Boleh Kosong"),
    // body_temperature: Yup.string().required("Suhu Tubuh Tidak Boleh Kosong"),
    // sp02: Yup.string().required("Sp02 Tidak Boleh Kosong"),
    // diagnosis: Yup.string().required("Diagnosis Umum Tidak Boleh Kosong"),
    // description: Yup.string().required("Keterangan Tidak Boleh Kosong"),
  });

  // OnChange Dynamic Form Medical Prescription

  const handleChangeField = (index, event, name) => {
    let employeemedicalprescription = [
      ...dynamicForm.employeemedicalprescription,
    ];

    let value = null;

    if (["location_id"].includes(name)) {
      value = event ? event.id : null;
      employeemedicalprescription[index]["location_id"] = value;
      getdrugnameOptionsSample(index, value);
    } else if (["drug_id_backup"].includes(name)) {
      value = event ? event : null;
      employeemedicalprescription[index]["drug_id"] = event ? event.id : null;
      employeemedicalprescription[index]["drug_distribution_id"] = event
        ? event.drugdistribution[0].id
        : null;
      employeemedicalprescription[index]["drug_kode"] = event
        ? event.drug_kode
        : null;
      employeemedicalprescription[index]["unit_drug"] = event
        ? event.drugdistribution[0].drugunit.drug_unit
        : null;
      employeemedicalprescription[index]["date_expired"] = event
        ? event.drugdistribution[0].drugexpired.date_expired
        : null;
      employeemedicalprescription[index]["qty"] = event
        ? event.drugdistribution[0].qty
        : null;
      employeemedicalprescription[index]["description"] = event
        ? event.drugdistribution[0].description
        : null;
    } else {
      value = event.target.value;
    }

    if (["how_to_use_medicine"].includes(name)) {
      employeemedicalprescription[index]["how_to_use_medicine"] = value;
    }

    if (["amount_medicine"].includes(name)) {
      employeemedicalprescription[index]["amount_medicine"] = value;
      // if (employeemedicalprescription[index]["qty"] !== "") {
      //   if (
      //     employeemedicalprescription[index]["amount_medicine"] >
      //     employeemedicalprescription[index]["qty"]
      //   ) {
      //     employeemedicalprescription[index]["amount_medicine"] =
      //       employeemedicalprescription[index]["qty"];
      //   }
      //   employeemedicalprescription[index]["qty"] = Math.max(
      //     0,
      //     employeemedicalprescription[index]["qty"] -
      //       employeemedicalprescription[index]["amount_medicine"]
      //   );
      // } else {
      //   employeemedicalprescription[index]["qty"] = "";
      // }
      // if (employeemedicalprescription[index]["amount_medicine"] === "") {
      //   employeemedicalprescription[index]["amount_medicine"] = value;
      // }
    }

    employeemedicalprescription[name] = value;

    setDynamicForm({ employeemedicalprescription });

    // Start Function Update Data

    // if (
    //   [
    //     "location_id",
    //     "drug_id",
    //     "amount_medicine",
    //     "unit_drug",
    //     "how_to_use_medicine",
    //   ].includes(event.target.name)
    // ) {
    //   let employeemedicalprescription = [
    //     ...dynamicForm.employeemedicalprescription,
    //   ];

    //   employeemedicalprescription[index][event.target.name] =
    //     event.target.value;
    //   setDynamicForm({ employeemedicalprescription });
    // } else {
    //   setDynamicForm({
    //     [event.target.name]: event.target.value,
    //   });
    // }

    // End Function Update Data

    // Start Function Filter Medicine Location

    // let value_drug_location = "";
    // value_drug_location = drugOptions.filter(
    //   (drug) => drug.locationdrug.listofukslocations.id == event.target.value
    // );

    // End Function Filter Medicine Location

    // Start Function Filter Medicine Name

    // let value_drug_name = "";
    // value_drug_name = drugOptions.filter(
    //   (drug) => drug.drugname.id == event.target.value
    // );

    // End Function Filter Medicine Name

    // Start Function Option To Combobox

    // if (event.target.name === "location_id") {
    //   let employeemedicalprescription = [
    //     ...dynamicForm.employeemedicalprescription,
    //   ];

    //   employeemedicalprescription[index]["drug_id"] = value_drug_location
    //     ? value_drug_location[0].drugname.id
    //     : 0;

    //   setDynamicForm({ employeemedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let employeemedicalprescription = [
    //     ...dynamicForm.employeemedicalprescription,
    //   ];

    //   employeemedicalprescription[index]["qty"] = value_drug_location
    //     ? value_drug_location[0].qty
    //     : 0;

    //   setDynamicForm({ employeemedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let employeemedicalprescription = [
    //     ...dynamicForm.employeemedicalprescription,
    //   ];

    //   employeemedicalprescription[index]["drug_kode"] = value_drug_location
    //     ? value_drug_location[0].drugname.drug_kode
    //     : 0;

    //   setDynamicForm({ employeemedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let employeemedicalprescription = [
    //     ...dynamicForm.employeemedicalprescription,
    //   ];

    //   employeemedicalprescription[index][
    //     "drug_expired_id"
    //   ] = value_drug_location
    //     ? value_drug_location[0].drugexpired.date_expired
    //     : 0;

    //   setDynamicForm({ employeemedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let employeemedicalprescription = [
    //     ...dynamicForm.employeemedicalprescription,
    //   ];

    //   employeemedicalprescription[index]["unit_drug"] = value_drug_location
    //     ? value_drug_location[0].drugunit.drug_unit
    //     : 0;

    //   setDynamicForm({ employeemedicalprescription });
    // }

    // End Function Option To Combobox

    // Start Fungsi Pengurangan Jumlah Stok

    // if (event.target.name === "amount_medicine") {
    //   let employeemedicalprescription = [
    //     ...dynamicForm.employeemedicalprescription,
    //   ];

    //   employeemedicalprescription[index]["qty"] =
    //     employeemedicalprescription[index]["qty"] -
    //       employeemedicalprescription[index]["amount_medicine"] || 0;

    //   // let numberqty = isNaN(studentmedicalprescription["qty"]);
    //   // let numberamount = isNaN(studentmedicalprescription["amount_medicine"]);

    //   // let calculate = numberqty - numberamount;

    //   // studentmedicalprescription[index]["qty"] =
    //   //   parseInt(value_drug_name ? value_drug_name[0].stocks.qty : "") -
    //   //   isNaN(studentmedicalprescription["amount_medicine"]);

    //   setDynamicForm({ employeemedicalprescription });
    // }

    // End Fungsi Pengurangan Jumlah Stok

    // console.log(index);
    // console.log(value_drug_name);
    // console.log(value_drug_location);
  };

  // OnChange Dynamic Form General Diagnosis

  const handleChangeFieldGeneralDiagnosis = (index, event) => {
    if (["diagnosis_id"].includes(event.target.name)) {
      let employeetreatmentgeneraldiagnosis = [
        ...dynamicFormGeneralDiagnosis.employeetreatmentgeneraldiagnosis,
      ];
      employeetreatmentgeneraldiagnosis[index][event.target.name] =
        event.target.value;
      setDynamicFormGeneralDiagnosis({
        employeetreatmentgeneraldiagnosis,
      });
    } else {
      setDynamicFormGeneralDiagnosis({
        [event.target.name]: event.target.value,
      });
    }
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

    // console.log(fieldName);
    // console.log(eventValue);
    setstate(newState);
  };

  const handleChange = (index, eventValue) => {
    let newState1 = { ...state };
    //let newState2 = [...dynamicForm];
    let value = "";
    if (index === "employee_id") {
      value = eventValue ? eventValue.id : "";
      newState1["name"] = eventValue ? eventValue.name : "";
    } else {
      value = eventValue.target.value;
    }

    if (index === "employee_id") {
      value = eventValue ? eventValue.id : "";
      newState1["nik"] = eventValue ? eventValue.nik : "";
    } else {
      value = eventValue.target.value;
    }

    // if (index === "employee_id") {
    //   value = eventValue ? eventValue.id : "";
    //   if (eventValue) {
    //     newState1["unit"] = eventValue.employeecareer
    //       ? eventValue.employeecareer.employeeunittypes.employeeunit.name
    //       : "";
    //   } else {
    //     value: "";
    //   }
    // } else {
    //   value = eventValue.target.value;
    // }

    if (index === "employee_id") {
      value = eventValue ? eventValue.id : "";
      if (eventValue) {
        newState1["unit"] = eventValue.employeecareer
          ? eventValue.employeecareer.employeeposition.employeeunit.name
          : "";
      } else {
        value: "";
      }
    } else {
      value = eventValue.target.value;
    }

    const header_detail = [
      "awareness",
      "distress_sign",
      "anxiety_sign",
      "sign_of_pain",
      "voice",
      "blood_pressure",
      "heart_rate",
      "breathing_ratio",
      "body_temperature",
      "sp02",
    ];

    if (header_detail.includes(index)) {
      newState1.generalphysicalexamination[index] = value;
    } else {
      newState1[index] = value;
    }

    if (header_detail.includes(index)) {
      newState1.employeevitalsigns[index] = value;
    } else {
      newState1[index] = value;
    }
    setstate(newState1);

    if (index === "id") {
      //getjenjangOptions(value);
      getdiagnosisgeneralOptions(value);
      getemployeeOptions(value);
      setinspectiondateValue(value);
      //getdrugOptions(value);
      //getukslocationOptions(value);
    }
    newState1[index] = value;
    setstate(newState1);
    //newState2[index] = value;
    //setDynamicForm(newState2);
    // console.log(eventValue);
  };

  // Function Add And Delete Dynamic Form Medical Prescription

  const handleAddFields = () => {
    setDynamicForm({
      employeemedicalprescription: [
        ...dynamicForm.employeemedicalprescription,
        {
          location_id: "",
          drug_id: "",
          drug_id_backup: "",
          drug_distribution_id: "",
          amount_medicine: "",
          unit_drug: "",
          how_to_use_medicine: "",
          qty: "",
          date_expired: "",
          drug_kode: "",
          description: "",
        },
      ],
    });
  };

  const handleRemoveFields = (index) => {
    dynamicForm.employeemedicalprescription.splice(index, 1);

    setDynamicForm({
      employeemedicalprescription: dynamicForm.employeemedicalprescription,
    });
  };

  // Function Add And Delete Dynamic Form General Diagnosis

  const handleAddFieldsGeneralDiagnosis = () => {
    setDynamicFormGeneralDiagnosis({
      employeetreatmentgeneraldiagnosis: [
        ...dynamicFormGeneralDiagnosis.employeetreatmentgeneraldiagnosis,
        {
          diagnosis_name: "",
        },
      ],
    });
  };

  const handleRemoveFieldsGeneralDiagnosis = (index) => {
    dynamicFormGeneralDiagnosis.employeetreatmentgeneraldiagnosis.splice(
      index,
      1
    );

    setDynamicFormGeneralDiagnosis({
      employeetreatmentgeneraldiagnosis:
        dynamicFormGeneralDiagnosis.employeetreatmentgeneraldiagnosis,
    });
  };

  // const submit = async () => {
  //   setUploading(true);
  //   let payload = new FormData();
  //   payload.append("name", state.name);
  //   // payload.append("inspection_date", format(inspection_date, "yyyy-MM-dd"));
  //   payload.append("inspection_date", state.inspection_date);
  //   payload.append("awareness", state.awareness);
  //   payload.append("distress_sign", state.distress_sign);
  //   payload.append("anxiety_sign", state.anxiety_sign);
  //   payload.append("sign_of_pain", state.sign_of_pain);
  //   payload.append("voice", state.voice);
  //   payload.append("blood_pressure", state.blood_pressure);
  //   payload.append("heart_rate", state.heart_rate);
  //   payload.append("breathing_ratio", state.breathing_ratio);
  //   payload.append("body_temperature", state.body_temperature);
  //   payload.append("sp02", state.sp02);
  //   payload.append("head", state.head);
  //   payload.append("neck", state.neck);
  //   payload.append("eye", state.eye);
  //   payload.append("nose", state.nose);
  //   payload.append("tongue", state.tongue);
  //   payload.append("tooth", state.tooth);
  //   payload.append("gum", state.gum);
  //   payload.append("throat", state.throat);
  //   payload.append("tonsils", state.tonsils);
  //   payload.append("ear", state.ear);
  //   payload.append("lymph_nodes_and_neck", state.lymph_nodes_and_neck);
  //   payload.append("heart", state.heart);
  //   payload.append("lungs", state.lungs);
  //   payload.append("epigastrium", state.epigastrium);
  //   payload.append("hearts", state.hearts);
  //   payload.append("spleen", state.spleen);
  //   payload.append("intestines", state.intestines);
  //   payload.append("hand", state.hand);
  //   payload.append("foot", state.foot);
  //   payload.append("skin", state.skin);
  //   payload.append("diagnosis", state.diagnosis);
  //   payload.append("description", state.description);
  //   payload.append("file", selectedFile);

  //   payload.append("dynamicForm", JSON.stringify(dynamicForm));
  //   const headers = {
  //     "content-type": "multipart/form-data",
  //   };

  //   if (actionCode === "CREATE") {
  //     await axios.post(endpoint.employee_treatment.create, payload, headers);
  //   } else {
  //     payload = { ...payload, id: state.id };
  //     await axios.put(endpoint.employee_treatment.update, payload, headers);
  //   }
  //   setisSubmitting(false);
  //   submitSuccess("saving data success");
  //   getData();
  //   setUploading(false);
  //   setUploadDone(true);
  //   setSelectedFile(null);
  //   inputFileRef.current.value = null;
  //   console.log(payload);
  //   console.log(actionCode);
  // };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: state.name,
      nik: state.nik,
      unit: state.unit,
      inspection_date: state.inspection_date,
      anamnesa: state.anamnesa,
      awareness: state.generalphysicalexamination.awareness,
      distress_sign: state.generalphysicalexamination.distress_sign,
      anxiety_sign: state.generalphysicalexamination.anxiety_sign,
      sign_of_pain: state.generalphysicalexamination.sign_of_pain,
      voice: state.generalphysicalexamination.voice,
      blood_pressure: state.employeevitalsigns.blood_pressure,
      heart_rate: state.employeevitalsigns.heart_rate,
      breathing_ratio: state.employeevitalsigns.breathing_ratio,
      body_temperature: state.employeevitalsigns.body_temperature,
      sp02: state.employeevitalsigns.sp02,
      head: state.head,
      neck: state.neck,
      eye: state.eye,
      nose: state.nose,
      tongue: state.tongue,
      tooth: state.tooth,
      gum: state.gum,
      throat: state.throat,
      tonsils: state.tonsils,
      ear: state.ear,
      lymph_nodes_and_neck: state.lymph_nodes_and_neck,
      heart: state.heart,
      lungs: state.lungs,
      epigastrium: state.epigastrium,
      hearts: state.hearts,
      spleen: state.spleen,
      intestines: state.intestines,
      hand: state.hand,
      foot: state.foot,
      skin: state.skin,
      description: state.description,
      file: selectedFile,
      dynamicForm: dynamicForm.employeemedicalprescription,
      dynamicFormGeneralDiagnosis:
        dynamicFormGeneralDiagnosis.employeetreatmentgeneraldiagnosis,
    },
    validationSchema: ValidationForm,

    onSubmit: async (values, { setSubmitting }) => {
      // setUploading(true);
      let payload = new FormData();
      payload.append("name", values.name);
      payload.append("nik", values.nik);
      payload.append("unit", values.unit);
      payload.append("inspection_date", values.inspection_date);
      payload.append("anamnesa", values.anamnesa);
      payload.append("awareness", values.awareness);
      payload.append("distress_sign", values.distress_sign);
      payload.append("anxiety_sign", values.anxiety_sign);
      payload.append("sign_of_pain", values.sign_of_pain);
      payload.append("voice", values.voice);
      payload.append("blood_pressure", values.blood_pressure);
      payload.append("heart_rate", values.heart_rate);
      payload.append("breathing_ratio", values.breathing_ratio);
      payload.append("body_temperature", values.body_temperature);
      payload.append("sp02", values.sp02);
      payload.append("head", values.head);
      payload.append("neck", values.neck);
      payload.append("eye", values.eye);
      payload.append("nose", values.nose);
      payload.append("tongue", values.tongue);
      payload.append("tooth", values.tooth);
      payload.append("gum", values.gum);
      payload.append("throat", values.throat);
      payload.append("tonsils", values.tonsils);
      payload.append("ear", values.ear);
      payload.append("lymph_nodes_and_neck", values.lymph_nodes_and_neck);
      payload.append("heart", values.heart);
      payload.append("lungs", values.lungs);
      payload.append("epigastrium", values.epigastrium);
      payload.append("hearts", values.hearts);
      payload.append("spleen", values.spleen);
      payload.append("intestines", values.intestines);
      payload.append("hand", values.hand);
      payload.append("foot", values.foot);
      payload.append("skin", values.skin);
      payload.append("diagnosis", values.diagnosis);
      payload.append("description", values.description);
      payload.append("file", values.file);

      payload.append("dynamicForm", JSON.stringify(values.dynamicForm));
      payload.append(
        "dynamicFormGeneralDiagnosis",
        JSON.stringify(values.dynamicFormGeneralDiagnosis)
      );
      const headers = {
        "content-type": "multipart/form-data",
      };
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.employee_treatment.create, payload, headers)
          .catch(function (error) {
            submitError("Data gagal disimpan !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        payload.append("id", row.id);
        let respon = await axios
          .post(endpoint.employee_treatment.update, payload, headers)
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
      // setUploading(false);
      // setUploadDone(true);
      // setSelectedFile(null);
      // inputFileRef.current.value = null;
      props.closeMainDialog();
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  // Employee

  useDebounce(
    () => {
      if (autoCompleteKeyword.trim() != "") {
        getemployeeOptions(autoCompleteKeyword);
      }
    },
    500,
    [autoCompleteKeyword]
  );

  // Medicine Location

  useDebounce(
    () => {
      if (autoCompleteMedicineLocationKeyword.trim() != "") {
        getukslocationOptions(autoCompleteMedicineLocationKeyword);
      }
    },
    500,
    [autoCompleteMedicineLocationKeyword]
  );

  // Medicine Name

  useDebounce(
    () => {
      // if (autoCompleteMedicineNameKeyword.trim() != "") {
      //   getdrugnameOptions(autoCompleteMedicineNameKeyword);
      // }
    },
    500,
    [autoCompleteMedicineNameKeyword]
  );

  useEffect(() => {
    getdiagnosisgeneralOptions();
    getemployeeOptions();
    getukslocationOptions();
    // getunitOptions();
    getdrugnameOptions();
    // getdrugOptions();
    // getdrugukslocationOptions();
    // getukslocationjobofficerOptions();
    //console.log(state);
  }, []);

  useEffect(() => {
    console.log(dynamicForm);
  }, [dynamicForm]);

  useEffect(() => {
    console.log(dynamicFormGeneralDiagnosis);
  }, [dynamicFormGeneralDiagnosis]);

  // useEffect(() => {
  //   console.log(inspection_date);
  // }, [inspection_date]);

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
          <Grid container style={{ marginBottom: 32 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <Autocomplete
                //disablePortal
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
            // {...getFieldProps("unit")}
            value={state && state.unit}
            onChange={(e) => handleChange("unit", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Posisi"
            // error={Boolean(touched.unit && errors.unit)}
            // helperText={touched.unit && errors.unit}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Tanggal Periksa"
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
            <Typography variant="h5">Anamnesa</Typography>
          </Grid>

          <TextField
            {...getFieldProps("anamnesa")}
            value={state.anamnesa}
            onChange={(e) => handleChange("anamnesa", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Anamnesa Pasien"
            multiline
            rows={4}
            sx={{ mb: 5 }}
            error={Boolean(touched.anamnesa && errors.anamnesa)}
            helperText={touched.anamnesa && errors.anamnesa}
          />

          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="h5">Pemeriksaan Fisik</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          {/*
      <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Secara Umum :</Typography>
      </Grid>
      */}

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <Typography variant="p">Kesadaran</Typography>
              <RadioGroup
                {...getFieldProps("awareness")}
                row
                aria-label="kesadaran"
                value={state.generalphysicalexamination.awareness}
                onChange={(e) => handleChange("awareness", e)}
                name="row-radio-buttons-group"
                error={Boolean(touched.awareness && errors.awareness)}
                helperText={touched.awareness && errors.awareness}
              >
                <FormControlLabel
                  value="Sadar"
                  control={<Radio />}
                  label="Sadar"
                />
                <FormControlLabel
                  value="Tidak"
                  control={<Radio />}
                  label="Tidak"
                />
              </RadioGroup>
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="distress">Pilih Tanda Distress</InputLabel>
              <Select
                {...getFieldProps("distress_sign")}
                labelId="distress"
                id="distress"
                value={state.generalphysicalexamination.distress_sign}
                onChange={(e) => handleChange("distress_sign", e)}
                label="Pilih Tanda Distress"
                error={Boolean(touched.distress_sign && errors.distress_sign)}
                helperText={touched.distress_sign && errors.distress_sign}
              >
                {tandadistressPemeriksaanFisik.map((distress) => (
                  <MenuItem key={distress} value={distress}>
                    {distress}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="kecemasan">Pilih Tanda Kecemasan</InputLabel>
              <Select
                {...getFieldProps("anxiety_sign")}
                labelId="kecemasan"
                id="kecemasan"
                value={state.generalphysicalexamination.anxiety_sign}
                onChange={(e) => handleChange("anxiety_sign", e)}
                label="Pilih Tanda Kecemasan"
                error={Boolean(touched.anxiety_sign && errors.anxiety_sign)}
                helperText={touched.anxiety_sign && errors.anxiety_sign}
              >
                {tandakecemasanPemeriksaanFisik.map((kecemasan) => (
                  <MenuItem key={kecemasan} value={kecemasan}>
                    {kecemasan}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="kesakitan">Pilih Tanda Kesakitan</InputLabel>
              <Select
                {...getFieldProps("sign_of_pain")}
                labelId="kesakitan"
                id="kesakitan"
                value={state.generalphysicalexamination.sign_of_pain}
                onChange={(e) => handleChange("sign_of_pain", e)}
                label="Pilih Tanda Kesakitan"
                error={Boolean(touched.sign_of_pain && errors.sign_of_pain)}
                helperText={touched.sign_of_pain && errors.sign_of_pain}
              >
                {tandakesakitanPemeriksaanFisik.map((kesakitan) => (
                  <MenuItem key={kesakitan} value={kesakitan}>
                    {kesakitan}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          {/* <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Suara</Typography>
      </Grid> */}

          <Grid container style={{ marginBottom: 16 }}>
            {/* <RadioGroup
          row
          aria-label="suara"
          value={state.suara}
          onChange={(e) => handleChange("suara", e)}
          name="row-radio-buttons-group"
        >
          <FormControlLabel
            value="Bindeng"
            control={<Radio />}
            label="Bindeng"
          />
          <FormControlLabel value="Parau" control={<Radio />} label="Parau" />
        </RadioGroup> */}

            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="suara">Pilih Suara</InputLabel>
              <Select
                {...getFieldProps("voice")}
                labelId="suara"
                id="suara"
                value={state.generalphysicalexamination.voice}
                onChange={(e) => handleChange("voice", e)}
                label="Pilih Suara"
                error={Boolean(touched.voice && errors.voice)}
                helperText={touched.voice && errors.voice}
              >
                {suara.map((suara) => (
                  <MenuItem key={suara} value={suara}>
                    {suara}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Tanda Vital</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.employeevitalsigns.blood_pressure}
                onChange={(e) => handleChange("blood_pressure", e)}
                fullWidth
                autoComplete="on"
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
                value={state.employeevitalsigns.heart_rate}
                onChange={(e) => handleChange("heart_rate", e)}
                fullWidth
                autoComplete="on"
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
                value={state.employeevitalsigns.breathing_ratio}
                onChange={(e) => handleChange("breathing_ratio", e)}
                fullWidth
                autoComplete="on"
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
                value={state.employeevitalsigns.body_temperature}
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
              value={state.employeevitalsigns.sp02}
              onChange={(e) => handleChange("sp02", e)}
              fullWidth
              autoComplete="on"
              type="text"
              label="SpO2"
              sx={{ mb: 5 }}
            />
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Kepala Dan Leher</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.head}
                onChange={(e) => handleChange("head", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Kepala"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.neck}
                onChange={(e) => handleChange("neck", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Leher"
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
                value={state.eye}
                onChange={(e) => handleChange("eye", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Mata"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.nose}
                onChange={(e) => handleChange("nose", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Hidung"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Mulut</Typography>
          </Grid>

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
                value={state.tooth}
                onChange={(e) => handleChange("tooth", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Gigi"
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
                value={state.gum}
                onChange={(e) => handleChange("gum", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Gusi"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <Typography variant="p">Tenggorokan</Typography>
              <RadioGroup
                row
                aria-label="tenggorokan"
                value={state.throat}
                onChange={(e) => handleChange("throat", e)}
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Hipermis"
                  control={<Radio />}
                  label="Hipermis"
                />
                <FormControlLabel
                  value="Tidak"
                  control={<Radio />}
                  label="Tidak"
                />
              </RadioGroup>
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Amandel</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              row
              aria-label="amandel"
              value={state.tonsils}
              onChange={(e) => handleChange("tonsils", e)}
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Pembesaran"
                control={<Radio />}
                label="Pembesaran"
              />
              <FormControlLabel
                value="Tidak"
                control={<Radio />}
                label="Tidak"
              />
            </RadioGroup>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.ear}
                onChange={(e) => handleChange("ear", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Telinga"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.lymph_nodes_and_neck}
                onChange={(e) => handleChange("lymph_nodes_and_neck", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Kelenjar Getah Bening"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Dada</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.heart}
                onChange={(e) => handleChange("heart", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Jantung"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.lungs}
                onChange={(e) => handleChange("lungs", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Paru-Paru"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Perut</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.epigastrium}
                onChange={(e) => handleChange("epigastrium", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Ulu Hati"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.hearts}
                onChange={(e) => handleChange("hearts", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Hati"
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
                value={state.spleen}
                onChange={(e) => handleChange("spleen", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Limpa"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.intestines}
                onChange={(e) => handleChange("intestines", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Usus"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Extremitas</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.hand}
                onChange={(e) => handleChange("hand", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Tangan"
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                value={state.foot}
                onChange={(e) => handleChange("foot", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Kaki"
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <TextField
            value={state.skin}
            onChange={(e) => handleChange("skin", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Kulit"
            sx={{ mb: 5 }}
          />

          {/* <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="diagnosis_umum">Pilih Diagnosis Umum</InputLabel>
              <Select
                {...getFieldProps("diagnosis")}
                labelId="diagnosis_umum"
                id="diagnosis_umum"
                value={state.diagnosis}
                onChange={(e) => handleChange("diagnosis", e)}
                label="Pilih Diagnosis Umum"
                error={Boolean(touched.diagnosis && errors.diagnosis)}
                helperText={touched.diagnosis && errors.diagnosis}
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

          {dynamicFormGeneralDiagnosis.employeetreatmentgeneraldiagnosis.map(
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
                          dynamicFormGeneralDiagnosis
                            .employeetreatmentgeneraldiagnosis.length === 1
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

          <TextField
            {...getFieldProps("description")}
            value={state.description}
            onChange={(e) => handleChange("description", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Keterangan"
            multiline
            rows={4}
            sx={{ mb: 5 }}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />

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
              <Input
                // disabled={uploading === true}
                onChange={fileChange}
                name="file"
                type="file"
                // ref={inputFileRef}
              />
              {state.file}
            </InputLabel>
          </Grid>

          {/* <Grid container style={{ marginBottom: 16 }}>
            <img height="150" width="150" src={state.file} />
          </Grid> */}

          {/* state.riwayat_rawat_inap.map((item) => (
        <RiwayatRawatInap key={props} /> 
      )) */}

          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="h5">Resep Obat</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          {dynamicForm.employeemedicalprescription.map(
            (medicalPrescreption, index) => (
              <Grid key={index}>
                <Grid container style={{ marginBottom: 16 }}>
                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "100%" }}
                  >
                    {/* <InputLabel id="lokasi-obat">Pilih Lokasi Obat</InputLabel>
                    <Select
                      labelId="lokasi-obat"
                      id="lokasi-obat"
                      name="location_id"
                      value={medicalPrescreption.location_id}
                      onChange={(e) => handleChangeField(index, e)}
                      label="Pilih Lokasi Obat"
                    >
                      {drugOptions.map((drug_location) => (
                        <MenuItem
                          key={drug_location.id}
                          value={drug_location.id}
                        >
                          {
                            drug_location.locationdrug.listofukslocations
                              .uks_name
                          }
                        </MenuItem>
                      ))}
                    </Select> */}

                    <Autocomplete
                      id="lokasi-obat"
                      name="location_id"
                      freeSolo
                      onOpen={() => {
                        setopenMedicineLocationAutoComplete(true);
                      }}
                      onClose={() => {
                        setopenMedicineLocationAutoComplete(false);
                      }}
                      loading={MedicineLocationAutoCompleteLoading}
                      onChange={(event, newValue) => {
                        handleChangeField(index, newValue, "location_id");
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
                      options={ukslocationOptions}
                      value={
                        medicalPrescreption !== null
                          ? medicalPrescreption
                          : ukslocationOptions[0]
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Lokasi Obat"
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

                <Stack direction="row" spacing={3}>
                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    {/* <InputLabel id="nama-obat">Pilih Nama Obat</InputLabel>
                    <Select
                      labelId="nama-obat"
                      id="nama-obat"
                      name="drug_id"
                      value={medicalPrescreption.drug_id}
                      onChange={(e) => handleChangeField(index, e)}
                      label="Pilih Nama Obat"
                    >
                      {drugOptions.map((drug) => (
                        <MenuItem key={drug.id} value={drug.drug_name_id}>
                          {drug.drugname.drug_name}
                        </MenuItem>
                      ))}
                    </Select> */}

                    <Autocomplete
                      id="nama-obat"
                      name="drug_id_backup"
                      freeSolo
                      onOpen={() => {
                        setopenMedicineNameAutoComplete(true);
                      }}
                      onClose={() => {
                        setopenMedicineNameAutoComplete(false);
                      }}
                      loading={MedicineNameAutoCompleteLoading}
                      onChange={(event, newValue) => {
                        handleChangeField(index, newValue, "drug_id_backup");
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
                      options={medicalPrescreption.drugnameOptions}
                      value={medicalPrescreption.drug_id_backup}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Nama Obat"
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
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    <TextField
                      name="drug_kode"
                      value={
                        (medicalPrescreption &&
                          medicalPrescreption.drug_kode) ||
                        ""
                      }
                      autoComplete="on"
                      type="text"
                      label="Kode Obat"
                      sx={{ mb: 5 }}
                      onChange={(e) => handleChangeField(index, e, "drug_kode")}
                      inputProps={{ readOnly: true }}
                    />
                  </FormControl>

                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    <TextField
                      name="qty"
                      value={
                        medicalPrescreption && medicalPrescreption.qty
                          ? medicalPrescreption.amount_medicine >
                            medicalPrescreption.qty
                            ? medicalPrescreption.qty
                            : medicalPrescreption.qty -
                              medicalPrescreption.amount_medicine
                          : ""
                      }
                      autoComplete="on"
                      type="text"
                      label="Jumlah Stok"
                      sx={{ mb: 5 }}
                      onChange={(e) => handleChangeField(index, e, "qty")}
                      inputProps={{ readOnly: true }}
                    />
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    <TextField
                      name="date_expired"
                      value={
                        (medicalPrescreption &&
                          medicalPrescreption.date_expired) ||
                        ""
                      }
                      autoComplete="on"
                      type="text"
                      label="Tanggal Expired"
                      sx={{ mb: 5 }}
                      onChange={(e) =>
                        handleChangeField(index, e, "date_expired")
                      }
                      inputProps={{ readOnly: true }}
                    />
                  </FormControl>

                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    <TextField
                      name="unit_drug"
                      value={
                        (medicalPrescreption &&
                          medicalPrescreption.unit_drug) ||
                        ""
                      }
                      autoComplete="on"
                      type="text"
                      onChange={(e) => handleChangeField(index, e, "unit_drug")}
                      label="Satuan"
                      sx={{ mb: 5 }}
                      inputProps={{ readOnly: true }}
                    />
                  </FormControl>

                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    <TextField
                      name="amount_medicine"
                      value={medicalPrescreption.amount_medicine}
                      onChange={(e) =>
                        handleChangeField(index, e, "amount_medicine")
                      }
                      autoComplete="on"
                      type="number"
                      label="Jumlah Obat"
                      sx={{ mb: 5 }}
                    />
                  </FormControl>
                </Stack>

                <TextField
                  name="description"
                  value={medicalPrescreption.description || ""}
                  onChange={(e) => handleChangeField(index, e, "description")}
                  fullWidth
                  autoComplete="on"
                  type="text"
                  multiline
                  rows={4}
                  label="Keterangan Obat"
                  sx={{ mb: 5 }}
                  inputProps={{ readOnly: true }}
                />

                <TextField
                  name="how_to_use_medicine"
                  value={medicalPrescreption.how_to_use_medicine}
                  onChange={(e) =>
                    handleChangeField(index, e, "how_to_use_medicine")
                  }
                  fullWidth
                  autoComplete="on"
                  type="text"
                  multiline
                  rows={4}
                  label="Cara Penggunaan Obat"
                  sx={{ mb: 5 }}
                />

                <FormControl
                  variant="outlined"
                  style={{ minWidth: 120, width: "5%" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    disabled={
                      dynamicForm.employeemedicalprescription.length === 1
                    }
                    onClick={() => handleRemoveFields(index)}
                    style={{ margin: "0 770px", width: "70%" }}
                  >
                    <RemoveIcon />
                    Delete
                  </Button>
                </FormControl>

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
            )
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
                  // disabled={uploading === true}
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
