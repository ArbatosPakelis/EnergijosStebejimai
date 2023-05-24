// import { useEffect, useState } from "react";
// import dayApi from "../Apis/dayApi";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Header from "../components/header";

export default function TimeForm() {

  // const [data, setData] = useState('');

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const dApi = new dayApi();
  //       const response = await dApi.getAll();
  //       setData(response.data);
  //       console.log(response.data);
  //     } catch (err) {
  //       setData(null);
  //     }
  //   };
  //   getData();
  // }, []);

  return (
    <div>
      <Header />
      <Container>
        <Typography className="page-title" sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
          Laiko forma
        </Typography>
        <Container component="main" maxWidth="xs">
          <Box
            component="form"
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            noValidate
            autoComplete="off"
            action="/newTime"
            method="post"
          >
            <TextField required fullWidth InputLabelProps={{ shrink: true }} id="pradzia" name="pradzia" label="Pradzia:" variant="outlined" type="time" /><br />

            <TextField required fullWidth InputLabelProps={{ shrink: true }} id="pabaiga" name="pabaiga" label="Pabaiga:" variant="outlined" type="time" /><br />

            <TextField required fullWidth id="asmenu_kiekis" name="asmenu_kiekis" label="Asmenu kiekis:" variant="outlined" type="number" /><br />

            {/* <InputLabel id="demo-simple-select-label">Day</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Day"
          name="Diena"
        >
          {data.map((row) => (
            <MenuItem value={row.id}>
              {row.savaites_diena}
            </MenuItem>
          ))}
        </Select><br/>  */}

            <Button type="submit">Pateikti</Button>
          </Box>
        </Container>
      </Container>
    </div>
  );
}