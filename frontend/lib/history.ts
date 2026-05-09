"use client";

import { useEffect, useState } from "react";

const KEY = "recaped:history:v1";

export type LocalEntry = {
  eventId: string;
  title: string;
  category: string;
  materialsURI: string;
  organizer: string;
  joined?: boolean;
  verified?: boolean;
  approved?: boolean;
  claimed?: boolean;
};

type Store = Record<string, LocalEntry>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("recaped:history"));
  } catch {
    /* ignore */
  }
}

export function recordEntry(eventId: string, patch: Partial<LocalEntry>) {
  const store = read();
  const prev = store[eventId] || {
    eventId,
    title: "",
    category: "",
    materialsURI: "",
    organizer: "",
  };
  store[eventId] = { ...prev, ...patch, eventId };
  write(store);
}

export function getEntries(): LocalEntry[] {
  return Object.values(read()).sort((a, b) =>
    a.eventId.localeCompare(b.eventId)
  );
}

export function getEntry(eventId: string): LocalEntry | undefined {
  return read()[eventId];
}

export function useHistorySnapshot(): LocalEntry[] {
  const [snap, setSnap] = useState<LocalEntry[]>([]);
  useEffect(() => {
    const refresh = () => setSnap(getEntries());
    refresh();
    window.addEventListener("recaped:history", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("recaped:history", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return snap;
}
