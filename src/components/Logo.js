// material
import { Box } from "@material-ui/core";

// ----------------------------------------------------------------------

export default function Logo({ ...other }) {
  return (
    <Box
      component="img"
      alt="logo"
      src={`${process.env.PUBLIC_URL}/static/brand/pahoa.png`}
      height={60}
      {...other}
    />
  );
}
