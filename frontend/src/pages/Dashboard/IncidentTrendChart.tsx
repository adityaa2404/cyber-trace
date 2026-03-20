import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import { analyticsApi } from "../../api/analytics";

export default function IncidentTrendChart() {
  const [granularity, setGranularity] = useState<"daily" | "monthly">("daily");
  const { data = [] } = useQuery({
    queryKey: ["analytics", "incident-trends", granularity],
    queryFn: () => analyticsApi.incidentTrends(granularity).then((r) => r.data),
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Incident Trends
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={granularity}
          exclusive
          onChange={(_, v) => v && setGranularity(v)}
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#ff5722" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
