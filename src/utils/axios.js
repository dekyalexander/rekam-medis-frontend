import axios from "axios";
// ----------------------------------------------------------------------

export const axiosInstance = axios.create();

if (process.env.REACT_APP_BACKEND_MODE === "PROD") {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_API_PROD;
} else if (process.env.REACT_APP_BACKEND_MODE === "UAT") {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_API_UAT;
} else {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_API_LOCAL;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export const endpoint = {
  employee: {
    root: "/employee",
    option: "/employee/option",
  },
  jenjang: {
    root: "/jenjang",
    option: "/jenjang/option",
  },
  jurusan: {
    root: "/jurusan",
    sync: "/jurusan/sync",
    option: "/jurusan/option",
  },
  kelas: {
    root: "/kelas",
    sync: "/kelas/sync",
    option: "/kelas/option",
  },
  login: "login",
  register: "register",
  user: {
    root: "user",
    option: "/user/option",
    by_token: "user/by-token",
    role: "user/role",
    change_password: "user/change-password",
    reset_password: "user/reset-password",
  },
  parameter: {
    root: "/parameter",
    option: "/parameter/option",
  },
  application: {
    root: "/application",
    option: "/application/option",
    role: "/application/role",
    menu: "/application/menu",
  },
  menu: {
    root: "/menu",
    option: "/menu/option",
    action: "/menu/action",
  },
  action: {
    root: "/action",
    option: "/action/option",
    approver: "/action/approver",
    role: "/action/role",
  },
  parallel: {
    root: "/parallel",
    sync: "/parallel/sync",
    option: "/parallel/option",
  },
  parent: {
    root: "/parent",
    option: "/parent/option",
    student: "/parent/student",
  },
  role: {
    root: "/role",
    detail: "/role/id",
    option: "/role/option",
    application: "/role/application",
    priviledge: "/role/priviledge",
    user: "/role/user",
    approval: "/role/approval",
  },
  school: {
    root: "/school",
    option: "/school/option",
  },
  student: {
    root: "/student",
    sync: "/student/sync",
    option: "/student/option",
    parent: "/student/parent",
  },
  tahun_pelajaran: {
    root: "/tahun-pelajaran",
    option: "/tahun-pelajaran/option",
  },
  unit: {
    root: "/unit",
    option: "/unit/option",
  },
  category: {
    root: "/category",
  },
  applicationCategory: {
    root: "/application-categories",
  },
  uks_location: {
    root: "/uks-location/option",
  },
  officer_registration: {
    root: "/uks-list-registration-location/option",
    create: "/uks-officer/create",
    update: "/uks-officer/update",
    delete: "/uks-officer/delete",
  },
  diagnosis_eyes: {
    root: "/diagnosis-eyes/option",
    create: "/diagnosis-eyes/create",
    update: "/diagnosis-eyes/update",
    delete: "/diagnosis-eyes/delete",
  },
  diagnosis_bmi: {
    root: "/diagnosis-bmi/option",
    create: "/diagnosis-bmi/create",
    update: "/diagnosis-bmi/update",
    delete: "/diagnosis-bmi/delete",
  },
  diagnosis_general: {
    root: "/diagnosis-general/option",
    create: "/diagnosis-general/create",
    update: "/diagnosis-general/update",
    delete: "/diagnosis-general/delete",
  },
  diagnosis_mcu: {
    root: "/diagnosis-mcu/option",
    create: "/diagnosis-mcu/create",
    update: "/diagnosis-mcu/update",
    delete: "/diagnosis-mcu/delete",
  },
  medical_history_student: {
    root: "/student-current-health-history/option",
    create: "/student-current-health-history/create",
    update: "/student-current-health-history/update",
    delete: "/student-current-health-history/delete",
    option_diagnosis: "/general-diagnosis/option",
    option_blood: "/blood-group/option",
  },
  medical_history_employee: {
    root: "/employee-current-health-history/option",
    create: "/employee-current-health-history/create",
    update: "/employee-current-health-history/update",
    delete: "/employee-current-health-history/delete",
    option_diagnosis: "/general-diagnosis/option",
    option_blood: "/blood-group/option",
    download_file: "/download-document",
  },
  student_mcu: {
    root: "/student-mcu/option",
    create: "/student-mcu/create",
    update: "/student-mcu/update",
    delete: "/student-mcu/delete",
    option_diagnosis_bmi: "/bmi-diagnosis/option",
    option_diagnosis_mcu: "/mcu-diagnosis/option",
    option_eye_visus: "/eye-visus/option",
    option_eye_diagnosis: "/eye-diagnosis/option",
  },
  employee_mcu: {
    root: "/employee-mcu/option",
    create: "/employee-mcu/create",
    update: "/employee-mcu/update",
    delete: "/employee-mcu/delete",
    download_file: "/download-document",
  },
  student_treatment: {
    root: "/student-treatment/option",
    create: "/student-treatment/create",
    update: "/student-treatment/update",
    delete: "/student-treatment/delete",
    reduce_stock: "/reduce-stock",
  },
  employee_treatment: {
    root: "/employee-treatment/option",
    create: "/employee-treatment/create",
    update: "/employee-treatment/update",
    delete: "/employee-treatment/delete",
    download_file: "/download-document",
  },
  drug: {
    root: "/drug/option",
    create: "/drug/create",
    update: "/drug/update",
    delete: "/drug/delete",
    option: "/uks-location/option",
    option_location_drug: "/location-drug/option",
    option_drug_recap: "/drug-recap/option",
    export_recap_drug_in: "/export-excel-drug-in",
    export_recap_drug_out: "/export",
    option_distribution: "/drug-distribution/option",
  },
  drug_distribution: {
    update: "/drug-distribution/update",
    delete: "/drug-distribution/delete",
  },
  drug_mutation: {
    root: "/drug-mutation/option",
    create: "/drug-mutation/create",
    update: "/drug-mutation/update",
    export: "/export-excel-drug-mutation",
  },
  drug_type: {
    root: "/drug-type/option",
    create: "/drug-type/create",
    update: "/drug-type/update",
    delete: "/drug-type/delete",
  },
  drug_location: {
    root: "/drug-location/option",
    create: "/drug-location/create",
    update: "/drug-location/update",
    delete: "/drug-location/delete",
  },
  drug_name: {
    root: "/drug-name/option",
    create: "/drug-name/create",
    update: "/drug-name/update",
    delete: "/drug-name/delete",
  },
  drug_unit: {
    root: "/drug-unit/option",
    create: "/drug-unit/create",
    update: "/drug-unit/update",
    delete: "/drug-unit/delete",
  },

  email_notification: {
    email_student: "/email-student/option",
    email_employee: "/email-employee/option",
    send_email_student: "/email-notification-student",
    send_email_employee: "/email-notification-employee",
  },

  student_recap_diagnosis: {
    root_recap_mcu: "/student-mcu-recap-diagnosis",
    root_recap_treatment: "/student-treatment-recap-diagnosis",
    export_mcu: "/export-excel-mcu",
    export_treatment: "/export-excel-treatment",
  },

  employee_recap_diagnosis: {
    root_recap_treatment: "/employee-recap-diagnosis-treatment",
    root_recap_mcu: "/employee-recap-diagnosis-mcu",
    export_treatment: "/export-excel-treatment",
    export_mcu: "/export-excel-mcu",
  },

  employee_unit: {
    root: "/employee-unit/option",
  },
};
