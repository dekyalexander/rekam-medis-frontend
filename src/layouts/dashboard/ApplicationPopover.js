import Icon from "@material-ui/core/Icon";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
// material
import { alpha } from "@material-ui/core/styles";
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  Grid,
} from "@material-ui/core";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useAuth from "../../hooks/useAuth";
import useIsMountedRef from "../../hooks/useIsMountedRef";
// components
import { MIconButton } from "../../components/@material-extend";
import MyAvatar from "../../components/MyAvatar";
import MenuPopover from "../../components/MenuPopover";
import ApplicationsAvailable from "src/components/general/analytics/ApplicationsAvailable";

// ----------------------------------------------------------------------

export default function ApplicationPopover() {
  const history = useHistory();
  const anchorRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const { applications = [] } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar>
          <Icon>apps</Icon>
        </Avatar>
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: "70%" }}
      >
        <Grid item xs={12}>
          <ApplicationsAvailable applications={applications} />
        </Grid>
      </MenuPopover>
    </>
  );
}
