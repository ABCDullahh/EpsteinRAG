import type { HistoryEntry } from "@/lib/types";
import { apiFetch } from "./client";

interface HistoryListResponse {
  history: HistoryEntry[];
  total: number;
}

export async function getHistory(
  limit = 50,
  offset = 0
): Promise<HistoryListResponse> {
  return apiFetch<HistoryListResponse>(
    `/history/?limit=${limit}&offset=${offset}`
  );
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  await apiFetch(`/history/${id}`, { method: "DELETE" });
}

export async function clearHistory(): Promise<void> {
  await apiFetch("/history/", { method: "DELETE" });
}
