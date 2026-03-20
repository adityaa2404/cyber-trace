import { useQuery } from "@tanstack/react-query";
import { alertApi } from "../api/alerts";

export function useUnacknowledgedCount() {
  return useQuery({
    queryKey: ["alerts", "unacknowledged-count"],
    queryFn: () => alertApi.unacknowledgedCount().then((r) => r.data.count),
    refetchInterval: 30000,
  });
}
