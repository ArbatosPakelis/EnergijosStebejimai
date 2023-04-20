import DataTable from "../components/weeksTable";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import weekApi from "../Apis/weekApi";
import Header from "../components/header";

export default function Weeks() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
          try {
            const repApi = new weekApi();
            const response = await repApi.getWeekSchedule();
            setData(response.data);
          } catch (err) {
            setData(null);
          }
        };
        getData();
      }, []);

    return (
        <div>
            <Header/>
            <Typography sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl:2 }}>
                Savaitės laikų peržiūra
            </Typography>
            <DataTable data={data}/>
        </div>
    );
  }