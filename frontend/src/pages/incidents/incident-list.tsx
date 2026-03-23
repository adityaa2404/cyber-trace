import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { SelectNative } from "@/components/ui/select-native";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { incidentApi } from "@/lib/api/incidents";
import { formatDateTime } from "@/lib/utils";
import { SEVERITY_LEVELS, STATUS_OPTIONS } from "@/lib/constants";
import type { SeverityLevel, StatusOption } from "@/lib/constants";

export default function IncidentList() {
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const qc = useQueryClient();

  const { data: incidents, isLoading } = useQuery({
    queryKey: ["incidents", { severity, status }],
    queryFn: () =>
      incidentApi
        .list({
          severity: severity || undefined,
          status: status || undefined,
        })
        .then((r) => r.data),
  });

  const handleDelete = async () => {
    if (deleteId == null) return;
    await incidentApi.delete(deleteId);
    qc.invalidateQueries({ queryKey: ["incidents"] });
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="Incidents"
        description="Manage and track security incidents"
        action={
          <Link to="/incidents/new">
            <Button>
              <Plus size={16} /> New Incident
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-48">
            <label className="text-xs text-muted-foreground mb-1 block">
              Severity
            </label>
            <SelectNative
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="">All Severities</option>
              {SEVERITY_LEVELS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="w-48">
            <label className="text-xs text-muted-foreground mb-1 block">
              Status
            </label>
            <SelectNative
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectNative>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !incidents?.length ? (
            <p className="text-sm text-muted-foreground p-12 text-center">
              No incidents found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Attack Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow key={inc.incident_id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{inc.incident_id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {inc.attack_type_name ?? `Type #${inc.attack_type_id}`}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={inc.severity as SeverityLevel} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {inc.system_name ?? `System #${inc.system_id}`}
                    </TableCell>
                    <TableCell>
                      {inc.reporter_name ?? `User #${inc.reported_by}`}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inc.status as StatusOption} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(inc.incident_timestamp)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {inc.response_time_minutes != null
                        ? `${inc.response_time_minutes} min`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link to={`/incidents/${inc.incident_id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(inc.incident_id)}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Incident"
        description="Are you sure you want to delete this incident? This action cannot be undone."
      />
    </div>
  );
}
