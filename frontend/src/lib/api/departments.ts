import client from "./client";
import type { Department } from "../types";

export const departmentApi = {
  list: () => client.get<Department[]>("/api/departments"),
};
