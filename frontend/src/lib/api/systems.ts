import client from "./client";
import type { System, SystemCreate, SystemUpdate } from "../types";

export const systemApi = {
  list: () => client.get<System[]>("/api/systems"),
  get: (id: number) => client.get<System>(`/api/systems/${id}`),
  create: (data: SystemCreate) => client.post<System>("/api/systems", data),
  update: (id: number, data: SystemUpdate) =>
    client.patch<System>(`/api/systems/${id}`, data),
  delete: (id: number) => client.delete(`/api/systems/${id}`),
};
