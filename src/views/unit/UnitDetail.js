import { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Grid,
  Card,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";

// ----------------------------------------------------------------------

UnitDetail.propTypes = {
  sx: PropTypes.object,
};

export default function UnitDetail(props) {
  const {
    row,
    getData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
    closeSubDialog,
  } = props;

  const [actionCode, setactionCode] = useState("READ");
  const [state, setState] = useState({
    name: "",
    head_role_id: "",
  });

  const [headRoleOptions, setheadRoleOptions] = useState([]);

  const getDetail = (row) => {
    if (row) {
      setState({ ...row });
    }
  };

  const ChangePassWordSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    head_role_id: Yup.string().required("Head Role is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: state,
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        await axios.post(endpoint.unit.root, values);
      } else {
        await axios.put(endpoint.unit.root, values);
      }
      setSubmitting(false);
      submitSuccess("saving data success");
      setState({ name: "", head_role_id: "" });
      getData();
    },
  });

  const getheadRoleOptions = async () => {
    const params = {
      not_id: row ? row.id : undefined,
    };

    const response = await axios.get("/role/option", { params: params });
    if (response && response.data) {
      setheadRoleOptions(response.data);
    }
  };

  const handleChange = (fieldName, eventValue) => {
    let newState = { ...state };
    let value = eventValue;

    // if (fieldName === "is_head") {
    //   value = eventValue.target.checked ? 1 : 0;
    // } else {
    //   value = eventValue.target.value;
    // }

    value = eventValue.target.value;

    newState[fieldName] = value;
    setState(newState);
  };

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    getheadRoleOptions();
    if(row && props.actionCode!=='CREATE'){
      getDetail(row);
    }
  }, [row]);

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <TextField
            {...getFieldProps("name")}
            name="name"
            fullWidth
            autoComplete="on"
            type="text"
            label="Name"
            onChange={(e) => handleChange("name", e)}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            sx={{ mb: 3 }}
          />

          <Grid container style={{ marginBottom: 16 }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, width: "50%" }}
            >
              <InputLabel id="role-label">Head Role</InputLabel>
              <Select
                labelId="role-label"
                name="head_role_id"
                id="role-select"
                value={state.head_role_id}
                onChange={(e) => handleChange("head_role_id", e)}
                label="Head Role"
              >
                <MenuItem value={undefined}>
                  <em>None</em>
                </MenuItem>
                {headRoleOptions.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container>
            <Grid item xs={6} container justifyContent="flex-start">
              <Conditional condition={actionCode === "READ"}>
                <Protected allowedCodes={["EDIT"]}>
                  <Button onClick={() => setactionCode("EDIT")}>edit</Button>
                </Protected>
              </Conditional>

              <Conditional condition={actionCode !== "READ"}>
                <Protected allowedCodes={["CREATE", "EDIT"]}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    pending={isSubmitting}
                  >
                    Save
                  </LoadingButton>
                </Protected>
              </Conditional>
            </Grid>

            <Grid item xs={6} container justifyContent="flex-end">
              {closeSubDialog && (
                <Button
                  variant="contained"
                  onClick={closeSubDialog}
                  color="inherit"
                >
                  close
                </Button>
              )}

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
          </Grid>
        </Form>
      </FormikProvider>
    </Card>
  );
}
