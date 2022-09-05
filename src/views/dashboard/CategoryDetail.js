import { Grid } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import ApplicationCard from "src/components/general/analytics/ApplicationCard";
import useAuth from "src/hooks/useAuth";

//app cat 2.
export default function CategoryDetail(props) {
  const { categoryId } = props;
  const { applications = [] } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    let arr = [];
    if (categoryId !== 0) {
      applications.map((app) => {
        let category = app.category_app.filter(
          (data) => data.category_id === categoryId
        );
        if (category.length !== 0) {
          arr.push(app);
        }
      });
    } else {
      arr = applications;
    }
    setApps(arr);
  }, [applications]);

  return (
    <Grid container spacing={2} style={{ padding: 16 }}>
      {apps.map((app) => (
        <Grid key={app.id} item xs={6} md={4} lg={3}>
          <ApplicationCard application={app} />
        </Grid>
      ))}
    </Grid>
  );
}
