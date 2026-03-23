import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { alertApi } from "@/lib/api/alerts";
import { formatDateTime } from "@/lib/utils";

export default function AlertList() {
  const qc = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertApi.list().then((r) => r.data),
  });

  const handleAcknowledge = async (id: number) => {
    await alertApi.acknowledge(id);
    qc.invalidateQueries({ queryKey: ["alerts"] });
    qc.invalidateQueries({ queryKey: ["alerts", "unacknowledged-count"] });
  };

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Security alerts triggered by incident rules"
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !alerts?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No alerts triggered yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Incident</TableHead>
                  <TableHead>Triggered</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.alert_id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{alert.alert_id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {alert.rule_name ?? `Rule #${alert.rule_id}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <ShieldAlert size={12} />
                        {alert.rule_type ?? "alert"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {alert.message ?? "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      #{alert.incident_id}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(alert.triggered_at)}
                    </TableCell>
                    <TableCell>
                      {alert.acknowledged ? (
                        <Badge className="bg-green-500/15 text-green-400 border-green-500/25 gap-1">
                          <CheckCircle size={12} />
                          Acknowledged
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.alert_id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
