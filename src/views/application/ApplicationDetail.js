import { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useFormik, Form, FormikProvider } from "formik";
// material
import { Grid, Card, TextField, Button } from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils
import fakeRequest from "../../utils/fakeRequest";
import Conditional from "../../components/Conditional";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";

// ----------------------------------------------------------------------

ApplicationDetail.propTypes = {
  sx: PropTypes.object,
};

export default function ApplicationDetail(props) {
  const {
    row,
    getData,
    sx,
    submitSuccess,
    submitError,
    closeMainDialog,
    closeSubDialog,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState("READ");
  const [state, setState] = useState({
    name: "",
    code: "",
    ip: "",
    host: "",
  });

  const getDetail = (row) => {
    if (row) {
      setState({ ...row });
    }
  };

  const ChangePassWordSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string().required("Code is required"),
    ip: Yup.string().required("IP is required"),
    host: Yup.string().required("Host is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: state,
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (actionCode === "CREATE") {
        await axios.post(endpoint.application.root, values);
      } else {
        await axios.put(endpoint.application.root, values);
      }
      setSubmitting(false);
      submitSuccess("saving data success");
      getData();
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row && props.actionCode!=='CREATE'){
      getDetail(row);
    }
  }, [row]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <TextField
            {...getFieldProps("name")}
            fullWidth
            autoComplete="on"
            type="text"
            label="Name"
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            sx={{ mb: 3 }}
          />

          <TextField
            {...getFieldProps("code")}
            fullWidth
            autoComplete="on"
            type="text"
            label="Code"
            error={Boolean(touched.code && errors.code)}
            helperText={touched.code && errors.code}
            sx={{ mb: 3 }}
          />

          <TextField
            {...getFieldProps("ip")}
            fullWidth
            autoComplete="on"
            type="text"
            label="IP"
            error={Boolean(touched.ip && errors.ip)}
            helperText={touched.ip && errors.ip}
            sx={{ mb: 3 }}
          />

          <TextField
            {...getFieldProps("host")}
            fullWidth
            autoComplete="on"
            type="text"
            label="Host"
            error={Boolean(touched.host && errors.host)}
            helperText={touched.host && errors.host}
            sx={{ mb: 3 }}
          />

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
