import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import SvgIconStyle from '../../components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import useUi from 'src/hooks/useUi';
import { ExpandLess, ExpandMore } from '@material-ui/icons';  

// ----------------------------------------------------------------------

const ListItemStyle = styled(ListItem)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  '&.isActiveRoot': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
    '&:before': {
      top: 0,
      right: 0,
      width: 3,
      bottom: 0,
      content: "''",
      position: 'absolute',
      backgroundColor: theme.palette.primary.main
    }
  },
  '&.isActiveSub': {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    '& .subIcon:before': {
      transform: 'scale(2)',
      backgroundColor: theme.palette.primary.main
    }
  }
}));

const SubIconStyle = styled('span')(({ theme }) => ({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:before': {
    width: 4,
    height: 4,
    content: "''",
    display: 'block',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.disabled,
    transition: theme.transitions.create('transform')
  }
}));

// ----------------------------------------------------------------------


export default function SidebarItem(props) {
  const {expandedMenuId, menu={}, menuClick, activeMenu={}} = props
  const { actions=[]} = useAuth();
  const { setActiveMenu, setMenuActions } = useUi();

  
    if(menu.children && menu.children.length>0)
    {
      return(
        <>
        <ListItemStyle
          button
          onClick={()=>menuClick(menu)}
          key={menu.id}
          selected={
            (expandedMenuId && menu.id===activeMenu.parent_id)
            }>
          <ListItemIcon> <Icon>{menu.icon}</Icon> </ListItemIcon>
          <ListItemText primary={menu.name} />
          {
            (expandedMenuId===menu.id ? <ExpandLess /> : <ExpandMore />)
          }
        </ListItemStyle>
        <Collapse in={expandedMenuId===menu.id} timeout="auto" unmountOnExit>
          <List style={{paddingLeft:16}}>
          {
            menu.children && menu.children.map(child=>
              (          
                <ListItemStyle
                  button
                  onClick={()=>menuClick(child)}
                  key={child.id}
                  selected={activeMenu.id===child.id}>
                  <ListItemIcon> <Icon>{child.icon}</Icon> </ListItemIcon>
                  <ListItemText 
                  primary={child.name} 
                  />
                </ListItemStyle>          
              )
            )
          }
          </List>
        </Collapse>
        
        </>
      )
    }else{
      return(
      <ListItemStyle
        button
        onClick={()=>menuClick(menu)}
        key={menu.id}
        selected={activeMenu.id===menu.id}>
        <ListItemIcon> <Icon>{menu.icon}</Icon> </ListItemIcon>
        <ListItemText 
        primary={menu.name} 
        />
      </ListItemStyle>
    )
    }

}
