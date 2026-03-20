import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/DataTable";
import SeverityBadge from "../../components/SeverityBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { incidentApi } from "../../api/incidents";
import { formatDateTime } from "../../utils/formatDate";
import type { SeverityLevel } from "../../utils/constants";

export default function IncidentList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => incidentApi.list().then((r) => r.data),
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await incidentApi.delete(deleteId);
      qc.invalidateQueries({ queryKey: ["incidents"] });
      setDeleteId(null);
    }
  };

  const columns: GridColDef[] = [
    { field: "incident_id", headerName: "ID", width: 70 },
    { field: "attack_type_name", headerName: "Attack Type", flex: 1 },
    {
      field: "severity",
      headerName: "Severity",
      width: 120,
      renderCell: (params) => <SeverityBadge severity={params.value as SeverityLevel} />,
    },
    { field: "system_name", headerName: "System", flex: 1 },
    { field: "reporter_name", headerName: "Reported By", flex: 1 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "incident_timestamp",
      headerName: "Timestamp",
      width: 160,
      valueFormatter: (value: string) => formatDateTime(value),
    },
    { field: "response_time_minutes", headerName: "Response (min)", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => navigate(`/incidents/${params.row.incident_id}/edit`)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.incident_id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Incidents</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/incidents/new")}>
          New Incident
        </Button>
      </Box>
      <DataTable rows={incidents} columns={columns} getRowId={(r) => r.incident_id} loading={isLoading} />
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Incident"
        message="Are you sure you want to delete this incident?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
