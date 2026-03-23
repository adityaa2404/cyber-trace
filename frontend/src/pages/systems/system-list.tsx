import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { systemApi } from "@/lib/api/systems";
import { useList } from "@/lib/hooks/use-api";

export default function SystemList() {
  const { data: systems, isLoading } = useList("systems", systemApi.list);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const qc = useQueryClient();

  const handleDelete = async () => {
    if (deleteId == null) return;
    await systemApi.delete(deleteId);
    qc.invalidateQueries({ queryKey: ["systems"] });
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="Systems"
        description="IT assets and infrastructure inventory"
        action={
          <Link to="/systems/new">
            <Button>
              <Plus size={16} /> New System
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !systems?.length ? (
            <p className="text-sm text-muted-foreground p-12 text-center">
              No systems found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>System Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systems.map((sys) => (
                  <TableRow key={sys.system_id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{sys.system_id}
                    </TableCell>
                    <TableCell className="font-medium font-mono text-sm">
                      {sys.system_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{sys.system_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {sys.department_name ?? `Dept #${sys.department_id}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link to={`/systems/${sys.system_id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(sys.system_id)}
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
        title="Delete System"
        description="Are you sure? This system may be linked to existing incidents."
      />
    </div>
  );
}
