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
import ConfirmDialog from "../../components/ConfirmDialog";
import { systemApi } from "../../api/systems";

export default function SystemList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: systems = [], isLoading } = useQuery({
    queryKey: ["systems"],
    queryFn: () => systemApi.list().then((r) => r.data),
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await systemApi.delete(deleteId);
      qc.invalidateQueries({ queryKey: ["systems"] });
      setDeleteId(null);
    }
  };

  const columns: GridColDef[] = [
    { field: "system_id", headerName: "ID", width: 70 },
    { field: "system_name", headerName: "System Name", flex: 1 },
    { field: "system_type", headerName: "Type", flex: 1 },
    { field: "department_name", headerName: "Department", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => navigate(`/systems/${params.row.system_id}/edit`)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.system_id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Systems</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/systems/new")}>
          New System
        </Button>
      </Box>
      <DataTable rows={systems} columns={columns} getRowId={(r) => r.system_id} loading={isLoading} />
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete System"
        message="Are you sure you want to delete this system?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
