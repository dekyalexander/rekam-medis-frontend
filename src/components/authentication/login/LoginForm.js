import * as Yup from "yup";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import {
  Box,
  Link,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// routes
import { PATH_AUTH } from "../../../routes/paths";
// hooks
import useAuth from "../../../hooks/useAuth";
import useIsMountedRef from "../../../hooks/useIsMountedRef";
// utils
import { passwordError, usernameError } from "../../../utils/helpError";
//
import { MIconButton } from "../../@material-extend";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const response = await login({
          username: values.username,
          password: values.password,
        });
        // console.log(response)
        if (response) {
          enqueueSnackbar("Login success", {
            variant: "success",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          });
        } else {
          enqueueSnackbar("Invalid Credentials", {
            variant: "error",
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          });
          console.log("gagal");
        }

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.code || error.message });
        }
      }
    },
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
  } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          autoComplete="username"
          type="text"
          label="Username"
          {...getFieldProps("username")}
          error={
            Boolean(touched.username && errors.username) ||
            usernameError(errors.afterSubmit).error
          }
          helperText={
            (touched.username && errors.username) ||
            usernameError(errors.afterSubmit).helperText
          }
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          autoComplete="current-password"
          type={showPassword ? "text" : "password"}
          label="Password"
          {...getFieldProps("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={handleShowPassword} edge="end">
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={
            Boolean(touched.password && errors.password) ||
            passwordError(errors.afterSubmit).error
          }
          helperText={
            (touched.password && errors.password) ||
            passwordError(errors.afterSubmit).helperText
          }
        />
        <Box
          sx={{
            my: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps("remember")}
                checked={values.remember}
              />
            }
            label="Remember me"
          />

          {/* <Link
            component={RouterLink}
            variant="subtitle2"
            to={PATH_AUTH.resetPassword}
          >
            Forgot password?
          </Link> */}
        </Box>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          pending={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
