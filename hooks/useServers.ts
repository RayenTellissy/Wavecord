"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Channel, Server } from "@prisma/client";

export type ServerWithChannel = Server & {
  channels: Channel[];
  _count?: { members: number };
};

export const SERVERS_QUERY_KEY = ["servers"] as const;

export function useServers(initialData?: ServerWithChannel[]) {
  return useQuery<ServerWithChannel[]>({
    queryKey: SERVERS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get<ServerWithChannel[]>("/api/servers");
      return data;
    },
    initialData,
  });
}

export function useServersQueryClient() {
  return useQueryClient();
}
