export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const STATUS_OPTIONS = ["Open", "Investigating", "Resolved", "Closed"] as const;

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  Low: "#4caf50",
  Medium: "#ff9800",
  High: "#f44336",
  Critical: "#d50000",
};

export const ROUTES = {
  DASHBOARD: "/",
  INCIDENTS: "/incidents",
  INCIDENT_NEW: "/incidents/new",
  INCIDENT_EDIT: "/incidents/:id/edit",
  USERS: "/users",
  USER_NEW: "/users/new",
  USER_EDIT: "/users/:id/edit",
  SYSTEMS: "/systems",
  SYSTEM_NEW: "/systems/new",
  SYSTEM_EDIT: "/systems/:id/edit",
  ALERTS: "/alerts",
} as const;
