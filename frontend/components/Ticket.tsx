"use client";

import { CheckCircle2, XCircle, Ticket as TicketIcon } from "lucide-react";
import clsx from "clsx";
import { shortAddress } from "@/lib/format";

type TicketProps = {
  address?: string;
  scanned: boolean;
  eventTitle: string;
};

// Deterministic pseudo-QR: hashes the wallet address into a 21x21 boolean grid
// so each wallet gets a unique-looking ticket. Decorative only — the real
// "scan" in the demo is the `scanned` flag passed in from sample data.
function hashGrid(seed: string, size = 21): boolean[][] {
  const bytes = new Uint8Array(size * size);
  let h = 2166136261;
  const src = seed || "0x0000000000000000000000000000000000000000";
  for (let i = 0; i < src.length; i++) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = 0; i < bytes.length; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    bytes[i] = (h >>> 0) & 1;
  }
  const grid: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) row.push(!!bytes[r * size + c]);
    grid.push(row);
  }
  // Stamp three "finder" squares like a real QR so the ticket reads as one.
  const stamp = (rr: number, cc: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const onEdge = r === 0 || r === 6 || c === 0 || c === 6;
        const onCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[rr + r][cc + c] = onEdge || onCore;
      }
    }
  };
  stamp(0, 0);
  stamp(0, size - 7);
  stamp(size - 7, 0);
  return grid;
}

export function Ticket({ address, scanned, eventTitle }: TicketProps) {
  const grid = hashGrid(address ?? "");
  const cell = 6;
  const size = grid.length * cell;

  return (
    <div
      className={clsx(
        "card p-5 space-y-4 border",
        scanned
          ? "border-emerald-400/30 bg-emerald-400/5"
          : "border-red-400/30 bg-red-400/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink-mute">
            Your ticket
          </div>
          <div className="font-display text-[18px] mt-0.5 leading-tight">
            {eventTitle}
          </div>
        </div>
        <div
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
            scanned
              ? "bg-emerald-400/15 text-emerald-200"
              : "bg-red-400/15 text-red-200"
          )}
        >
          {scanned ? (
            <>
              <CheckCircle2 size={13} strokeWidth={2.5} /> Scanned
            </>
          ) : (
            <>
              <XCircle size={13} strokeWidth={2.5} /> Not scanned
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-white p-2 shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            shapeRendering="crispEdges"
            aria-label="ticket QR"
          >
            <rect width={size} height={size} fill="#fff" />
            {grid.map((row, r) =>
              row.map((on, c) =>
                on ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c * cell}
                    y={r * cell}
                    width={cell}
                    height={cell}
                    fill="#0E0B10"
                  />
                ) : null
              )
            )}
          </svg>
        </div>

        <div className="space-y-2 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] font-bold text-accent">
            <TicketIcon size={12} strokeWidth={2.5} /> Wallet pass
          </div>
          {address ? (
            <div className="font-mono text-[12px] text-ink truncate">
              {shortAddress(address)}
            </div>
          ) : (
            <div className="font-mono text-[12px] text-ink-dim">
              connect wallet
            </div>
          )}
          <p className="text-[11px] leading-snug text-ink-mute">
            {scanned
              ? "An organizer scanned this pass at the door, so your attendance is on the books and materials are unlocked below."
              : "This pass wasn't scanned at the door. Find an organizer to scan it before the event ends to unlock materials."}
          </p>
        </div>
      </div>
    </div>
  );
}
