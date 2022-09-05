import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Grid, Box, Tabs, Tab } from "@material-ui/core";
//
import { BaseOptionChart } from "../../charts";
import ApplicationCard from "./ApplicationCard";
import { useEffect, useState } from "react";
import { capitalCase } from "change-case";
import CategoryDetail from "src/views/dashboard/CategoryDetail";

// ----------------------------------------------------------------------
//app cat 1.

export default function ApplicationsAvailable(props) {
  const { applications = [], cleardata } = props;

  const [currentTab, setCurrentTab] = useState("Semua");
  const [listCategory, setListCategory] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    const arrCat = [
      { value: "Semua", id: 0, component: <CategoryDetail categoryId={0} /> },
    ];
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
    setListCategory(arrCat);
    setCurrentTab(arrCat[0].value);
  }, [applications]);

  return (
    <Card>
      <CardHeader
        title="Applications"
        subheader="application available for you"
      />
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
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Box>
    </Card>
  );
}
