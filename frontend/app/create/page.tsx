"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keccak256, toHex } from "viem";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { NetworkGate } from "@/components/NetworkGate";
import { TxStatus } from "@/components/TxStatus";
import { useRecapedWrite, useNextEventId } from "@/hooks/useRecaped";
import { IS_CONFIGURED } from "@/constants/contract";
import { dateToUnix } from "@/lib/format";

const CATEGORIES = [
  "Workshop",
  "Hackathon",
  "Career",
  "Tech Talk",
  "Club",
  "Training",
];

export default function CreateEventPage() {
  const { isConnected } = useAccount();
  const { call, isPending, isSuccess, error, reset } = useRecapedWrite();
  const { data: nextId, refetch } = useNextEventId();
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [pendingNewId, setPendingNewId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Workshop",
    materialsURI: "",
    eventCode: "RECAPED2026",
    capacity: "50",
    startTime: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // When tx succeeds, surface the id we captured before submitting.
  useEffect(() => {
    if (isSuccess && pendingNewId !== null) {
      setCreatedId(pendingNewId);
      refetch();
    }
  }, [isSuccess, pendingNewId, refetch]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.materialsURI.trim()) return;
    const cap = BigInt(parseInt(form.capacity || "0", 10));
    if (cap <= 0n) return;
    // Contract stores a bytes32 codeHash; the QR-ticket flow doesn't use it,
    // but we still need to pass *something* to satisfy the signature.
    const codeHash = keccak256(toHex(form.eventCode.trim() || "qr-ticket"));
    const start = BigInt(dateToUnix(form.startTime));
    setCreatedId(null);
    if (nextId !== undefined) setPendingNewId(Number(nextId));
    reset();
    call("createEvent", [
      form.title.trim(),
      form.description.trim(),
      form.category,
      form.materialsURI.trim(),
      codeHash,
      cap,
      start,
    ]);
  }

  if (!isConnected) {
    return (
      <div className="space-y-4 pt-4 pb-6">
        <h1 className="h1">Create Event</h1>
        <div className="card p-5 space-y-3 text-center">
          <p className="muted">Connect your wallet to create an event.</p>
          <div className="flex justify-center">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </div>
    );
  }

  if (!IS_CONFIGURED) {
    return (
      <div className="space-y-4 pt-4 pb-6">
        <h1 className="h1">Create Event</h1>
        <div className="card p-5 space-y-2">
          <p className="font-semibold">Deploy the contract first.</p>
          <p className="muted">
            Run <code className="text-accent">npm run deploy:local</code> from the
            project root, or set{" "}
            <code className="text-accent">NEXT_PUBLIC_CONTRACT_ADDRESS</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-4 pb-8">
      <header>
        <h1 className="h1">Create Event</h1>
        <p className="muted mt-1">Anyone with a wallet can attend and earn a badge.</p>
      </header>

      <NetworkGate />

      {createdId && createdId > 0 ? (
        <div className="card p-5 space-y-4 border-emerald-400/30 bg-emerald-400/5">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 size={18} />
            <div className="font-semibold">Event created</div>
          </div>
          <p className="muted">
            Your event is live on-chain as <span className="text-ink font-semibold">#{createdId}</span>.
            Share the link with attendees.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link href={`/events/${createdId}`} className="btn-primary">
              View event <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setCreatedId(null);
                setPendingNewId(null);
                reset();
                setForm({
                  title: "",
                  description: "",
                  category: "Workshop",
                  materialsURI: "",
                  eventCode: "RECAPED2026",
                  capacity: "50",
                  startTime: "",
                });
              }}
            >
              <Sparkles size={14} /> Create another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title">
            <input
              className="input"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Solidity 101 Workshop"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="input min-h-[88px] resize-none"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What attendees will learn…"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                className="input"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Capacity">
              <input
                className="input"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field
            label="Materials link"
            hint="Unlocked for attendees after their wallet QR is scanned at the door."
          >
            <input
              className="input"
              value={form.materialsURI}
              onChange={(e) => update("materialsURI", e.target.value)}
              placeholder="https://… or ipfs://…"
              required
            />
          </Field>
          <Field label="Start time (optional)">
            <input
              className="input"
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => update("startTime", e.target.value)}
            />
          </Field>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isPending}
          >
            {isPending ? "Creating…" : "Create Event"}
          </button>
        </form>
      )}

      <TxStatus pending={isPending} success={isSuccess && !createdId} error={error} />
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="label">{label}</div>
      {children}
      {hint && <div className="mt-1.5 text-[11px] text-ink-dim">{hint}</div>}
    </div>
  );
}
