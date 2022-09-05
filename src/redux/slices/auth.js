import jwtDecode from "jwt-decode";
import { createSlice } from "@reduxjs/toolkit";
// utils
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { setApplicationMenus } from "./ui";
// ----------------------------------------------------------------------

const initialState = {
  applicationCode: "RM",
  application: {},
  isLoading: false,
  isAuthenticated: false,
  user: {},
  // location: {},
  roles: [],
  applications: [],
  menus: [],
  actions: [],
  units: [],
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    stopLoading(state) {
      state.isLoading = false;
    },

    // INITIALISE
    getInitialize(state, action) {
      state.application = action.payload.application;
      state.isLoading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.roles = action.payload.roles;
      state.applications = action.payload.applications;
      state.menus = action.payload.menus;
      state.actions = action.payload.actions;
      state.units = action.payload.units;
    },

    // LOGIN
    loginSuccess(state, action) {
      state.application = action.payload.application;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.roles = action.payload.roles;
      state.applications = action.payload.applications;
      state.menus = action.payload.menus;
      state.actions = action.payload.actions;
      state.units = action.payload.units;
    },

    // REGISTER
    registerSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // UKS Location
    ukslocationSuccess(state, action) {
      state.isAuthenticated = false;
      state.location = action.payload.location;
    },

    // LOGOUT
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

// ----------------------------------------------------------------------

export function login({ username, password }) {
  return async (dispatch) => {
    const response = await axios.post(endpoint.login, {
      username,
      password,
    });
    const {
      access_token,
      user,
      applications,
      roles,
      menus,
      actions,
      units,
    } = response.data;
    if (user && access_token) {
      setSession(access_token);
      const application = applications.filter((app) => app.code === "RM")[0];
      const applicationMenus = menus.filter(
        (menu) => menu.application_id === application.id
      );
      dispatch(
        slice.actions.loginSuccess({
          application: application,
          user: user,
          applications: applications,
          roles: roles,
          menus: menus,
          actions: actions,
          units: units,
        })
      );
      dispatch(setApplicationMenus(applicationMenus));
      return response;
    }
  };
}

// ----------------------------------------------------------------------

export function register({ username, password, firstName, lastName }) {
  return async (dispatch) => {
    const response = await axios.post(endpoint.register, {
      username,
      password,
      firstName,
      lastName,
    });
    const { access_token, user } = response.data;

    window.localStorage.setItem("accessToken", access_token);
    dispatch(slice.actions.registerSuccess({ user }));
  };
}

// ----------------------------------------------------------------------

export function logout() {
  return async (dispatch) => {
    setSession(null);
    dispatch(slice.actions.logoutSuccess());

    console.log("mode ", process.env.REACT_APP_BACKEND_MODE);

    if (process.env.REACT_APP_BACKEND_MODE == "PROD")
      window.location.href = "http://139.255.38.102/pusat";
  };
}

// ----------------------------------------------------------------------

export function getInitialize() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const accessToken = window.localStorage.getItem("accessToken");

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        //
        const response = await axios.get(endpoint.user.by_token);
        if (response && response.data) {
          const {
            user,
            applications,
            roles,
            menus,
            actions,
            units,
          } = response.data;
          const application = applications.filter(
            (app) => app.code === "RM"
          )[0];
          const applicationMenus = menus.filter(
            (menu) => menu.application_id === application.id
          );
          dispatch(
            slice.actions.getInitialize({
              application: application,
              isAuthenticated: true,
              user: user,
              applications: applications,
              roles: roles,
              menus: menus,
              actions: actions,
              units: units,
            })
          );
          dispatch(setApplicationMenus(applicationMenus));
        }
      } else {
        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: false,
            user: null,
          })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: false,
          user: null,
        })
      );
    }
  };
}

// export function location({ uks_name }) {
//   return async (dispatch) => {
//     const response = await axios.get(endpoint.uks_location.option, {
//       uks_name
//     });
//     dispatch(slice.actions.ukslocationSuccess({ location }));
//   };
// }
