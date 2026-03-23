import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/severity-badge";
import { analyticsApi } from "@/lib/api/analytics";
import type { SeverityLevel } from "@/lib/constants";
import { AlertTriangle } from "lucide-react";

export function HighRiskSystems() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "high-risk"],
    queryFn: () => analyticsApi.highRiskSystems().then((r) => r.data),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle size={16} className="text-amber-400" />
        <CardTitle>High Risk Systems</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No high-risk systems detected
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System</TableHead>
                <TableHead>Incidents (30d)</TableHead>
                <TableHead>Latest Severity</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((sys) => (
                <TableRow key={sys.system_name}>
                  <TableCell className="font-medium font-mono text-sm">
                    {sys.system_name}
                  </TableCell>
                  <TableCell>{sys.count}</TableCell>
                  <TableCell>
                    <SeverityBadge
                      severity={sys.latest_severity as SeverityLevel}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-full max-w-[120px] bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                        style={{
                          width: `${Math.min(100, (sys.count / 10) * 100)}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
