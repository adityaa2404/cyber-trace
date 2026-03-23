import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { PageHeader } from "@/components/page-header";
import { systemApi } from "@/lib/api/systems";
import { departmentApi } from "@/lib/api/departments";
import type { SystemCreate } from "@/lib/types";

export default function SystemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<SystemCreate>({
    system_name: "",
    system_type: "",
    department_id: 0,
  });
  const [saving, setSaving] = useState(false);

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentApi.list().then((r) => r.data),
  });

  const { data: existing } = useQuery({
    queryKey: ["systems", id],
    queryFn: () => systemApi.get(Number(id)).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        system_name: existing.system_name,
        system_type: existing.system_type,
        department_id: existing.department_id,
      });
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await systemApi.update(Number(id), form);
      } else {
        await systemApi.create(form);
      }
      qc.invalidateQueries({ queryKey: ["systems"] });
      navigate("/systems");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit System" : "New System"}
        description={
          isEdit ? `Editing system #${id}` : "Register a new IT asset"
        }
      />

      <Card className="max-w-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                System Name <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. prod-web-server-01"
                value={form.system_name}
                onChange={(e) =>
                  setForm({ ...form, system_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                System Type <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Web Server, Database, Firewall"
                value={form.system_type}
                onChange={(e) =>
                  setForm({ ...form, system_type: e.target.value })
                }
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
                {saving
                  ? "Saving..."
                  : isEdit
                  ? "Update System"
                  : "Create System"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/systems")}
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
