import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
// redux
import { login, register, logout, location } from "../redux/slices/auth";

// ----------------------------------------------------------------------

export default function useAuth() {
  // JWT Auth
  const dispatch = useDispatch();
  const {
    application,
    applicationCode,
    user,
    location,
    roles,
    applications,
    menus,
    units,
    actions,
    isLoading,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  // JWT Auth
  return {
    method: "jwt",
    user,
    location,
    roles,
    applicationCode,
    application,
    applications,
    menus,
    actions,
    units,
    isLoading,
    isAuthenticated,

    login: ({ username, password }) =>
      dispatch(
        login({
          username,
          password,
        })
      ),

    register: ({ username, password, firstName, lastName }) =>
      dispatch(
        register({
          username,
          password,
          firstName,
          lastName,
        })
      ),

    logout: () => dispatch(logout()),

    uks_location: ({ uks_name }) =>
      dispatch(
        uks_location({
          uks_name,
        })
      ),

    resetPassword: () => {},

    updateProfile: () => {},
  };
}
