import Header from "../components/header";
import { useEffect, useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import { useParams } from "react-router-dom";
import accommodationApi from "../Apis/accommodationApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";


export default function AccommondationSchedule() {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [data1, setData1] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const repApi = new accommodationApi();
                const response = await repApi.getAccommendation(id);
                const response1 = await repApi.getSchedule(id);
                setData(response.data);
                setData1(response1.data);
            } catch (err) {
                console.log(err.response.data.message)
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
                    Patalpos tvarkaraštis
                </Typography>
                {data1 === null || data1.length === 0 ? (
                    <Typography sx={{ textAlign: "center" }}>Wow, so empty!</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Diena
                                </TableCell>
                                <TableCell>
                                    Laikas nuo
                                </TableCell>
                                <TableCell>
                                    Laikas iki
                                </TableCell>
                                <TableCell>
                                    Asmenų skaičius
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data1.map((row) => (
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        {row.savaites_diena}
                                    </TableCell>
                                    <TableCell>
                                        {row.pradzia}
                                    </TableCell>
                                    <TableCell>
                                        {row.pabaiga}
                                    </TableCell>
                                    <TableCell>
                                        {row.asmenu_kiekis}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Container>
        </div>
    );
}