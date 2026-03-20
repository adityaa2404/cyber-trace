import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export function useList<T>(key: string, fetcher: () => Promise<AxiosResponse<T[]>>) {
  return useQuery({ queryKey: [key], queryFn: () => fetcher().then((r) => r.data) });
}

export function useMutateAndInvalidate<TData, TVar>(
  key: string,
  mutator: (v: TVar) => Promise<AxiosResponse<TData>>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutator,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}
