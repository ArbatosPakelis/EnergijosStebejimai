import Header from "../components/header";
import React, { useRef } from 'react';
import { useEffect, useState } from "react";
import { Button, Typography, ButtonGroup } from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import accommodationApi from "../Apis/accommodationApi";
import graphApi from "../Apis/graphApi";
import Graph from "../components/graph";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from "@mui/material/Box";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { Container } from "@mui/system";
import DevicesTable from "../components/accommodationDevicesTable";
import WarningTable from "../components/accommodationWarningTable";
import axios from "axios";

export default function Accommondation() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [time, setTime] = useState(null);
    const [occupiedTimes, setOccupiedTimes] = useState(null);
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();
    const chartRef = useRef();
    const [disabledPower, setDisabledPower] = React.useState(true);
    const [disabledUsage, setDisabledUsage] = React.useState(false);
      

    let dayTemp = 0;

    useEffect(() => {
        const getData = async () => {
            try {
                const repApi = new accommodationApi();
                const response = await repApi.getAccommendation(id);
                const response1 = await repApi.getAllDevices(id);
                const response2 = await repApi.getAllWarnings(id);
                const response3 = await repApi.getAllTime();
                const response4 = await repApi.getAccommodationTimes(id);
                setData(response.data);
                setData1(response1.data);
                setData2(response2.data);
                setTime(response3.data);
                setOccupiedTimes(response4.data);
            } catch (err) {
                console.log(err.response.data.message)
                setData(null);
            }
        };

        const getEntries = async () => {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const day = today.getDate().toString().padStart(2, '0');
                const todayString = `${year}-${month}-${day}`;
                const grphApi = new graphApi();
                const response = await grphApi.getHourGraph(id, todayString);
                setEntries(response.data);
                console.log(todayString)
            } catch (err) {
                console.log(err.response.data.message)
                setEntries(null);
            }
        };

        getData();
        getEntries();
    }, []);

    function checking(uz_laikas, diena, extension) {
        var hold = occupiedTimes.filter(x => x.id_uzimtumo_laikas === uz_laikas && x.savaites_diena === diena)
        if (hold !== undefined && hold !== null && hold.length !== 0) {
            // var tag = (uz_laikas-1).toString()+ extension
            // console.log(tag)
            // document.getElementById(tag).style.backroundColor = "#1DA1F2";
            return (
                <>
                    Užimta 
                    <Link sx={{ ml: 2, pl: 5 }} to={`/times/${uz_laikas}`}>
                        »
                    </Link>   
                </>
            );
        }
    }

    function checkingPersonalDevices(check) {
        if (check === 0) {
            return "Ne";
        }
        else return "Taip"
    }
    

    function emptyDays() {
        let days = [];
        if (occupiedTimes) {
            occupiedTimes.forEach(time => {
                if (days[time.savaites_diena] != null) {
                    days[time.savaites_diena]++;
                } else {
                    days[time.savaites_diena] = 0;
                }
            });
        }
        return days;
    }

    function deleteButtonHandle(id) {
        if (window.confirm("Ar tikrai norite ištrinti patalpą?")) {
            deleteAccommodation(id);
        }
    }

    async function deleteAccommodation(accommodationId) {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/accommodations/${accommodationId}`);
            if (response.status === 204) {
                window.alert("Patalpa pašalinta");
                navigate(`/accommodation`);
            }
        } catch (error) {
            console.error(error);
            window.alert('Nepavyko pašalinti prietaiso');
        }
    }

    function graphDataButtonHandle(dataTitle) {
        if (dataTitle === "Power") {
            setDisabledPower(true);
            setDisabledUsage(false);
            chartRef.current.updateData(entries, 'Diena', "Power");

        } else if (dataTitle === "Usage") {
            setDisabledPower(false);
            setDisabledUsage(true);
            chartRef.current.updateData(entries, 'Diena', "Usage");
        }
    }

    let occupiedDays = emptyDays();

    return (
        <div>
            <Header />
            <Container>
                <Typography className="page-title" sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
                    Patalpa
                </Typography>
                {data === null || data.length === 0 ? (
                    <Typography sx={{ textAlign: "center" }}>Wow, so empty!</Typography>
                ) : (
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3 }}>
                        {/* {console.log(data)} */}
                        <List>
                            <ListItem>Pavadinimas</ListItem>
                            <ListItem>Atsakingas asmuo</ListItem>
                            <ListItem>Atsakingo asmens kontaktas</ListItem>
                            <ListItem>Kompiuterių kiekis</ListItem>
                            <ListItem>Energijos riba per žmogų</ListItem>
                            <ListItem>Min. energija nuo kurios siųsti įpėjimą</ListItem>
                            <ListItem>Ar bus asmeninių kompiuterių?</ListItem>
                            <ListItem><Button sx={{ mr: 1 }} style={{ background: "#1DA1F2", color: "white" }} onClick={() => navigate(`update`)}>
                                Redaguoti
                            </Button>
                                <Button style={{ background: "crimson", color: "white" }} onClick={() => deleteButtonHandle(data[0].id)}>
                                    Ištrinti patalpą
                                </Button>
                            </ListItem>
                            <ListItem><Button style={{ background: "#1DA1F2", color: "white" }} onClick={() => navigate(`sensors`)}>
                                Sensoriai
                            </Button>
                            </ListItem>
                            <ListItem><Button style={{ background: "#1DA1F2", color: "white" }} onClick={() => navigate(`schedule`)}>
                                Patalpos tvarkaraštis
                            </Button>
                            </ListItem>
                        </List>
                        <List>
                            <ListItem>{data[0].pavadinimas}</ListItem>
                            <ListItem>{data[0].atsakingo_asmens_vardas} {data[0].atsakingo_asmens_pavarde}</ListItem>
                            <ListItem>{data[0].atsakingo_asmens_kontaktas}</ListItem>
                            <ListItem>{data[0].kompiuteriu_kiekis}</ListItem>
                            <ListItem>{data[0].energijos_riba_per_zmogu}</ListItem>
                            <ListItem>{data[0].min_energija_ispejimui}</ListItem>
                            <ListItem>{checkingPersonalDevices(data[0].asmeniniai_prietaisai)}</ListItem>
                        </List>
                    </Box>)}
                <Typography sx={{ textAlign: "center" }}>Šiandienos momentinių enegijos sąnaudų diagrama</Typography>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button disabled={disabledPower} onClick={() => graphDataButtonHandle("Power")}>Galia</Button>
                    <Button disabled={disabledUsage} onClick={() => graphDataButtonHandle("Usage")}>Sąnaudos</Button>
                </ButtonGroup>
                <Graph ref={chartRef} data={entries} scale={"Valanda"} />

                {/* <DevicesTable data1={data1} navigate={navigate} setData1={setData1} /> */}
                
                <WarningTable data={data2}/>

                <Box sx={{ flexGrow: 1, p: 3 }}>

                    <Box sx={{ mb: 1 }} display="flex" justifyContent="flex-end" >
                        <Button style={{ background: "#1DA1F2", color: "white" }}
                            onClick={() => navigate(`weeks`)}>Savaitės pasirinkimas</Button>
                    </Box>

                    {data1 === null || data1.length === 0 ? (
                        <Typography sx={{ textAlign: "center" }}>Wow, so empty!</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell sx={occupiedDays['Pirmadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }}>
                                        Pirmadienis
                                    </TableCell>
                                    <TableCell sx={occupiedDays['Antradienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }}>
                                        Antradienis
                                    </TableCell>
                                    <TableCell sx={occupiedDays['Trečiadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }}>
                                        Trečiadienis
                                    </TableCell>
                                    <TableCell sx={occupiedDays['Ketvirtadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }}>
                                        Ketvirtadienis
                                    </TableCell>
                                    <TableCell sx={occupiedDays['Penktadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }}>
                                        Penktadienis
                                    </TableCell>
                                    <TableCell sx={occupiedDays['Šeštadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }}>
                                        Šeštadienis
                                    </TableCell>
                                    <TableCell sx={occupiedDays['Sekmadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }}>
                                        Sekmadienis
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {time.map((row, index) => {
                                    return (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.pradzia} - {row.pabaiga}
                                            </TableCell>
                                            <TableCell sx={occupiedDays['Pirmadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }} id={index + "t1"}>
                                                {(checking(index + 1, 'Pirmadienis', "t1"))}
                                            </TableCell>
                                            <TableCell sx={occupiedDays['Antradienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }} id={index + "t2"}>
                                                {checking(index + 1, 'Antradienis', "t2")}
                                            </TableCell>
                                            <TableCell sx={occupiedDays['Trečiadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }} id={index + "t3"}>
                                                {checking(index + 1, 'Trečiadienis', "t3")}
                                            </TableCell>
                                            <TableCell sx={occupiedDays['Ketvirtadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }} id={index + "t4"}>
                                                {checking(index + 1, 'Ketvirtadienis', "t4")}
                                            </TableCell>
                                            <TableCell sx={occupiedDays['Penktadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }} id={index + "t5"}>
                                                {checking(index + 1, 'Penktadienis', "t5")}
                                            </TableCell>
                                            <TableCell sx={occupiedDays['Šeštadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }} id={index + "t6"}>
                                                {checking(index + 1, 'Šeštadienis', "t6")}
                                            </TableCell>
                                            <TableCell sx={occupiedDays['Sekmadienis'] > 0 ? undefined : { background: "rgba(0, 0, 0, 0.08)", border: "none" }} id={index + "t7"}>
                                                {checking(index + 1, 'Sekmadienis', "t7")}
                                            </TableCell>
                                        </TableRow>
                                    )

                                })}
                            </TableBody>
                        </Table>
                    )}
                </Box>
            </Container>
        </div>
    );
}