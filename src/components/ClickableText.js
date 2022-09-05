// material
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function ClickableText({ text, onClick, sx, ...other }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Typography
      variant="body"
      noWrap
      sx={{ color: theme.palette.info.main }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {text}
    </Typography>
  );
}
