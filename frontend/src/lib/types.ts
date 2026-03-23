// Incidents
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

export type IncidentUpdate = Partial<IncidentCreate>;

// Users
export interface User {
  user_id: number;
  name: string;
  email: string;
  department_id: number;
  department_name?: string;
}

export interface UserCreate {
  name: string;
  email: string;
  department_id: number;
}

export type UserUpdate = Partial<UserCreate>;

// Systems
export interface System {
  system_id: number;
  system_name: string;
  system_type: string;
  department_id: number;
  department_name?: string;
}

export interface SystemCreate {
  system_name: string;
  system_type: string;
  department_id: number;
}

export type SystemUpdate = Partial<SystemCreate>;

// Attacks
export interface AttackCategory {
  category_id: number;
  category_name: string;
  description: string | null;
}

export interface AttackType {
  attack_type_id: number;
  attack_type_name: string;
  category_id: number;
  category_name?: string;
}

// Departments
export interface Department {
  department_id: number;
  department_name: string;
  location: string | null;
}

// Analytics
export interface AttackFrequency {
  attack_type: string;
  count: number;
}

export interface IncidentTrend {
  date: string;
  count: number;
}

export interface ResponseTimeBySeverity {
  severity: string;
  avg_minutes: number;
}

export interface IncidentsByGroup {
  name: string;
  count: number;
}

export interface HighRiskSystem {
  system_name: string;
  count: number;
  latest_severity: string;
}

export interface RepeatedAttack {
  attack_type: string;
  system_name: string;
  count: number;
}

// Alerts
export interface AlertLog {
  alert_id: number;
  rule_id: number;
  rule_name?: string;
  rule_type?: string;
  incident_id: number;
  triggered_at: string;
  message: string | null;
  acknowledged: boolean;
}

export interface AlertCount {
  count: number;
}
