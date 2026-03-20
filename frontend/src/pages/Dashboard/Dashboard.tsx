import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { incidentApi } from "../../api/incidents";
import { useUnacknowledgedCount } from "../../hooks/useAlerts";
import AttackFrequencyChart from "./AttackFrequencyChart";
import IncidentTrendChart from "./IncidentTrendChart";
import ResponseTimeBySeverity from "./ResponseTimeBySeverity";
import IncidentsBySystem from "./IncidentsBySystem";
import HighRiskSystems from "./HighRiskSystems";

function KpiCard({ title, value, color }: { title: string; value: string | number; color?: string }) {
  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700} color={color || "text.primary"}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function Dashboard() {
  const { data: incidents = [] } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => incidentApi.list({ limit: 200 }).then((r) => r.data),
  });
  const { data: alertCount = 0 } = useUnacknowledgedCount();

  const total = incidents.length;
  const openCount = incidents.filter((i) => i.status === "Open" || i.status === "Investigating").length;
  const resolved = incidents.filter((i) => i.response_time_minutes != null);
  const avgResp = resolved.length
    ? Math.round(resolved.reduce((s, i) => s + (i.response_time_minutes ?? 0), 0) / resolved.length)
    : 0;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Total Incidents" value={total} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Open Incidents" value={openCount} color="warning.main" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Avg Response Time" value={`${avgResp} min`} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Unread Alerts" value={alertCount} color="error.main" />
        </Grid>
      </Grid>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AttackFrequencyChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <IncidentTrendChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ResponseTimeBySeverity />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <IncidentsBySystem />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <HighRiskSystems />
        </Grid>
      </Grid>
    </Box>
  );
}
