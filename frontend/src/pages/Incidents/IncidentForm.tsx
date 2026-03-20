import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { incidentApi } from "../../api/incidents";
import { attackApi } from "../../api/attacks";
import { userApi } from "../../api/users";
import { systemApi } from "../../api/systems";
import { SEVERITY_LEVELS, STATUS_OPTIONS } from "../../utils/constants";

export default function IncidentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: attackTypes = [] } = useQuery({
    queryKey: ["attack-types"],
    queryFn: () => attackApi.listTypes().then((r) => r.data),
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.list().then((r) => r.data),
  });
  const { data: systems = [] } = useQuery({
    queryKey: ["systems"],
    queryFn: () => systemApi.list().then((r) => r.data),
  });

  const [form, setForm] = useState({
    attack_type_id: "",
    severity: "Medium",
    system_id: "",
    reported_by: "",
    incident_timestamp: new Date().toISOString().slice(0, 16),
    response_time_minutes: "",
    description: "",
    status: "Open",
  });

  useEffect(() => {
    if (isEdit && id) {
      incidentApi.get(Number(id)).then((r) => {
        const d = r.data;
        setForm({
          attack_type_id: String(d.attack_type_id),
          severity: d.severity,
          system_id: String(d.system_id),
          reported_by: String(d.reported_by),
          incident_timestamp: d.incident_timestamp.slice(0, 16),
          response_time_minutes: d.response_time_minutes != null ? String(d.response_time_minutes) : "",
          description: d.description || "",
          status: d.status,
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      attack_type_id: Number(form.attack_type_id),
      severity: form.severity,
      system_id: Number(form.system_id),
      reported_by: Number(form.reported_by),
      incident_timestamp: form.incident_timestamp + ":00",
      response_time_minutes: form.response_time_minutes ? Number(form.response_time_minutes) : null,
      description: form.description || null,
      status: form.status,
    };
    if (isEdit && id) {
      await incidentApi.update(Number(id), payload);
    } else {
      await incidentApi.create(payload);
    }
    qc.invalidateQueries({ queryKey: ["incidents"] });
    navigate("/incidents");
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isEdit ? "Edit Incident" : "New Incident"}
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField select fullWidth label="Attack Type" required value={form.attack_type_id} onChange={set("attack_type_id")}>
            {attackTypes.map((a) => (
              <MenuItem key={a.attack_type_id} value={a.attack_type_id}>
                {a.attack_type_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField select fullWidth label="Severity" required value={form.severity} onChange={set("severity")}>
            {SEVERITY_LEVELS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField select fullWidth label="Affected System" required value={form.system_id} onChange={set("system_id")}>
            {systems.map((s) => (
              <MenuItem key={s.system_id} value={s.system_id}>
                {s.system_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField select fullWidth label="Reported By" required value={form.reported_by} onChange={set("reported_by")}>
            {users.map((u) => (
              <MenuItem key={u.user_id} value={u.user_id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Timestamp"
            type="datetime-local"
            required
            value={form.incident_timestamp}
            onChange={set("incident_timestamp")}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="Response Time (min)"
            type="number"
            value={form.response_time_minutes}
            onChange={set("response_time_minutes")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField select fullWidth label="Status" required value={form.status} onChange={set("status")}>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={set("description")} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" sx={{ mr: 1 }}>
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button variant="outlined" onClick={() => navigate("/incidents")}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
