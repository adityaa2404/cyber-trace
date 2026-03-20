import { useQuery, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/DataTable";
import { alertApi } from "../../api/alerts";
import { formatDateTime } from "../../utils/formatDate";

export default function AlertList() {
  const qc = useQueryClient();
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertApi.list().then((r) => r.data),
  });

  const handleAcknowledge = async (id: number) => {
    await alertApi.acknowledge(id);
    qc.invalidateQueries({ queryKey: ["alerts"] });
    qc.invalidateQueries({ queryKey: ["alerts", "unacknowledged-count"] });
  };

  const columns: GridColDef[] = [
    { field: "alert_id", headerName: "ID", width: 70 },
    { field: "rule_name", headerName: "Rule", flex: 1 },
    { field: "rule_type", headerName: "Type", width: 140 },
    { field: "message", headerName: "Message", flex: 2 },
    { field: "incident_id", headerName: "Incident #", width: 100 },
    {
      field: "triggered_at",
      headerName: "Triggered At",
      width: 160,
      valueFormatter: (value: string) => formatDateTime(value),
    },
    {
      field: "acknowledged",
      headerName: "Status",
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Acknowledged" size="small" color="success" />
        ) : (
          <Button size="small" variant="outlined" color="warning" onClick={() => handleAcknowledge(params.row.alert_id)}>
            Acknowledge
          </Button>
        ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Alerts
      </Typography>
      <DataTable rows={alerts} columns={columns} getRowId={(r) => r.alert_id} loading={isLoading} />
    </Box>
  );
}
