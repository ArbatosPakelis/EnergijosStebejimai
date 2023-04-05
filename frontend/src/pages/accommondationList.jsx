import { Container, Typography } from "@mui/material";
import * as React from "react";
import Header from "../components/header";
import AccommondationGrid from "../components/accommondationGrid";

export default function AccommondationList() {
  return (
    <>
      <Header />
      <Container>
        <Typography
          className="page-title"
          variant="h3"
          sx={{ borderBottom: "1px solid gray", pb: 1, my: 4 }}
        >
          Patalpos
        </Typography>
        <div className="middle-section">
          <AccommondationGrid />
        </div>
      </Container>
    </>
  );
}