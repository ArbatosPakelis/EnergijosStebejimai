import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

export default function DataTable({data}) {
    return (
      <TableContainer sx={{ width: 1000, margin: "0 auto" }}>
        { data === null || data.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>Wow, so empty!</Typography>
        ) : (
        <div>
          <Table>
            <TableHead>
             <TableRow>
              <TableCell>
                dienos_laikas ID
              </TableCell>
              <TableCell>
                dienos ID
              </TableCell>
              <TableCell>
                uzimtumo_laikas ID
              </TableCell>
              <TableCell>
                Savaitės diena
              </TableCell>
              <TableCell>
                Pradzia
              </TableCell>
              <TableCell>
                Pabaiga
              </TableCell>
              <TableCell>
                Asmenu kiekis
              </TableCell>
             </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
              <TableRow>
                <TableCell component="th" scope="row">
                 {row.id}
                </TableCell>
                <TableCell>
                 {row.id_diena}
                </TableCell>
                <TableCell>
                 {row.id_uzimtumo_laikas}
                </TableCell>
                <TableCell>
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
        </div>)}
        </TableContainer>
    );
  }