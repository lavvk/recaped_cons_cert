"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { NetworkGate } from "@/components/NetworkGate";
import { SAMPLE_EVENTS } from "@/constants/sampleData";
import { useAllOnchainEvents } from "@/hooks/useRecaped";
import { IS_CONFIGURED } from "@/constants/contract";

const FILTERS = ["All", "Workshop", "Hackathon", "Career", "Tech Talk"];

export default function EventsPage() {
  const { events: onchain, isLoading } = useAllOnchainEvents();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    // Always show the three sample events first (for the demo), then any
    // real on-chain events the user has created at this contract.
    const list = IS_CONFIGURED ? [...SAMPLE_EVENTS, ...onchain] : SAMPLE_EVENTS;
    return list.filter((e) => {
      if (filter !== "All" && e.category !== filter) return false;
      if (q && !e.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [onchain, filter, q]);

  return (
    <div className="space-y-5 pb-6">
      <header className="flex items-end justify-between pt-6">
        <div>
          <h1 className="h1">Browse</h1>
          <p className="muted mt-1">Pick an event. Show up. Collect.</p>
        </div>
        <Link href="/create" className="btn-primary text-xs px-3.5 py-2">
          <Plus size={14} strokeWidth={2.5} /> Host
        </Link>
      </header>

      <div className="relative">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-dim"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search events"
          className="input pl-10"
        />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition " +
                (active
                  ? "border-accent/60 bg-accent/15 text-accent"
                  : "border-line bg-bg-elev/60 text-ink-mute hover:text-ink hover:border-line")
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      <NetworkGate />

      {IS_CONFIGURED && isLoading && onchain.length === 0 && (
        <div className="card p-5 muted text-center">Loading events…</div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="card p-6 text-center space-y-2">
          <div className="font-display text-lg">No matches</div>
          <p className="muted">Try a different filter or search term.</p>
        </div>
      )}

      <section className="space-y-3">
        {filtered.map((e) => (
          <EventCard
            key={String(e.id)}
            id={e.id}
            title={e.title}
            category={e.category}
            organizer={e.organizer}
            description={e.description}
            startTime={e.startTime}
            attendeeCount={e.attendeeCount}
            capacity={e.capacity}
            hasMaterials={!!e.materialsURI}
            status={"isSample" in e && (e as any).isSample ? "sample" : undefined}
          />
        ))}
      </section>
    </div>
  );
}
