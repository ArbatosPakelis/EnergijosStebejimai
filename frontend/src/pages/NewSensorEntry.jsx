//import { Box, TextField, Button } from "@mui/material";
import { Container } from "@mui/material";
import Header from "../components/header";

export default function SensorForm() {

  return (
    <div>
      <Header />
      <Container>
        <form action="/newSensorEntry" method="POST" enctype="application/x-www-form-urlencoded">

          <label for="sensor_id">Sensor ID:</label>
          <input type="number" id="sensor_id" name="sensor_id"></input><br></br>

          <label for="power">Power:</label>
          <input type="number" id="power" name="power"></input><br></br>

          <label for="useage">Useage:</label>
          <input type="text" id="useage" name="useage"></input><br></br>

          <input type="submit" value="Submit" />
        </form>
      </Container>
      {/* <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        action="/newSensorEntry"
        method="post"
      >
        <TextField id="sensor_id" label="Sensor ID" variant="outlined" type="number" />

        <TextField id="filled-basic" label="Power" variant="outlined" type="number" />
        
        <Button type="submit">Submit</Button>
      </Box> */}
    </div>
  );
}