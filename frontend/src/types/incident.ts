export interface Incident {
  incident_id: number;
  attack_type_id: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  system_id: number;
  reported_by: number;
  date_id: number;
  incident_timestamp: string;
  response_time_minutes: number | null;
  description: string | null;
  status: "Open" | "Investigating" | "Resolved" | "Closed";
  created_at: string;
  updated_at: string;
  attack_type_name?: string;
  system_name?: string;
  reporter_name?: string;
}

export interface IncidentCreate {
  attack_type_id: number;
  severity: string;
  system_id: number;
  reported_by: number;
  incident_timestamp: string;
  response_time_minutes?: number | null;
  description?: string | null;
  status?: string;
}

export interface IncidentUpdate extends Partial<IncidentCreate> {}
