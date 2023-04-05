import Header from "../components/header";
import weekApi from "../Apis/weekApi";
import accommodationApi from "../Apis/accommodationApi";
import { useEffect, useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";

export default function WeekForm() {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const repApi = new accommodationApi();
                const response = await repApi.getAllAccommendation();
                setRooms(response.data);
            } catch (err) {
                // console.log(err)
                setRooms(null);
            }
        };
        getData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const weekData = ({
            weekId: data.get('weekId'),
            isActive: data.get('isActive'),
            room: data.get('roomId')
        });
        //   console.log(weekData);
        testas(weekData);
    };

    // const postWeek = async (data) => {
    //     try {
    //         const api = new weekApi();
    //         const response = await api.postWeek(data);
    //         console.log(response)
    //         window.alert("Savaitė sukurta");
    //     }
    //     catch(err) {
    //         window.alert("Nepavyko sukurti savaitės");
    //     }
    // };

    function testas(data) {

        axios.post("http://127.0.0.1:5000/weeks", {
            weekNumber: data.weekId,
            isActive: data.isActive,
            room: data.room
        }).then(response => {
            // console.log(response);
            if (response.status == 201) {
                window.alert("Savaitė sukurta");
            }
        }).catch(error => alert(error.response.statusText));

    }

    return (
        <div>
            <Header />
            <Container>
                <Typography className="page-title" sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
                    Savaitės forma
                </Typography>

                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="weekId"
                                        required
                                        fullWidth
                                        id="weekId"
                                        label="Savaitės numeris"
                                        type="number"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="isActive"
                                        required
                                        fullWidth
                                        id="isActive"
                                        label="Aktyvi savaitė"
                                        defaultValue="0"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="roomId"
                                        required
                                        fullWidth
                                        id="roomId"
                                        label="Patalpa"
                                        select
                                        defaultValue=""
                                    >
                                        {rooms.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.pavadinimas}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Pridėti
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Container>
        </div>
    );
}