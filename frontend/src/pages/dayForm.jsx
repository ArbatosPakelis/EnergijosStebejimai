import { Box, TextField, Button, Typography, Container } from "@mui/material";
import Header from "../components/header";

export default function DayForm() {

  return (
    <div>
      <Header />

      <Typography sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
        Dienos forma
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
          action="/newDay"
          method="post"
        >
          <TextField required fullWidth id="savaites_diena" name="savaites_diena" label="Savaites diena:" variant="outlined" type="text" /><br />

          <Button type="submit">Submit</Button>
          <Button href="/updateDay/8">Update day id=8</Button>
          {/* <Button href="/getDay/100">Get day id=100</Button>
        <Button href="/deleteDay/100" method="delete">Delete day id=100</Button> */}
        </Box>
      </Container>
    </div>
  );
}