// material
import { useState } from "react";
import { Box, Grid, Container, Typography, Button, Dialog } from '@material-ui/core';
// components
import Page from '../../components/Page';
import useAuth from 'src/hooks/useAuth';
import Mchip from 'src/components/@material-extend/MChip';
import ChangePasswordForm from './ChangePasswordForm';

// ----------------------------------------------------------------------

export default function Profile(props) {
  const { user={}, roles=[] } = useAuth();
  const [openDialog, setopenDialog] = useState(false);
  const [maxWidth, setMaxWidth] = useState('sm');
  
  const showChangePassword=()=>{
    setopenDialog(true)
  }

  const handleClose = () => {
    setopenDialog(false);
  };

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Profile</Typography>
        </Box>
        <Grid container>
          <Grid item xs={2} container>
            Name 
          </Grid>
          <Grid item xs={1} container>
          :
          </Grid>
          <Grid item xs={9} container>
            {user.name}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} container>
            Username 
          </Grid>
          <Grid item xs={1} container>
          :
          </Grid>
          <Grid item xs={9} container>
          {user.username}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} container>
            Role
          </Grid>
          <Grid item xs={1} container>
          :
          </Grid>
          <Grid item xs={9} container>
            {
              roles.map(role=>(
                <Mchip
                  key={role.id}
                  variant="filled"
                  label={role.name}
                  color="info"
                  style={{marginRight:8}}
                />
              ))
            }
          </Grid>
        </Grid>
        
        <Grid container>
          <Grid item xs={2} container>
            <Button variant="contained" onClick={showChangePassword} color="primary">
              Change Password
            </Button>
          </Grid>          
        </Grid>
      </Container>

      <Dialog
        open={openDialog}
        maxWidth={maxWidth}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        <ChangePasswordForm closeSubDialog={handleClose}/>
      </Dialog>
    </Page>
  );
}
