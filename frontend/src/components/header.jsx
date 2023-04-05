import {
    Menu,
    MenuItem,
    Button,
    AppBar,
    Typography,
    Box,
    Toolbar,
    IconButton
} from "@mui/material";
import React, { useState } from "react"
// import HomeIcon from '@mui/icons-material/Home';
import TableChartIcon from '@mui/icons-material/TableChart';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/system";

const forms = [
    {
        name: "Patalpa",
        link: "accommodation/new",
    },
    {
        name: "Savaite",
        link: "week/new",
    },
    {
        name: "Diena",
        link: "dayForm",
    },
    {
        name: "Uzimtumo laikas",
        link: "timeForm",
    },
    {
        name: "Irasas (testams)",
        link: "sensorForm",
    },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState()
    const navigate = useNavigate();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    }

    let closeMenu = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    }

    return (
        <AppBar style={{background: "#11111199", padding: 20 }} position="static">
            <Container>
                <Toolbar variant="dense">
                    <IconButton onClick={handleMenuClick} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3 }}>
                        <Button style={{ color: 'white', px: 5 }} href="/">
                            <Typography sx={{ pr: 3 }} >Energijos stebejimas</Typography>
                        </Button>
                        <React.Fragment>
                            <Button onClick={handleMenuClick} style={{ color: 'white', width: 60, padding: 10, pl: 5 }}>
                                Formos
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={closeMenu}
                                onClick={closeMenu}>
                                {forms.map((form) => (
                                    <MenuItem
                                        key={form.name}
                                        onClick={function () {
                                            navigate(`/${form.link}`);
                                        }}>
                                        {form.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </React.Fragment>
                        <Button href="/data" startIcon={<TableChartIcon />} style={{ color: 'white', padding: 10, pl: 5 }}>Sensor Data</Button>
                        <Button href="/graph" startIcon={<EqualizerIcon />} style={{ color: 'white', padding: 10, pl: 5 }}>Graph</Button>
                        <Button href="/accommodation" style={{ color: 'white', padding: 10, pl: 5 }}>Patalpos</Button>
                    </Box>
                    </Toolbar>
            </Container>
        </AppBar>
    );
    // return (
    //     <>
    //         <div>
    //             <ButtonGroup variant="contained" size="large" aria-label="text button group" sx={{ pl:4 }}>

    //                 <Button href="./" startIcon={<HomeIcon />}>Homepage</Button>
    //                 <Button href="./data" startIcon={<TableChartIcon />}>Sensor Data</Button>
    //                 <Button href="./graph" startIcon={<EqualizerIcon />}>Graph</Button>
    //                 <Button href="./sensorForm" startIcon={<EqualizerIcon />}>Sensor Form</Button>
    //                 <Button href="./temp" startIcon={<EqualizerIcon />}>Temp</Button>
    //                 <Button href="./temp" startIcon={<EqualizerIcon />}>Temp</Button>
    //             </ButtonGroup>
    //         </div> 
    //     </>
    // );
}