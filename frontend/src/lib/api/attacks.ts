import client from "./client";
import type { AttackType } from "../types";

export const attackApi = {
  listTypes: () => client.get<AttackType[]>("/api/attack-types"),
};
