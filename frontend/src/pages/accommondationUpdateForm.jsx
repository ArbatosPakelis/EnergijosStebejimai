import Header from "../components/header";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import { useParams } from "react-router-dom";
import accommodationApi from "../Apis/accommodationApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AccommondationUpdateForm() {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const repApi = new accommodationApi();
                const response = await repApi.getAccommendation(id);
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
        const accommondationData = ({
            accommondationId: id,
            pavadinimas: data.get('pavadinimas'),
            atsakingo_asmens_vardas: data.get('atsakingo_asmens_vardas'),
            atsakingo_asmens_pavarde: data.get('atsakingo_asmens_pavarde'),
            atsakingo_asmens_kontaktas: data.get('atsakingo_asmens_kontaktas'),
            kompiuteriu_kiekis: data.get('kompiuteriu_kiekis'),
            energijos_riba_per_zmogu: data.get('energijos_riba_per_zmogu')
          });
        //console.log(accommondationData);
        axios.post(`http://127.0.0.1:5000/updateAccommendation`, accommondationData).then(response => {
            // console.log(response);
            if (response.status == 201) {
                window.alert("Patalpa redaguota");
                navigate(`/accommodation/${id}`)
            }
        }).catch(error => alert(error.response.statusText));
    };

    return (
        <div>
            <Header />
            <Typography sx={{ borderBottom: "1px solid gray", pb: 1, my: 4, pl: 2 }}>
                Patalpos redagavimo forma
            </Typography>
            {data === null || data.length === 0 ? (
                <Typography sx={{ textAlign: "center" }}>Wow, so empty!</Typography>
            ) : (
                <Box sx={{ pl: 3 }}
                    component="form"
                    onSubmit={handleSubmit}>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3 }}>
                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="pavadinimas" name="pavadinimas" label="Pavadinimas" variant="outlined" type="text" defaultValue={data[0].pavadinimas} /><br />

                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="atsakingo_asmens_vardas" name="atsakingo_asmens_vardas" label="Atsakingo asmens vardas" variant="outlined" type="text" defaultValue={data[0].atsakingo_asmens_vardas} /><br />

                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="atsakingo_asmens_pavarde" name="atsakingo_asmens_pavarde" label="Atsakingo asmens pavardė" variant="outlined" type="text" defaultValue={data[0].atsakingo_asmens_pavarde} /><br />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3 }}>
                        <TextField sx={{ py: 5 }} InputLabelProps={{ shrink: true }} id="atsakingo_asmens_kontaktas" name="atsakingo_asmens_kontaktas" label="Atsakingo asmens kontaktas" variant="outlined" type="text" defaultValue={data[0].atsakingo_asmens_kontaktas} /><br />

                        <TextField sx={{ py: 5 }} id="kompiuteriu_kiekis" name="kompiuteriu_kiekis" label="Kompiuterių kiekis" variant="outlined" type="number" defaultValue={data[0].kompiuteriu_kiekis} /><br />

                        <TextField sx={{ py: 5 }} id="energijos_riba_per_zmogu" name="energijos_riba_per_zmogu" label="Energijos riba per žmogų" variant="outlined" type="number" defaultValue={data[0].energijos_riba_per_zmogu} /><br />
                    </Box>

                    <Button style={{ background: "#1DA1F2", color: "white" }} type="submit">Pateikti</Button>
                </Box>
                )}
        </div>
    );
}