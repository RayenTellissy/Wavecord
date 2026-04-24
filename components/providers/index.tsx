"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 60s — avoids redundant refetches
            // while socket events keep the cache up-to-date in real time.
            staleTime: 60_000,
            // Keep unused query data in memory for 5 minutes before GC.
            gcTime: 5 * 60_000,
            retry: 1,
            // Don't refetch when the user switches tabs or reconnects —
            // socket handles live updates; these would just burn API calls.
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
