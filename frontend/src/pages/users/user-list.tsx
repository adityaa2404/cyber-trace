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
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { userApi } from "@/lib/api/users";
import { useList } from "@/lib/hooks/use-api";

export default function UserList() {
  const { data: users, isLoading } = useList("users", userApi.list);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const qc = useQueryClient();

  const handleDelete = async () => {
    if (deleteId == null) return;
    await userApi.delete(deleteId);
    qc.invalidateQueries({ queryKey: ["users"] });
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage incident reporters and analysts"
        action={
          <Link to="/users/new">
            <Button>
              <Plus size={16} /> New User
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
          ) : !users?.length ? (
            <p className="text-sm text-muted-foreground p-12 text-center">
              No users found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{u.user_id}
                    </TableCell>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      {u.department_name ?? `Dept #${u.department_id}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link to={`/users/${u.user_id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(u.user_id)}
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
        title="Delete User"
        description="Are you sure? This user may be linked to existing incidents."
      />
    </div>
  );
}
