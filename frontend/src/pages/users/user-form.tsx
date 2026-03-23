import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { PageHeader } from "@/components/page-header";
import { userApi } from "@/lib/api/users";
import { departmentApi } from "@/lib/api/departments";
import type { UserCreate } from "@/lib/types";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<UserCreate>({
    name: "",
    email: "",
    department_id: 0,
  });
  const [saving, setSaving] = useState(false);

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentApi.list().then((r) => r.data),
  });

  const { data: existing } = useQuery({
    queryKey: ["users", id],
    queryFn: () => userApi.get(Number(id)).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        email: existing.email,
        department_id: existing.department_id,
      });
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await userApi.update(Number(id), form);
      } else {
        await userApi.create(form);
      }
      qc.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit User" : "New User"}
        description={isEdit ? `Editing user #${id}` : "Add a new analyst or reporter"}
      />

      <Card className="max-w-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                required
                placeholder="user@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Department <span className="text-destructive">*</span>
              </label>
              <SelectNative
                required
                value={form.department_id || ""}
                onChange={(e) =>
                  setForm({ ...form, department_id: Number(e.target.value) })
                }
              >
                <option value="">Select department...</option>
                {departments?.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                  </option>
                ))}
              </SelectNative>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : isEdit ? "Update User" : "Create User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/users")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
