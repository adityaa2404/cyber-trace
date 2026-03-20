import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { analyticsApi } from "../../api/analytics";

export default function AttackFrequencyChart() {
  const { data = [] } = useQuery({
    queryKey: ["analytics", "attack-frequency"],
    queryFn: () => analyticsApi.attackFrequency().then((r) => r.data),
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Top Attack Types
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="attack_type" width={100} />
          <Tooltip />
          <Bar dataKey="count" fill="#00bcd4" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
