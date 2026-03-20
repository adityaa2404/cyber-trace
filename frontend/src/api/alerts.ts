import client from "./client";
import type { AlertLog, AlertCount } from "../types/analytics";

export const alertApi = {
  list: (acknowledged?: boolean) =>
    client.get<AlertLog[]>("/api/alerts", { params: acknowledged !== undefined ? { acknowledged } : {} }),
  unacknowledgedCount: () => client.get<AlertCount>("/api/alerts/unacknowledged-count"),
  acknowledge: (id: number) => client.patch(`/api/alerts/${id}/acknowledge`),
};
