import client from "./client";
import type { AttackType, AttackCategory } from "../types/attack";

export const attackApi = {
  listCategories: () => client.get<AttackCategory[]>("/api/attack-categories"),
  listTypes: () => client.get<AttackType[]>("/api/attack-types"),
};
