import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { userApi } from "../../api/users";
import client from "../../api/client";

interface Dept {
  department_id: number;
  department_name: string;
}

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: departments = [] } = useQuery<Dept[]>({
    queryKey: ["departments"],
    queryFn: () => client.get("/api/departments").then((r) => r.data),
  });

  const [form, setForm] = useState({ name: "", email: "", department_id: "" });

  useEffect(() => {
    if (isEdit && id) {
      userApi.get(Number(id)).then((r) => {
        setForm({
          name: r.data.name,
          email: r.data.email,
          department_id: String(r.data.department_id),
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: form.name, email: form.email, department_id: Number(form.department_id) };
    if (isEdit && id) {
      await userApi.update(Number(id), payload);
    } else {
      await userApi.create(payload);
    }
    qc.invalidateQueries({ queryKey: ["users"] });
    navigate("/users");
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isEdit ? "Edit User" : "New User"}
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Name" required value={form.name} onChange={set("name")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Email" type="email" required value={form.email} onChange={set("email")} />
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
          <Button variant="outlined" onClick={() => navigate("/users")}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
