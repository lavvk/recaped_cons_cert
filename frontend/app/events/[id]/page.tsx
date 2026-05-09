"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { keccak256, toHex } from "viem";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  CheckCircle2,
  Circle,
  Lock,
  Award,
  Users,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";

import { NetworkGate } from "@/components/NetworkGate";
import { StatusChip, type StatusKind } from "@/components/StatusChip";
import { MaterialCard } from "@/components/MaterialCard";
import { TxStatus } from "@/components/TxStatus";
import {
  useEvent,
  useAttendeeStatus,
  useRecapedWrite,
} from "@/hooks/useRecaped";
import { IS_CONFIGURED } from "@/constants/contract";
import { SAMPLE_EVENTS, SAMPLE_MATERIALS, DEMO_EVENT_CODE } from "@/constants/sampleData";
import { shortAddress, formatDate } from "@/lib/format";
import { recordEntry } from "@/lib/history";
import type { RecapedEventInfo, RecapedAttendee } from "@/constants/abi";

const COVERS = [
  "linear-gradient(135deg, #FF8FA3 0%, #FFB37A 60%, #FFE0D6 100%)",
  "linear-gradient(135deg, #E5446D 0%, #FF8FA3 50%, #FFB37A 100%)",
  "linear-gradient(135deg, #B07CFF 0%, #FF8FA3 60%, #FFB37A 100%)",
  "linear-gradient(135deg, #FFB37A 0%, #FF8FA3 50%, #B07CFF 100%)",
  "linear-gradient(135deg, #FFD86B 0%, #FF8FA3 60%, #E5446D 100%)",
  "linear-gradient(135deg, #6BD0FF 0%, #B07CFF 50%, #FF8FA3 100%)",
];
function coverGradient(id: number) {
  return COVERS[Math.abs(id) % COVERS.length];
}

function statusKind(a?: RecapedAttendee): StatusKind {
  if (!a) return "not-joined";
  if (a.badgeClaimed) return "claimed";
  if (a.approved) return "approved";
  if (a.verificationSubmitted) return "submitted";
  if (a.joined) return "joined";
  return "not-joined";
}

const STEPS = [
  "Join",
  "Verify",
  "Approve",
  "Unlock",
  "Claim",
] as const;

