import client from "./client";
import type { Incident, IncidentCreate, IncidentUpdate } from "../types";

interface ListParams {
  skip?: number;
  limit?: number;
  severity?: string;
  status?: string;
  system_id?: number;
  from_date?: string;
  to_date?: string;
}

export const incidentApi = {
  list: (params?: ListParams) =>
    client.get<Incident[]>("/api/incidents", { params }),
  get: (id: number) => client.get<Incident>(`/api/incidents/${id}`),
  create: (data: IncidentCreate) =>
    client.post<Incident>("/api/incidents", data),
  update: (id: number, data: IncidentUpdate) =>
    client.patch<Incident>(`/api/incidents/${id}`, data),
  delete: (id: number) => client.delete(`/api/incidents/${id}`),
};
