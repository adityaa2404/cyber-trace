import { useQuery } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import SeverityBadge from "../../components/SeverityBadge";
import { analyticsApi } from "../../api/analytics";
import type { SeverityLevel } from "../../utils/constants";

export default function HighRiskSystems() {
  const { data = [] } = useQuery({
    queryKey: ["analytics", "high-risk-systems"],
    queryFn: () => analyticsApi.highRiskSystems().then((r) => r.data),
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        High Risk Systems (Last 30 Days)
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>System</TableCell>
            <TableCell align="right">Incidents</TableCell>
            <TableCell>Latest Severity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.system_name}>
              <TableCell>{row.system_name}</TableCell>
              <TableCell align="right">{row.count}</TableCell>
              <TableCell>
                <SeverityBadge severity={row.latest_severity as SeverityLevel} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
