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
import Protected from "src/components/Protected";
import { useDispatch, useSelector } from "react-redux";
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

  // const [selectedMedicineName, setselectedMedicineName] = useState(null);

  // Student
  const [openStudentAutoComplete, setopenStudentAutoComplete] = useState(false);
  const [studentAutoCompleteLoading, setstudentAutoCompleteLoading] = useState(
    false
  );

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

  // Student Keyword
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
  const [studentOptions, setstudentOptions] = useState([]);
  const [diagnosisgeneralOptions, setdiagnosisgeneralOptions] = useState([]);
  const [drugdistributionOptions, setdrugdistributionOptions] = useState([]);
  // const [
  //   ukslocationjobofficerOptions,
  //   setukslocationjobofficerOptions,
  // ] = useState([]);
  const [drugukslocationOptions, setdrugukslocationOptions] = useState([]);
  const [drugnameOptions, setdrugnameOptions] = useState([]);
  // const [drugOptions, setdrugOptions] = useState([]);
  // const [reduceStock, setreduceStock] = useState([]);
  // const [unitOptions, setunitOptions] = useState([]);
  //const [employeeOptions, setemployeeOptions] = useState([]);

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

  // State Dynamic Form Medical Prescription
  const [dynamicForm, setDynamicForm] = useState({
    studentmedicalprescription: [
      {
        drugnameOptions: [],
        amount_medicine: "",
        unit: "",
        how_to_use_medicine: "",
        qty: "",

        drug_kode: "",
        drug_id: "",
        drug_id_backup: "",
        drug_distribution_id: "",
        location_id: "",
        date_expired: "",
        description: "",
      },
    ],
  });

  // State Dynamic Form General Diagnosis
  const [
    dynamicFormGeneralDiagnosis,
    setDynamicFormGeneralDiagnosis,
  ] = useState({
    studenttreatmentgeneraldiagnosis: [
      {
        diagnosis_id: "",
      },
    ],
  });

  const [state, setstate] = useState({
    id: "",
    name: "",
    niy: "",
    level: "",
    // kelas: "",
    kelas: { code: "" },
    inspection_date: "",
    anamnesa: "",
    studentgeneralphysicalexamination: {
      awareness: "",
      distress_sign: "",
      anxiety_sign: "",
      sign_of_pain: "",
      voice: "",
    },
    studentvitalsigns: {
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
    diagnosis: "",
    description: "",
    student_treat_id: null,
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

  //Fungsi GetData Drug Distribution

  // const getdrugdistributionOptions = async () => {
  //   const params = {
  //     location_id: dynamicForm.studentmedicalprescription.location_id,
  //     drug_name_id: dynamicForm.studentmedicalprescription.drug_id,
  //   };
  //   const response = await axios.get(endpoint.drug.option_distribution, {
  //     params: params,
  //   });
  //   if (response && response.data) {
  //     setdrugdistributionOptions(response.data);
  //   }
  //   // console.log(response);
  // };

  //Fungsi GetData Drug Location UKS

  const getdrugukslocationOptions = async () => {
    setMedicineLocationAutoCompleteLoading(true);

    const response = await axios.get(endpoint.drug_location.root);
    if (response && response.data) {
      setdrugukslocationOptions(response.data);
    }
    // console.log(response);
    setMedicineLocationAutoCompleteLoading(false);
  };

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
      id: dynamicForm.studentmedicalprescription.location_id,
    };
    const response = await axios.get(endpoint.drug_name.root, {
      params: params,
    });
    if (response && response.data) {
      setdrugnameOptions(response.data);
    }
    // console.log(response);
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

      let studentmedicalprescription = [
        ...dynamicForm.studentmedicalprescription,
      ];
      studentmedicalprescription[index]["drugnameOptions"] = response.data;
      setDynamicForm({ studentmedicalprescription });
    }
    // console.log(response);
    setMedicineNameAutoCompleteLoading(false);
  };

  //Fungsi GetData Drug

  // const getdrugOptions = async (id) => {
  //   const params = {
  //     id: id,
  //   };
  //   const response = await axios.get(endpoint.drug.root, {
  //     params: params,
  //   });
  //   if (response && response.data) {
  //     setdrugOptions(response.data);
  //   }
  //   console.log(response);
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
    console.log(row);
    if (row) {
      setstate({
        ...row,
      });
      setDynamicForm({
        studentmedicalprescription:
          row.studentmedicalprescription.length > 0
            ? row.studentmedicalprescription.map((data) => ({
                location_id: data.id,
                drug_id: data.id,
                unit: data.unit,
                amount_medicine: data.amount_medicine,
                how_to_use_medicine: data.how_to_use_medicine,
              }))
            : [
                {
                  location_id: "",
                  drug_id: "",
                  unit: "",
                  amount_medicine: "",
                  how_to_use_medicine: "",
                },
              ],
      });

      setDynamicFormGeneralDiagnosis({
        studenttreatmentgeneraldiagnosis:
          row.studenttreatmentgeneraldiagnosis.length > 0
            ? row.studenttreatmentgeneraldiagnosis.map((data) => ({
                diagnosis_id: data.diagnosis_id,
              }))
            : [{ diagnosis_id: "" }],
      });
    }
  };

  const ValidationForm = Yup.object().shape({
    name: Yup.string().required("Nama Tidak Boleh Kosong"),
    niy: Yup.string().required("Niy Tidak Boleh Kosong"),
    level: Yup.string().required("Jenjang Tidak Boleh Kosong"),
    // kelas: Yup.string().required("Kelas Tidak Boleh Kosong"),
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

  const handleChangeFieldMedicalPrescription = (index, event, name) => {
    let studentmedicalprescription = [
      ...dynamicForm.studentmedicalprescription,
    ];

    let value = null;

    if (["location_id"].includes(name)) {
      value = event ? event.id : null;
      studentmedicalprescription[index]["location_id"] = value;
      getdrugnameOptionsSample(index, value);
    } else if (["drug_id_backup"].includes(name)) {
      value = event ? event : null;
      studentmedicalprescription[index]["drug_id"] = event ? event.id : null;
      studentmedicalprescription[index]["drug_distribution_id"] = event
        ? event.drugdistribution[0].id
        : null;
      studentmedicalprescription[index]["drug_kode"] = event
        ? event.drug_kode
        : null;
      studentmedicalprescription[index]["unit"] = event
        ? event.drugdistribution[0].drugunit.drug_unit
        : null;
      studentmedicalprescription[index]["date_expired"] = event
        ? event.drugdistribution[0].drugexpired.date_expired
        : null;
      studentmedicalprescription[index]["qty"] = event
        ? event.drugdistribution[0].qty
        : null;
      studentmedicalprescription[index]["description"] = event
        ? event.drugdistribution[0].description
        : null;
    } else {
      value = event.target.value;
    }

    if (["how_to_use_medicine"].includes(name)) {
      studentmedicalprescription[index]["how_to_use_medicine"] = value;
    }

    if (["amount_medicine"].includes(name)) {
      studentmedicalprescription[index]["amount_medicine"] = value;
      // if (studentmedicalprescription[index]["qty"] !== "") {
      //   if (
      //     studentmedicalprescription[index]["amount_medicine"] >
      //     studentmedicalprescription[index]["qty"]
      //   ) {
      //     studentmedicalprescription[index]["amount_medicine"] =
      //       studentmedicalprescription[index]["qty"];
      //   }

      //   studentmedicalprescription[index]["qty"] = Math.max(
      //     0,
      //     studentmedicalprescription[index]["qty"]  -
      //       studentmedicalprescription[index]["amount_medicine"]
      //   );
      // } else {
      //   studentmedicalprescription[index]["qty"] = "";
      // }
      // if (studentmedicalprescription[index]["amount_medicine"] === "") {
      //   studentmedicalprescription[index]["amount_medicine"] = value;
      // }
    }

    studentmedicalprescription[name] = value;

    setDynamicForm({ studentmedicalprescription });

    // Start Function Update Data

    // if (
    //   [
    //     "location_id",
    //     "drug_id",
    //     "amount_medicine",
    //     "unit",
    //     "how_to_use_medicine",
    //   ].includes(event.target.name)
    // ) {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index][event.target.name] = event.target.value;
    //   setDynamicForm({ studentmedicalprescription });
    // } else {
    //   setDynamicForm({
    //     [event.target.name]: event.target.value,
    //   });
    // }

    // End Function Update Data

    // Start Function Filter Medicine Location

    // let value_drug_location = "";
    // value_drug_location = drugdistributionOptions.filter(
    //   (drug) => drug.locationdrug.listofukslocations.id == event.target.value
    // );

    // End Function Filter Medicine Location

    // Start Function Filter Medicine Name

    // let value_drug_name = "";
    // value_drug_name = drugnameOptions.filter(
    //   (drug) => drug.id == event.target.value
    // );

    // End Function Filter Medicine Name

    // Start Function Option To Combobox

    // if (event.target.name === "location_id") {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index]["drug_id"] = value_drug_location
    //     ? value_drug_location[0].drugname.id
    //     : "";

    //   setDynamicForm({ studentmedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index]["qty"] = value_drug_location
    //     ? value_drug_location[0].drugdistribution.qty
    //     : 0;

    //   setDynamicForm({ studentmedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index]["drug_kode"] = value_drug_location
    //     ? value_drug_location[0].drugdistribution.drugname.drug_kode
    //     : 0;

    //   setDynamicForm({ studentmedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index]["drug_expired_id"] = value_drug_location
    //     ? value_drug_location[0].drugdistribution.drugexpired.date_expired
    //     : 0;

    //   setDynamicForm({ studentmedicalprescription });
    // }

    // if (event.target.name === "drug_id") {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index]["unit"] = value_drug_location
    //     ? value_drug_location[0].drugdistribution.drugunit.drug_unit
    //     : 0;

    //   setDynamicForm({ studentmedicalprescription });
    // }

    // if (event.target.name === "amount_medicine") {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index]["qty"] = value_reduce_stock
    //     ? value_reduce_stock[0].stocks.qty
    //     : 0;

    //   setDynamicForm({ studentmedicalprescription });
    // }

    // End Function Option To Combobox

    // Start Fungsi Pengurangan Jumlah Stok

    // if (event.target.name === "amount_medicine") {
    //   let studentmedicalprescription = [
    //     ...dynamicForm.studentmedicalprescription,
    //   ];

    //   studentmedicalprescription[index]["qty"] =
    //     studentmedicalprescription[index]["qty"] -
    //       studentmedicalprescription[index]["amount_medicine"] || 0;

    //   // let numberqty = isNaN(studentmedicalprescription["qty"]);
    //   // let numberamount = isNaN(studentmedicalprescription["amount_medicine"]);

    //   // let calculate = numberqty - numberamount;

    //   // studentmedicalprescription[index]["qty"] =
    //   //   parseInt(value_drug_name ? value_drug_name[0].stocks.qty : "") -
    //   //   isNaN(studentmedicalprescription["amount_medicine"]);

    //   setDynamicForm({ studentmedicalprescription });
    // }

    // End Fungsi Pengurangan Jumlah Stok

    // console.log(index);
    // console.log(name);
    // console.log(event);
    // console.log(studentmedicalprescription);
    // console.log(value_drug_name);
    // console.log(value_drug_location);
  };

  // OnChange Dynamic Form General Diagnosis

  const handleChangeFieldGeneralDiagnosis = (index, event) => {
    if (["diagnosis_id"].includes(event.target.name)) {
      let studenttreatmentgeneraldiagnosis = [
        ...dynamicFormGeneralDiagnosis.studenttreatmentgeneraldiagnosis,
      ];
      studenttreatmentgeneraldiagnosis[index][event.target.name] =
        event.target.value;
      setDynamicFormGeneralDiagnosis({
        studenttreatmentgeneraldiagnosis,
      });
    } else {
      setDynamicFormGeneralDiagnosis({
        [event.target.name]: event.target.value,
      });
    }
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
      newState1.studentgeneralphysicalexamination[index] = value;
    } else {
      newState1[index] = value;
    }

    if (header_detail.includes(index)) {
      newState1.studentvitalsigns[index] = value;
    } else {
      newState1[index] = value;
    }
    setstate(newState1);

    if (index === "id") {
      //getjenjangOptions(value);
      getdiagnosisgeneralOptions(value);
      getstudentOptions(value);
      setinspectiondateValue(value);
      //getdrugOptions(value);
      //getukslocationOptions(value);
    }
    newState1[index] = value;
    setstate(newState1);
    //newState2[index] = value;
    //setDynamicForm(newState2);
    // console.log(newState1.kelas["code"]);
  };

  // Function Add And Delete Dynamic Form Medical Prescription

  const handleAddFields = () => {
    setDynamicForm({
      studentmedicalprescription: [
        ...dynamicForm.studentmedicalprescription,
        {
          amount_medicine: "",
          unit: "",
          how_to_use_medicine: "",
          qty: "",

          drug_kode: "",
          drug_id: "",
          drug_id_backup: "",
          drug_distribution_id: "",
          location_id: "",
          date_expired: "",
          description: "",
        },
      ],
    });
  };

  const handleRemoveFields = (index) => {
    dynamicForm.studentmedicalprescription.splice(index, 1);

    setDynamicForm({
      studentmedicalprescription: dynamicForm.studentmedicalprescription,
    });
  };

  // Function Add And Delete Dynamic Form General Diagnosis

  const handleAddFieldsGeneralDiagnosis = () => {
    setDynamicFormGeneralDiagnosis({
      studenttreatmentgeneraldiagnosis: [
        ...dynamicFormGeneralDiagnosis.studenttreatmentgeneraldiagnosis,
        {
          diagnosis_id: "",
        },
      ],
    });
  };

  const handleRemoveFieldsGeneralDiagnosis = (index) => {
    dynamicFormGeneralDiagnosis.studenttreatmentgeneraldiagnosis.splice(
      index,
      1
    );

    setDynamicFormGeneralDiagnosis({
      studenttreatmentgeneraldiagnosis:
        dynamicFormGeneralDiagnosis.studenttreatmentgeneraldiagnosis,
    });
  };

  // const submit = async () => {
  //   let payload = new FormData();
  //   payload.append("name", state.name);
  //   payload.append("level", state.level);
  //   payload.append("kelas", state.kelas);
  //   payload.append("inspection_date", format(inspection_date, "yyyy-MM-dd"));
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

  //   payload.append("dynamicForm", JSON.stringify(dynamicForm));
  //   if (actionCode === "CREATE") {
  //     await axios.post(endpoint.student_treatment.create, payload, {
  //       body: payload,
  //     });
  //   } else {
  //     payload = { ...payload, id: state.id };
  //     await axios.put(endpoint.student_treatment.update, payload, {
  //       body: payload,
  //     });
  //   }
  //   setisSubmitting(false);
  //   submitSuccess("saving data success");
  //   getData();
  //   console.log(payload);
  //   console.log(actionCode);
  // };

  let params = {
    id: state.id,
    name: state.name,
    niy: state.niy,
    level: state.level,
    // kelas: state.kelas,
    kelas: state.kelas.code,
    // inspection_date: format(inspection_date, "yyyy-MM-dd"),
    inspection_date: state.inspection_date,
    anamnesa: state.anamnesa,
    awareness: state.studentgeneralphysicalexamination.awareness,
    distress_sign: state.studentgeneralphysicalexamination.distress_sign,
    anxiety_sign: state.studentgeneralphysicalexamination.anxiety_sign,
    sign_of_pain: state.studentgeneralphysicalexamination.sign_of_pain,
    voice: state.studentgeneralphysicalexamination.voice,
    blood_pressure: state.studentvitalsigns.blood_pressure,
    heart_rate: state.studentvitalsigns.heart_rate,
    breathing_ratio: state.studentvitalsigns.breathing_ratio,
    body_temperature: state.studentvitalsigns.body_temperature,
    sp02: state.studentvitalsigns.sp02,
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
    diagnosis: state.diagnosis,
    description: state.description,
    dynamicForm: JSON.stringify(dynamicForm),
    dynamicFormGeneralDiagnosis: JSON.stringify(dynamicFormGeneralDiagnosis),
  };

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: params,
  //   validationSchema: ValidationForm,

  //   onSubmit: async (values, { setSubmitting }) => {
  //     if (actionCode === "CREATE") {
  //       await axios.post(endpoint.student_treatment.create, values);
  //     } else {
  //       await axios.put(endpoint.student_treatment.update, values);
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
          .post(endpoint.student_treatment.create, values)
          .catch(function (error) {
            submitError("Data gagal disimpan !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        let respon = await axios
          .post(endpoint.student_treatment.update, values)
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
    getdiagnosisgeneralOptions();
    getstudentOptions();
    // getdrugdistributionOptions();
    // getunitOptions();
    getdrugnameOptions();
    // getdrugOptions();
    // getreduceStock();
    getdrugukslocationOptions();
    // getukslocationjobofficerOptions();
    //console.log(state);
    //console.log(state);
  }, []);

  useEffect(() => {
    console.log(dynamicForm);
  }, [dynamicForm]);

  // useEffect(() => {
  //   console.log(dynamicFormGeneralDiagnosis);
  // }, [dynamicFormGeneralDiagnosis]);

  // useEffect(() => {
  //   if (selectedMedicineName) {
  //     getdrugnameOptions(selectedMedicineName);
  //   }
  // }, [selectedMedicineName]);

  // useEffect(() => {
  //   console.log("Ini Seleksi Id", selectedMedicineName);
  // }, [selectedMedicineName]);

  // Student

  useDebounce(
    () => {
      if (autoCompleteKeyword.trim() != "") {
        getstudentOptions(autoCompleteKeyword);
      }
    },
    500,
    [autoCompleteKeyword]
  );

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

  //Function Reduce
  // const penguranganStok = () => {
  //   let studentmedicalprescription = [
  //     ...dynamicForm.studentmedicalprescription,
  //   ];
  //   if (studentmedicalprescription["amount_medicine"] === "") {
  //     return "";
  //   } else if (studentmedicalprescription["qty"] === "") {
  //     return "";
  //   } else {
  //     return (
  //       studentmedicalprescription["amount_medicine"] -
  //       studentmedicalprescription["qty"]
  //     );
  //   }
  // };

  // useEffect(() => {
  //   let studentmedicalprescription = [
  //     ...dynamicForm.studentmedicalprescription,
  //   ];
  //   studentmedicalprescription["qty"] = penguranganStok();
  // }, [
  //   dynamicForm.studentmedicalprescription.amount_medicine,
  //   dynamicForm.studentmedicalprescription.qty,
  // ]);

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
                  setopenStudentAutoComplete(true);
                }}
                onClose={() => {
                  setopenStudentAutoComplete(false);
                }}
                loading={studentAutoCompleteLoading}
                //value={state.nama}
                onChange={(event, newValue) => {
                  // console.log(JSON.stringify(newValue, null, " "));
                  handleChange("student_id", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue);
                }}
                getOptionLabel={(option) => option.name}
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
            // {...getFieldProps("kelas")}
            value={state && state.kelas.code}
            onChange={(e) => handleChange("code", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Kelas"
            // error={Boolean(touched.kelas && errors.kelas)}
            // helperText={touched.kelas && errors.kelas}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          {/*

      <Grid container style={{ marginBottom: 16 }}>
        <TextField
          value={state && state.umur}
          onChange={(e) => handleChange("umur", e)}
          fullWidth
          autoComplete="on"
          type="text"
          label="Umur"
          error={Boolean(errors.code)}
          helperText={errors.code}
          sx={{ mb: 5 }}
          inputProps={{ readOnly: true }}
        />


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
      

      <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Jenis Kelamin</Typography>
      </Grid>

      <Grid container style={{ marginBottom: 16 }}>
        <RadioGroup
          row
          aria-label="gender"
          value={state.jenis_kelamin}
          onChange={(e) => handleChange("jenis_kelamin", e)}
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="Pria" control={<Radio />} label="Pria" />
          <FormControlLabel value="Wanita" control={<Radio />} label="Wanita" />
        </RadioGroup>
      </Grid>
      */}

          {/*
      <Grid container style={{ marginBottom: 16 }}>
        <Typography variant="p">Tanggal Periksa</Typography>
      </Grid>
      
      <Grid container style={{ marginBottom: 16 }}>
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
      </Grid>
      */}

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  {...getFieldProps("inspection_date")}
                  label="Tanggal Periksa"
                  value={inspection_date}
                  fullWidth
                  error={Boolean(
                    touched.inspection_date && errors.inspection_date
                  )}
                  helperText={touched.inspection_date && errors.inspection_date}
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
                value={state.studentgeneralphysicalexamination.awareness}
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
                value={state.studentgeneralphysicalexamination.distress_sign}
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
                value={state.studentgeneralphysicalexamination.anxiety_sign}
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
                value={state.studentgeneralphysicalexamination.sign_of_pain}
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
                value={state.studentgeneralphysicalexamination.voice}
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
                {...getFieldProps("blood_pressure")}
                value={state.studentvitalsigns.blood_pressure}
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
                {...getFieldProps("heart_rate")}
                value={state.studentvitalsigns.heart_rate}
                onChange={(e) => handleChange("heart_rate", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Detak Jantung"
                error={Boolean(touched.heart_rate && errors.heart_rate)}
                helperText={touched.heart_rate && errors.heart_rate}
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
                {...getFieldProps("breathing_ratio")}
                value={state.studentvitalsigns.breathing_ratio}
                onChange={(e) => handleChange("breathing_ratio", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Pernapasan"
                error={Boolean(
                  touched.breathing_ratio && errors.breathing_ratio
                )}
                helperText={touched.breathing_ratio && errors.breathing_ratio}
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("body_temperature")}
                value={state.studentvitalsigns.body_temperature}
                onChange={(e) => handleChange("body_temperature", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Suhu Tubuh"
                error={Boolean(
                  touched.body_temperature && errors.body_temperature
                )}
                helperText={touched.body_temperature && errors.body_temperature}
                sx={{ mb: 5 }}
              />
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}>
            <TextField
              {...getFieldProps("sp02")}
              value={state.studentvitalsigns.sp02}
              onChange={(e) => handleChange("sp02", e)}
              fullWidth
              autoComplete="on"
              type="text"
              label="SpO2"
              error={Boolean(touched.sp02 && errors.sp02)}
              helperText={touched.sp02 && errors.sp02}
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

          {dynamicFormGeneralDiagnosis.studenttreatmentgeneraldiagnosis.map(
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
                            .studenttreatmentgeneraldiagnosis.length === 1
                        }
                        onClick={() =>
                          handleRemoveFieldsGeneralDiagnosis(index)
                        }
                        style={{ margin: "0 26px", width: "70%" }}
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
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
            multiline
            rows={4}
            sx={{ mb: 5 }}
          />

          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="h5">Resep Obat</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          {dynamicForm.studentmedicalprescription.map(
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
                      onChange={(e) => handleChangeFieldMedicalPrescription(index, e)}
                      label="Pilih Lokasi Obat"
                    >
                      {drugukslocationOptions.map((drug_location) => (
                        <MenuItem
                          key={drug_location.id}
                          value={drug_location.id}
                        >
                          {drug_location.uks_name}
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
                        handleChangeFieldMedicalPrescription(
                          index,
                          newValue,
                          "location_id"
                        );
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
                      options={drugukslocationOptions}
                      value={
                        medicalPrescreption !== null
                          ? medicalPrescreption
                          : drugukslocationOptions[0]
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
                      onChange={(e) => handleChangeFieldMedicalPrescription(index, e)}
                      label="Pilih Nama Obat"
                    >
                      {drugnameOptions.map((drug) => (
                        <MenuItem key={drug.id} value={drug.id}>
                          {drug.drug_name}
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
                        handleChangeFieldMedicalPrescription(
                          index,
                          newValue,
                          "drug_id_backup"
                        );
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
                      onChange={(e) =>
                        handleChangeFieldMedicalPrescription(
                          index,
                          e,
                          "drug_kode"
                        )
                      }
                      sx={{ mb: 5 }}
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
                      type="number"
                      label="Jumlah Stok"
                      sx={{ mb: 5 }}
                      onChange={(e) =>
                        handleChangeFieldMedicalPrescription(index, e, "qty")
                      }
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
                        handleChangeFieldMedicalPrescription(
                          index,
                          e,
                          "date_expired"
                        )
                      }
                      inputProps={{ readOnly: true }}
                    />
                  </FormControl>

                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    <TextField
                      name="unit"
                      value={
                        (medicalPrescreption && medicalPrescreption.unit) || ""
                      }
                      autoComplete="on"
                      type="text"
                      onChange={(e) =>
                        handleChangeFieldMedicalPrescription(index, e, "unit")
                      }
                      label="Satuan"
                      sx={{ mb: 5 }}
                      inputProps={{ readOnly: true }}
                    />
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "35%" }}
                  >
                    {/* <InputLabel id="satuan-obat">Pilih Satuan</InputLabel>
                  <Select
                    labelId="satuan-obat"
                    id="satuan-obat"
                    name="unit"
                    value={dynamicForm.unit}
                    onChange={(e) => handleChangeFieldMedicalPrescription(index, e)}
                    label="Pilih Satuan"
                  >
                    {drugOptions.map((drug_unit) => (
                      <MenuItem
                        key={drug_unit.id}
                        value={drug_unit.drug_unit_id}
                      >
                        {drug_unit.drug_unit_id}
                      </MenuItem>
                    ))}
                  </Select> */}

                    <TextField
                      name="amount_medicine"
                      value={medicalPrescreption.amount_medicine}
                      onChange={(e) =>
                        handleChangeFieldMedicalPrescription(
                          index,
                          e,
                          "amount_medicine"
                        )
                      }
                      type="number"
                      label="Jumlah Obat"
                      sx={{ mb: 5 }}
                    />
                  </FormControl>
                </Stack>

                <TextField
                  name="description"
                  value={medicalPrescreption.description || ""}
                  onChange={(e) =>
                    handleChangeFieldMedicalPrescription(
                      index,
                      e,
                      "description"
                    )
                  }
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
                    handleChangeFieldMedicalPrescription(
                      index,
                      e,
                      "how_to_use_medicine"
                    )
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
                      dynamicForm.studentmedicalprescription.length === 1
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
