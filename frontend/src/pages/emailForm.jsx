import * as React from 'react';
import { useEffect, useState } from "react";
import Header from "../components/header";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import emailApi from '../Apis/emailApi';

export default function EmailForm() {

  const navigate = useNavigate();
  const [email, setEmail] = useState(''); 

  useEffect(() => {
    const getCurrentEmail = async () => {
        try {
            const api = new emailApi();
            const response = await api.get();
            setEmail(response.data)
        } catch (err) {
            console.log(err.response.data.message)
            setEmail('');
        }
    };
    getCurrentEmail();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateEmail(email);
  };

  async function updateEmail(emailAddr){
    try{
        const api = new emailApi();
        const response = await api.upateEmail(emailAddr)
        if (response.status === 200)
        {
            window.alert('el. pašto adresas pakeistas');
            navigate(-1)
        }
    } catch (error){
        console.error(error);
        window.alert('el. pašto pakeisti nepavyko');
    }
}

  return (
    <div>
        <Header/>

        <Container component="main" maxWidth="xs">
        <Typography className="page-title" sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
            Pranešimų el. pašto keitimas
        </Typography>
            <Box
              sx={{alignItems: 'center'}}
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                            name="emailId"
                            required
                            fullWidth
                            id="emailId"
                            label="elektroninio pašto adresas"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            >
                            </TextField>
                        </Grid>
                        
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Keisti
                    </Button>
                </Box>
            </Box>
        </Container>
    </div>
);
}