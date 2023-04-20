import DataTable from "../components/daysTable";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import dayApi from "../Apis/dayApi";
import Header from "../components/header";

export default function Days() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
          try {
            const repApi = new dayApi();
            const response = await repApi.getDaySchedules();
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
                Dienų laikų peržiūra
            </Typography>
            <DataTable data={data}/>
        </div>
    );
  }