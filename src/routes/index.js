import NProgress from "nprogress";
import { Switch, Route, Redirect } from "react-router-dom";
import { Suspense, Fragment, lazy, useEffect, useMemo } from "react";
// material
import { makeStyles } from "@material-ui/core/styles";
// guards
import GuestGuard from "../guards/GuestGuard";
// components
import LoadingScreen from "../components/LoadingScreen";
//
import AuthGuard from "../guards/AuthGuard";
// layouts
import DashboardLayout from "../layouts/dashboard";
import HomeLayout from "../layouts/home";
import {
  PATH_PAGE,
  PATH_AUTH,
  PATH_DASHBOARD,
  mode,
  folderName,
} from "./paths";

// ----------------------------------------------------------------------

const nprogressStyle = makeStyles((theme) => ({
  "@global": {
    "#nprogress": {
      pointerEvents: "none",
      "& .bar": {
        top: 0,
        left: 0,
        height: 2,
        width: "100%",
        position: "fixed",
        zIndex: theme.zIndex.snackbar,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 2px ${theme.palette.primary.main}`,
      },
      "& .peg": {
        right: 0,
        opacity: 1,
        width: 100,
        height: "100%",
        display: "block",
        position: "absolute",
        transform: "rotate(3deg) translate(0px, -4px)",
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
      },
    },
  },
}));

function RouteProgress(props) {
  nprogressStyle();

  NProgress.configure({
    speed: 500,
    showSpinner: false,
  });

  useMemo(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    NProgress.done();
  }, []);

  return <Route {...props} />;
}

export function renderRoutes(routes = []) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, idx) => {
          const Component = route.component;
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;

          return (
            <RouteProgress
              key={`routes-${idx}`}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}

const routes = [
  // Others Routes
  {
    exact: true,
    guard: GuestGuard,
    path: PATH_AUTH.login,
    component: lazy(() => import("../views/authentication/Login")),
  },
  {
    exact: true,
    path: PATH_AUTH.loginUnprotected,
    component: lazy(() => import("../views/authentication/Login")),
  },
  {
    exact: true,
    guard: GuestGuard,
    path: PATH_AUTH.register,
    component: lazy(() => import("../views/authentication/Register")),
  },
  {
    exact: true,
    path: PATH_AUTH.registerUnprotected,
    component: lazy(() => import("../views/authentication/Register")),
  },
  {
    exact: true,
    path: PATH_AUTH.resetPassword,
    component: lazy(() => import("../views/authentication/ResetPassword")),
  },
  {
    exact: true,
    path: PATH_AUTH.verify,
    component: lazy(() => import("../views/authentication/VerifyCode")),
  },
  {
    exact: true,
    path: PATH_PAGE.page404,
    component: lazy(() => import("../views/general/Page404")),
  },
  {
    exact: true,
    path: PATH_PAGE.page500,
    component: lazy(() => import("../views/general/Page500")),
  },
  {
    exact: true,
    path: PATH_PAGE.maintenance,
    component: lazy(() => import("../views/general/Maintenance")),
  },
  {
    exact: true,
    path: PATH_AUTH.root,
    component: () => <Redirect to={PATH_AUTH.login} />,
  },
  {
    path: PATH_DASHBOARD.root,
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: PATH_DASHBOARD.root,
        component: () => <Redirect to={PATH_DASHBOARD.general.app} />,
      },
      {
        exact: true,
        path: PATH_DASHBOARD.general.app,
        component: lazy(() => import("../views/dashboard/DashboardContent")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.application,
        component: lazy(() => import("../views/application/Application")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.menu,
        component: lazy(() => import("../views/menu/Menu")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.action,
        component: lazy(() => import("../views/action/Action")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.role,
        component: lazy(() => import("../views/role/Role")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.user.root,
        component: lazy(() => import("../views/user/User")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.parameter,
        component: lazy(() => import("../views/parameter/Parameter")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.unit,
        component: lazy(() => import("../views/unit/Unit")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.student,
        component: lazy(() => import("../views/student/Student")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.employee,
        component: lazy(() => import("../views/employee/Employee")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.parent,
        component: lazy(() => import("../views/parent/Parent")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.jenjang,
        component: lazy(() => import("../views/jenjang/Jenjang")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.school,
        component: lazy(() => import("../views/school/School")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.kelas,
        component: lazy(() => import("../views/kelas/Kelas")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.jurusan,
        component: lazy(() => import("../views/jurusan/Jurusan")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.parallel,
        component: lazy(() => import("../views/parallel/Parallel")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.tahunPelajaran,
        component: lazy(() =>
          import("../views/tahun-pelajaran/TahunPelajaran")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.profile,
        component: lazy(() => import("../views/profile/Profile")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.lokasiTugas,
        component: lazy(() => import("../views/lokasi-tugas/LokasiTugas")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.biodataStudent,
        component: lazy(() => import("../views/biodata-student/Biodata")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.biodataEmployee,
        component: lazy(() => import("../views/biodata-employee/Biodata")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.studentCurrentHealthHistory,
        component: lazy(() =>
          import("../views/student-current-health-history/MedicalHistory")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.employeeCurrentHealthHistory,
        component: lazy(() =>
          import("../views/employee-current-health-history/MedicalHistory")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.studentMCU,
        component: lazy(() => import("../views/student-mcu/MCU")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.studentTreatment,
        component: lazy(() => import("../views/student-treatment/Treatment")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.employeeMCU,
        component: lazy(() => import("../views/employee-mcu/MCU")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.employeeTreatment,
        component: lazy(() => import("../views/employee-treatment/Treatment")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.drug,
        component: lazy(() => import("../views/drug/Drug")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.diagnosisGeneral,
        component: lazy(() => import("../views/diagnosis-general/Diagnosis")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.diagnosisDentalAndOral,
        component: lazy(() =>
          import("../views/diagnosis-dental-and-oral/Diagnosis")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.diagnosisEyes,
        component: lazy(() => import("../views/diagnosis-eyes/Diagnosis")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.diagnosisBMI,
        component: lazy(() => import("../views/diagnosis-bmi/Diagnosis")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.drugType,
        component: lazy(() => import("../views/drug-type/Drug")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.drugLocation,
        component: lazy(() => import("../views/drug-location/Drug")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.drugName,
        component: lazy(() => import("../views/drug-name/Drug")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.drugUnit,
        component: lazy(() => import("../views/drug-unit/Drug")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.emailNotification,
        component: lazy(() => import("../views/email-notification/Email")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.studentMCUDiagnosisRecap,
        component: lazy(() =>
          import("../views/student-mcu-recap-diagnosis/RecapDiagnosis")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.studentTreatmentDiagnosisRecap,
        component: lazy(() =>
          import("../views/student-treatment-recap-diagnosis/RecapDiagnosis")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.employeeTreatmentDiagnosisRecap,
        component: lazy(() =>
          import("../views/employee-treatment-recap-diagnosis/RecapDiagnosis")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.employeeMCUDiagnosisRecap,
        component: lazy(() =>
          import("../views/employee-mcu-recap-diagnosis/RecapDiagnosis")
        ),
      },
      // {
      //   exact: true,
      //   path: PATH_DASHBOARD.drugTransactionIn,
      //   component: lazy(() => import("../views/drug-transaction-in/Drug")),
      // },
      {
        exact: true,
        path: PATH_DASHBOARD.drugTransactionOut,
        component: lazy(() => import("../views/drug-transaction-out/Drug")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.drugMutation,
        component: lazy(() => import("../views/drug-mutation/Drug")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.drugSettings,
        component: lazy(() => import("../views/drug-settings/Drug")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "*",
    layout: HomeLayout,
    routes: [
      {
        exact: true,
        path: mode === "LOCAL" ? "/" : `/${folderName}`,
        component: () => (
          <Redirect
            to={mode === "LOCAL" ? "/dashboard" : `/${folderName}/dashboard`}
          />
        ),
      },
      // ----------------------------------------------------------------------

      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
