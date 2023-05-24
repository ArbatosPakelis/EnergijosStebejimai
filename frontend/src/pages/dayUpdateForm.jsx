import { Box, TextField, Button, Typography, Container } from "@mui/material";
import Header from "../components/header";
import { useParams } from "react-router-dom";
import dayApi from "../Apis/dayApi";
import axios from "axios";
import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

export default function DayUpdateForm() {

  const { id } = useParams();
  const [data, setData] = useState(null);
  //const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const dApi = new dayApi();
        const response = await dApi.get(id);
        setData(response.data);
      } catch (err) {
        console.log(err.response.data.message)
        setData(null);
      }
    };
    getData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dayData = ({
      id: id,
      savaites_diena: data.get('savaites_diena'),
      dienos_nr: getDayNumber(data.get('savaites_diena'))
    });
    console.log(dayData);
    axios.post(`http://127.0.0.1:5000/updateDay`, dayData).then(response => {
      // console.log(response);
      if (response.status == 201) {
        window.alert("Diena redaguota");
      }
    }).catch(error => alert(error.response.statusText));
  };

  const getDayNumber = (weekDay) =>
{
  switch (weekDay) {
    case 'Pirmadienis':
      return 2;
    case 'Antradienis':
      return 3;
    case 'Trečiadienis':
      return 4;
    case 'Ketvirtadienis':
      return 5;
    case 'Penktadienis':
      return 6;
    case 'Šeštadienis':
      return 7;
    case 'Sekmadienis':
      return 1;
    default:
      return -1;
  }
}

  return (
    <div>
      <Header />

      <Typography sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
        Dienos forma
      </Typography>
      <Container component="main" maxWidth="xs">
        {data === null || data.length === 0 ? (
          <Typography sx={{ textAlign: "center" }}>Wow, so empty!</Typography>
        ) : (
          <Box
            component="form"
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onSubmit={handleSubmit}
          >
            <TextField required fullWidth id="savaites_diena" name="savaites_diena" label="Savaites diena:" variant="outlined" type="text" defaultValue={data[0].savaites_diena} /><br />

            <Button type="submit">Pateikti</Button>
          </Box>
        )}
      </Container>
    </div>
  );
}