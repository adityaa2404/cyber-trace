import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { incidentApi } from "@/lib/api/incidents";
import { attackApi } from "@/lib/api/attacks";
import { systemApi } from "@/lib/api/systems";
import { userApi } from "@/lib/api/users";
import { SEVERITY_LEVELS, STATUS_OPTIONS } from "@/lib/constants";
import type { IncidentCreate } from "@/lib/types";

export default function IncidentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<IncidentCreate>({
    attack_type_id: 0,
    severity: "Medium",
    system_id: 0,
    reported_by: 0,
    incident_timestamp: new Date().toISOString().slice(0, 16),
    response_time_minutes: null,
    description: "",
    status: "Open",
  });
  const [saving, setSaving] = useState(false);

  const { data: attackTypes } = useQuery({
    queryKey: ["attack-types"],
    queryFn: () => attackApi.listTypes().then((r) => r.data),
  });

  const { data: systems } = useQuery({
    queryKey: ["systems"],
    queryFn: () => systemApi.list().then((r) => r.data),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.list().then((r) => r.data),
  });

  const { data: existing } = useQuery({
    queryKey: ["incidents", id],
    queryFn: () => incidentApi.get(Number(id)).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        attack_type_id: existing.attack_type_id,
        severity: existing.severity,
        system_id: existing.system_id,
        reported_by: existing.reported_by,
        incident_timestamp: existing.incident_timestamp.slice(0, 16),
        response_time_minutes: existing.response_time_minutes,
        description: existing.description ?? "",
        status: existing.status,
      });
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await incidentApi.update(Number(id), form);
      } else {
        await incidentApi.create(form);
      }
      qc.invalidateQueries({ queryKey: ["incidents"] });
      navigate("/incidents");
    } finally {
      setSaving(false);
    }
  };

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Incident" : "New Incident"}
        description={
          isEdit
            ? `Editing incident #${id}`
            : "Log a new security incident"
        }
      />

      <Card className="max-w-2xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Attack Type */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Attack Type <span className="text-destructive">*</span>
              </label>
              <SelectNative
                required
                value={form.attack_type_id || ""}
                onChange={(e) =>
                  set("attack_type_id", Number(e.target.value))
                }
              >
                <option value="">Select attack type...</option>
                {attackTypes?.map((at) => (
                  <option key={at.attack_type_id} value={at.attack_type_id}>
                    {at.attack_type_name}
                  </option>
                ))}
              </SelectNative>
            </div>

            {/* Severity + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Severity <span className="text-destructive">*</span>
                </label>
                <SelectNative
                  required
                  value={form.severity}
                  onChange={(e) => set("severity", e.target.value)}
                >
                  {SEVERITY_LEVELS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </SelectNative>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Status <span className="text-destructive">*</span>
                </label>
                <SelectNative
                  required
                  value={form.status || "Open"}
                  onChange={(e) => set("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </SelectNative>
              </div>
            </div>

            {/* System */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Affected System <span className="text-destructive">*</span>
              </label>
              <SelectNative
                required
                value={form.system_id || ""}
                onChange={(e) => set("system_id", Number(e.target.value))}
              >
                <option value="">Select system...</option>
                {systems?.map((sys) => (
                  <option key={sys.system_id} value={sys.system_id}>
                    {sys.system_name} ({sys.system_type})
                  </option>
                ))}
              </SelectNative>
            </div>

            {/* Reported By */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Reported By <span className="text-destructive">*</span>
              </label>
              <SelectNative
                required
                value={form.reported_by || ""}
                onChange={(e) => set("reported_by", Number(e.target.value))}
              >
                <option value="">Select user...</option>
                {users?.map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.name}
                  </option>
                ))}
              </SelectNative>
            </div>

            {/* Timestamp + Response Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Timestamp <span className="text-destructive">*</span>
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={form.incident_timestamp}
                  onChange={(e) => set("incident_timestamp", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Response Time (min)
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="Optional"
                  value={form.response_time_minutes ?? ""}
                  onChange={(e) =>
                    set(
                      "response_time_minutes",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description
              </label>
              <Textarea
                placeholder="Describe the incident..."
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : isEdit
                  ? "Update Incident"
                  : "Create Incident"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/incidents")}
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
