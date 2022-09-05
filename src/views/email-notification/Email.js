import { Icon } from "@iconify/react";
import { capitalCase } from "change-case";
import { useState, useEffect } from "react";
import bellFill from "@iconify/icons-eva/bell-fill";
import shareFill from "@iconify/icons-eva/share-fill";
import emailOutline from "@iconify/icons-eva/email-outline";
import { useDispatch, useSelector } from "react-redux";
import roundVpnKey from "@iconify/icons-ic/round-vpn-key";
import roundReceipt from "@iconify/icons-ic/round-receipt";
import roundAccountBox from "@iconify/icons-ic/round-account-box";
// material
import { Container, Typography, Tab, Box, Tabs } from "@material-ui/core";

// redux
import {
  getCards,
  getProfile,
  getInvoices,
  getAddressBook,
  getNotifications,
} from "../../redux/slices/user";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
import Page from "../../components/Page";
// components

import EmailStudent from "./EmailStudent";

import EmailEmployee from "./EmailEmployee";

// ----------------------------------------------------------------------

export default function Email(props) {
  const [currentTab, setCurrentTab] = useState("Email Student");

  let TABS = [
    {
      value: "Email Student",
      component: <EmailStudent />,
      icon: <Icon icon={emailOutline} width={20} height={20} />,
    },
    {
      value: "Email Employee",
      component: <EmailEmployee />,
      icon: <Icon icon={emailOutline} width={20} height={20} />,
    },
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="Email Notification">
      <Typography gutterBottom variant="h4" component="h6">
        Email Notification
      </Typography>
      <Container>
        <Box
          sx={{
            paddingBottom: 2,
          }}
        >
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {TABS.map((tab) => (
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
    </Page>
  );
}
