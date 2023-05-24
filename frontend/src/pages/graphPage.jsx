import { useEffect, useState } from "react";
import graphApi from "../Apis/graphApi";
import accommodationApi from "../Apis/accommodationApi";
import Graph from "../components/graph";
import Header from "../components/header";
import { Typography, Box, Container, TextField, Button, MenuItem, Grid } from "@mui/material";
import React, { useRef } from 'react';


export default function GraphPage() {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const timeTypes = ['Metai', 'Menuo', 'Diena'];
  const dataTypes = ["Galia", "Sanaudos"];
  const chartRef = useRef();

  useEffect(() => {
    const getData = async () => {
      try {
        const grphApi = new graphApi();
        const response = await grphApi.getHourGraph("1", "2023-3-18");
        setData(response.data);
      } catch (err) {
        console.log(err.response.data.message)
        setData(null);
      }
    };

    const getAccomodations = async () => {
      try {
        const accmApi = new accommodationApi();
        const response1 = await accmApi.getAllAccommendation();
        setData1(response1.data);
      } catch (err) {
        console.log(err.response.data.message)
        setData1(null);
      }
    };

    getData();
    getAccomodations();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const dataType = data.get('dataType');
    const timeType = data.get('timeType');
    const accom = data.get('accomodation');
    const date = data.get('date');

    console.log(timeType);
    console.log(dataType);
    console.log(date);
    console.log(accom);

    getEntriesByDate(date, accom, timeType, dataType);
  };



  async function getEntriesByDate(date, accom, timeType, dataType) {
    const grphApi = new graphApi();
    let response;
    if (timeType === 'Metai') {
      response = await grphApi.getMonthGraph(accom, date);
      if (dataType === "Galia") {
        chartRef.current.updateData(response.data, 'Mėnuo', "Power");
      } 
      else if (dataType === "Sanaudos") {
        chartRef.current.updateData(response.data, 'Mėnuo', "Usage");
      }
    }
    else if (timeType === 'Menuo') {
      response = await grphApi.getDayGraph(accom, date);
      if (dataType === "Galia") {
        chartRef.current.updateData(response.data, 'Diena', "Power");
      } 
      else if (dataType === "Sanaudos") {
        chartRef.current.updateData(response.data, 'Diena', "Usage");
      }
    }
    else if (timeType === 'Diena') {
      response = await grphApi.getHourGraph(accom, date);
      if (dataType === "Galia") {
        chartRef.current.updateData(response.data, 'Valanda', "Power");
      } 
      else if (dataType === "Sanaudos") {
        chartRef.current.updateData(response.data, 'Valanda', "Usage");
      }
    }
    //console.log(response.data);

  }

  return (
    <div>
      <Header />
      <Container>
        <Typography className="page-title" sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
          Duomenų diagrama
        </Typography>
        {/* <TextField sx={{ py: 5 }} id="test" name="test" label="test:" variant="outlined" type="date" /><br /> */}
        <Typography sx={{ textAlign: "center", my: 4 }}>Vidutinė momentinė galia pasirinktu laiko intervalu</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="dataType"
                required
                fullWidth
                id="dataType"
                label="Informaijos tipas"
                select
                defaultValue=""
              >
                {dataTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="timeType"
                required
                fullWidth
                id="timeType"
                label="Grafo tipas"
                select
                defaultValue=""
              >
                {timeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="accomodation"
                required
                fullWidth
                id="accomodation"
                label="Patalpa"
                select
                defaultValue=""
              >
                {data1.map((accomodation) => (
                  <MenuItem key={accomodation.id} value={accomodation.id}>
                    {accomodation.pavadinimas + ' ' + accomodation.atsakingo_asmens_pavarde}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth InputLabelProps={{ shrink: true }} id="date" name="date" label="Data:" variant="outlined" type="date" />
            </Grid>
          </Grid>
          <Button type="submit">Submit</Button>
        </Box>

        <Graph ref={chartRef} data={data} scale={"hour"} />

      </Container>
    </div>
  );
}