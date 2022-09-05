import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';
import { useDispatch, useSelector } from 'react-redux';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { Container, Tab, Box, Tabs } from '@material-ui/core';

// redux
import {
  getCards,
  getProfile,
  getInvoices,
  getAddressBook,
  getNotifications
} from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components

import ApplicationDetail from './ApplicationDetail';
import ApplicationMenu from './ApplicationMenu';

// ----------------------------------------------------------------------

export default function ApplicationForm(props) {
  const {actionCode} = props
  const [currentTab, setCurrentTab] = useState('detail');

  const TABS = [
    {
      value: 'detail',
      component: <ApplicationDetail {...props} />
    },
    {
      value: 'menu',
      component: <ApplicationMenu {...props} />
    }
  ];

  const getAccountTabs = () =>{
    if(actionCode==="CREATE"){
      return TABS.filter(tab=>tab.value==='detail')
    }else{
      return TABS
    }
  }

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  

  return (
    <Container>
      <Box
        sx={{
          paddingBottom: 2
        }}
      >
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
        >
          {getAccountTabs().map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Box>
    </Container>
  );
}
