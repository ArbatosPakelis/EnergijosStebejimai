import React from 'react';
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import axios from "axios";

export default function WarningTable({ data }) {
    function seenButtonHandle(id) {
        if (window.confirm("Ar norite pažymėti įspėjimą kaip matyta?")) {
            warningSeen(id);
        }
        
    }

    async function warningSeen(warningId) {
        const warningData = ({
            id: warningId,
        });
        axios.post(`http://127.0.0.1:5000/warningSeen`, warningData).then(response => {
            // console.log(response);
            if (response.status == 201) {
                window.location.reload();
            }
        }).catch(error => alert(error.response.statusText));

    }

    function checking(seen) {
        if (seen === 0) {
            return "Ne";
        }
        else return "Taip"
    }

    function convert(laikas) {
        const originalDate = new Date(laikas);
        const formattedDate = originalDate.toLocaleString('fr-FR', {
            timeZone: 'Europe/Istanbul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
        return formattedDate
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography sx={{ textAlign: "center" }}>Peržiūrėti įspėjimai</Typography>
            {data === null || data.length === 0 ? (
                <Typography sx={{ textAlign: "center" }}>Nėra peržiūrėtų įspėjimų</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Įspėjimo laikas
                            </TableCell>
                            <TableCell>
                                Energijos kiekis
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {convert(row.data)}
                                </TableCell>
                                <TableCell>
                                    {row.galios_virsyjimas}
                                </TableCell>                     
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    )
}