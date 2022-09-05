// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@material-ui/core";
import { capitalCase } from "change-case";
// components
import Page from "../../components/Page";
import ApplicationsAvailable from "../../components/general/analytics/ApplicationsAvailable";
import useAuth from "src/hooks/useAuth";
import { useEffect, useState } from "react";
import CategoryDetail from "./CategoryDetail";

// ----------------------------------------------------------------------

export default function DashboardContent(props) {
  const { applications = [] } = useAuth();
  const [currentTab, setCurrentTab] = useState();
  const [listCategory, setListCategory] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    const arrCat = [];
    applications.map((val, i) => {
      if (val.category_app.length !== 0) {
        const category = val.category_app;

        category.map((cat) => {
          const getFilter = arrCat.find((data) => data.id === cat.category_id);
          if (!getFilter) {
            let objData = {
              value: cat.category.name,
              id: cat.category.id,
              component: <CategoryDetail categoryId={cat.category.id} />,
            };
            arrCat.push(objData);
          }
        });
      }
    });
    setCurrentTab(arrCat[0].value);
    setListCategory(arrCat);
  }, [applications]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Dashboard</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ m: 2 }}>
                  <Tabs
                    value={currentTab}
                    scrollButtons="auto"
                    variant="scrollable"
                    allowScrollButtonsMobile
                    onChange={handleChangeTab}
                  >
                    {listCategory.map((categoryApp, i) => (
                      <Tab
                        disableRipple
                        key={categoryApp.value}
                        label={capitalCase(categoryApp.value)}
                        icon={categoryApp.icon}
                        value={categoryApp.value}
                      />
                    ))}
                  </Tabs>
                </Box>
                <Box sx={{ m: 2 }}>
                  {listCategory.map((tab) => {
                    const isMatched = tab.value === currentTab;
                    return (
                      isMatched && <Box key={tab.value}>{tab.component}</Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
