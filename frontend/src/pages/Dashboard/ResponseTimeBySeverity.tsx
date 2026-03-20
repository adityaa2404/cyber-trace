import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { analyticsApi } from "../../api/analytics";

export default function ResponseTimeBySeverity() {
  const { data = [] } = useQuery({
    queryKey: ["analytics", "response-time"],
    queryFn: () => analyticsApi.responseTimeBySeverity().then((r) => r.data),
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Avg Response Time by Severity
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="severity" />
          <YAxis unit=" min" />
          <Tooltip />
          <Bar dataKey="avg_minutes" fill="#ff9800" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
