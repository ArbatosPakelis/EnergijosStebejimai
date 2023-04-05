import DataTable from "../components/dataTable";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import reportApi from "../Apis/reportApi";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";

export default function AccommondationForm() {

    return (
        <div>
            <Header />
            <Container>
                <Typography className="page-title" sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
                    Patalpos forma
                </Typography>
                <Box sx={{ pl: 3 }}>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3 }}>
                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="pavadinimas" name="pavadinimas" label="Pavadinimas" variant="outlined" type="text" /><br />

                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="atsakingo_asmens_vardas" name="atsakingo_asmens_vardas" label="Atsakingo asmens vardas" variant="outlined" type="text" /><br />

                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="atsakingo_asmens_pavarde" name="atsakingo_asmens_pavarde" label="Atsakingo asmens pavardė" variant="outlined" type="text" /><br />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3 }}>
                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="atsakingo_asmens_kontaktas" name="atsakingo_asmens_kontaktas" label="Atsakingo asmens kontaktas" variant="outlined" type="text" /><br />

                        <TextField sx={{ py: 5 }} id="kompiuteriu_kiekis" name="kompiuteriu_kiekis" label="Kompiuterių kiekis" variant="outlined" type="number" /><br />

                        <TextField sx={{ py: 5 }} id="energijos_riba_per_zmogu" name="energijos_riba_per_zmogu" label="Energijos riba per žmogų" variant="outlined" type="number" /><br />
                    </Box>

                    <Button style={{ background: "#1DA1F2", color: "white" }}>Pateikti</Button>
                </Box>
            </Container>
        </div>
    );
}