function stepProgress(a?: RecapedAttendee): number {
  if (!a) return 0;
  if (a.badgeClaimed) return 5;
  if (a.approved) return 4;
  if (a.verificationSubmitted) return 2;
  if (a.joined) return 1;
  return 0;
}

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id ?? "0";
  const numericId = Number(rawId);
  const isSampleId = numericId >= 1000;

  const sampleMatch = SAMPLE_EVENTS.find((e) => Number(e.id) === numericId);
  const onChainId = !isSampleId && numericId > 0 ? BigInt(numericId) : undefined;

  const { address, isConnected } = useAccount();
  const { data: onchainEvent, refetch: refetchEvent } = useEvent(onChainId);
  const { data: attendee, refetch: refetchAttendee } = useAttendeeStatus(
    onChainId,
    address
  );
  const { call, isPending, isSuccess, error, reset } = useRecapedWrite();

  const [pendingAction, setPendingAction] = useState<
    null | "join" | "verify" | "approve" | "claim"
  >(null);

  const event: RecapedEventInfo | undefined =
    onchainEvent ?? (sampleMatch as RecapedEventInfo | undefined);

  useEffect(() => {
    if (!isSuccess) return;
    refetchEvent();
    refetchAttendee();

    if (event && address && onChainId !== undefined) {
      const base = {
        title: event.title,
        category: event.category,
        materialsURI: event.materialsURI,
        organizer: event.organizer,
      };
      if (pendingAction === "join")
        recordEntry(String(onChainId), { ...base, joined: true });
      if (pendingAction === "verify")
        recordEntry(String(onChainId), {
          ...base,
          joined: true,
          verified: true,
        });
      if (pendingAction === "claim")
        recordEntry(String(onChainId), {
          ...base,
          joined: true,
          verified: true,
          approved: true,
          claimed: true,
        });
    }

    const t = setTimeout(() => {
      reset();
      setPendingAction(null);
    }, 1800);
    return () => clearTimeout(t);
  }, [isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  const [code, setCode] = useState("");
  const [proof, setProof] = useState("");
  const [approveAddr, setApproveAddr] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [demoUnlocked, setDemoUnlocked] = useState(false);

  const isOrganizer = useMemo(
    () =>
      !!address &&
      !!event &&
      !isSampleId &&
      event.organizer?.toLowerCase() === address.toLowerCase(),
    [address, event, isSampleId]
  );

  if (!event) {
    return (
      <div className="space-y-4 pt-6 pb-6">
        <h1 className="h1">Event not found</h1>
        <p className="muted">This event ID isn't on-chain or in the demo set.</p>
        <Link href="/events" className="btn-secondary">
          Back to events
        </Link>
      </div>
    );
  }

  const kind: StatusKind = isSampleId ? "sample" : statusKind(attendee);
  const progress = stepProgress(attendee);
  const unlocked = !!attendee?.approved || !!attendee?.badgeClaimed;

  function handleJoin() {
    if (onChainId === undefined) return;
    setPendingAction("join");
    reset();
    call("joinEvent", [onChainId]);
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setCodeError(null);
    if (onChainId === undefined) {
      setCodeError("Demo events are read-only.");
      return;
    }
    if (!code.trim()) {
      setCodeError("Enter the event code.");
      return;
    }
    const expected = event?.eventCodeHash;
    if (expected && /^0x[0-9a-fA-F]+$/.test(expected)) {
      const got = keccak256(toHex(code.trim()));
      if (got.toLowerCase() !== expected.toLowerCase()) {
        setCodeError("Wrong code.");
        return;
      }
    }
    const verificationURI = proof.trim() || `code:${code.trim()}`;
    setPendingAction("verify");
    reset();
    call("submitAttendanceVerification", [onChainId, verificationURI]);
  }

  function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    if (onChainId === undefined) return;
    if (!/^0x[0-9a-fA-F]{40}$/.test(approveAddr.trim())) return;
    setPendingAction("approve");
    reset();
    call("approveAttendance", [onChainId, approveAddr.trim() as `0x${string}`]);
  }

  function handleClaim() {
    if (onChainId === undefined) return;
    setPendingAction("claim");
    reset();
    call("claimSkillBadge", [onChainId]);
  }

  return (
    <div className="space-y-5 pt-4 pb-8">
      <NetworkGate />

      {/* Pass / hero card */}
      <section className="card overflow-hidden p-0">
        <div
          className="relative h-40 w-full"
          style={{ background: coverGradient(numericId) }}
        >
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(70% 60% at 25% 25%, rgba(255,255,255,0.55), transparent 60%), radial-gradient(60% 60% at 80% 90%, rgba(0,0,0,0.35), transparent 60%)",
            }}
          />
          <div className="absolute left-5 top-5 flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-bg-card/85 backdrop-blur-md border border-white/10 shadow-card">
            <div className="text-[10px] font-bold tracking-[0.16em] text-accent">
              {new Date(Number(event.startTime) * 1000)
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase()}
            </div>
            <div className="font-display text-[26px] leading-none font-semibold text-ink">
              {new Date(Number(event.startTime) * 1000).getDate()}
            </div>
          </div>
          <div className="absolute right-5 top-5">
            <StatusChip kind={kind} />
          </div>
          <div className="absolute right-5 bottom-4 inline-flex items-center rounded-full bg-bg-card/85 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider">
            {event.category.toUpperCase()}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h1 className="font-display text-[28px] font-medium tracking-[-0.01em] leading-[1.1]">
              {event.title}
            </h1>
            <div className="mt-2 text-[13px] text-ink-mute">
              by {shortAddress(event.organizer)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-ink-mute">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} strokeWidth={2.5} /> {formatDate(event.startTime)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} strokeWidth={2.5} /> {Number(event.attendeeCount)}/
              {Number(event.capacity)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} strokeWidth={2.5} /> Code-verified
            </span>
          </div>

          {/* Step row */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {STEPS.map((label, i) => {
              const done = i < progress;
              const current = i === progress;
              return (
                <div key={label} className="space-y-1.5">
                  <div
                    className={clsx(
                      "h-1 rounded-full",
                      done
                        ? "bg-gradient-to-r from-accent to-accent-warm"
                        : current
                          ? "bg-accent/40"
                          : "bg-line"
                    )}
                  />
                  <div
                    className={clsx(
                      "text-[9px] uppercase tracking-wider font-semibold text-center",
                      done
                        ? "text-accent"
                        : current
                          ? "text-ink"
                          : "text-ink-dim"
                    )}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Description */}
      {event.description && (
        <section className="card p-4">
          <p className="text-[14px] text-ink/85 whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        </section>
      )}

      {/* Demo-only notice + code unlock */}
      {isSampleId && sampleMatch && (
        <div className="card p-4 space-y-3 border-amber-400/30 bg-amber-400/5">
          <div className="text-amber-200 font-semibold text-sm">
            Demo event
          </div>
          {!demoUnlocked ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCodeError(null);
                if (
                  code.trim().toUpperCase() ===
                  sampleMatch.code.trim().toUpperCase()
                ) {
                  setDemoUnlocked(true);
                } else {
                  setCodeError("Wrong code.");
                }
              }}
              className="space-y-3"
            >
              <p className="muted">
                Enter the event code to unlock the materials (slides, repo,
                etc.). The organizer would share this code at the event.
              </p>
              <input
                className="input font-mono"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Event code"
                autoComplete="off"
              />
              {codeError && (
                <div className="text-xs text-red-300">{codeError}</div>
              )}
              <button type="submit" className="btn-primary w-full">
                Unlock materials
              </button>
              <Link href="/create" className="btn-secondary w-full">
                Or create your own event <ArrowRight size={14} />
              </Link>
            </form>
          ) : (
            <p className="muted">
              Unlocked. Materials are listed below.
            </p>
          )}
        </div>
      )}

      {/* Connect prompt */}
      {!isSampleId && !isConnected && (
        <div className="card p-5 space-y-3 text-center">
          <p className="muted">Connect your wallet to take action.</p>
          <div className="flex justify-center">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      )}

      {/* Action by state */}
      {!isSampleId && isConnected && IS_CONFIGURED && (
        <section className="space-y-3">
          {kind === "not-joined" && (
            <button
              className="btn-primary w-full text-base py-4"
              onClick={handleJoin}
              disabled={isPending}
            >
              {isPending && pendingAction === "join" ? "Joining…" : "Join Event"}
            </button>
          )}

          {kind === "joined" && (
            <form onSubmit={handleVerify} className="card p-5 space-y-4">
              <div>
                <h2 className="font-bold text-base">Verify your attendance</h2>
                <p className="muted mt-1">
                  Enter the code the organizer shared at the event.
                </p>
              </div>
              <div>
                <label className="label">Event code</label>
                <input
                  className="input font-mono"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Event code"
                  autoComplete="off"
                />
              </div>
              {codeError && (
                <div className="text-xs text-red-300 -mt-2">{codeError}</div>
              )}
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isPending}
              >
                {isPending && pendingAction === "verify"
                  ? "Submitting…"
                  : "Verify Attendance"}
              </button>
            </form>
          )}

          {kind === "submitted" && (
            <div className="card p-5 space-y-2 border-blue-400/30 bg-blue-400/5">
              <div className="font-semibold text-blue-200">
                Verification submitted
              </div>
              <p className="muted">
                Waiting for the organizer to approve your attendance.
              </p>
            </div>
          )}

          {kind === "approved" && (
            <button
              className="btn-primary w-full text-base py-4"
              onClick={handleClaim}
              disabled={isPending}
            >
              <Award size={18} strokeWidth={2.5} />
              {isPending && pendingAction === "claim"
                ? "Claiming…"
                : "Claim Skill Badge"}
            </button>
          )}

          {kind === "claimed" && (
            <div className="card p-5 border-fuchsia-400/30 bg-fuchsia-400/5">
              <div className="flex items-center gap-2 text-fuchsia-200 font-semibold">
                <Award size={18} /> Badge claimed
              </div>
              <p className="muted mt-1">It's in your profile and skills page.</p>
            </div>
          )}
        </section>
      )}

      {/* Organizer approval */}
      {isOrganizer && IS_CONFIGURED && (
        <section className="card p-5 space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-accent font-bold">
              Organizer
            </div>
            <h2 className="font-bold text-base mt-0.5">Approve attendance</h2>
            <p className="muted mt-1">
              Paste an attendee's wallet. They must have submitted verification.
            </p>
          </div>
          <form onSubmit={handleApprove} className="space-y-3">
            <input
              className="input font-mono text-xs"
              value={approveAddr}
              onChange={(e) => setApproveAddr(e.target.value)}
              placeholder="0x…"
            />
            <button
              type="submit"
              className="btn-secondary w-full"
              disabled={
                isPending || !/^0x[0-9a-fA-F]{40}$/.test(approveAddr.trim())
              }
            >
              {isPending && pendingAction === "approve"
                ? "Approving…"
                : "Approve Attendance"}
            </button>
          </form>
        </section>
      )}

      <TxStatus pending={isPending} success={isSuccess} error={error} />

      {/* Materials */}
      <section className="space-y-2">
        <h2 className="h2">Materials</h2>
        {isSampleId ? (
          !demoUnlocked ? (
            <div className="card p-5 flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-bg-elev text-ink-mute shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <div className="font-semibold">Locked</div>
                <p className="muted">
                  Enter the event code above to unlock materials.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sampleMatch?.materials.map((m) => (
                <MaterialCard
                  key={m.kind}
                  kind={m.kind}
                  description={m.description}
                  href={m.href}
                />
              ))}
            </div>
          )
        ) : !unlocked ? (
          <div className="card p-5 flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-bg-elev text-ink-mute shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <div className="font-semibold">Locked</div>
              <p className="muted">Verify attendance to unlock materials.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {SAMPLE_MATERIALS.map((m) => (
              <MaterialCard
                key={m.kind}
                kind={m.kind}
                description={m.description}
                href={event.materialsURI || undefined}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
