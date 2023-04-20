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
                savaites_diena ID
              </TableCell>
              <TableCell>
                savaites ID
              </TableCell>
              <TableCell>
                dienos ID
              </TableCell>
              <TableCell>
                diena
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
                 {row.id_savaite}
                </TableCell>
                <TableCell>
                 {row.id_diena}
                </TableCell>
                <TableCell>
                 {row.savaites_diena}
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>)}
        </TableContainer>
    );
  }