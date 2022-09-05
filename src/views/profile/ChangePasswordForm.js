import { useState, useEffect } from "react";
import closeFill from '@iconify/icons-eva/close-fill';
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useFormik, Form, FormikProvider } from "formik";
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
  Grid,
  FormControlLabel,
  FormHelperText,
  Checkbox,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";
import useAuth from "src/hooks/useAuth";
import { MIconButton } from "src/components/@material-extend";
import Icon from "@iconify/react";
// ----------------------------------------------------------------------

ChangePasswordForm.propTypes = {
  sx: PropTypes.object,
};

export default function ChangePasswordForm(props) {
  const { sx, closeSubDialog } = props;
  const { user={}} = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("EDIT");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [state, setstate] = useState({
    password: '',
    passwordConfirmation:''

  });
  
  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue.target.value;

    newState[fieldName] = value;
    setstate(newState);
  };

  const validation = ()=>{
    if(state.password!==state.passwordConfirmation){
      return false
    }
    if(state.password && state.password.trim()===''){
      return false
    }

    return true
  }

  const submit = async () => {
    let isValid = validation()
    
    if(isValid){
      let params = {
        user_id:user.id,
        new_password:state.password
      };
      await axios.put(endpoint.user.change_password, params);
      setisSubmitting(false);
      submitSuccess("change password success");
      closeSubDialog()
    }
    
  };

  const submitSuccess = (message) => {
    enqueueSnackbar(message, {
      variant: 'success',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  };

  const submitError = (message) => {
    enqueueSnackbar(message, {
      variant: 'error',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  };

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
  }, []);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <Grid container style={{ marginBottom: 16 }}>
      <TextField
        value={state.password}
        onChange={(e) => handleChange("password", e)}
        fullWidth
        type="password"
        label="New Password"
        error={Boolean(errors.password)}
        helperText={errors.password}
        sx={{ mb: 3 }}
      />
      </Grid>              

      <Grid container style={{ marginBottom: 16 }}>
      <TextField
        value={state.passwordConfirmation}
        onChange={(e) => handleChange("passwordConfirmation", e)}
        fullWidth
        type="password"
        label="Confirm Password"
        error={Boolean(errors.passwordConfirmation)}
        helperText={errors.passwordConfirmation}
        sx={{ mb: 3 }}
      />
      </Grid>              

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Protected allowedCodes={['EDIT','CREATE']} >
          <LoadingButton
            onClick={submit}
            variant="contained"
            pending={isSubmitting}
          >
            Save
          </LoadingButton>
        </Protected>
      </Box>
    </Card>
  );
}
