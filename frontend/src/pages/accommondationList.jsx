import { Typography } from "@mui/material";
import * as React from "react";
import Header from "../components/header";
import AccommondationGrid from "../components/accommondationGrid";

export default function AccommondationList() {
  return (
    <>
      <Header/>
      <Typography
        variant="h3"
        sx={{ borderBottom: "1px solid gray", pb: 1, my: 4 }}
      >
        Patalpos
      </Typography>
      <div className="middle-section">
          <AccommondationGrid />
      </div>
    </>
  );
}