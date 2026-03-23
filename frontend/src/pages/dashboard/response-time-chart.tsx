import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsApi } from "@/lib/api/analytics";

const SEVERITY_BAR_COLORS: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
  Critical: "#dc2626",
};

export function ResponseTimeChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "response-time"],
    queryFn: () => analyticsApi.responseTimeBySeverity().then((r) => r.data),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avg Response Time by Severity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis
                dataKey="severity"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                label={{
                  value: "minutes",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#6b7280",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value} min`, "Avg Response"]}
              />
              <Bar dataKey="avg_minutes" radius={[4, 4, 0, 0]}>
                {data?.map((entry) => (
                  <Cell
                    key={entry.severity}
                    fill={SEVERITY_BAR_COLORS[entry.severity] ?? "#6b7280"}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
