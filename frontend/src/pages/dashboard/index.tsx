import { useQuery } from "@tanstack/react-query";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Bell,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { incidentApi } from "@/lib/api/incidents";
import { analyticsApi } from "@/lib/api/analytics";
import { useUnacknowledgedCount } from "@/lib/hooks/use-alerts";
import { AttackFrequencyChart } from "./attack-frequency-chart";
import { IncidentTrendChart } from "./incident-trend-chart";
import { ResponseTimeChart } from "./response-time-chart";
import { IncidentsBySystemChart } from "./incidents-by-system-chart";
import { HighRiskSystems } from "./high-risk-systems";

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-1" />
          ) : (
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: incidents, isLoading: loadingIncidents } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => incidentApi.list().then((r) => r.data),
  });

  const { data: responseData, isLoading: loadingResponse } = useQuery({
    queryKey: ["analytics", "response-time"],
    queryFn: () => analyticsApi.responseTimeBySeverity().then((r) => r.data),
  });

  const { data: alertCount, isLoading: loadingAlerts } =
    useUnacknowledgedCount();

  const totalIncidents = incidents?.length ?? 0;
  const openIncidents =
    incidents?.filter((i) => i.status === "Open" || i.status === "Investigating")
      .length ?? 0;
  const avgResponse = responseData?.length
    ? Math.round(
        responseData.reduce((s, r) => s + r.avg_minutes, 0) /
          responseData.length
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time security incident overview and analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Total Incidents"
          value={totalIncidents}
          icon={ShieldAlert}
          color="bg-primary/15 text-primary"
          loading={loadingIncidents}
        />
        <KpiCard
          label="Open / Active"
          value={openIncidents}
          icon={AlertTriangle}
          color="bg-amber-500/15 text-amber-400"
          loading={loadingIncidents}
        />
        <KpiCard
          label="Avg Response"
          value={`${avgResponse} min`}
          icon={Clock}
          color="bg-purple-500/15 text-purple-400"
          loading={loadingResponse}
        />
        <KpiCard
          label="Unread Alerts"
          value={alertCount ?? 0}
          icon={Bell}
          color="bg-red-500/15 text-red-400"
          loading={loadingAlerts}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttackFrequencyChart />
        <IncidentTrendChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponseTimeChart />
        <IncidentsBySystemChart />
      </div>

      {/* High Risk Systems */}
      <HighRiskSystems />
    </div>
  );
}
