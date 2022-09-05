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
  CardContent,
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
import { format, parse } from "date-fns";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
// import RiwayatRawatInap from "./RiwayatRawatInap";
import Protected from "src/components/Protected";
import { useDebounce } from "react-use";
// ----------------------------------------------------------------------

MedicalHistoryDetail.propTypes = {
  sx: PropTypes.object,
};

export default function MedicalHistoryDetail(props) {
  const {
    row,
    getData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { user, units, roles } = useSelector((state) => state.auth);
  const [actionCode, setactionCode] = useState("READ");
  // const [isSubmitting, setisSubmitting] = useState(false);
  // const [errors, seterrors] = useState({});
  const [openStudentAutoComplete, setopenStudentAutoComplete] = useState(false);
  const [studentAutoCompleteLoading, setstudentAutoCompleteLoading] = useState(
    false
  );
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState("");
  // const [isUsernameChanged, setisUsernameChanged] = useState(false);
  //const [bloodOptions, setbloodOptions] = useState([]);
  const [diagnosisOptions, setdiagnosisOptions] = useState([]);
  const [studentOptions, setstudentOptions] = useState([]);
  // const [showHistoryVaccineCovid19, setShowHistoryVaccineCovid19] = useState(
  //   false
  // );
  // const [showCovid19IllnessHistory, setShowCovid19IllnessHistory] = useState(
  //   false
  // );

  const [autoComplete, setautoComplete] = useState(1);

  //const [nama, setNama] = useState([""]);

  //Button Dialog
  //const [open, setOpen] = useState(false);

  //const handleClickOpen = () => {
  //setOpen(true);
  //};

  //const handleClose = (event, reason) => {
  //if (reason !== "backdropClick") {
  //setOpen(false);
  //}
  //};

  const [dynamicFormVaccineCovid19, setDynamicFormVaccineCovid19] = useState({
    studentcovid19vaccinehistory: [
      {
        vaccine_to: "",
        vaccine_date: "",
      },
    ],
  });

  const [
    dynamicFormBasicImmunization,
    setDynamicFormBasicImmunization,
  ] = useState({
    basicimmunizationhistory: [
      {
        type_of_immunization: "",
        immunization_date: "",
        value: "",
      },
    ],
  });

  const [
    dynamicFormHospitalizationHistory,
    setDynamicFormHospitalizationHistory,
  ] = useState({
    studenthospitalizationhistory: [
      {
        hospital_name: "",
        date_treated: "",
        diagnosis: "",
        other_diagnosis: "",
      },
    ],
  });

  const [dynamicFormComorbidities, setDynamicFormComorbidities] = useState({
    studenthistoryofcomorbidities: [
      {
        history_of_comorbidities: "",
      },
    ],
  });

  const [
    dynamicFormPastMedicalHistory,
    setDynamicFormPastMedicalHistory,
  ] = useState({
    studentpastmedicalhistory: [
      {
        past_medical_history: "",
      },
    ],
  });

  const [
    dynamicFormFamilyDiseaseHistory,
    setDynamicFormFamilyDiseaseHistory,
  ] = useState({
    studentfamilyhistoryofillness: [
      {
        family_history_of_illness: "",
      },
    ],
  });

  //Object
  const [state, setstate] = useState({
    id: "",
    niy: "",
    name: "",
    level: "",
    kelas: "",
    blood_group: "",
    blood_group_rhesus: "",
    history_of_drug_allergy: "",
    covid19_illness_history: "",
    covid19_sick_date: "",
    covid19_vaccine_history: "",
    covid19_vaccine_description: "",
    studentbirthtimedata: {
      weight: "",
      height: "",
      head_circumference: "",
      month: "",
      birth_condition: "",
      indication: "",
    },
    // studentcovid19vaccinehistory: {
    //   vaccine_history: "",
    //   description: "",
    //   vaccine_date: "",
    // },
    // nama: "",
    // jenjang: "",
    // kelas: "",
    // golongan_darah: "",
    // berat_badan: "",
    // tinggi_badan: "",
    // lingkar_kepala: "",
    // bulan_lahir: "",
    // kondisi_lahir: "",
    // indikasi: "",
    // //jenis_imunisasi: "",
    // //tanggal_imunisasi: "",
    // //nilai: "",
    // riwayat_vaksin_covid19: "",
    // keterangan_vaksin: "",
    // //tanggal_vaksin: "",

    // //riwayat_rawat_inap: [
    // //{
    // //nama_rs: "",
    // //tanggal_rawat: "",
    // //diagnosis: {
    // //general_diagnosis_id: 0,
    // //diagnosis_name: "",
    // //},
    // //diagnosis_lain: "",
    // //},
    // //],

    // //riwayat_rawat_inap: [
    // //{
    // //id: uuidv4(),
    // //nama_rs: "",
    // //tanggal_rawat: "",
    // //diagnosis_name: "",
    // //diagnosis_lain: "",
    // //},
    // //],

    // riwayat_alergi_obat: "",
    // riwayat_covid19: "",
    // //terapi: "",
    // //lampiran: "",
    // id_siswa_riwayat_kesehatan: null,
  });

  const BirthMonth = ["Cukup", "Kurang", "Lebih"];

  const BirthCondition = ["Kondisi Khusus", "Normal", "Caesar"];

  const BloodGroup = ["A", "B", "AB", "O"];

  const BloodGroupRhesus = ["Rhesus +", "Rhesus -"];

  const TypeOfImmunization = [
    "Hepatitis B",
    "Polio",
    "BCG",
    "DTP",
    "Hib",
    "PVC",
    "Rotavirus",
    "Influenza",
    "JE",
    "Varisela",
    "Hepatitis A",
    "Tifoid",
    "HPV",
    "Dengue",
  ];

  //Datepicker
  // const [vaccine_date, setvaccinedateValue] = useState(new Date());
  //const [tanggal_imunisasi, settanggalimunisasiValue] = useState(new Date());
  // const [covid19_sick_date, setcovid19sickdateValue] = useState(new Date());

  {
    /*
  //Fungsi GetData Blood
  const getbloodOptions = async (id) => {
    const params = {
      id: id,
    };
    const response = await axios.get(
      endpoint.medical_history_student.option_blood,
      {
        params: params,
      }
    );
    if (response && response.data) {
      setbloodOptions(response.data);
    }
  };
*/
  }

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
      setstudentOptions(response.data);
      let value = response.data.length > 1 ? 1 : 0;
      setautoComplete(value);
    }
    setstudentAutoCompleteLoading(false);
  };

  const ValidationForm = Yup.object().shape({
    name: Yup.string().required("Nama Tidak Boleh Kosong"),
    niy: Yup.string().required("Niy Tidak Boleh Kosong"),
    level: Yup.string().required("Jenjang Tidak Boleh Kosong"),
    kelas: Yup.string().required("Kelas Tidak Boleh Kosong"),
    blood_group: Yup.string().required("Golongan Darah Tidak Boleh Kosong"),
    weight: Yup.string().required("Berat Badan Tidak Boleh Kosong"),
    height: Yup.string().required("Tinggi Badan Tidak Boleh Kosong"),
    head_circumference: Yup.string().required(
      "Lingkar Kepala Tidak Boleh Kosong"
    ),
    month: Yup.string().required("Bulan Lahir Tidak Boleh Kosong"),
    birth_condition: Yup.string().required("Kondisi Lahir Tidak Boleh Kosong"),
    indication: Yup.string().required("Indikasi Tidak Boleh Kosong"),
    // vaccine_history: Yup.string().required(
    //   "Riwayat Vaksin Covid19 Tidak Boleh Kosong"
    // ),
    covid19_vaccine_history: Yup.string().required(
      "Riwayat Vaksin Covid19 Tidak Boleh Kosong"
    ),
    covid19_illness_history: Yup.string().required(
      "Riwayat Sakit Covid19 Obat Tidak Boleh Kosong"
    ),
  });

  // const handleChangeDate1 = (fieldName, eventValue) => {
  //   let newState2 = { ...state };
  //   let value = "";

  //   if (fieldName == "vaccine_date") {
  //     value = moment(eventValue).format("YYYY-MM-DD");
  //   } else {
  //     value = eventValue.target.value;
  //   }
  //   const header_details = ["vaccine_date"];

  //   if (header_details.includes(fieldName)) {
  //     newState2.studentcovid19vaccinehistory[fieldName] = value;
  //   } else {
  //     newState2[fieldName] = value;
  //   }

  //   // console.log(fieldName);
  //   // console.log(eventValue);
  //   setstate(newState2);
  // };

  const handleChangeDate2 = (fieldName, eventValue) => {
    let newState3 = { ...state };
    let value = "";

    if (fieldName == "covid19_sick_date") {
      value = moment(eventValue).format("YYYY-MM-DD");
    } else {
      value = eventValue.target.value;
    }
    const header_details = ["covid19_sick_date"];

    if (header_details.includes(fieldName)) {
      newState3[fieldName] = value;
    } else {
      newState3[fieldName] = value;
    }

    // console.log(fieldName);
    // console.log(eventValue);
    setstate(newState3);
  };

  const handleChange = (index, eventValue) => {
    let newState1 = { ...state };
    //let newState2 = [...dynamicForm];

    let value = "";

    if (index === "student_id") {
      value = eventValue ? eventValue.id : "";
      newState1["name"] = eventValue ? eventValue.name : "";
      newState1["niy"] = eventValue ? eventValue.niy : "";
      newState1["level"] = eventValue ? eventValue.jenjang.code : "";
      newState1["kelas"] = eventValue ? eventValue.kelas.name : "";
    } else {
      value = eventValue.target.value;
    }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1["name"] = eventValue ? eventValue.name : "";
    // } else {
    //   value = eventValue.target.value;
    // }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1["niy"] = eventValue ? eventValue.niy : "";
    // } else {
    //   value = eventValue.target.value;
    // }

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
    //   if (eventValue) {
    //     newState1["level"] = eventValue ? eventValue.jenjang.code : "";
    //   } else {
    //     value: "";
    //   }
    // } else {
    //   value = eventValue.target.value;
    // }

    // if (index === "student_id") {
    //   value = eventValue ? eventValue.id : "";
    //   if (eventValue) {
    //     newState1["kelas"] = eventValue ? eventValue.kelas.name : "";
    //   } else {
    //     value: "";
    //   }
    // } else {
    //   value = eventValue.target.value;
    // }

    const header_detail = [
      "weight",
      "height",
      "head_circumference",
      "month",
      "birth_condition",
      "indication",
      // "vaccine_history",
      // "description",
    ];

    if (header_detail.includes(index)) {
      newState1.studentbirthtimedata[index] = value;
    } else {
      newState1[index] = value;
    }

    // if (header_detail.includes(index)) {
    //   newState1.studentcovid19vaccinehistory[index] = value;
    // } else {
    //   newState1[index] = value;
    // }
    setstate(newState1);

    if (index === "id") {
      getdiagnosisOptions(value);
      getstudentOptions(value);
      BloodGroup(value);
      setcovid19sickdateValue(value);
      // setvaccinedateValue(value);
    }
    newState1[index] = value;
    setstate(newState1);

    // console.log(eventValue);
    // console.log(value);
  };

  //Backup handleChange

  const handleChangeField1 = (index1, event) => {
    if (
      [
        "hospital_name",
        "date_treated",
        "diagnosis",
        "other_diagnosis",
      ].includes(event.target.name)
    ) {
      let studenthospitalizationhistory = [
        ...dynamicFormHospitalizationHistory.studenthospitalizationhistory,
      ];
      studenthospitalizationhistory[index1][event.target.name] =
        event.target.value;
      setDynamicFormHospitalizationHistory({ studenthospitalizationhistory });
    } else {
      setDynamicFormHospitalizationHistory({
        [event.target.name]: event.target.value,
      });
    }
    // console.log(event);
  };

  const handleChangeField2 = (index2, event) => {
    if (["history_of_comorbidities"].includes(event.target.name)) {
      let studenthistoryofcomorbidities = [
        ...dynamicFormComorbidities.studenthistoryofcomorbidities,
      ];
      studenthistoryofcomorbidities[index2][event.target.name] =
        event.target.value;
      setDynamicFormComorbidities({ studenthistoryofcomorbidities });
    } else {
      setDynamicFormComorbidities({ [event.target.name]: event.target.value });
    }
    // console.log(event);
  };

  const handleChangeField3 = (index3, event) => {
    if (["past_medical_history"].includes(event.target.name)) {
      let studentpastmedicalhistory = [
        ...dynamicFormPastMedicalHistory.studentpastmedicalhistory,
      ];
      studentpastmedicalhistory[index3][event.target.name] = event.target.value;
      setDynamicFormPastMedicalHistory({ studentpastmedicalhistory });
    } else {
      setDynamicFormPastMedicalHistory({
        [event.target.name]: event.target.value,
      });
    }
    // console.log(event);
  };

  const handleChangeField4 = (index4, event) => {
    if (["family_history_of_illness"].includes(event.target.name)) {
      let studentfamilyhistoryofillness = [
        ...dynamicFormFamilyDiseaseHistory.studentfamilyhistoryofillness,
      ];
      studentfamilyhistoryofillness[index4][event.target.name] =
        event.target.value;
      setDynamicFormFamilyDiseaseHistory({ studentfamilyhistoryofillness });
    } else {
      setDynamicFormFamilyDiseaseHistory({
        [event.target.name]: event.target.value,
      });
    }
    // console.log(event);
  };

  const handleChangeField5 = (index5, event) => {
    if (
      ["immunization_date", "type_of_immunization", "value"].includes(
        event.target.name
      )
    ) {
      let basicimmunizationhistory = [
        ...dynamicFormBasicImmunization.basicimmunizationhistory,
      ];
      basicimmunizationhistory[index5][event.target.name] = event.target.value;
      setDynamicFormBasicImmunization({ basicimmunizationhistory });
    } else {
      setDynamicFormBasicImmunization({
        [event.target.name]: event.target.value,
      });
    }
    // console.log(event);
  };

  const handleChangeField6 = (index6, event) => {
    if (["vaccine_to", "vaccine_date"].includes(event.target.name)) {
      let studentcovid19vaccinehistory = [
        ...dynamicFormVaccineCovid19.studentcovid19vaccinehistory,
      ];
      studentcovid19vaccinehistory[index6][event.target.name] =
        event.target.value;
      setDynamicFormVaccineCovid19({ studentcovid19vaccinehistory });
    } else {
      setDynamicFormVaccineCovid19({
        [event.target.name]: event.target.value,
      });
    }

    // let value = "";

    // if (index6 == "vaccine_date") {
    //   value = moment(event).format("YYYY-MM-DD");
    // } else {
    //   value = event.target.value;
    // }
    // console.log(event);
  };

  //Dynamic Form Riwayat Rawat Inap
  const handleAddFieldsInpatient = () => {
    setDynamicFormHospitalizationHistory({
      studenthospitalizationhistory: [
        ...dynamicFormHospitalizationHistory.studenthospitalizationhistory,
        {
          hospital_name: "",
          date_treated: "",
          diagnosis: "",
          other_diagnosis: "",
        },
      ],
    });
  };

  const handleRemoveFieldsInpatient = (index1) => {
    dynamicFormHospitalizationHistory.studenthospitalizationhistory.splice(
      index1,
      1
    );
    setDynamicFormHospitalizationHistory({
      studenthospitalizationhistory:
        dynamicFormHospitalizationHistory.studenthospitalizationhistory,
    });
  };

  //Dynamic Form Riwayat Penyakit Penyerta
  const handleAddFieldsHistoryOfComorbidities = () => {
    setDynamicFormComorbidities({
      studenthistoryofcomorbidities: [
        ...dynamicFormComorbidities.studenthistoryofcomorbidities,
        {
          history_of_comorbidities: "",
        },
      ],
    });
  };

  const handleRemoveFieldsHistoryOfComorbidities = (index2) => {
    dynamicFormComorbidities.studenthistoryofcomorbidities.splice(index2, 1);
    setDynamicFormComorbidities({
      studenthistoryofcomorbidities:
        dynamicFormComorbidities.studenthistoryofcomorbidities,
    });
  };

  //Dynamic Form Riwayat Penyakit Dahulu
  const handleAddFieldsPastMedicalHistory = () => {
    setDynamicFormPastMedicalHistory({
      studentpastmedicalhistory: [
        ...dynamicFormPastMedicalHistory.studentpastmedicalhistory,
        {
          past_medical_history: "",
        },
      ],
    });
  };

  const handleRemoveFieldsPastMedicalHistory = (index3) => {
    dynamicFormPastMedicalHistory.studentpastmedicalhistory.splice(index3, 1);
    setDynamicFormPastMedicalHistory({
      studentpastmedicalhistory:
        dynamicFormPastMedicalHistory.studentpastmedicalhistory,
    });
  };

  //Dynamic Form Riwayat Penyakit Keluarga
  const handleAddFieldsFamilyDiseaseHistory = () => {
    setDynamicFormFamilyDiseaseHistory({
      studentfamilyhistoryofillness: [
        ...dynamicFormFamilyDiseaseHistory.studentfamilyhistoryofillness,
        {
          //id: uuidv4(),
          family_history_of_illness: "",
        },
      ],
    });
  };

  const handleRemoveFieldsFamilyDiseaseHistory = (index4) => {
    dynamicFormFamilyDiseaseHistory.studentfamilyhistoryofillness.splice(
      index4,
      1
    );
    setDynamicFormFamilyDiseaseHistory({
      studentfamilyhistoryofillness:
        dynamicFormFamilyDiseaseHistory.studentfamilyhistoryofillness,
    });
  };

  //Dynamic Form Imunisasi Dasar
  const handleAddFieldsBasicImmunization = () => {
    setDynamicFormBasicImmunization({
      basicimmunizationhistory: [
        ...dynamicFormBasicImmunization.basicimmunizationhistory,
        {
          type_of_immunization: "",
          immunization_date: "",
          value: "",
        },
      ],
    });
  };

  const handleRemoveFieldsBasicImmunization = (index5) => {
    dynamicFormBasicImmunization.basicimmunizationhistory.splice(index5, 1);
    setDynamicFormBasicImmunization({
      basicimmunizationhistory:
        dynamicFormBasicImmunization.basicimmunizationhistory,
    });
  };

  //Dynamic Form Vaksin Covid19
  const handleAddFieldsVaccineCovid19 = () => {
    setDynamicFormVaccineCovid19({
      studentcovid19vaccinehistory: [
        ...dynamicFormVaccineCovid19.studentcovid19vaccinehistory,
        {
          vaccine_to: "",
          vaccine_date: "",
        },
      ],
    });
  };

  const handleRemoveFieldsVaccineCovid19 = (index6) => {
    dynamicFormVaccineCovid19.studentcovid19vaccinehistory.splice(index6, 1);
    setDynamicFormVaccineCovid19({
      studentcovid19vaccinehistory:
        dynamicFormVaccineCovid19.studentcovid19vaccinehistory,
    });
  };

  // const submit = async () => {
  //   let payload = new FormData();
  //   payload.append("name", state.name);
  //   payload.append("level", state.level);
  //   payload.append("kelas", state.kelas);
  //   payload.append("blood_group", state.blood_group);
  //   payload.append("history_of_drug_allergy", state.history_of_drug_allergy);
  //   payload.append("covid19_illness_history", state.covid19_illness_history);
  //   payload.append(
  //     "covid19_sick_date",
  //     format(covid19_sick_date, "yyyy-MM-dd")
  //   );
  //   payload.append("weight", state.weight);
  //   payload.append("height", state.height);
  //   payload.append("head_circumference", state.head_circumference);
  //   payload.append("month", state.month);
  //   payload.append("birth_condition", state.birth_condition);
  //   payload.append("indication", state.indication);
  //   //payload.append("type_of_immunization", state.jenis_imunisasi);
  //   //payload.append(
  //   //"immunization_date",
  //   //format(tanggal_imunisasi, "yyyy-MM-dd")
  //   //);
  //   //payload.append("value", state.nilai);
  //   payload.append("vaccine_history", state.vaccine_history);
  //   payload.append("description", state.description);
  //   payload.append("vaccine_date", format(vaccine_date, "yyyy-MM-dd"));
  //   // payload.append("vaccine_date", state.tanggal_vaksin);

  //   payload.append(
  //     "dynamicFormBasicImmunization",
  //     JSON.stringify(dynamicFormBasicImmunization)
  //   );

  //   payload.append(
  //     "dynamicFormHospitalizationHistory",
  //     JSON.stringify(dynamicFormHospitalizationHistory)
  //   );
  //   payload.append(
  //     "dynamicFormComorbidities",
  //     JSON.stringify(dynamicFormComorbidities)
  //   );
  //   payload.append(
  //     "dynamicFormPastMedicalHistory",
  //     JSON.stringify(dynamicFormPastMedicalHistory)
  //   );
  //   payload.append(
  //     "dynamicFormFamilyDiseaseHistory",
  //     JSON.stringify(dynamicFormFamilyDiseaseHistory)
  //   );
  //   // payload.append("hospital_name", dynamicForm.nama_rs);
  //   // payload.append("date_treated", dynamicForm.tanggal_rawat);
  //   // payload.append("diagnosis", dynamicForm.diagnosis);
  //   // payload.append("other_diagnosis", dynamicForm.diagnosis_lain);

  //   if (actionCode === "CREATE") {
  //     await axios.post(endpoint.medical_history_student.create, payload, {
  //       body: payload,
  //     });
  //   } else {
  //     payload = { ...payload, id: state.id };
  //     await axios.put(endpoint.medical_history_student.update, payload, {
  //       body: payload,
  //     });
  //   }
  //   setisSubmitting(false);
  //   submitSuccess("saving data success");
  //   getData();
  //   console.log(actionCode);
  //   console.log(payload);
  // };

  // let params = {
  //   name: state.name,
  //   niy: state.niy,
  //   level: state.level,
  //   kelas: state.kelas,
  //   blood_group: state.blood_group,
  //   blood_group_rhesus: state.blood_group_rhesus,
  //   history_of_drug_allergy: state.history_of_drug_allergy,
  //   covid19_illness_history: state.covid19_illness_history,
  //   // covid19_sick_date: format(covid19_sick_date, "yyyy-MM-dd"),
  //   covid19_sick_date: state.covid19_sick_date,
  //   weight: state.studentbirthtimedata.weight,
  //   height: state.studentbirthtimedata.height,
  //   head_circumference: state.studentbirthtimedata.head_circumference,
  //   month: state.studentbirthtimedata.month,
  //   birth_condition: state.studentbirthtimedata.birth_condition,
  //   indication: state.studentbirthtimedata.indication,
  //   covid19_vaccine_history: state.covid19_vaccine_history,
  //   covid19_vaccine_description: state.covid19_vaccine_description,
  //   // vaccine_history: state.studentcovid19vaccinehistory.vaccine_history,
  //   // vaccine_date: format(vaccine_date, "yyyy-MM-dd"),
  //   // vaccine_date: state.studentcovid19vaccinehistory.vaccine_date,
  //   // description: state.studentcovid19vaccinehistory.description,
  //   dynamicFormBasicImmunization: JSON.stringify(
  //     dynamicFormBasicImmunization.basicimmunizationhistory
  //   ),
  //   dynamicFormHospitalizationHistory: JSON.stringify(
  //     dynamicFormHospitalizationHistory.studenthospitalizationhistory
  //   ),
  //   dynamicFormComorbidities: JSON.stringify(
  //     dynamicFormComorbidities.studenthistoryofcomorbidities
  //   ),
  //   dynamicFormPastMedicalHistory: JSON.stringify(
  //     dynamicFormPastMedicalHistory.studentpastmedicalhistory
  //   ),
  //   dynamicFormFamilyDiseaseHistory: JSON.stringify(
  //     dynamicFormFamilyDiseaseHistory.studentfamilyhistoryofillness
  //   ),
  //   dynamicFormVaccineCovid19: JSON.stringify(
  //     dynamicFormVaccineCovid19.studentcovid19vaccinehistory
  //   ),
  // };

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: params,
  //   validationSchema: ValidationForm,

  //   onSubmit: async (values, { setSubmitting }) => {
  //     if (actionCode === "CREATE") {
  //       await axios.post(endpoint.medical_history_student.create, values);
  //     } else {
  //       await axios.put(endpoint.medical_history_student.update, values);
  //     }
  //     setSubmitting(false);
  //     submitSuccess("saving data success");
  //     getData();
  //   },
  // });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: state.id,
      name: state.name,
      niy: state.niy,
      level: state.level,
      kelas: state.kelas,
      blood_group: state.blood_group,
      blood_group_rhesus: state.blood_group_rhesus,
      history_of_drug_allergy: state.history_of_drug_allergy,
      covid19_illness_history: state.covid19_illness_history,
      covid19_sick_date: state.covid19_sick_date,
      weight: state.studentbirthtimedata.weight,
      height: state.studentbirthtimedata.height,
      head_circumference: state.studentbirthtimedata.head_circumference,
      month: state.studentbirthtimedata.month,
      birth_condition: state.studentbirthtimedata.birth_condition,
      indication: state.studentbirthtimedata.indication,
      covid19_vaccine_history: state.covid19_vaccine_history,
      covid19_vaccine_description: state.covid19_vaccine_description,
      dynamicFormBasicImmunization: JSON.stringify(
        dynamicFormBasicImmunization.basicimmunizationhistory
      ),
      dynamicFormHospitalizationHistory: JSON.stringify(
        dynamicFormHospitalizationHistory.studenthospitalizationhistory
      ),
      dynamicFormComorbidities: JSON.stringify(
        dynamicFormComorbidities.studenthistoryofcomorbidities
      ),
      dynamicFormPastMedicalHistory: JSON.stringify(
        dynamicFormPastMedicalHistory.studentpastmedicalhistory
      ),
      dynamicFormFamilyDiseaseHistory: JSON.stringify(
        dynamicFormFamilyDiseaseHistory.studentfamilyhistoryofillness
      ),
      dynamicFormVaccineCovid19: JSON.stringify(
        dynamicFormVaccineCovid19.studentcovid19vaccinehistory
      ),
    },
    validationSchema: ValidationForm,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.medical_history_student.create, values)
          .catch(function (error) {
            submitError("Data gagal disimpan !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        let respon = await axios
          .post(endpoint.medical_history_student.update, values)
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
    //getbloodOptions();
    getdiagnosisOptions();
    getstudentOptions();
    //console.log(state);
  }, []);

  useDebounce(
    () => {
      if (autoCompleteKeyword.trim() != "") {
        getstudentOptions(autoCompleteKeyword);
      }
    },
    500,
    [autoCompleteKeyword]
  );

  // useEffect(() => {
  //   console.log(dynamicFormHospitalizationHistory);
  // }, [dynamicFormHospitalizationHistory]);

  // useEffect(() => {
  //   console.log(dynamicFormComorbidities);
  // }, [dynamicFormComorbidities]);

  // useEffect(() => {
  //   console.log(dynamicFormPastMedicalHistory);
  // }, [dynamicFormPastMedicalHistory]);

  // useEffect(() => {
  //   console.log(dynamicFormFamilyDiseaseHistory);
  // }, [dynamicFormFamilyDiseaseHistory]);

  // useEffect(() => {
  //   console.log(dynamicFormBasicImmunization);
  // }, [dynamicFormBasicImmunization]);

  // useEffect(() => {
  //   console.log(dynamicFormVaccineCovid19);
  // }, [dynamicFormVaccineCovid19]);

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if (row && props.actionCode !== "CREATE") {
      getDetail(row);

      // console.log("cek data row", row);
    }
  }, [row]);

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
      setDynamicFormHospitalizationHistory({
        studenthospitalizationhistory:
          row.studenthospitalizationhistory.length > 0
            ? row.studenthospitalizationhistory.map((data) => ({
                hospital_name: data.hospital_name,
                date_treated: data.date_treated,
                diagnosis: data.diagnosis,
                other_diagnosis: data.other_diagnosis,
              }))
            : [
                {
                  hospital_name: "",
                  date_treated: "",
                  diagnosis: "",
                  other_diagnosis: "",
                },
              ],
      });
      setDynamicFormComorbidities({
        studenthistoryofcomorbidities:
          row.studenthistoryofcomorbidities.length > 0
            ? row.studenthistoryofcomorbidities.map((data) => ({
                history_of_comorbidities: data.history_of_comorbidities,
              }))
            : [
                {
                  history_of_comorbidities: "",
                },
              ],
      });
      setDynamicFormPastMedicalHistory({
        studentpastmedicalhistory:
          row.studentpastmedicalhistory.length > 0
            ? row.studentpastmedicalhistory.map((data) => ({
                past_medical_history: data.past_medical_history,
              }))
            : [
                {
                  past_medical_history: "",
                },
              ],
      });
      setDynamicFormFamilyDiseaseHistory({
        studentfamilyhistoryofillness:
          row.studentfamilyhistoryofillness.length > 0
            ? row.studentfamilyhistoryofillness.map((data) => ({
                family_history_of_illness: data.family_history_of_illness,
              }))
            : [
                {
                  family_history_of_illness: "",
                },
              ],
      });
      setDynamicFormBasicImmunization({
        basicimmunizationhistory:
          row.basicimmunizationhistory.length > 0
            ? row.basicimmunizationhistory.map((data) => ({
                type_of_immunization: data.type_of_immunization,
                immunization_date: data.immunization_date,
                value: data.value,
              }))
            : [
                {
                  type_of_immunization: "",
                  immunization_date: "",
                  value: "",
                },
              ],
      });
      setDynamicFormVaccineCovid19({
        studentcovid19vaccinehistory:
          row.studentcovid19vaccinehistory.length > 0
            ? row.studentcovid19vaccinehistory.map((data) => ({
                vaccine_to: data.vaccine_to,
                vaccine_date: data.vaccine_date,
              }))
            : [
                {
                  vaccine_to: "",
                  vaccine_date: "",
                },
              ],
      });
    }
  };

  const getValue = () => {
    let user_id = "";
    if (user.user_type.value == "1") {
      user_id = user.id;
    } else {
      user_id = user.student.id;
    }
    let data = studentOptions.filter((item) => item.id == user_id);

    return data.map((row) => ({
      niy: row.niy,
      name: row.name,
      jenjang: row.jenjang ? row.jenjang.name : "",
      kelas: row.kelas ? row.kelas.name : "",
    }));
  };

  useEffect(() => {
    let niy = getValue().map((row) => row.niy)[0];
    let name = getValue().map((row) => row.name)[0];
    let level = getValue().map((row) => row.jenjang)[0];
    let kelas = getValue().map((row) => row.kelas)[0];

    let newState = { ...state };

    newState["niy"] = niy;
    newState["name"] = name;
    newState["level"] = level;
    newState["kelas"] = kelas;

    if (getValue().length < 2 && name) {
      setstate(newState);
    }
  }, [studentOptions]);

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              {studentOptions && studentOptions.length > 1 ? (
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
              ) : (
                <TextField
                  {...getFieldProps("name")}
                  value={state && state.name}
                  onChange={(e) => handleChange("name", e)}
                  fullWidth
                  autoComplete="on"
                  type="text"
                  label="Name"
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 5 }}
                  inputProps={{ readOnly: true }}
                />
              )}
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
            {...getFieldProps("kelas")}
            value={state && state.kelas}
            onChange={(e) => handleChange("kelas", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Kelas"
            error={Boolean(touched.kelas && errors.kelas)}
            helperText={touched.kelas && errors.kelas}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="golongan-darah">Pilih Golongan Darah</InputLabel>
              <Select
                {...getFieldProps("blood_group")}
                labelId="golongan-darah"
                id="golongan-darah"
                value={state.blood_group}
                onChange={(e) => handleChange("blood_group", e)}
                label="Pilih Golongan Darah"
                error={Boolean(touched.blood_group && errors.blood_group)}
                helperText={touched.blood_group && errors.blood_group}
              >
                {BloodGroup.map((blood_group) => (
                  <MenuItem key={blood_group} value={blood_group}>
                    {blood_group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="golongan-darah-rhesus">
                Pilih Golongan Darah Rhesus
              </InputLabel>
              <Select
                labelId="golongan-darah-rhesus"
                id="golongan-darah-rhesus"
                value={state.blood_group_rhesus}
                onChange={(e) => handleChange("blood_group_rhesus", e)}
                label="Pilih Golongan Darah Rhesus"
              >
                {BloodGroupRhesus.map((blood_group_rhesus) => (
                  <MenuItem key={blood_group_rhesus} value={blood_group_rhesus}>
                    {blood_group_rhesus}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Grid container style={{ marginBottom: 16 }}></Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Data Waktu Lahir</Typography>
          </Grid>

          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <TextField
                {...getFieldProps("weight")}
                value={state.studentbirthtimedata.weight}
                onChange={(e) => handleChange("weight", e)}
                fullWidth
                autoComplete="on"
                type="text"
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
              <TextField
                {...getFieldProps("height")}
                value={state.studentbirthtimedata.height}
                onChange={(e) => handleChange("height", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Tinggi Badan"
                error={Boolean(touched.height && errors.height)}
                helperText={touched.height && errors.height}
                sx={{ mb: 5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Cm</InputAdornment>
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
                {...getFieldProps("head_circumference")}
                value={state.studentbirthtimedata.head_circumference}
                onChange={(e) => handleChange("head_circumference", e)}
                fullWidth
                autoComplete="on"
                type="text"
                label="Lingkar Kepala"
                error={Boolean(
                  touched.head_circumference && errors.head_circumference
                )}
                helperText={
                  touched.head_circumference && errors.head_circumference
                }
                sx={{ mb: 5 }}
              />
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="diagnosis-umum">
                Pilih Keterangan Bulan Lahir
              </InputLabel>
              <Select
                {...getFieldProps("month")}
                labelId="keterangan-bulan-lahir"
                id="keterangan-bulan-lahir"
                value={state.studentbirthtimedata.month}
                onChange={(e) => handleChange("month", e)}
                label="Pilih Keterangan Bulan Lahir"
                error={Boolean(touched.month && errors.month)}
                helperText={touched.month && errors.month}
              >
                {BirthMonth.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
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
              <InputLabel id="kondisi-lahir">Pilih Kondisi Lahir</InputLabel>
              <Select
                {...getFieldProps("birth_condition")}
                labelId="kondisi-lahir"
                id="kondisi-lahir"
                value={state.studentbirthtimedata.birth_condition}
                onChange={(e) => handleChange("birth_condition", e)}
                label="Pilih Kondisi Lahir"
                error={Boolean(
                  touched.birth_condition && errors.birth_condition
                )}
                helperText={touched.birth_condition && errors.birth_condition}
                sx={{ mb: 5 }}
              >
                {BirthCondition.map((birth_condition) => (
                  <MenuItem key={birth_condition} value={birth_condition}>
                    {birth_condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <TextField
            {...getFieldProps("indication")}
            value={state.studentbirthtimedata.indication}
            onChange={(e) => handleChange("indication", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Indikasi SC"
            error={Boolean(touched.indication && errors.indication)}
            helperText={touched.indication && errors.indication}
            sx={{ mb: 5 }}
          />

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Riwayat Imunisasi Dasar</Typography>
          </Grid>

          {dynamicFormBasicImmunization.basicimmunizationhistory.map(
            (BasicImmunization, index5) => {
              return (
                <Grid key={index5}>
                  <Grid container style={{ marginBottom: 16 }}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "100%" }}
                    >
                      <InputLabel id="jenis-imunisasi">
                        Pilih Jenis Imunisasi
                      </InputLabel>
                      <Select
                        labelId="jenis-imunisasi"
                        id="jenis-imunisasi"
                        name="type_of_immunization"
                        value={BasicImmunization.type_of_immunization}
                        onChange={(e) => handleChangeField5(index5, e)}
                        label="Pilih Jenis Imunisasi"
                      >
                        {TypeOfImmunization.map((type_of_immunization) => (
                          <MenuItem
                            key={type_of_immunization}
                            value={type_of_immunization}
                          >
                            {type_of_immunization}
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
                        name="immunization_date"
                        value={BasicImmunization.immunization_date}
                        onChange={(e) => handleChangeField5(index5, e)}
                        fullWidth
                        autoComplete="on"
                        type="date"
                        label=""
                        sx={{ mb: 5 }}
                      />
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "50%" }}
                    >
                      <TextField
                        name="value"
                        value={BasicImmunization.value}
                        onChange={(e) => handleChangeField5(index5, e)}
                        autoComplete="on"
                        type="text"
                        label="Isi Jumlah Berapa Kali Mengikuti Imunisasi"
                        sx={{ mb: 5 }}
                      />
                    </FormControl>
                  </Stack>

                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "5%" }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      disabled={
                        dynamicFormBasicImmunization.basicimmunizationhistory
                          .length === 1
                      }
                      onClick={() =>
                        handleRemoveFieldsBasicImmunization(index5)
                      }
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
              onClick={handleAddFieldsBasicImmunization}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Riwayat Vaksin Covid 19</Typography>
          </Grid>

          {/* <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              {...getFieldProps("vaccine_history")}
              value={state.studentcovid19vaccinehistory.vaccine_history}
              onChange={(e) => handleChange("vaccine_history", e)}
              row
              aria-label="covid-19-vaccine-history"
              name="row-radio-buttons-group"
              error={Boolean(touched.vaccine_history && errors.vaccine_history)}
              helperText={touched.vaccine_history && errors.vaccine_history}
            >
              <FormControlLabel
                onClick={() => setShowHistoryVaccineCovid19(false)}
                value="Sudah"
                control={<Radio />}
                label="Sudah"
              />
              <FormControlLabel
                onClick={() => setShowHistoryVaccineCovid19(true)}
                value="Belum"
                control={<Radio />}
                label="Belum"
              />
            </RadioGroup>
          </Grid>
          {showHistoryVaccineCovid19 ? (
            <TextField
              value={state.studentcovid19vaccinehistory.description}
              onChange={(e) => handleChange("description", e)}
              fullWidth
              autoComplete="on"
              type="text"
              label="Keterangan"
              sx={{ mb: 5 }}
            />
          ) : (
            <Grid container style={{ marginBottom: 16 }}>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, width: "100%" }}
              >
                <DatePicker
                  label="Tanggal Vaksin"
                  value={state.studentcovid19vaccinehistory.vaccine_date || ""}
                  hintText="DD/MM/YYYY"
                  inputFormat="dd/MM/yyyy"
                  onChange={(e) => handleChangeDate1("vaccine_date", e)}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
              </FormControl>
            </Grid>
          )} */}

          <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              {...getFieldProps("covid19_vaccine_history")}
              value={state.covid19_vaccine_history}
              onChange={(e) => handleChange("covid19_vaccine_history", e)}
              row
              aria-label="covid-19-vaccine-history"
              name="row-radio-buttons-group"
              error={Boolean(
                touched.covid19_vaccine_history &&
                  errors.covid19_vaccine_history
              )}
              helperText={
                touched.covid19_vaccine_history &&
                errors.covid19_vaccine_history
              }
            >
              <FormControlLabel
                // onClick={() => setShowHistoryVaccineCovid19(false)}
                value="Sudah"
                control={<Radio />}
                label="Sudah"
              />
              <FormControlLabel
                // onClick={() => setShowHistoryVaccineCovid19(true)}
                value="Belum"
                control={<Radio />}
                label="Belum"
              />
            </RadioGroup>
          </Grid>
          {state.covid19_vaccine_history === "Belum" ? (
            <TextField
              value={state.covid19_vaccine_description}
              onChange={(e) => handleChange("covid19_vaccine_description", e)}
              fullWidth
              autoComplete="on"
              type="text"
              label="Keterangan"
              sx={{ mb: 5 }}
            />
          ) : null}

          {dynamicFormVaccineCovid19.studentcovid19vaccinehistory.map(
            (VaccineHistory, index6) => {
              return state.covid19_vaccine_history === "Sudah" ? (
                <Grid key={index6}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "50%" }}
                    >
                      <TextField
                        name="vaccine_to"
                        value={VaccineHistory.vaccine_to}
                        onChange={(e) => handleChangeField6(index6, e)}
                        fullWidth
                        autoComplete="on"
                        type="text"
                        label=""
                        sx={{ mb: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Vaksin Ke
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "50%" }}
                    >
                      {/* <DatePicker
                        name="vaccine_date"
                        label="Tanggal Vaksin"
                        value={VaccineHistory.vaccine_date || ""}
                        hintText="DD/MM/YYYY"
                        inputFormat="dd/MM/yyyy"
                        onChange={(e) => handleChangeField6(index6, e)}
                        renderInput={(params) => (
                          <TextField {...params} helperText={null} />
                        )}
                      /> */}

                      <TextField
                        name="vaccine_date"
                        value={VaccineHistory.vaccine_date}
                        onChange={(e) => handleChangeField6(index6, e)}
                        fullWidth
                        autoComplete="on"
                        type="date"
                        label=""
                        sx={{ mb: 5 }}
                      />
                    </FormControl>
                  </Stack>

                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, width: "5%" }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      disabled={
                        dynamicFormVaccineCovid19.studentcovid19vaccinehistory
                          .length === 1
                      }
                      onClick={() => handleRemoveFieldsVaccineCovid19(index6)}
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
              ) : null;
            }
          )}

          {state.covid19_vaccine_history === "Sudah" ? (
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
                onClick={handleAddFieldsVaccineCovid19}
                style={{ margin: "0 8px" }}
              >
                <AddIcon />
                Add
              </Button>
            </Grid>
          ) : null}

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Riwayat Rawat Inap</Typography>
          </Grid>
          {dynamicFormHospitalizationHistory.studenthospitalizationhistory.map(
            (HospitalizationHistory, index1) => {
              return (
                <Grid key={index1}>
                  <Grid container style={{ marginBottom: 16 }}>
                    <TextField
                      name="hospital_name"
                      value={HospitalizationHistory.hospital_name}
                      onChange={(e) => handleChangeField1(index1, e)}
                      fullWidth
                      autoComplete="on"
                      type="text"
                      label="Nama Rumah Sakit"
                      sx={{ mb: 5 }}
                    />
                  </Grid>

                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "50%" }}
                    >
                      <TextField
                        name="date_treated"
                        value={HospitalizationHistory.date_treated}
                        onChange={(e) => handleChangeField1(index1, e)}
                        fullWidth
                        autoComplete="on"
                        type="date"
                        label=""
                        sx={{ mb: 5 }}
                      />
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "50%" }}
                    >
                      <InputLabel id="diagnosis-umum">
                        Pilih Diagnosis
                      </InputLabel>
                      <Select
                        labelId="diagnosis-umum"
                        id="diagnosis-umum"
                        name="diagnosis"
                        defaultValue=""
                        value={HospitalizationHistory.diagnosis}
                        onChange={(e) => handleChangeField1(index1, e)}
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
                    name="other_diagnosis"
                    value={HospitalizationHistory.other_diagnosis}
                    onChange={(e) => handleChangeField1(index1, e)}
                    fullWidth
                    autoComplete="on"
                    type="text"
                    label="Diagnosis Lain"
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
                        dynamicFormHospitalizationHistory
                          .studenthospitalizationhistory.length === 1
                      }
                      onClick={() => handleRemoveFieldsInpatient(index1)}
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
              onClick={handleAddFieldsInpatient}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}></Grid>
          <Grid container style={{ marginBottom: 16 }}></Grid>

          {dynamicFormComorbidities.studenthistoryofcomorbidities.map(
            (Comorbidities, index2) => {
              return (
                <Grid key={index2}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "95%" }}
                    >
                      {/* {console.log(
                    Comorbidities.studenthistoryofcomorbidities
                      .history_of_comorbidities
                  )} */}
                      <TextField
                        name="history_of_comorbidities"
                        value={Comorbidities.history_of_comorbidities}
                        onChange={(e) => handleChangeField2(index2, e)}
                        autoComplete="on"
                        type="text"
                        label="Riwayat Penyakit Penyerta"
                        sx={{ mb: 5 }}
                      />
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "5%" }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        disabled={
                          dynamicFormComorbidities.studenthistoryofcomorbidities
                            .length === 1
                        }
                        onClick={() =>
                          handleRemoveFieldsHistoryOfComorbidities(index2)
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
              onClick={handleAddFieldsHistoryOfComorbidities}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}></Grid>
          <Grid container style={{ marginBottom: 16 }}></Grid>

          {dynamicFormPastMedicalHistory.studentpastmedicalhistory.map(
            (PastMedicalHistory, index3) => {
              return (
                <Grid key={index3}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "95%" }}
                    >
                      <TextField
                        name="past_medical_history"
                        value={PastMedicalHistory.past_medical_history}
                        onChange={(e) => handleChangeField3(index3, e)}
                        fullWidth
                        autoComplete="on"
                        type="text"
                        label="Riwayat Penyakit Dahulu"
                        sx={{ mb: 5 }}
                      />
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "5%" }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        disabled={
                          dynamicFormPastMedicalHistory
                            .studentpastmedicalhistory.length === 1
                        }
                        onClick={() =>
                          handleRemoveFieldsPastMedicalHistory(index3)
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
              onClick={handleAddFieldsPastMedicalHistory}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}></Grid>
          <Grid container style={{ marginBottom: 16 }}></Grid>

          {dynamicFormFamilyDiseaseHistory.studentfamilyhistoryofillness.map(
            (FamilyDiseaseHistory, index4) => {
              return (
                <Grid key={index4}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "95%" }}
                    >
                      <TextField
                        name="family_history_of_illness"
                        value={FamilyDiseaseHistory.family_history_of_illness}
                        onChange={(e) => handleChangeField4(index4, e)}
                        autoComplete="on"
                        type="text"
                        label="Riwayat Penyakit Keluarga"
                        sx={{ mb: 5 }}
                      />
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "5%" }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        disabled={
                          dynamicFormFamilyDiseaseHistory
                            .studentfamilyhistoryofillness.length === 1
                        }
                        onClick={() =>
                          handleRemoveFieldsFamilyDiseaseHistory(index4)
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
              onClick={handleAddFieldsFamilyDiseaseHistory}
              style={{ margin: "0 8px" }}
            >
              <AddIcon />
              Add
            </Button>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}></Grid>
          <Grid container style={{ marginBottom: 16 }}></Grid>

          <TextField
            value={state.history_of_drug_allergy}
            onChange={(e) => handleChange("history_of_drug_allergy", e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Riwayat Alergi Obat"
            sx={{ mb: 5 }}
          />

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Riwayat Sakit Covid</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              {...getFieldProps("covid19_illness_history")}
              value={state.covid19_illness_history}
              onChange={(e) => handleChange("covid19_illness_history", e)}
              row
              aria-label="covid-19-illness-history"
              name="row-radio-buttons-group"
              error={Boolean(
                touched.covid19_illness_history &&
                  errors.covid19_illness_history
              )}
              helperText={
                touched.covid19_illness_history &&
                errors.covid19_illness_history
              }
            >
              <FormControlLabel
                // onClick={() => setShowCovid19IllnessHistory(true)}
                value="Ada"
                control={<Radio />}
                label="Ada"
              />
              <FormControlLabel
                // onClick={() => setShowCovid19IllnessHistory(false)}
                value="Tidak"
                control={<Radio />}
                label="Tidak"
              />
            </RadioGroup>
          </Grid>

          {state.covid19_illness_history === "Ada" ? (
            <Grid container style={{ marginBottom: 16 }}>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, width: "100%" }}
              >
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Tanggal Sakit Covid19"
                    value={covid19_sick_date}
                    fullWidth
                    onChange={(e) => {
                      setcovid19sickdateValue(e);
                    }}
                    //onChange={(event, newValue) => {
                    //handleChange("tanggal", newValue);
                    //}}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider> */}
                <DatePicker
                  label="Tanggal Sakit Covid19"
                  value={state.covid19_sick_date || ""}
                  hintText="DD/MM/YYYY"
                  inputFormat="dd/MM/yyyy"
                  onChange={(e) => handleChangeDate2("covid19_sick_date", e)}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
              </FormControl>
            </Grid>
          ) : null}

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
