import client from "./client";
import type { User, UserCreate, UserUpdate } from "../types/user";

export const userApi = {
  list: () => client.get<User[]>("/api/users"),
  get: (id: number) => client.get<User>(`/api/users/${id}`),
  create: (data: UserCreate) => client.post<User>("/api/users", data),
  update: (id: number, data: UserUpdate) => client.patch<User>(`/api/users/${id}`, data),
  delete: (id: number) => client.delete(`/api/users/${id}`),
};
