import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, Grid } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';
import ApplicationCardRegisterLocationUKS from './ApplicationCardRegisterLocationUKS';

// ----------------------------------------------------------------------


export default function ApplicationAvailableRegistrationLocationUKS(props) {

  const {applications=[]} = props  

  return (
    <Card>
      <Grid container spacing={3} style={{padding:16}}>
        {
          applications.map(app=>(
            <Grid key={app.id} item xs={6} md={4} lg={3}>
              <ApplicationCardRegisterLocationUKS application={app}/>
            </Grid>
          ))
        }
      </Grid>
    </Card>
  );
}
