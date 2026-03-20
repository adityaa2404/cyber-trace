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
