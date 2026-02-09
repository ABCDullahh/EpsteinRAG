"use client";

import { useState, useCallback, useRef } from "react";
import type { Citation, Document, SSEEvent } from "@/lib/types";
import { siteConfig } from "@/config/site";

export function useStreamingAnswer() {
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (query: string) => {
    // Reset state
    setAnswer("");
    setCitations([]);
    setDocuments([]);
    setIsStreaming(true);
    setTotalResults(0);

    // Abort previous stream if any
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    try {
      const res = await fetch(
        `${siteConfig.api}/search/stream?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Stream failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (!json) continue;

          try {
            const event: SSEEvent = JSON.parse(json);
            switch (event.type) {
              case "answer_chunk":
                setAnswer((prev) => prev + (event.content || ""));
                break;
              case "citation":
                setCitations((prev) => [
                  ...prev,
                  {
                    document_id: event.document_id!,
                    efta_id: event.efta_id!,
                    snippet: event.snippet || "",
                    doc_type: null,
                    relevance_score: 0,
                  },
                ]);
                break;
              case "document":
                if (event.document) {
                  setDocuments((prev) => [...prev, event.document!]);
                }
                break;
              case "complete":
                setTotalResults(event.total_results || 0);
                break;
            }
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Stream error:", err);
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return {
    answer,
    citations,
    documents,
    isStreaming,
    totalResults,
    startStream,
    stopStream,
  };
}
