import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import androidFilled from '@iconify/icons-ant-design/android-filled';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Autocomplete, TextField, Button, Stack } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';



// ----------------------------------------------------------------------


const IconWrapperStyle = styled('div')(({ theme }) => ({  
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.dark,
    0
  )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`
}));

// ----------------------------------------------------------------------

export default function ApplicationCardRegistrationLocationUKS(props) {
  const {application={}}=props
  return (
  <Stack direction="row"sx={{ width: 950 }} spacing={2}>
  <Autocomplete
  disablePortal
  id="combo-box-demo"
  options={application.name}
  sx={{ width: 980 }}
  renderInput={(params) => <TextField {...params} label="Pilih Lokasi Tugas" />}
 />
 <Button variant="contained" sx={{ width: 100, bgcolor: 'secondary.main' }}>
 Save
 </Button>
 </Stack>
  );
 }
 