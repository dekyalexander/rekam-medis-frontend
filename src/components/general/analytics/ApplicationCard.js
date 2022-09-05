import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import androidFilled from "@iconify/icons-ant-design/android-filled";
// material
import { alpha, experimentalStyled as styled } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(3, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.dark,
    0
  )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function ApplicationCard(props) {
  const { application = {} } = props;
  const [appHost, setappHost] = useState("");
  useEffect(() => {
    if (appHost !== "") {
      window.location.href = appHost;
    }
  }, [appHost]);
  return (
    <RootStyle onClick={() => setappHost(application.host)}>
      <Typography variant="h5">{application.name}</Typography>
    </RootStyle>
  );
}
