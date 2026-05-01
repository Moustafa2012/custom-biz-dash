import { QueryClient } from "@tanstack/react-query";

// Shared TanStack Query client per ERP.md §2.2 (Server State).
// Sensible defaults for an ERP: short stale time, background refetch on focus.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
