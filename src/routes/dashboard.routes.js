import { lazy } from "react";
import { Redirect } from "react-router-dom";
// guards
import AuthGuard from "../guards/AuthGuard";
// layouts
import DashboardLayout from "../layouts/dashboard";
//
import { PATH_DASHBOARD } from "./paths";

// ----------------------------------------------------------------------

const DashboardRoutes = {
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
      path: PATH_DASHBOARD.parameter.root,
      component: lazy(() => import("../views/parameter/Parameter")),
    },
    {
      exact: true,
      path: PATH_DASHBOARD.unit.root,
      component: lazy(() => import("../views/unit/Unit")),
    },
    {
      component: () => <Redirect to="/404" />,
    },
  ],
};

export default DashboardRoutes;
