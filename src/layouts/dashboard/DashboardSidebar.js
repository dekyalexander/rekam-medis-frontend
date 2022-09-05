import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, matchPath } from 'react-router-dom';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Link,
  List,
  Button,
  Drawer,
  Hidden,
  Typography,
  ListSubheader
} from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD, mode, folderName } from '../../routes/paths';
// components
import Logo from '../../components/Logo';
import MyAvatar from '../../components/MyAvatar';
import Scrollbar from '../../components/Scrollbar';
//
import SidebarItem from './SidebarItem';
import {useHistory} from 'react-router-dom'
import useUi from 'src/hooks/useUi';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  margin: theme.spacing(1, 2.5, 5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

// ----------------------------------------------------------------------


DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const { user, menus=[], actions=[], application={} } = useAuth();

  const history = useHistory()
  const {isLoading, activeMenu={}, setActiveMenu, setMenuActions } = useUi()
  const [expandedMenuId, setexpandedMenuId] = useState(null)

  const navigateToMenu = (menu) =>{    
    if(menu.parent_id!==expandedMenuId){
      setexpandedMenuId(null) 
    }
    setActiveMenu(menu)
    setMenuActions(actions.filter(action=>action.menu_id===menu.id));
    const url = mode==='LOCAL'?menu.path:`/${folderName}${menu.path}`
    history.push(url)
  }

  const toggleParentMenu = (menu) =>{
    if(expandedMenuId){
      if(expandedMenuId===menu.id){
        setexpandedMenuId(null)  
      }else{
        setexpandedMenuId(menu.id)  
      }
    }else{
      setexpandedMenuId(menu.id)
    }
    
  }

  const menuClick=(menu)=>{
    if(menu.children && menu.children.length>0){
      toggleParentMenu(menu)
    }else{
      navigateToMenu(menu)
    }
  }

  useEffect(() => {
    if(menus){
      const route = window.location.pathname;
      const filteredMenus = menus.filter(menu=>menu.path===route)
      if(filteredMenus[0]){
        const Activemenu = filteredMenus[0]
        setActiveMenu(Activemenu)
        setMenuActions(actions.filter(action=>action.menu_id===Activemenu.id));
      }      
    }       
  }, [menus]);

  useEffect(() => {
    if (isOpenSidebar && onCloseSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar>
      <Link
        underline="none"
        component={RouterLink}
        to={PATH_DASHBOARD.user.account}
      >
        <AccountStyle>
          <Box sx={{ ml: 2 }} display="flex" justifyContent="center" >
            <Typography variant="h5" textAlign="center">              
                {application.name}
            </Typography>
          </Box>
        </AccountStyle>
      </Link>

      <List disablePadding>
          {
            menus.filter(menu=>
              (
                menu.application_id===application.id)&&(!menu.parent_id)              
              ).map(menu=>(
              <SidebarItem 
              key={menu.id}
              expandedMenuId={expandedMenuId} 
              menu={menu} 
              activeMenu={activeMenu} 
              menuClick={menuClick}/>
            ))
          }
      </List>
      
    </Scrollbar>
  );

  return (
    <RootStyle>
      <Hidden lgUp>
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: { width: DRAWER_WIDTH, bgcolor: 'background.default' }
          }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
    </RootStyle>
  );
}
