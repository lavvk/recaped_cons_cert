"use client";

import { useEffect, useState } from "react";

const KEY = "recaped:hidden:v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids))));
    window.dispatchEvent(new CustomEvent("recaped:hidden"));
  } catch {
    /* ignore */
  }
}

export function hideEvent(eventId: string) {
  const list = read();
  if (!list.includes(eventId)) write([...list, eventId]);
}

export function unhideEvent(eventId: string) {
  write(read().filter((id) => id !== eventId));
}

export function isHidden(eventId: string): boolean {
  return read().includes(eventId);
}

export function useHiddenIds(): Set<string> {
  const [ids, setIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    // One-time cleanup: sample event IDs (>= 1000) should never be hidden.
    // Older builds let users hide them by accident; prune those entries.
    const current = read();
    const cleaned = current.filter((id) => {
      const n = Number(id);
      return !Number.isFinite(n) || n < 1000;
    });
    if (cleaned.length !== current.length) write(cleaned);

    const refresh = () => setIds(new Set(read()));
    refresh();
    window.addEventListener("recaped:hidden", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("recaped:hidden", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return ids;
}
