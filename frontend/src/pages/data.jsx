import DataTable from "../components/dataTable";
import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import reportApi from "../Apis/reportApi";
import Header from "../components/header";

export default function Data() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const repApi = new reportApi();
        const response = await repApi.getAll();
        setData(response.data);
      } catch (err) {
        setData(null);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <Header />
      <Container>
        <Typography className="page-title" sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
          Data table
        </Typography>
        <DataTable data={data} />
      </Container>
    </div>
  );
}