import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { analyticsApi } from "../../api/analytics";

const COLORS = ["#00bcd4", "#ff5722", "#4caf50", "#ff9800", "#9c27b0", "#2196f3", "#e91e63"];

export default function IncidentsBySystem() {
  const { data = [] } = useQuery({
    queryKey: ["analytics", "incidents-by-system"],
    queryFn: () => analyticsApi.incidentsBySystem().then((r) => r.data),
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Incidents by System
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
