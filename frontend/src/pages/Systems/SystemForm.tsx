import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { systemApi } from "../../api/systems";
import client from "../../api/client";

interface Dept {
  department_id: number;
  department_name: string;
}

export default function SystemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: departments = [] } = useQuery<Dept[]>({
    queryKey: ["departments"],
    queryFn: () => client.get("/api/departments").then((r) => r.data),
  });

  const [form, setForm] = useState({ system_name: "", system_type: "", department_id: "" });

  useEffect(() => {
    if (isEdit && id) {
      systemApi.get(Number(id)).then((r) => {
        setForm({
          system_name: r.data.system_name,
          system_type: r.data.system_type,
          department_id: String(r.data.department_id),
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      system_name: form.system_name,
      system_type: form.system_type,
      department_id: Number(form.department_id),
    };
    if (isEdit && id) {
      await systemApi.update(Number(id), payload);
    } else {
      await systemApi.create(payload);
    }
    qc.invalidateQueries({ queryKey: ["systems"] });
    navigate("/systems");
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isEdit ? "Edit System" : "New System"}
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="System Name" required value={form.system_name} onChange={set("system_name")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="System Type" required value={form.system_type} onChange={set("system_type")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField select fullWidth label="Department" required value={form.department_id} onChange={set("department_id")}>
            {departments.map((d) => (
              <MenuItem key={d.department_id} value={d.department_id}>
                {d.department_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" sx={{ mr: 1 }}>
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button variant="outlined" onClick={() => navigate("/systems")}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
