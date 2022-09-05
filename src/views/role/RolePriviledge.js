import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardHeader,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Button,
  Grid,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { MButton } from '../../components/@material-extend';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import RoleListHead from './RoleListHead';
import Conditional from '../../components/Conditional';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import Protected from 'src/components/Protected';

// ----------------------------------------------------------------------

export default function RolePriviledge(props) {
  const { row, submitSuccess, submitError } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [applicationOptions, setapplicationOptions] = useState([]);
  const [menuOptions, setmenuOptions] = useState([]);
  const [actionOptions, setactionOptions] = useState([]);
  const [state, setstate] = useState({
    applications:[],
    menus:[],
    actions:[]
  });
  const [selectedApplication, setselectedApplication] = useState(null);
  const [selectedMenu, setselectedMenu] = useState(null);
  const [selectedAction, setselectedAction] = useState(null);
  const [openDialog, setopenDialog] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('');

  
  const getDetail = async(row) => {
    const response = await axios.get(endpoint.role.detail.replace('id',row.id));        
    if (response && response.data) {
      setstate(response.data);
    }
  };
  
  const getapplicationOptions = async () => {
    const response = await axios.get(endpoint.application.option);        
    if (response && response.data) {
      setapplicationOptions(response.data);
    }
  };

  const getmenuOptions = async (application) => {
    const params  = {
      application_id:application?application.id:undefined
    }
    const response = await axios.get(endpoint.menu.option, {params:params});
    if (response && response.data) {
      setmenuOptions(response.data);
    }
  };

  const getactionOptions = async (menu) => {
    const params  = {
      menu_id:menu?menu.id:undefined
    }

    const response = await axios.get(endpoint.action.option, {params:params});
    if (response && response.data) {
      setactionOptions(response.data);
    }
  };

  const selectApplication = (application) => {
    setselectedApplication(application)
    getmenuOptions(application)
  };

  const selectMenu = (menu) => {
    setselectedMenu(menu)
    getactionOptions(menu)
  };

  const selectAction = (action) => {
    setselectedAction(action)
  };

  const toggleApplication = (application, event) => {
    let newApplications = state.applications
    if(event.target.checked){
      newApplications = [...newApplications,application]
    }else{
      newApplications = newApplications.filter(item=>item.id != application.id)
    }
    setstate({...state, applications:newApplications})
  };

  const toggleMenu = (menu, event) => {
    let newMenus = state.menus
    if(event.target.checked){
      newMenus = [...newMenus,menu]
    }else{
      newMenus = newMenus.filter(item=>item.id != menu.id)
    }
    setstate({...state, menus:newMenus})
  };

  const toggleAction = (action, event) => {
    let newActions = state.actions
    if(event.target.checked){
      newActions = [...newActions,action]
    }else{
      newActions = newActions.filter(item=>item.id != action.id)
    }
    setstate({...state, actions:newActions})
  };


  const handleClose = () => {
    setopenDialog(false);
  };

  const isIncluded=(list, item, property)=>{
    if(list.filter(obj => obj[property] === item[property])[0]){
      return true
    }
    return false
  }

  const submit = async()=>{
    let params = {
      role_id:state.id,
      applications:state.applications.map(app=>app.id),
      menus:state.menus.map(menu=>menu.id),
      actions:state.actions.map(action=>action.id)
    };
    await axios.put(endpoint.role.priviledge, params);
    setisSubmitting(false);
    submitSuccess('saving data success');
    getDetail(state.id); 
  }


  
  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getapplicationOptions();
      getDetail(row)
    }
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end">
            
          </Grid>
        </Grid>

        
          <Grid container justifyContent="center">
            <Grid item xs={4} container justifyContent="center" style={{padding:8, width:'100%'}}>
              <Card style={{width:'100%'}}>
                <CardHeader title="Application"/>
                <List>
                  {applicationOptions.map((application) => {
                    const labelId = `checkbox-list-label-${application.id}`;

                    return (
                      <ListItem 
                      key={application.id} 
                      role={undefined} 
                      dense 
                      button 
                      onClick={()=>selectApplication(application)}
                      selected={selectedApplication && application.id===selectedApplication.id}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={isIncluded(state.applications,application,'id')}
                            onChange={(e) => toggleApplication( application, e)}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={application.id} primary={application.name} />
                      </ListItem>
                    );
                  })}
                </List>
              </Card>
            </Grid>
            <Grid item xs={4} container justifyContent="center" style={{padding:8, width:'100%'}}>
              <Card style={{width:'100%'}}>
              <CardHeader title="Menu"/>
              <List>
                {menuOptions.map((menu) => {
                  const labelId = `checkbox-list-label-${menu.id}`;

                  return (
                    <ListItem 
                    key={menu.id} 
                    role={undefined} 
                    dense 
                    button 
                    onClick={()=>selectMenu(menu)}
                    selected={selectedMenu && menu.id===selectedMenu.id}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isIncluded(state.menus,menu,'id')}
                          onChange={(e) => toggleMenu( menu, e)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={menu.id} primary={menu.name} />
                    </ListItem>
                  );
                })}
              </List>
              </Card>
            </Grid>

            <Grid item xs={4} container justifyContent="center" style={{padding:8, width:'100%'}}>
              <Card style={{width:'100%'}}>
              <CardHeader title="Action"/>
              <List>
                {actionOptions.map((action) => {
                  const labelId = `checkbox-list-label-${action.id}`;

                  return (
                    <ListItem key={action.id} role={undefined} dense button onClick={()=>selectAction(action)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isIncluded(state.actions,action,'id')}
                          onChange={(e) => toggleAction( action, e)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={action.id} primary={action.name} />
                    </ListItem>
                  );
                })}
              </List>
              </Card>
            </Grid>
          </Grid>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            margin: '16px 0'
          }}
        >
            <Conditional condition={actionCode === 'READ'}>
              <Protected  allowedCodes={['EDIT']} >
                  <Button onClick={() => setactionCode('EDIT')}>edit</Button>
              </Protected>
            </Conditional>
            <Conditional condition={actionCode !== 'READ'}>
              <Protected allowedCodes={['EDIT','CREATE']} >
                <LoadingButton
                  onClick={submit}
                  variant="contained"
                  pending={isSubmitting}
                >
                  Save
                </LoadingButton>
              </Protected>
            </Conditional>
        </Box>
      </Container>
      <Dialog
        open={openDialog}
        maxWidth={maxWidth}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        <DialogTitle>Title</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
