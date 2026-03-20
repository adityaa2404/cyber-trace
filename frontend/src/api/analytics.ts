import client from "./client";
import type {
  AttackFrequency,
  IncidentTrend,
  ResponseTimeBySeverity,
  IncidentsByGroup,
  HighRiskSystem,
  RepeatedAttack,
} from "../types/analytics";

export const analyticsApi = {
  attackFrequency: () => client.get<AttackFrequency[]>("/api/analytics/attack-frequency"),
  incidentTrends: (granularity: "daily" | "monthly" = "daily") =>
    client.get<IncidentTrend[]>("/api/analytics/incident-trends", { params: { granularity } }),
  responseTimeBySeverity: () =>
    client.get<ResponseTimeBySeverity[]>("/api/analytics/response-time-by-severity"),
  incidentsBySystem: () => client.get<IncidentsByGroup[]>("/api/analytics/incidents-by-system"),
  incidentsByDepartment: () => client.get<IncidentsByGroup[]>("/api/analytics/incidents-by-department"),
  highRiskSystems: () => client.get<HighRiskSystem[]>("/api/analytics/high-risk-systems"),
  repeatedAttacks: () => client.get<RepeatedAttack[]>("/api/analytics/repeated-attacks"),
};
