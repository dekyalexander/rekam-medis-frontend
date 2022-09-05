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
  InputAdornment,
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
//import { v4 as uuidv4 } from "uuid";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "src/hooks/useAuth";
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
  const redux = useAuth();
  const [actionCode, setactionCode] = useState("READ");
  // const [isSubmitting, setisSubmitting] = useState(false);
  // const [errors, seterrors] = useState({});
  const [openEmployeeAutoComplete, setopenEmployeeAutoComplete] = useState(
    false
  );
  const [
    employeeAutoCompleteLoading,
    setemployeeAutoCompleteLoading,
  ] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState("");
  //const [isUsernameChanged, setisUsernameChanged] = useState(false);
  //const [bloodOptions, setbloodOptions] = useState([]);
  const [diagnosisOptions, setdiagnosisOptions] = useState([]);
  const [employeeOptions, setemployeeOptions] = useState([]);
  // const [uploadDone, setUploadDone] = useState(false);
  // const [uploading, setUploading] = useState(false);
  // const inputFileRef = useRef(null);
  //Datepicker
  // const [vaccine_date, setvaccinedateValue] = useState(new Date());
  // const [covid19_sick_date, setcovid19sickdateValue] = useState(new Date());
  // const [showHistoryVaccineCovid19, setShowHistoryVaccineCovid19] = useState(
  //   false
  // );
  // const [showCovid19IllnessHistory, setShowCovid19IllnessHistory] = useState(
  //   false
  // );

  const BloodGroup = ["A", "B", "O", "AB"];
  const BloodGroupRhesus = ["Rhesus +", "Rhesus -"];

  const [autoComplete, setautoComplete] = useState(1);

  //Button Dialog
  {
    /* const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  }; */
  }

  const [dynamicFormVaccineCovid19, setDynamicFormVaccineCovid19] = useState({
    employeecovid19vaccinehistory: [
      {
        vaccine_to: "",
        vaccine_date: "",
      },
    ],
  });

  const [
    dynamicFormHospitalizationHistory,
    setDynamicFormHospitalizationHistory,
  ] = useState({
    employeehospitalizationhistory: [
      {
        hospital_name: "",
        date_treated: "",
        diagnosis: "",
        other_diagnosis: "",
      },
    ],
  });

  const [dynamicFormComorbidities, setDynamicFormComorbidities] = useState({
    employeehistoryofcomorbidities: [
      {
        history_of_comorbidities: "",
      },
    ],
  });

  const [
    dynamicFormPastMedicalHistory,
    setDynamicFormPastMedicalHistory,
  ] = useState({
    employeepastmedicalhistory: [
      {
        past_medical_history: "",
      },
    ],
  });

  const [
    dynamicFormFamilyDiseaseHistory,
    setDynamicFormFamilyDiseaseHistory,
  ] = useState({
    employeefamilyhistoryofillness: [
      {
        family_history_of_illness: "",
      },
    ],
  });

  const [selectedFile, setSelectedFile] = useState([]);

  //Array
  const [state, setstate] = useState({
    id: "",
    name: "",
    nik: "",
    unit: "",
    blood_group: "",
    blood_group_rhesus: "",
    basic_immunization: "",
    history_of_drug_allergy: "",
    covid19_illness_history: "",
    covid19_vaccine_history: "",
    covid19_vaccine_description: "",
    // employeecovid19vaccinehistory: {
    //   vaccine_date: "",
    //   vaccine_history: "",
    //   description: "",
    // },
    covid19_sick_date: "",
    // nama: "",
    // golongan_darah: "",
    // imunisasi_dasar: "",
    // riwayat_vaksin_covid19: "",
    // keterangan_vaksin: "",
    // tanggal_vaksin: "",
    //riwayat_rawat_inap: [
    //{
    //nama_rs: "",
    //tanggal_rawat: "",
    //diagnosis: {
    //general_diagnosis_id: 0,
    //diagnosis_name: "",
    //},
    //diagnosis_lain: "",
    //},
    //],
    //riwayat_rawat_inap: [
    //{
    //id: uuidv4(),
    //nama_rs: "",
    //tanggal_rawat: "",
    //diagnosis_name: "",
    //diagnosis_lain: "",
    //},
    //],
    //riwayat_penyakit_penyerta: [
    //{
    //id: uuidv4(),
    //nama_penyakit: "",
    //},
    //],
    //riwayat_penyakit_dahulu: [
    //{
    //id: uuidv4(),
    //nama_penyakit: "",
    //},
    //],
    //riwayat_penyakit_keluarga: [
    //{
    //id: uuidv4(),
    //nama_penyakit: "",
    //},
    //],
    // riwayat_covid19: "",
    // tanggal_sakit_covid19: "",
    // riwayat_alergi_obat: "",
    // lampiran: "",
    // diagnosis: "",
    // id_karyawan_riwayat_kesehatan: null,
    // employee_health_id: null,
  });

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
      let value = response.data.length > 1 ? 1 : 0;
      setautoComplete(value);
    }
    setemployeeAutoCompleteLoading(false);
  };

  const getDetail = (row) => {
    if (row) {
      setstate({
        ...row,
      });
      setDynamicFormHospitalizationHistory({
        employeehospitalizationhistory:
          row.employeehospitalizationhistory.length > 0
            ? row.employeehospitalizationhistory.map((data) => ({
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
        employeehistoryofcomorbidities:
          row.employeehistoryofcomorbidities.length > 0
            ? row.employeehistoryofcomorbidities.map((data) => ({
                history_of_comorbidities: data.history_of_comorbidities,
              }))
            : [
                {
                  history_of_comorbidities: "",
                },
              ],
      });
      setDynamicFormPastMedicalHistory({
        employeepastmedicalhistory:
          row.employeepastmedicalhistory.length > 0
            ? row.employeepastmedicalhistory.map((data) => ({
                past_medical_history: data.past_medical_history,
              }))
            : [
                {
                  past_medical_history: "",
                },
              ],
      });
      setDynamicFormFamilyDiseaseHistory({
        employeefamilyhistoryofillness:
          row.employeefamilyhistoryofillness.length > 0
            ? row.employeefamilyhistoryofillness.map((data) => ({
                family_history_of_illness: data.family_history_of_illness,
              }))
            : [
                {
                  family_history_of_illness: "",
                },
              ],
      });
      setDynamicFormVaccineCovid19({
        employeecovid19vaccinehistory:
          row.employeecovid19vaccinehistory.length > 0
            ? row.employeecovid19vaccinehistory.map((data) => ({
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
    user_id = user.id;

    let data = employeeOptions; //.filter((item) => item.id == user_id);
    // let unitData = units.map((row) => row.unit_id);
    // const unit = unitData.find((el) => el == 12);
    return data.map((row) => ({
      nik: row.nik,
      name: row.name,
      unit: row.employeecareer
        ? row.employeecareer.employeeposition.employeeunit.name
        : "",
    }));
  };

  useEffect(() => {
    // console.log("users", getValue());
    let nik = getValue().map((row) => row.nik)[0];
    let name = getValue().map((row) => row.name)[0];
    let unit = getValue().map((row) => row.unit)[0];

    let newState = { ...state };

    newState["nik"] = nik;
    newState["name"] = name;
    newState["unit"] = unit;

    if (getValue().length < 2 && name) {
      // alert("ok");
      setstate(newState);
    }
  }, [employeeOptions]);

  // useEffect(() => {
  //   console.log(redux);
  // }, []);

  const ValidationForm = Yup.object().shape({
    name: Yup.string().required("Nama Tidak Boleh Kosong"),
    nik: Yup.string().required("NIK Tidak Boleh Kosong"),
    // unit: Yup.string().required("Posisi Tidak Boleh Kosong"),
    blood_group: Yup.string().required("Golongan Darah Tidak Boleh Kosong"),
    basic_immunization: Yup.string().required(
      "Imunisasi Dasar Tidak Boleh Kosong"
    ),
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

  const fileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

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
  //     newState2.employeecovid19vaccinehistory[fieldName] = value;
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

    let value = "";
    if (index === "employee_id") {
      value = eventValue ? eventValue.id : "";
      newState1["name"] = eventValue ? eventValue.name : "";
      newState1["nik"] = eventValue ? eventValue.nik : "";
      newState1["unit"] = eventValue.employeecareer
        ? eventValue.employeecareer.employeeposition.employeeunit.name
        : "";
    } else {
      value = eventValue.target.value;
    }

    // if (index === "employee_id") {
    //   value = eventValue ? eventValue.id : "";
    //   newState1["nik"] = eventValue ? eventValue.nik : "";
    // } else {
    //   value = eventValue.target.value;
    // }

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

    // if (index === "employee_id") {
    //   value = eventValue ? eventValue.id : "";
    //   if (eventValue) {
    //     newState1["unit"] = eventValue.employeecareer
    //       ? eventValue.employeecareer.employeeposition.employeeunit.name
    //       : "";
    //   } else {
    //     value: "";
    //   }
    // } else {
    //   value = eventValue.target.value;
    // }

    // const header_detail = ["vaccine_date", "vaccine_history", "description"];

    // if (header_detail.includes(index)) {
    //   newState1.employeecovid19vaccinehistory[index] = value;
    // } else {
    //   newState1[index] = value;
    // }

    if (index === "id") {
      //getbloodOptions(value);
      getdiagnosisOptions(value);
      getemployeeOptions(value);
      setcovid19sickdateValue(value);
      setvaccinedateValue(value);
    }
    newState1[index] = value;
    setstate(newState1);
    // console.log(value);
  };

  const handleChangeField1 = (index1, event) => {
    if (
      [
        "hospital_name",
        "date_treated",
        "diagnosis",
        "other_diagnosis",
      ].includes(event.target.name)
    ) {
      let employeehospitalizationhistory = [
        ...dynamicFormHospitalizationHistory.employeehospitalizationhistory,
      ];
      employeehospitalizationhistory[index1][event.target.name] =
        event.target.value;
      setDynamicFormHospitalizationHistory({ employeehospitalizationhistory });
    } else {
      setDynamicFormHospitalizationHistory({
        [event.target.name]: event.target.value,
      });
    }
    // console.log(event);
  };

  const handleChangeField2 = (index2, event) => {
    if (["history_of_comorbidities"].includes(event.target.name)) {
      let employeehistoryofcomorbidities = [
        ...dynamicFormComorbidities.employeehistoryofcomorbidities,
      ];
      employeehistoryofcomorbidities[index2][event.target.name] =
        event.target.value;
      setDynamicFormComorbidities({ employeehistoryofcomorbidities });
    } else {
      setDynamicFormComorbidities({ [event.target.name]: event.target.value });
    }
    // console.log(event);
  };

  const handleChangeField3 = (index3, event) => {
    if (["past_medical_history"].includes(event.target.name)) {
      let employeepastmedicalhistory = [
        ...dynamicFormPastMedicalHistory.employeepastmedicalhistory,
      ];
      employeepastmedicalhistory[index3][event.target.name] =
        event.target.value;
      setDynamicFormPastMedicalHistory({ employeepastmedicalhistory });
    } else {
      setDynamicFormPastMedicalHistory({
        [event.target.name]: event.target.value,
      });
    }
    // console.log(event);
  };

  const handleChangeField4 = (index4, event) => {
    if (["family_history_of_illness"].includes(event.target.name)) {
      let employeefamilyhistoryofillness = [
        ...dynamicFormFamilyDiseaseHistory.employeefamilyhistoryofillness,
      ];
      employeefamilyhistoryofillness[index4][event.target.name] =
        event.target.value;
      setDynamicFormFamilyDiseaseHistory({ employeefamilyhistoryofillness });
    } else {
      setDynamicFormFamilyDiseaseHistory({
        [event.target.name]: event.target.value,
      });
    }
    // console.log(event);
  };

  const handleChangeField5 = (index5, event) => {
    if (["vaccine_to", "vaccine_date"].includes(event.target.name)) {
      let employeecovid19vaccinehistory = [
        ...dynamicFormVaccineCovid19.employeecovid19vaccinehistory,
      ];
      employeecovid19vaccinehistory[index5][event.target.name] =
        event.target.value;
      setDynamicFormVaccineCovid19({ employeecovid19vaccinehistory });
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
      employeehospitalizationhistory: [
        ...dynamicFormHospitalizationHistory.employeehospitalizationhistory,
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
    dynamicFormHospitalizationHistory.employeehospitalizationhistory.splice(
      index1,
      1
    );
    setDynamicFormHospitalizationHistory({
      employeehospitalizationhistory:
        dynamicFormHospitalizationHistory.employeehospitalizationhistory,
    });
  };

  //Dynamic Form Riwayat Penyakit Penyerta
  const handleAddFieldsHistoryOfComorbidities = () => {
    setDynamicFormComorbidities({
      employeehistoryofcomorbidities: [
        ...dynamicFormComorbidities.employeehistoryofcomorbidities,
        {
          history_of_comorbidities: "",
        },
      ],
    });
  };

  const handleRemoveFieldsHistoryOfComorbidities = (index2) => {
    dynamicFormComorbidities.employeehistoryofcomorbidities.splice(index2, 1);
    setDynamicFormComorbidities({
      employeehistoryofcomorbidities:
        dynamicFormComorbidities.employeehistoryofcomorbidities,
    });
  };

  //Dynamic Form Riwayat Penyakit Dahulu
  const handleAddFieldsPastMedicalHistory = () => {
    setDynamicFormPastMedicalHistory({
      employeepastmedicalhistory: [
        ...dynamicFormPastMedicalHistory.employeepastmedicalhistory,
        {
          past_medical_history: "",
        },
      ],
    });
  };

  const handleRemoveFieldsPastMedicalHistory = (index3) => {
    dynamicFormPastMedicalHistory.employeepastmedicalhistory.splice(index3, 1);
    setDynamicFormPastMedicalHistory({
      employeepastmedicalhistory:
        dynamicFormPastMedicalHistory.employeepastmedicalhistory,
    });
  };

  //Dynamic Form Riwayat Penyakit Keluarga
  const handleAddFieldsFamilyDiseaseHistory = () => {
    setDynamicFormFamilyDiseaseHistory({
      employeefamilyhistoryofillness: [
        ...dynamicFormFamilyDiseaseHistory.employeefamilyhistoryofillness,
        {
          family_history_of_illness: "",
        },
      ],
    });
  };

  const handleRemoveFieldsFamilyDiseaseHistory = (index4) => {
    dynamicFormFamilyDiseaseHistory.employeefamilyhistoryofillness.splice(
      index4,
      1
    );
    setDynamicFormFamilyDiseaseHistory({
      employeefamilyhistoryofillness:
        dynamicFormFamilyDiseaseHistory.employeefamilyhistoryofillness,
    });
  };

  //Dynamic Form Vaksin Covid19
  const handleAddFieldsVaccineCovid19 = () => {
    setDynamicFormVaccineCovid19({
      employeecovid19vaccinehistory: [
        ...dynamicFormVaccineCovid19.employeecovid19vaccinehistory,
        {
          vaccine_to: "",
          vaccine_date: "",
        },
      ],
    });
  };

  const handleRemoveFieldsVaccineCovid19 = (index5) => {
    dynamicFormVaccineCovid19.employeecovid19vaccinehistory.splice(index5, 1);
    setDynamicFormVaccineCovid19({
      employeecovid19vaccinehistory:
        dynamicFormVaccineCovid19.employeecovid19vaccinehistory,
    });
  };

  // const submit = async () => {
  //   setUploading(true);
  //   let payload = new FormData();
  //   payload.append("name", state.name);
  //   payload.append("blood_group", state.blood_group);
  //   payload.append("basic_immunization", state.basic_immunization);
  //   payload.append("history_of_drug_allergy", state.history_of_drug_allergy);
  //   payload.append("covid19_illness_history", state.covid19_illness_history);
  //   payload.append(
  //     "covid19_sick_date",
  //     format(covid19_sick_date, "yyyy-MM-dd")
  //   );
  //   // payload.append("covid19_sick_date", state.tanggal_sakit_covid19);
  //   payload.append("vaccine_history", state.vaccine_history);
  //   payload.append("description", state.description);
  //   payload.append("vaccine_date", format(vaccine_date, "yyyy-MM-dd"));
  //   // payload.append("vaccine_date", state.tanggal_vaksin);
  //   payload.append("file", selectedFile);

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

  //   const headers = {
  //     "content-type": "multipart/form-data",
  //   };

  //   if (actionCode === "CREATE") {
  //     await axios.post(
  //       endpoint.medical_history_employee.create,
  //       payload,
  //       headers
  //     );
  //   } else {
  //     payload = { ...payload, id: state.id };
  //     await axios.put(
  //       endpoint.medical_history_employee.update,
  //       payload,
  //       headers
  //     );
  //   }
  //   setisSubmitting(false);
  //   submitSuccess("saving data success");
  //   getData();
  //   setUploading(false);
  //   setUploadDone(true);
  //   setSelectedFile(null);
  //   inputFileRef.current.value = null;
  //   console.log(actionCode);
  //   console.log(payload);
  // };

  // let params = {
  //   name: state.name,
  //   blood_group: state.blood_group,
  //   history_of_drug_allergy: state.history_of_drug_allergy,
  //   basic_immunization: state.basic_immunization,
  //   covid19_sick_date: state.covid19_sick_date,
  //   covid19_illness_history: state.covid19_illness_history,
  //   // covid19_sick_date: format(covid19_sick_date, "yyyy-MM-dd"),
  //   vaccine_history: state.employeecovid19vaccinehistory.vaccine_history,
  //   // vaccine_date: format(vaccine_date, "yyyy-MM-dd"),
  //   vaccine_date: state.employeecovid19vaccinehistory.vaccine_date,
  //   description: state.employeecovid19vaccinehistory.description,
  //   file: selectedFile,
  //   dynamicFormHospitalizationHistory:
  //     dynamicFormHospitalizationHistory.employeehospitalizationhistory,
  //   dynamicFormComorbidities:
  //     dynamicFormComorbidities.employeehistoryofcomorbidities,
  //   dynamicFormPastMedicalHistory:
  //     dynamicFormPastMedicalHistory.employeepastmedicalhistory,
  //   dynamicFormFamilyDiseaseHistory:
  //     dynamicFormFamilyDiseaseHistory.employeefamilyhistoryofillness,
  // };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: state.name,
      nik: state.nik,
      unit: state.unit,
      blood_group: state.blood_group,
      blood_group_rhesus: state.blood_group_rhesus,
      history_of_drug_allergy: state.history_of_drug_allergy,
      basic_immunization: state.basic_immunization,
      covid19_sick_date: state.covid19_sick_date,
      covid19_illness_history: state.covid19_illness_history,
      history_of_drug_allergy: state.history_of_drug_allergy,
      covid19_vaccine_history: state.covid19_vaccine_history,
      covid19_vaccine_description: state.covid19_vaccine_description,
      // vaccine_history: state.employeecovid19vaccinehistory.vaccine_history,
      // vaccine_date: state.employeecovid19vaccinehistory.vaccine_date,
      // description: state.employeecovid19vaccinehistory.description,
      file: selectedFile,
      dynamicFormHospitalizationHistory:
        dynamicFormHospitalizationHistory.employeehospitalizationhistory,
      dynamicFormComorbidities:
        dynamicFormComorbidities.employeehistoryofcomorbidities,
      dynamicFormPastMedicalHistory:
        dynamicFormPastMedicalHistory.employeepastmedicalhistory,
      dynamicFormFamilyDiseaseHistory:
        dynamicFormFamilyDiseaseHistory.employeefamilyhistoryofillness,
      dynamicFormVaccineCovid19:
        dynamicFormVaccineCovid19.employeecovid19vaccinehistory,
    },
    validationSchema: ValidationForm,

    onSubmit: async (values, { setSubmitting }) => {
      // setUploading(true);
      let payload = new FormData();
      payload.append("name", values.name);
      payload.append("nik", values.nik);
      payload.append("unit", values.unit);
      payload.append("blood_group", values.blood_group);
      payload.append("blood_group_rhesus", values.blood_group_rhesus);
      payload.append("basic_immunization", values.basic_immunization);
      payload.append("history_of_drug_allergy", values.history_of_drug_allergy);
      payload.append("covid19_illness_history", values.covid19_illness_history);
      payload.append("covid19_sick_date", values.covid19_sick_date);
      payload.append("covid19_vaccine_history", values.covid19_vaccine_history);
      payload.append(
        "covid19_vaccine_description",
        values.covid19_vaccine_description
      );
      // payload.append("vaccine_history", values.vaccine_history);
      // payload.append("description", values.description);
      // payload.append("vaccine_date", values.vaccine_date);
      payload.append("file", values.file);

      payload.append(
        "dynamicFormHospitalizationHistory",
        JSON.stringify(values.dynamicFormHospitalizationHistory)
      );
      payload.append(
        "dynamicFormComorbidities",
        JSON.stringify(values.dynamicFormComorbidities)
      );
      payload.append(
        "dynamicFormPastMedicalHistory",
        JSON.stringify(values.dynamicFormPastMedicalHistory)
      );
      payload.append(
        "dynamicFormFamilyDiseaseHistory",
        JSON.stringify(values.dynamicFormFamilyDiseaseHistory)
      );
      payload.append(
        "dynamicFormVaccineCovid19",
        JSON.stringify(values.dynamicFormVaccineCovid19)
      );
      const headers = {
        "content-type": "multipart/form-data",
      };

      if (actionCode === "CREATE") {
        let respon = await axios
          .post(endpoint.medical_history_employee.create, payload, headers)
          .catch(function (error) {
            submitError("Data gagal disimpan !");
          });
        if (respon) {
          submitSuccess("Data berhasil di simpan...!");
        }
      } else {
        payload.append("id", row.id);
        let respon = await axios
          .post(endpoint.medical_history_employee.update, payload, headers)
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

  useEffect(() => {
    //getbloodOptions();
    getdiagnosisOptions();
    getemployeeOptions();
    //console.log(state);
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
  //   console.log(dynamicFormVaccineCovid19);
  // }, [dynamicFormVaccineCovid19]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "100%" }}
            >
              {employeeOptions && employeeOptions.length > 1 ? (
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
            label="Unit"
            // error={Boolean(touched.unit && errors.unit)}
            // helperText={touched.unit && errors.unit}
            sx={{ mb: 5 }}
            inputProps={{ readOnly: true }}
          />

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="p">Imunisasi Dasar</Typography>
          </Grid>

          <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              {...getFieldProps("basic_immunization")}
              value={state.basic_immunization}
              onChange={(e) => handleChange("basic_immunization", e)}
              row
              aria-label="basic-immunization"
              name="row-radio-buttons-group"
              error={Boolean(
                touched.basic_immunization && errors.basic_immunization
              )}
              helperText={
                touched.basic_immunization && errors.basic_immunization
              }
            >
              <FormControlLabel
                value="Komplit"
                control={<Radio />}
                label="Komplit"
              />
              <FormControlLabel
                value="Tidak Komplit"
                control={<Radio />}
                label="Tidak Komplit"
              />
            </RadioGroup>
          </Grid>

          {/*

      <Grid container style={{ marginBottom: 16 }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, width: "100%" }}
        >
          <InputLabel id="golongan-darah">Pilih Golongan Darah</InputLabel>
          <Select
            labelId="golongan-darah"
            id="golongan-darah"
            value={state.golongan_darah}
            onChange={(e) => handleChange("golongan_darah", e)}
            label="Pilih Golongan Darah"
          >
            {bloodOptions.map((medical_history_student) => (
              <MenuItem
                key={medical_history_student.id}
                value={medical_history_student.blood_name}
              >
                {medical_history_student.blood_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      */}

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
            <Typography variant="p">Riwayat Vaksin Covid 19</Typography>
          </Grid>

          {/* <Grid container style={{ marginBottom: 16 }}>
            <RadioGroup
              {...getFieldProps("vaccine_history")}
              value={state.employeecovid19vaccinehistory.vaccine_history}
              onChange={(e) => handleChange("vaccine_history", e)}
              row
              aria-label="covid-vaccine-history"
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
              value={state.employeecovid19vaccinehistory.description}
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
                  value={state.employeecovid19vaccinehistory.vaccine_date || ""}
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

          {dynamicFormVaccineCovid19.employeecovid19vaccinehistory.map(
            (VaccineHistory, index5) => {
              return state.covid19_vaccine_history === "Sudah" ? (
                <Grid key={index5}>
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, width: "50%" }}
                    >
                      <TextField
                        name="vaccine_to"
                        value={VaccineHistory.vaccine_to}
                        onChange={(e) => handleChangeField5(index5, e)}
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
                        onChange={(e) => handleChangeField5(index5, e)}
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
                        dynamicFormVaccineCovid19.employeecovid19vaccinehistory
                          .length === 1
                      }
                      onClick={() => handleRemoveFieldsVaccineCovid19(index5)}
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
          {dynamicFormHospitalizationHistory.employeehospitalizationhistory.map(
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
                        {diagnosisOptions.map((medical_history_employee) => (
                          <MenuItem
                            key={medical_history_employee.id}
                            value={medical_history_employee.diagnosis_name}
                          >
                            {medical_history_employee.diagnosis_name}
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
                          .employeehospitalizationhistory.length === 1
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

          {dynamicFormComorbidities.employeehistoryofcomorbidities.map(
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
                          dynamicFormComorbidities
                            .employeehistoryofcomorbidities.length === 1
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

          {dynamicFormPastMedicalHistory.employeepastmedicalhistory.map(
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
                            .employeepastmedicalhistory.length === 1
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

          {dynamicFormFamilyDiseaseHistory.employeefamilyhistoryofillness.map(
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
                            .employeefamilyhistoryofillness.length === 1
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

          <Grid container style={{ marginBottom: 16 }}>
            <Typography variant="h5">
              Medical Checkup Saat Bergabung Di Pahoa
            </Typography>
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
                // onChange={(event) => {
                //   setSelectedFile("file", event.target.files[0]);
                // }}
                type="file"
                // ref={inputFileRef}
              />
              {state.file}
            </InputLabel>
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
