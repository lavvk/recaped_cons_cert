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
