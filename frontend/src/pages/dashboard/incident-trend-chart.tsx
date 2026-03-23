import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsApi } from "@/lib/api/analytics";

export function IncidentTrendChart() {
  const [granularity, setGranularity] = useState<"daily" | "monthly">("daily");

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "trends", granularity],
    queryFn: () => analyticsApi.incidentTrends(granularity).then((r) => r.data),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Incident Trends</CardTitle>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={granularity === "daily" ? "default" : "ghost"}
            onClick={() => setGranularity("daily")}
          >
            Daily
          </Button>
          <Button
            size="sm"
            variant={granularity === "monthly" ? "default" : "ghost"}
            onClick={() => setGranularity("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={11}
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4", r: 3 }}
                activeDot={{ r: 5, fill: "#22d3ee" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
